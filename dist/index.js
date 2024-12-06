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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const userMiddleware_1 = __importDefault(require("./userMiddleware"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_TOKEN || '123abc';
const saltRounds = 10;
app.use(express_1.default.json());
//@ts-ignore
app.post('/v1/api/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!(email && password))
            return res.status(400).json({ "message": "enter the email and password" });
        const user = yield db_1.userModel.findOne({
            email
        });
        if (!user) {
            return res.status(500).json("wrong user cretentials");
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ "message": "invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET);
        res.status(200).json({
            "token": token
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
}));
//@ts-ignore
app.post('/v1/api/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    if (!(username && password && email))
        return res.status(400).json({ "message": "username password and email required" });
    try {
        const hash = bcrypt_1.default.hashSync(password, saltRounds);
        const exisitingUser = yield db_1.userModel.findOne({ email: email });
        if (!exisitingUser) {
            const newUser = yield db_1.userModel.create({
                username: username,
                password: hash,
                email: email
            });
            const token = jsonwebtoken_1.default.sign({ id: newUser._id }, JWT_SECRET);
            return res.json({
                "token": token
            });
        }
        return res.json("user already exits");
    }
    catch (e) {
        console.log(e);
    }
}));
//@ts-ignore
app.post('/v1/api/content', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { link, type, tag, title } = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log(userid);
    if (!userid)
        return res.status(400).json({ "error": "not authenticted user" });
    try {
        const newContent = yield db_1.contentModel.create({ link,
            type,
            tag,
            title,
            userId: userid });
        res.json({ "message": "content added successfully" });
    }
    catch (e) {
        res.status(404).json({
            "error": e
        });
    }
}));
//@ts-ignore
app.delete('/v1/api/content/:id', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const contentId = req.params.id;
    const userid = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    if (!userid)
        return res.status(411).json({ "error": "user not authenticated" });
    try {
        const content = yield db_1.contentModel.findOne({
            _id: contentId
        });
        if (!content)
            return res.status(404).json({ "message": "data not found enter correct contentid" });
        if (content.userId.toString() != userid)
            return res.status(403).json({ "message": "unauthorized to delete this content" });
    }
    catch (e) {
        console.log("error deleting content" + e);
    }
}));
app.post('/v1/api/share', (req, res) => {
});
app.get('/v1/api/:shareLink', (req, res) => {
});
app.listen(3000, () => {
    console.log(`server is running`);
});
