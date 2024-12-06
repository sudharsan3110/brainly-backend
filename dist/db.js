"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = exports.contentModel = exports.linkModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const name = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb://localhost:27017/brainly");
});
const UserSchema = new mongoose_2.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});
const TagSchema = new mongoose_2.Schema({
    title: { type: String, unique: true, required: true }
});
const contentType = ['images', 'audio', 'video', 'document'];
const ContentSchema = new mongoose_2.Schema({
    link: { type: String, unique: true, required: true },
    type: { type: String, enum: contentType, required: true },
    tags: { type: mongoose_1.default.Types.ObjectId, ref: 'Tag' },
    title: { type: String, unique: true, required: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'user', required: true },
});
const linkSchema = new mongoose_1.default.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
});
const userModel = (0, mongoose_2.model)("User", UserSchema); //schema is equal to table and 
exports.userModel = userModel;
const TagModel = (0, mongoose_2.model)("Tag", TagSchema);
exports.TagModel = TagModel;
const linkModel = (0, mongoose_2.model)("link", linkSchema);
exports.linkModel = linkModel;
const contentModel = (0, mongoose_2.model)("content", ContentSchema);
exports.contentModel = contentModel;
name();
