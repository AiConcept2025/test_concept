// import { google } from 'googleapis';
// import fs from 'fs';

// // Initialize Google Drive API Client
// async function initializeDriveClient() {
//     try {
//         const serviceAccountKeyPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
//         if (!serviceAccountKeyPath) {
//             throw new Error('SERVICE_ACCOUNT_KEY_PATH environment variable is not set.');
//         }

//         if (!fs.existsSync(serviceAccountKeyPath)) {
//             throw new Error(`Service account key file not found at: ${serviceAccountKeyPath}`);
//         }

//         const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));
//         const auth = new google.auth.GoogleAuth({
//             credentials: serviceAccount,
//             scopes: ['https://www.googleapis.com/auth/drive'],
//         });

//         return google.drive({ version: 'v3', auth });
//     } catch (error) {
//         console.error('Error initializing Google Drive client:', error.message);
//         throw error;
//     }
// }

// // Verify that the file exists locally
// function verifyFileExists(filePath) {
//     if (!fs.existsSync(filePath)) {
//         throw new Error(`File not found: ${filePath}`);
//     }
//     console.log(`File verified locally: ${filePath}`);
// }

// // Create a subfolder in Google Drive if it does not exist
// async function createSubFolderIfNotExist(drive, parentFolderId, subFolderName) {
//     try {
//         const response = await drive.files.list({
//             q: `'${parentFolderId}' in parents and name='${subFolderName}' and mimeType='application/vnd.google-apps.folder'`,
//             fields: 'files(id, name)',
//         });

//         if (response.data.files.length > 0) {
//             console.log(
//                 `Subfolder "${subFolderName}" already exists. Folder ID: ${response.data.files[0].id}`
//             );
//             return response.data.files[0].id;
//         }

//         const folderMetadata = {
//             name: subFolderName,
//             mimeType: 'application/vnd.google-apps.folder',
//             parents: [parentFolderId],
//         };

//         const folderResponse = await drive.files.create({
//             resource: folderMetadata,
//             fields: 'id, name',
//         });

//         console.log(`Subfolder "${subFolderName}" created. Folder ID: ${folderResponse.data.id}`);
//         return folderResponse.data.id;
//     } catch (error) {
//         console.error('Error creating subfolder:', error.message);
//         throw error;
//     }
// }

// // Upload the file to Google Drive
// async function uploadToGoogleDrive(filePath, parentFolderId, subFolderName, documentName) {
//     try {
//         verifyFileExists(filePath);

//         const drive = await initializeDriveClient();
//         const subFolderId = await createSubFolderIfNotExist(drive, parentFolderId, subFolderName);

//         const fileMetadata = {
//             name: documentName,
//             parents: [subFolderId],
//         };
//         const media = {
//             mimeType: 'application/octet-stream',
//             body: fs.createReadStream(filePath),
//         };

//         console.log(`Uploading file "${fileMetadata.name}" to folder ID: ${subFolderId}`);
//         const response = await drive.files.create({
//             resource: fileMetadata,
//             media: media,
//             fields: 'id, name',
//         });

//         if (!response.data.id) {
//             throw new Error('File upload failed: No file ID returned.');
//         }

//         console.log(`File uploaded successfully. File ID: ${response.data.id}`);
//         return response.data.id;
//     } catch (error) {
//         console.error('Error during upload:', error.message);
//         throw error;
//     }
// }

// // Main function to execute the upload
// (async () => {
//     const parentFolderId = process.env.FLOWISE_FOLDER_NAME;
//     const subFolderName = process.env.FLOWISE_SUBFOLDER_NAME;
//     const documentName = process.env.CUSTOMER_DOCUMENT;
//     const localFilePath = process.env.LOCAL_FILE_PATH;

//     if (!parentFolderId || !subFolderName || !documentName || !localFilePath) {
//         console.error('One or more required environment variables are missing.');
//         process.exit(1);
//     }

//     try {
//         const uploadedFileId = await uploadToGoogleDrive(
//             localFilePath,
//             parentFolderId,
//             subFolderName,
//             documentName
//         );
//         console.log(`Process completed successfully. Uploaded File ID: ${uploadedFileId}`);
//     } catch (error) {
//         console.error('Process failed:', error.message);
//     }
// })();
