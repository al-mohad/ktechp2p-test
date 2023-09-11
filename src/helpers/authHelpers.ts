// import { signJWT } from 'utilities/jwt';
import { getMongoUserByEmail, getMongoUserByMobileNumber, getMongoUserByUsername } from '../models/UserSchema';

export const validateRegistrationSchema = async (body: any): Promise<string | null> => {
    const { mobileNumber, email, password, username, fcmToken } = body;

    if (!email) return "email is required"
    if (!mobileNumber) return "mobileNumber is required"
    if (!username) return "username is required"
    if (!fcmToken) return "fcm token is required"
    if (!password) return "password is required"

    const nigerianMobileNumberRegex = /^\+234[789]\d{9}$/;
    if (!nigerianMobileNumberRegex.test(mobileNumber)) {
        return "Invalid mobile number";
    }

    if (mobileNumber) {
        const mobileNumberExist = await getMongoUserByMobileNumber(mobileNumber);
        if (mobileNumberExist !== null) return "User with that mobile number already exist."
    }
    if (username) {
        const usernameExist = await getMongoUserByUsername(username);
        if (usernameExist !== null) return "Username taken."
    }
    if (email) {
        const emailExist = await getMongoUserByEmail(email);
        if (emailExist !== null) return "User with that email already exist."
    }
    return null
}

export const validateLoginSchema = async (body: any): Promise<string | null> => {
    const { mobileNumber, password } = body;
    if (!mobileNumber) return "mobileNumber is required"
    if (!password) return "password is required"

    const nigerianMobileNumberRegex = /^\+234[789]\d{9}$/;
    if (!nigerianMobileNumberRegex.test(mobileNumber)) {
        return "Invalid mobile number";
    }
    return null
}

export const validateRequestUserVerification = async (body: any) => {
    const { mobileNumber } = body;
    if (!mobileNumber) return "Mobile number is missing"
    const nigerianMobileNumberRegex = /^\+234[789]\d{9}$/;
    if (!nigerianMobileNumberRegex.test(mobileNumber)) {
        return "Invalid mobile number";
    }
    return null
}

export const validateVerifyUser = async (body: any) => {
    const { mobileNumber, otp } = body;
    if (!mobileNumber) return "Mobile number is missing"
    if (!otp) return "OTP code is missing"
    const nigerianMobileNumberRegex = /^\+234[789]\d{9}$/;
    if (!nigerianMobileNumberRegex.test(mobileNumber)) {
        return "Invalid mobile number";
    }
    return null
}

export const validatePassword = async (password: string) => {

}


// FIXIT::experiment

// export function signAccessToken(user: Document) {
//     const payload = user.toJSON()
//     const accessToken = signJWT(payload, "accessTokenPrivateKey")
//     return accessToken
// }

// export function signRefreshToken({ userId }: { userId: String }) { }