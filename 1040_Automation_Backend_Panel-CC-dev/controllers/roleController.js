const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all roles
const getRolesController = async (req, res) => {
    try {
        const roles = await prisma.roles.findMany();
        res.status(200).json(roles);
    } catch (err) {
        console.error('Error fetching roles:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    getRolesController,
};
