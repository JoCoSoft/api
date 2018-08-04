"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = __importDefault(require("sequelize"));
if (process.env.DATABASE_URL === undefined)
    throw Error("Missing required environment variable 'DATABASE_URL'");
exports.default = new sequelize_1.default(process.env.DATABASE_URL);
