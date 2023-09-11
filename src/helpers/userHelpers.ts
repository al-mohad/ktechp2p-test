
import multer from 'multer';
import path from "path";

import { getMongoUserById } from "../models/UserSchema";

export const validateDeleteUserBody = async (body: any) => {
    const { uid } = body;

    if (!uid) return "User ID is missing"
    const user = await getMongoUserById(uid);
    if (!user) return "User not found"
    return null
}

export const getUploadPath = (fieldName: string) => {
    switch (fieldName) {
        case 'profile':
            return './public/uploads/profile-avatar';
        default:
            return './public/uploads/';
    }
}

export const checkFileType = (file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const fileTypes = '/jpeg|jpj|png/'
    const extname = fileTypes.match(
        path.extname(file.originalname).toLocaleLowerCase(),
    )
    const mimeType = fileTypes.match(file.mimetype)
    if (extname && mimeType) {
        return callback(null, true)
    } else {
        // bug:: fix this
        callback(null, false)
    }
}