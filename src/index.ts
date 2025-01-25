import { initializeDriveClient, uploadToGoogleDrive, fetchStartPageToken, fetchChanges } from './utils';

const world = 'world';

export function hello(who: string = world): string {
    return `Hello ${who}! `;
}

const localFilePath = 'data/ipsum.txt';
const googleDriveFolderId = '1R4g1cSZUZ5nC2bzo7RxRO_46so5uYJS8';

console.log(hello());

// Promise.resolve()
//     .then(() => initializeDriveClient('./secret/service-account-key.json'))
//     .then(drive => uploadToGoogleDrive(drive, localFilePath, googleDriveFolderId))
//     .then(res => { console.log(res); })
//     .catch((error) => { console.log(error.message); });

// Promise.resolve()
//     .then(() => initializeDriveClient('./secret/service-account-key.json'))
//     .then(drive => fetchStartPageToken(drive))
//     .then(res => { console.log(res); })
//     .catch((error) => { console.log(error.message); });

Promise.resolve()
    .then(() => initializeDriveClient('./secret/service-account-key.json'))
    .then(drive => fetchChanges(drive, '64'))
    .then(res => { console.log(res); })
    .catch((error) => { console.log(error.message); });
