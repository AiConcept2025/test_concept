import { drive_v3, google } from 'googleapis';
import fse from 'fs-extra';
import path from 'path';

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
        } as any);

        console.log(`Subfolder "${subFolderName}" created. Folder ID: ${(folderResponse as any).data.id}`);
        return (folderResponse as any).data.id;
    } catch (error) {
        console.error('Error creating subfolder:', (error as Error).message);
        throw error;
    }
}

/**
 * Upload the file to Google Drive sub folder
 */
export async function uploadToGoogleDrive1(
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
            media,
            fields: 'id, name',
        } as any);

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
 * Upload the file to Google Drive
 */
export async function uploadToGoogleDrive(
    drive: drive_v3.Drive,
    filePath: string,
    folderId: string): Promise<any> {
    try {
        if (!isFileExists(filePath)) {
            return Promise.reject();
        }
        const name = path.basename(filePath);
        const fileMetadata = {
            name,
            parents: [folderId], // Folder ID where the file will be uploaded
        };
        const media = {
            mimeType: 'application/octet-stream',
            body: fse.createReadStream(filePath),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: 'id, name',
        } as any);

        console.log(`File uploaded successfully. File ID: ${(response as any).data.id}`);
        return (response as any).data.id;
    } catch (error) {
        console.error('Error uploading file:', (error as Error).message);
        throw error;
    }
}

/**
 * Verify if the file exists on Google Drive
 */
export async function verifyFileOnGoogleDrive(
    drive: drive_v3.Drive,
    fileId: string): Promise<boolean> {
    try {
        const file = await drive.files.get({
            fileId,
            fields: 'id, name',
        });
        console.log('File found on Google Drive:', file.data);
        return true;
    } catch (error) {
        console.error('Error verifying file on Google Drive:', (error as Error).message);
        return false;
    }
}

/**
 * Retrieve page token for the current state of the account.
 **/
export async function fetchStartPageToken(drive: drive_v3.Drive,): Promise<string | null | undefined> {
    try {
        const res = await drive.changes.getStartPageToken({});
        const token = res.data.startPageToken;
        console.log('start token: ', token);
        return token;
    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }
}

/**
 * Retrieve the list of changes for the currently authenticated user.
 * @param {string} savedStartPageToken page token got after executing fetch_start_page_token.js file
 **/
export async function fetchChanges(drive: drive_v3.Drive, savedStartPageToken: string) {
    try {
        let pageToken = savedStartPageToken;
        do {
            const res = await drive.changes.list({
                pageToken: savedStartPageToken,
                fields: '*',
            });
            res.data.changes?.forEach((change) => {
                console.log('change found for file: ', change.fileId);
            });
            pageToken = res.data.newStartPageToken as string;
            return pageToken;
        } while (pageToken);
    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }
}