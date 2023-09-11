"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./router"));
const mailer_1 = __importDefault(require("./utilities/mailer"));
// import swaggerDocs from "../src/utilities/swagger"
const firebaseController_1 = __importDefault(require("./controllers/firebaseController"));
const socketController_1 = __importDefault(require("./controllers/socketController"));
const userHelpers_1 = require("./helpers/userHelpers");
require('dotenv').config();
const firebaseController = new firebaseController_1.default();
const app = (0, express_1.default)();
// middlewares
app.use((0, cors_1.default)({
    credentials: true
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// public folder
app.use(express_1.default.static('/public'));
app.use(express_1.default.urlencoded({ extended: true }));
// less hackers knows about our stack
app.disable("x-powered-by");
// Set up Multer for handling file uploads
const storage = multer_1.default.diskStorage({
    // todo:: check if there is an avatar with the user's id
    destination: (req, file, cb) => {
        let destination = (0, userHelpers_1.getUploadPath)(file.fieldname);
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        let profileName = req.params.id;
        cb(null, profileName + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    // limits: { fieldSize: 1000000 },
    // fileFilter(req, file, callback) {
    //     checkFileType(file, callback)
    // },
});
const PORT = process.env.PORT || 3000;
// const url = "mongodb://localhost:27017/mern_playground"
const server = http_1.default.createServer(app);
// const io = new Server(server);
// Connect and export the io instance
const io = (0, socketController_1.default)(server);
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(process.env.MONGO_CONNECTION_STRING, {}).then(() => {
    console.info(`Database connected`);
    server.listen(PORT, async () => {
        console.error(`Server running on http://localhost:${PORT}`);
        // swaggerDocs(app, 3000);
        await firebaseController.test();
        await (0, mailer_1.default)({
            from: "test@example.com",
            to: "gmbdairy@gmail.com",
            subject: "Welcome on board to flash",
            text: "This is a test from flash nodemailer"
        });
    });
    // swaggerDocs(app, 3000)
});
mongoose_1.default.connection.on('error', (e) => {
    console.error(`Error connecting to database: ${e}`);
});
app.use('/api/v1', (0, router_1.default)());
/*
* listen to any event
? io.on('event_name',(data)=>{
?   perform operation on data
})
*/
/*
* send message to all sockets
? io.broadcast.emit('event_name',data)
*/ 
//# sourceMappingURL=index.js.map