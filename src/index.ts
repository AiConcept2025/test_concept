import { initializeDriveClient, uploadToGoogleDrive } from './utils';

const world = 'world';

export function hello(who: string = world): string {
    return `Hello ${who}! `;
}

const localFilePath = './ipsum.txt';
const googleDriveFolderId = '1R4g1cSZUZ5nC2bzo7RxRO_46so5uYJS8';

console.log(hello());

Promise.resolve()
    .then(() => initializeDriveClient('./secret/service-account-key.json'))
    .then((drive) => uploadToGoogleDrive(drive,))
