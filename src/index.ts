import { initializeDriveClient, uploadToGoogleDrive, fetchStartPageToken, fetchChanges } from './utils.js';


const localFilePath = 'data/ipsum.txt';
const googleDriveFolderId = '1R4g1cSZUZ5nC2bzo7RxRO_46so5uYJS8';

try {
    const drive = await initializeDriveClient('./secret/service-account-key.json');
    const res = await uploadToGoogleDrive(drive, localFilePath, googleDriveFolderId);
    console.log(res);
}
catch (e) {
    console.log((e as Error).message);
}
