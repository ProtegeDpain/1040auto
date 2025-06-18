const { PrismaClient } = require('@prisma/client');
const { BlockBlobClient } = require('@azure/storage-blob');
const { uploadToAzureBlob } = require('../utils/azureBlob');
const { mergeDocumentsToPDF } = require('../utils/toPDF');
const { createTaskStepErrorLog } = require('../utils/taskStepErrorLog');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const os = require('os');
const fs = require('fs').promises;
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

        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        const taskData = req.body;
        if (!taskData.client_id || !taskData.sub_client_id) {
            return res.status(400).json({ error: 'client_id and sub_client_id are required.' });
        }

        // Get client and subclient details for file path
        const subClient = await prisma.subClients.findUnique({
            where: { id: Number(taskData.sub_client_id) },
            include: {
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

        // Create temp directory for file processing
        const tempDir = path.join(os.tmpdir(), 'task-files-' + Date.now());
        await fs.mkdir(tempDir, { recursive: true });

        try {
            // Save files temporarily and collect paths
            const filePaths = await Promise.all(files.map(async (file) => {
                const tempPath = path.join(tempDir, file.originalname);
                await fs.writeFile(tempPath, file.buffer);
                return tempPath;
            }));

            // Merge files into single PDF
            const mergedPdfName = `${subClient.client.name}_${subClient.firstName}_${subClient.lastName}_${Date.now()}.pdf`;
            const mergedPdfPath = await mergeDocumentsToPDF(filePaths, mergedPdfName, tempDir);

            // Upload merged PDF to Azure
            const mergedPdfBuffer = await fs.readFile(mergedPdfPath);
            const mergedPdfFile = {
                buffer: mergedPdfBuffer,
                originalname: mergedPdfName,
                mimetype: 'application/pdf'
            };

            // Upload to Azure with proper path structure
            const blobUrl = await uploadToAzureBlob(mergedPdfFile, {
                tax_year: taskData.tax_year,
                client_name: subClient.client.name,
                subclient_name: `${subClient.firstName}_${subClient.lastName}`
            });

            // Create task in database
            const task = await prisma.tasks.create({
                data: {
                    task_uid: uuidv4(),
                    client_id: Number(taskData.client_id),
                    sub_client_id: Number(taskData.sub_client_id),
                    tax_year: parseInt(taskData.tax_year, 10),
                    resident_state: taskData.resident_state,
                    
                    // software_name: taskData.software_name,
                    software_exe_path: taskData.software_exe_path,
                    software_ip_address: taskData.software_ip_address,
                    software_username: taskData.software_username,
                    software_password: taskData.software_password,
                    vpn_name: taskData.vpn_name,
                    vpn_exe_path: taskData.vpn_exe_path,
                    vpn_ip_address: taskData.vpn_ip_address,
                    vpn_username: taskData.vpn_username,
                    vpn_password: taskData.vpn_password,
                    rdc_name: taskData.rdc_name,
                    rdc_exe_path: taskData.rdc_exe_path,
                    rdc_ip_address: taskData.rdc_ip_address,
                    rdc_username: taskData.rdc_username,
                    rdc_password: taskData.rdc_password,
                    // splashtop_email: taskData.splashtop_email,
                    // splashtop_password: taskData.splashtop_password,
                    // documents_url: blobUrl,
                    created_by: userId
                }
            });

            res.status(201).json({
                message: 'Task created successfully',
                task: {
                    ...task,
                    client_name: subClient.client.name,
                    sub_client_name: `${subClient.firstName} ${subClient.lastName}`,
                    company_name: subClient.client.company.company_name
                }
            });

        } finally {
            // Clean up temp directory
            await fs.rm(tempDir, { recursive: true, force: true });
        }

    } catch (error) {
        console.error('Error in addTaskController:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
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
