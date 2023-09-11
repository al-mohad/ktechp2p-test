"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const authenticationRoute_1 = __importDefault(require("./authenticationRoute"));
const paymentsRoute_1 = __importDefault(require("./paymentsRoute"));
const playgroundRouter_1 = __importDefault(require("./playgroundRouter"));
const superAdminRouter_1 = __importDefault(require("./superAdminRouter"));
const usersRoute_1 = __importDefault(require("./usersRoute"));
const router = express_1.default.Router();
// todo::  implement schema validation using Joi package
exports.default = () => {
    (0, authenticationRoute_1.default)(router);
    (0, usersRoute_1.default)(router);
    (0, paymentsRoute_1.default)(router);
    (0, superAdminRouter_1.default)(router);
    (0, playgroundRouter_1.default)(router);
    router.get('/', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname + '/../../index.html'));
    });
    return router;
};
//# sourceMappingURL=index.js.map