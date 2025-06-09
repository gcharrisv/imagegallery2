import jwt from "jsonwebtoken";

export interface IAuthTokenPayload {
    username: string;
}

export function generateAuthToken(username: string, jwtSecret: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const payload: IAuthTokenPayload = { username };
        jwt.sign(payload, jwtSecret, { expiresIn: "1d" }, (err, token) => {
            if (err || !token) reject(err);
            else resolve(token);
        });
    });
}
