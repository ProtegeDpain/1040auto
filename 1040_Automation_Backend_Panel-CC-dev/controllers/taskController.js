const { PrismaClient } = require('@prisma/client');
const { BlockBlobClient } = require('@azure/storage-blob');
const { uploadToAzureBlob } = require('../utils/azureBlob');
const { createTaskStepErrorLog } = require('../utils/taskStepErrorLog');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

// Get all task statuses for the Logged-in user
const getTasksByIdController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in.' });
        }

        // Fetch tasks created by the user
        const tasks = await prisma.tasks.findMany({
            where: { created_by: userId },
            select: {
                client: {
                    select: {
                        name: true, // client name
                        company: {
                            select: {
                                company_name: true // company name
                            }
                        },
                        softwareType: {
                            select: {
                                name: true // TaxSoftware Name
                            }
                        },
                        networkAccessType: {
                            select: {
                                name: true // software type
                            }
                        }
                    }
                },
                subClient: {
                    select: {
                        firstName: true, // Correct field name
                        lastName: true // Correct field name
                    }
                },
                taskStepErrors: {
                    select: {
                        status: {
                            select: {
                                status_name: true // filing status
                            }
                        }
                    }
                },
                updated_at: true // last process date
            }
        });

        // Format the response
        const formattedResponse = tasks.map(task => ({
            client: task.client.name,
            subClient: `${task.subClient.firstName} ${task.subClient.lastName}`,
            company: task.client.company.company_name,
            taxSoftwareName: task.client.softwareType.name,
            softwareType: task.client.networkAccessType.name,
            filingStatus: task.taskStepErrors[0]?.status.status_name || 'Unknown',
            lastProcessDate: task.updated_at.toISOString().split('T')[0] // Format date as YYYY-MM-DD
        }));

        res.status(200).json(formattedResponse);
    } catch (err) {
        console.error('Error fetching task statuses for user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Add a new task status for the logged-in user
const addTaskStatusController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in.' });
        }
        const { status_name, description } = req.body;
        if (!status_name) {
            return res.status(400).json({ error: 'status_name is required.' });
        }
        // Check for duplicate status_name
        const existing = await prisma.taskStatuses.findUnique({ where: { status_name } });
        if (existing) {
            return res.status(409).json({ error: 'Task status already exists.' });
        }
        const taskStatus = await prisma.taskStatuses.create({
            data: {
                status_name,
                description: description || null
            }
        });
        res.status(201).json(taskStatus);
    } catch (err) {
        console.error('Error adding task status:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
// Get tasks by client ID
const getTasksByClientIdController = async (req, res) => {
    try {
        const { clientId } = req.params;
        if (!clientId) {
            return res.status(400).json({ error: 'clientId is required.' });
        }
        const tasks = await prisma.tasks.findMany({
            where: { client_id: Number(clientId) }
        });
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks by clientId:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Add a new task for a subclient of a client for the logged-in user
const addTaskController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in.' });
        }

        const {
            client_id,
            sub_client_id,
            software_exe_path,
            software_ip_address,
            software_username,
            software_password,
            vpn_name,
            vpn_exe_path,
            vpn_ip_address,
            vpn_username,
            vpn_password,
            rdc_name,
            rdc_exe_path,
            rdc_ip_address,
            rdc_username,
            rdc_password,
            tax_year
        } = req.body;

        if (!client_id || !sub_client_id) {
            return res.status(400).json({ error: 'client_id and sub_client_id are required.' });
        }

        if (!tax_year) {
            return res.status(400).json({ error: 'tax_year is required.' });
        }

        // Ensure tax_year is an integer
        const parsedTaxYear = parseInt(tax_year, 10);
        if (isNaN(parsedTaxYear)) {
            return res.status(400).json({ error: 'tax_year must be an integer.' });
        }

        // Create the task without task_uid
        const task = await prisma.tasks.create({
            data: {
                client_id: Number(client_id),
                sub_client_id: Number(sub_client_id),
                software_exe_path,
                software_ip_address,
                software_username,
                software_password,
                vpn_name,
                vpn_exe_path,
                vpn_ip_address,
                vpn_username,
                vpn_password,
                rdc_name,
                rdc_exe_path,
                rdc_ip_address,
                rdc_username,
                rdc_password,
                created_by: userId,
                tax_year: parsedTaxYear
            }
        });

        res.status(201).json(task);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Helper: Log error to TaskStepErrors table
async function logTaskStepError({ task_id, status_id, error_message, error_code }) {
    try {
        await prisma.taskStepErrors.create({
            data: {
                task_id: Number(task_id),
                status_id: Number(status_id),
                error_message: error_message || null,
                error_code: error_code || null
            }
        });
    } catch (err) {
        console.error('Failed to log TaskStepError:', err);
    }
}

module.exports = {
    getTasksByIdController,
    getTasksByClientIdController,
    addTaskController,
    addTaskStatusController
};
