const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const { validateUser } = require('../validators/userValidator');

async function createUserController(req, res) {
    // 1. Validate input
    const { error, value } = validateUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message) });
    }
    const { full_name, username, phone_number, email, role_id, password } = value;

    try {
        // 2. Check for existing user
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Email or username already exists.' });
        }

        // 3. Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // 4. Create user
        const user = await prisma.users.create({
            data: {
                full_name,
                username,
                phone_number,
                email,
                password_hash,
                role_id,
                is_active: true
            }
        });

        return res.status(201).json({ id: user.id, email: user.email, username: user.username });
    } catch (err) {
        console.error('User creation error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = { createUserController };
