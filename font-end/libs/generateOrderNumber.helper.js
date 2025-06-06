"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
function generateOrderNumber() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // yyyyMMddHHmmss
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
}
//# sourceMappingURL=generateOrderNumber.helper.js.map