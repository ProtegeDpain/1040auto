const { PrismaClient } = require('@prisma/client');
const { createSubClientSchema } = require('../validations/subClientValidator');
const { get } = require('../middleware/mailer');
const prisma = new PrismaClient();

// Create a new subclient
const createSubClientController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in.' });
        }

        console.log('Received request body:', JSON.stringify(req.body, null, 2));

        // Validate request body
        console.log('Raw request body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        
        const { error, value } = createSubClientSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        
        if (error) {
            console.log('Validation failed. Details:', {
                error: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path,
                    type: detail.type,
                    context: detail.context
                }))
            });
        } else {
            console.log('Validation successful. Validated data:', {
                ...value,
                ssn: value.ssn ? '***-**-****' : null,
                spouse_ssn: value.spouse_ssn ? '***-**-****' : null
            });
        }

        if (error) {
            console.log('Validation error:', error.details);
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path
                }))
            });
        }

        let client_id = value.client_id;
        
        
        if (!client_id) {
            return res.status(400).json({ error: 'client_id or client object is required' });
        }

        // Prepare dates
        const subClientData = {
            client_id,
            ...value,
            client: undefined, // Remove client object
            // Format dates correctly
            dob: value.dob ? new Date(value.dob).toISOString() : null,
            spouseDOB: value.spouseDOB ? new Date(value.spouseDOB).toISOString() : null,
            // Handle dependents
            dependents: value.dependents?.length > 0
                ? {
                    create: value.dependents.map(dep => ({
                        name: dep.name,
                        ssn: dep.ssn
                    }))
                }
                : undefined
        };

        console.log('Attempting to create subclient with data:', {
            ...subClientData,
            ssn: subClientData.ssn ? '***-**-****' : null, // Mask sensitive data in logs
            spouse_ssn: subClientData.spouse_ssn ? '***-**-****' : null
        });

        const subClient = await prisma.subClients.create({
            data: subClientData,
            include: {
                dependents: true,
                filingStatus: true,
                client: {
                    include: {
                        company: true
                    }
                }
            }
        });

        console.log('SubClient created successfully:', {
            id: subClient.id,
            firstName: subClient.firstName,
            lastName: subClient.lastName
        });

        res.status(201).json(subClient);
    } catch (err) {
        console.error('SubClient creation error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ 
                error: 'A subclient with this information already exists.',
                details: err.meta
            });
        }
        if (err.code === 'P2003') {
            return res.status(400).json({ 
                error: 'Invalid reference. Check client_id and filing_status_id.',
                details: err.meta
            });
        }
        res.status(500).json({ 
            error: 'Internal server error',
            message: err.message,
            code: err.code
        });
    }
};

// Get all subclients
const getSubClientsController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in.' });
        }

        // Fetch all clients created by the user
        const userClients = await prisma.clients.findMany({
            where: { created_by: userId },
            select: { id: true }
        });

        const clientIds = userClients.map(c => c.id);

        // Fetch subclients with required fields
        const subClients = await prisma.subClients.findMany({
            where: {
                client_id: { in: clientIds }
            },
            select: {
                firstName: true, // sub_client_name
                lastName: true, // sub_client_last_name
                ssn: true,  // sub_client_ssn
                client: {
                    select: {
                        name: true, // Client_name
                        company: {
                            select: {
                                company_name: true // Company_name
                            }
                        },
                        softwareType: {
                            select: {
                                name: true // tax_software_type
                            }
                        }
                    }
                }
            }
        });

        // Format the response
        const formattedResponse = subClients.map(subClient => ({
            sub_client_name: subClient.firstName + ' ' + subClient.lastName,
            sub_client_ssn: subClient.ssn,
            client_name: subClient.client.name,
            company_name: subClient.client.company.company_name,
            tax_software_type: subClient.client.softwareType.name
        }));

        res.status(200).json(formattedResponse);
    } catch (err) {
        console.error('Error fetching subclients:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get SubClient by User ID
const getSubClientByIdController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in.' });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'SubClient id is required.' });
        }

        const subClient = await prisma.subClients.findUnique({
            where: { created_by: Number(id) },
            include: {
                dependents: true,
                filingStatus: true,
                client: {
                    include: {
                        company: true
                    }
                }
            }
        });

        if (!subClient) {
            return res.status(404).json({ error: 'SubClient not found.' });
        }
        const data = {
            id: subClient.id,
            name: subClient.firstName + ' ' + subClient.lastName,
            ssn: subClient.ssn ? '***-**-****' : null,// Mask sensitive data 
        };
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching subclient by ID:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'SubClient not found.' });
    }
    console.error('Error fetching subclient:', err);
    res.status(500).json({ error: 'Internal server error.' });
    
};

// Archive a subclient by ID
const archiveSubClientController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'SubClient id is required.' });
        }
        const subClient = await prisma.subClients.update({
            where: { id: Number(id) },
            data: { isArchieved: true }
        });
        res.status(200).json({ message: 'SubClient archived successfully.', subClient });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'SubClient not found.' });
        }
        console.error('Error archiving subclient:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Unarchive a subclient by ID
const unarchiveSubClientController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'SubClient id is required.' });
        }
        const subClient = await prisma.subClients.update({
            where: { id: Number(id) },
            data: { isArchieved: false }
        });
        res.status(200).json({ message: 'SubClient unarchived successfully.', subClient });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'SubClient not found.' });
        }
        console.error('Error unarchiving subclient:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    createSubClientController,
    getSubClientsController,
    archiveSubClientController,
    unarchiveSubClientController,
    getSubClientByIdController,
};
