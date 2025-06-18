const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const {validateUser , validateUserUpdate} = require('../validations/userValidator'); 
async function createUserController(req, res) {
    try {
        const { full_name, phone_number, email, password, role_id, username } = req.body;

        // Use Joi validation
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details.map(d => d.message)
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                full_name,
                phone_number,
                email,
                password_hash,
                role_id,
                is_active: true,
                username // Store username in the database
            }
        });

        return res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Email or username already exists.' });
        }
        console.error('User creation error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

const getUserController = async (req, res) => {
    try {
        const users = await prisma.users.findMany({ where: { isArchieved: false } });
        res.status(200).json({
            message: 'Users fetched successfully.',
            users: users.map(user => ({
                id: user.id,
                full_name: user.full_name,
                username: user.username,
                email: user.email,
                phone_number: user.phone_number,
                role_id: user.role_id,
                is_active: user.is_active,
                is_archived: user.isArchieved
            }))
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const archiveUserController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'User id is required.' });
        }
        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: { isArchieved: true }
        });
        res.status(200).json({ message: 'User archived successfully.', user });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User not found.' });
        }
        console.error('Error archiving user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const unarchiveUserController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'User id is required.' });
        }
        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: { isArchieved: false }
        });
        res.status(200).json({ message: 'User unarchived successfully.', user });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User not found.' });
        }
        console.error('Error unarchiving user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const updateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, phone_number, email, role_id, username } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'User id is required.' });
        }

        // Use Joi validation
        const { error } = validateUserUpdate(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details.map(d => d.message)
            });
        }

        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: {
                full_name,
                phone_number,
                email,
                role_id,
                username // Update username in the database
            }
        });

        return res.status(200).json({ message: 'User updated successfully.', user });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User not found.' });
        }
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
module.exports = {
    createUserController,
    getUserController,
    archiveUserController,
    unarchiveUserController,
    updateUserController,
};
