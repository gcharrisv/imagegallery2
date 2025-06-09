import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

class ImageFormatError extends Error { }

const storageEngine = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadsPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");
        cb(null, uploadsPath);
    },
    filename: function (_req, file, cb) {
        let ext = "";
        if (file.mimetype === "image/png") ext = "png";
        else if (["image/jpeg", "image/jpg"].includes(file.mimetype)) ext = "jpg";
        else return cb(new ImageFormatError("Unsupported image type"), "");

        const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
        cb(null, fileName);
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export function handleImageFileErrors(err: any, _req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err);
}
