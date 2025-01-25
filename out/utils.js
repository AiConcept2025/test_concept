"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDriveClient = initializeDriveClient;
const googleapis_1 = require("googleapis");
const fs_extra_1 = __importDefault(require("fs-extra"));
// Initialize Google Drive API Client
async function initializeDriveClient(serviceAccountKeyPath) {
    try {
        const serviceAccount = await fs_extra_1.default.readJson(serviceAccountKeyPath);
        const auth = new googleapis_1.google.auth.GoogleAuth({
            credentials: serviceAccount,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        return googleapis_1.google.drive({ version: 'v3', auth });
    }
    catch (error) {
        console.error('Error initializing Google Drive client:', error.message);
        throw error;
    }
}
//# sourceMappingURL=utils.js.map