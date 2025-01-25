"use strict";
// import { google } from 'googleapis';
// import fs from 'fs';
// import path from 'path';
Object.defineProperty(exports, "__esModule", { value: true });
// // Initialize Google Drive API Client
// async function initializeDriveClient() {
//     const serviceAccountKeyPath = './service-account-key.json'; // Update with your JSON key path
//     const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));
//     const auth = new google.auth.GoogleAuth({
//         credentials: serviceAccount,
//         scopes: ['https://www.googleapis.com/auth/drive'],
//     });
//     return google.drive({ version: 'v3', auth });
// }
// // Verify that the file exists locally
// function verifyFileExists(filePath) {
//     if (!fs.existsSync(filePath)) {
//         throw new Error(`File not found: ${filePath}`);
//     }
//     console.log(`File verified locally: ${filePath}`);
// }
// // Upload the file to Google Drive
// async function uploadToGoogleDrive(filePath, folderId) {
//     try {
//         verifyFileExists(filePath);
//         const drive = await initializeDriveClient();
//         const fileMetadata = {
//             name: path.basename(filePath),
//             parents: [folderId], // Folder ID where the file will be uploaded
//         };
//         const media = {
//             mimeType: 'application/octet-stream',
//             body: fs.createReadStream(filePath),
//         };
//         const response = await drive.files.create({
//             resource: fileMetadata,
//             media: media,
//             fields: 'id, name',
//         });
//         console.log(`File uploaded successfully. File ID: ${response.data.id}`);
//         return response.data.id;
//     } catch (error) {
//         console.error('Error uploading file:', error.message);
//         throw error;
//     }
// }
// // Verify if the file exists on Google Drive
// async function verifyFileOnGoogleDrive(fileId) {
//     try {
//         const drive = await initializeDriveClient();
//         const file = await drive.files.get({
//             fileId,
//             fields: 'id, name',
//         });
//         console.log('File found on Google Drive:', file.data);
//     } catch (error) {
//         console.error('Error verifying file on Google Drive:', error.message);
//         throw error;
//     }
// }
// // Example Usage
// (async () => {
//     const localFilePath = './ipsum.txt'; // Replace with your local file path
//     const googleDriveFolderId = '1R4g1cSZUZ5nC2bzo7RxRO_46so5uYJS8'; // Replace with the folder ID for IrisSolutions on Google Drive
//     try {
//         const uploadedFileId = await uploadToGoogleDrive(localFilePath, googleDriveFolderId);
//         await verifyFileOnGoogleDrive(uploadedFileId);
//     } catch (error) {
//         console.error('Process failed:', error.message);
//     }
// })();
//# sourceMappingURL=upload.js.map