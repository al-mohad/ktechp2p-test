import bodyParser from "body-parser"
import compression from "compression"
import cookierParser from "cookie-parser"
import cors from "cors"
import express from "express"
import http from "http"
import mongoose from "mongoose"
import morgan from "morgan"
import multer from 'multer'
import path from "path"
import router from "./router"



import { getUploadPath } from "./helpers/userHelpers"
require('dotenv').config()


const app = express()
// middlewares
app.use(cors({
    credentials: true
}))
app.use(compression())
app.use(cookierParser())
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(express.json())

// public folder
app.use(express.static('/public'))

app.use(express.urlencoded({ extended: true }))

// less hackers knows about our stack
app.disable("x-powered-by")

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    // todo:: check if there is an avatar with the user's id
    destination: (req, file, cb) => {
        let destination = getUploadPath(file.fieldname)
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        let profileName = req.params.id
        cb(null, profileName + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage,
    // limits: { fieldSize: 1000000 },
    // fileFilter(req, file, callback) {
    //     checkFileType(file, callback)
    // },
});

const PORT = process.env.PORT || 3000
// const url = "mongodb://localhost:27017/mern_playground"

const server = http.createServer(app)
// const io = new Server(server);
// Connect and export the io instance

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {}).then(() => {
    console.info(`Database connected`)
    server.listen(PORT, async () => {
        console.error(`Server running on http://localhost:${PORT}`)
        // swaggerDocs(app, 3000);


    })
    // swaggerDocs(app, 3000)
});

mongoose.connection.on('error', (e) => {
    console.error(`Error connecting to database: ${e}`)
})


app.use('/api/v1', router())

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