"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = hello;
const utils_1 = require("./utils");
const world = 'world';
function hello(who = world) {
    return `Hello ${who}! `;
}
console.log(hello());
Promise.resolve()
    .then(() => (0, utils_1.initializeDriveClient)('./secret/service-account-key.json'));
//# sourceMappingURL=index.js.map