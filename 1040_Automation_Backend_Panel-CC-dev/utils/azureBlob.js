const { BlockBlobClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

/**
 * Uploads a file buffer to Azure Blob Storage using BlockBlobClient.
 * @param {Object} file - The file object (expects .buffer, .originalname, .mimetype)
 * @param {Object} options - The options object
 * @param {string} options.tax_year - The tax year
 * @param {string} options.client_name - The client name
 * @param {string} options.subclient_name - The subclient name
 * @returns {Promise<string>} - The URL of the uploaded blob
 * @throws {Error} - Throws if upload fails or config is missing
 */
async function uploadToAzureBlob(file, { tax_year, client_name, subclient_name }) {
    if (!AZURE_STORAGE_CONNECTION_STRING || !AZURE_CONTAINER_NAME) {
        throw new Error('Azure storage configuration missing');
    }
    // Build the blob path: TaxYear/Client/SubClient/Uploaded/filename
    const safeTaxYear = String(tax_year).replace(/[^\w-]/g, '');
    const safeClient = String(client_name).replace(/[^\w-]/g, '_');
    const safeSubClient = String(subclient_name).replace(/[^\w-]/g, '_');
    const folderPath = `${safeTaxYear}/${safeClient}/${safeSubClient}/Uploaded`;
    const blobName = `${folderPath}/${Date.now()}-${file.originalname}`;
    const blockBlobClient = new BlockBlobClient(
        AZURE_STORAGE_CONNECTION_STRING,
        AZURE_CONTAINER_NAME,
        blobName
    );
    try {
        const uploadResponse = await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype }
        });
        if (uploadResponse.errorCode) {
            throw new Error(`Azure upload failed: ${uploadResponse.errorCode}`);
        }
        return blockBlobClient.url;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    uploadToAzureBlob
};
