const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new client
const createClientController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in.' });
        }
        let { name, software_type_id, network_access_type_id, company_name } = req.body;
        // Basic validation
        if (!name || !software_type_id || !network_access_type_id || !company_name) {
            return res.status(400).json({ error: 'name, software_type_id, network_access_type_id, and company_name are required.' });
        }
        // Look up software type ID by name if not a number
        if (isNaN(Number(software_type_id))) {
            const swType = await prisma.softwareTypes.findUnique({ where: { name: software_type_id } });
            if (!swType) return res.status(400).json({ error: 'Invalid software_type_id (name not found).' });
            software_type_id = swType.id;
        }
        // Look up network access type ID by name if not a number
        if (isNaN(Number(network_access_type_id))) {
            const netType = await prisma.networkAccessTypes.findUnique({ where: { name: network_access_type_id } });
            if (!netType) return res.status(400).json({ error: 'Invalid network_access_type_id (name not found).' });
            network_access_type_id = netType.id;
        }
        // Use upsert to safely create or get the company
        const company = await prisma.company.upsert({
            where: { company_name },
            create: { company_name },
            update: {}
        });

        // Check if this company is already linked to a client
        const linkedClient = await prisma.clients.findUnique({ 
            where: { company_id: company.id } 
        });
        if (linkedClient) {
            return res.status(409).json({ 
                error: 'This company is already linked to another client.' 
            });
        }

        // Create the client and link to the company
        const client = await prisma.clients.create({
            data: {
                name,
                software_type_id: Number(software_type_id),
                network_access_type_id: Number(network_access_type_id),
                created_by: userId,
                company_id: company.id
            },
            include: { company: true }
        });
        return res.status(201).json(client);
    } catch (err) {
        console.error('Client creation error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get all clients
const getClientsController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in.' });
        }
        const clients = await prisma.clients.findMany({
            where: {
                isArchieved: false 
            },
            select: {
                id: true,
                name: true,
                company: {
                    select: {
                        company_name: true
                    }
                }
            }
        });
        
        res.status(200).json(
            clients.map(client => ({
                id: client.id,
                client_name: client.name,
                company_name: client.company.company_name
            }))
        );
    } catch (err) {
        console.error('Error fetching clients:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Archive a client
const archiveClientController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Client id is required.' });
        }
        const client = await prisma.clients.update({
            where: { id: Number(id) },
            data: { isArchieved: true }
        });
        res.status(200).json({ message: 'Client archived successfully.', client });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Client not found.' });
        }
        console.error('Error archiving client:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Unarchive a client
const unarchiveClientController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Client id is required.' });
        }
        const client = await prisma.clients.update({
            where: { id: Number(id) },
            data: { isArchieved: false }
        });
        res.status(200).json({ message: 'Client unarchived successfully.', client });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Client not found.' });
        }
        console.error('Error unarchiving client:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get all clients for a user by userId
const getClientsByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required.' });
        }
        // Find clients where created_by matches userId
        const clients = await prisma.clients.findMany({
            where: { created_by: Number(userId) }
        });
        res.status(200).json(clients);
    } catch (err) {
        console.error('Error fetching clients by userId:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    createClientController,
    getClientsController,
    archiveClientController,
    unarchiveClientController,
    getClientsByUserIdController,
};
