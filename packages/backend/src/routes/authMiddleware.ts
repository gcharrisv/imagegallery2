import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import type { IAuthTokenPayload } from "../authUtils.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: IAuthTokenPayload;
    }
}

export function verifyAuthToken(req: Request, res: Response, next: NextFunction): void {
    const header = req.get("Authorization");
    const token = header?.split(" ")[1];

    if (!token) {
        res.status(401).end();
        return;
    }

    jwt.verify(
        token,
        req.app.locals.JWT_SECRET as string,
        (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (err || !decoded) {
                res.status(403).end();
                return;
            }

            req.user = decoded as IAuthTokenPayload;
            next();
        }
    );
}

