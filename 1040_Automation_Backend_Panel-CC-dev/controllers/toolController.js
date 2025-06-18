const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all software types
const getSoftwareTypesController = async (req, res) => {
    try {
        const softwareTypes = await prisma.softwareTypes.findMany();
        res.status(200).json(softwareTypes);
    } catch (err) {
        console.error('Error fetching software types:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Add a new software type
const addSoftwareTypeController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }
        const softwareType = await prisma.softwareTypes.create({ data: { name } });
        res.status(201).json(softwareType);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Software type already exists.' });
        }
        console.error('Error adding software type:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Archive a software type
const archiveSoftwareTypeController = async (req, res) => {
    try {
        const { id } = req.params;
        const softwareType = await prisma.softwareTypes.update({
            where: { id: Number(id) },
            data: { isArchieved: true }
        });
        res.status(200).json({ message: 'Software type archived.', softwareType });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Software type not found.' });
        }
        console.error('Error archiving software type:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Unarchive a software type
const unarchiveSoftwareTypeController = async (req, res) => {
    try {
        const { id } = req.params;
        const softwareType = await prisma.softwareTypes.update({
            where: { id: Number(id) },
            data: { isArchieved: false }
        });
        res.status(200).json({ message: 'Software type unarchived.', softwareType });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Software type not found.' });
        }
        console.error('Error unarchiving software type:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get all network access types
const getNetworkAccessTypesController = async (req, res) => {
    try {
        const networkTypes = await prisma.networkAccessTypes.findMany();
        res.status(200).json(networkTypes);
    } catch (err) {
        console.error('Error fetching network access types:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Add a new network access type
const addNetworkAccessTypeController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }
        const networkType = await prisma.networkAccessTypes.create({ data: { name } });
        res.status(201).json(networkType);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Network access type already exists.' });
        }
        console.error('Error adding network access type:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Archive a network access type
const archiveNetworkAccessTypeController = async (req, res) => {
    try {
        const { id } = req.params;
        const networkType = await prisma.networkAccessTypes.update({
            where: { id: Number(id) },
            data: { isArchieved: true }
        });
        res.status(200).json({ message: 'Network access type archived.', networkType });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Network access type not found.' });
        }
        console.error('Error archiving network access type:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Unarchive a network access type
const unarchiveNetworkAccessTypeController = async (req, res) => {
    try {
        const { id } = req.params;
        const networkType = await prisma.networkAccessTypes.update({
            where: { id: Number(id) },
            data: { isArchieved: false }
        });
        res.status(200).json({ message: 'Network access type unarchived.', networkType });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Network access type not found.' });
        }
        console.error('Error unarchiving network access type:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    getSoftwareTypesController,
    addSoftwareTypeController,
    archiveSoftwareTypeController,
    unarchiveSoftwareTypeController,
    getNetworkAccessTypesController,
    addNetworkAccessTypeController,
    archiveNetworkAccessTypeController,
    unarchiveNetworkAccessTypeController
};
