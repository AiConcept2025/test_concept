import { drive_v3, google } from 'googleapis';
import fse from 'fs-extra';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';
import internal from 'stream';

/**
 * Verify that the file exists locally
 */
function isFileExists(filePath: string) {
    return fse.existsSync(filePath);
}

/**
 * Initialize Google Drive API Client
 */
export async function initializeDriveClient(serviceAccountKeyPath: string): Promise<drive_v3.Drive> {
    try {
        const serviceAccount = await fse.readJson(serviceAccountKeyPath);
        const auth = new google.auth.GoogleAuth({
            credentials: serviceAccount,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        return google.drive({ version: 'v3', auth });
    }
    catch (error) {
        console.error('Error initializing Google Drive client:', (error as Error).message);
        throw error;
    }
}

/**
 * Create a subfolder in Google Drive if it does not exist
 */
async function createSubFolderIfNotExist(
    drive: drive_v3.Drive,
    parentFolderId: string,
    subFolderName: string): Promise<any> {
    try {
        const response = await drive.files.list({
            q: `'${parentFolderId}' in parents and name='${subFolderName}' and mimeType='application/vnd.google-apps.folder'`,
            fields: 'files(id, name)',
        });

        if (response.data.files?.length ?? 0 > 0) {
            console.log(
                `Subfolder "${subFolderName}" already exists. Folder ID: ${response.data.files?.[0]?.id}`
            );
            return response.data.files?.[0]?.id;
        }

        const folderMetadata = {
            name: subFolderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
        };

        const folderResponse = await drive.files.create({
            resource: folderMetadata,
            fields: 'id, name',
        });

        console.log(`Subfolder "${subFolderName}" created. Folder ID: ${(folderResponse as any).data.id}`);
        return (folderResponse as any).data.id;
    } catch (error) {
        console.error('Error creating subfolder:', (error as Error).message);
        throw error;
    }
}

/**
 * Upload the file to Google Drive
 */
export async function uploadToGoogleDrive(
    drive: drive_v3.Drive,
    filePath: string,
    parentFolderId: string,
    subFolderName: string,
    documentName: string): Promise<any> {
    try {
        if (!isFileExists(filePath)) {
            return Promise.reject();
        }

        const subFolderId = await createSubFolderIfNotExist(drive, parentFolderId, subFolderName);

        const fileMetadata = {
            name: documentName,
            parents: [subFolderId],
        };
        const media = {
            mimeType: 'application/octet-stream',
            body: fse.createReadStream(filePath),
        };

        console.log(`Uploading file "${fileMetadata.name}" to folder ID: ${subFolderId}`);
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, name',
        });

        if (!(response as any).data.id) {
            throw new Error('File upload failed: No file ID returned.');
        }

        console.log(`File uploaded successfully. File ID: ${(response as any).data.id}`);
        return (response as any).data.id;
    } catch (error) {
        console.error('Error during upload:', (error as Error).message);
        throw error;
    }
}

/**
 * Verify if the file exists on Google Drive
 */
export async function verifyFileOnGoogleDrive(
    drive: drive_v3.Drive,
    fileId: string): Promise<void> {
    try {
        const file = await drive.files.get({
            fileId,
            fields: 'id, name',
        });

        console.log('File found on Google Drive:', file.data);
    } catch (error) {
        console.error('Error verifying file on Google Drive:', (error as Error).message);
        throw error;
    }
}