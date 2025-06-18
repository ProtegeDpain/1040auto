const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateExistingSubclients() {
    try {
        // Get all subclients that don't have firstName/lastName
        const subclients = await prisma.subClients.findMany({
            where: {
                OR: [
                    { firstName: null },
                    { lastName: null }
                ]
            }
        });

        console.log(`Found ${subclients.length} subclients to update`);

        // Update each subclient
        for (const subclient of subclients) {
            // Split the existing name into parts (assuming format is "FirstName LastName")
            const nameParts = subclient.name.trim().split(' ');
            const firstName = nameParts[0] || 'Unknown';
            const lastName = nameParts.slice(1).join(' ') || 'Unknown';

            await prisma.subClients.update({
                where: { id: subclient.id },
                data: {
                    firstName,
                    lastName
                }
            });

            console.log(`Updated subclient ${subclient.id}: ${firstName} ${lastName}`);
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateExistingSubclients().catch(console.error);
