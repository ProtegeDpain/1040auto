const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    // Seed Roles
    const adminRole = await prisma.roles.upsert({
        where: { name: 'Admin' },
        update: {},
        create: { name: 'Admin' }
    });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Seed Users
    await prisma.users.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            full_name: 'Admin User',
            phone_number: '1234567890',
            email: 'admin@example.com',
            password_hash: hashedPassword,
            role_id: adminRole.id,
            is_active: true
        }
    });

    // Seed SoftwareTypes
    const softwareType = await prisma.softwareTypes.upsert({
        where: { name: 'ProTax' },
        update: {},
        create: {
            name: 'ProTax'
        }
    });

    // Seed NetworkAccessTypes
    const networkAccessType = await prisma.networkAccessTypes.upsert({
        where: { name: 'VPN' },
        update: {},
        create: {
            name: 'VPN'
        }
    });

    // Seed Clients
    let client = await prisma.clients.findFirst({ where: { name: 'Acme Corp' } });
    if (!client) {
        client = await prisma.clients.create({
            data: {
                name: 'Acme Corp',
                software_type_id: softwareType.id,
                network_access_type_id: networkAccessType.id
            }
        });
    }

    // Seed SubClients
    let subClient = await prisma.subClients.findFirst({ where: { name: 'John Doe', client_id: client.id } });
    if (!subClient) {
        subClient = await prisma.subClients.create({
            data: {
                client_id: client.id,
                name: 'John Doe',
                ssn: '123-45-6789',
                spouse_name: 'Jane Doe',
                spouse_ssn: '987-65-4321'
            }
        });
    }

    // Seed SubClientDependents
    let dependent = await prisma.subClientDependents.findFirst({ where: { name: 'Jimmy Doe', sub_client_id: subClient.id } });
    if (!dependent) {
        await prisma.subClientDependents.create({
            data: {
                sub_client_id: subClient.id,
                name: 'Jimmy Doe',
                ssn: '111-22-3333'
            }
        });
    }

    // Seed TaskStatuses
    const status = await prisma.taskStatuses.upsert({
        where: { status_name: 'Pending' },
        update: {},
        create: {
            status_name: 'Pending',
            description: 'Task is pending'
        }
    });

    // Seed Tasks
    const task = await prisma.tasks.upsert({
        where: { task_uid: '11111111-1111-1111-1111-111111111111' },
        update: {},
        create: {
            task_uid: '11111111-1111-1111-1111-111111111111',
            client_id: client.id,
            sub_client_id: subClient.id,
            software_exe_path: '/path/to/software.exe',
            software_ip_address: '192.168.1.100',
            software_username: 'softuser',
            software_password: 'softpass',
            vpn_name: 'AcmeVPN',
            vpn_exe_path: '/path/to/vpn.exe',
            vpn_ip_address: '10.0.0.1',
            vpn_username: 'vpnuser',
            vpn_password: 'vpnpass',
            rdc_name: 'AcmeRDC',
            rdc_exe_path: '/path/to/rdc.exe',
            rdc_ip_address: '10.0.0.2',
            rdc_username: 'rdcuser',
            rdc_password: 'rdcpass',
            created_by: 1 // admin user id
        }
    });

    // Seed TaskFiles
    await prisma.taskFiles.upsert({
        where: { original_filename: 'document.pdf' },
        update: {},
        create: {
            task_id: task.id,
            file_type: 'PDF',
            original_filename: 'document.pdf',
            azure_blob_url: 'https://blob.example.com/document.pdf',
            blob_folder_name: 'taskfiles'
        }
    });

    // Seed TaskStepErrors
    await prisma.taskStepErrors.upsert({
        where: { error_code: 'ERR001' },
        update: {},
        create: {
            task_id: task.id,
            status_id: status.id,
            error_message: 'Sample error message',
            error_code: 'ERR001'
        }
    });

    // ...existing code for other tables as needed...
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });