import express from "express";
import { ImageProvider } from "../ImageProvider.js";
import type { Request, Response } from "express";

export function registerImageRoutes(app: express.Application, imageProvider: ImageProvider) {
    app.get("/api/images", async (req, res) => {
        try {
            const nameFilter = typeof req.query.name === "string" ? req.query.name : undefined;
            const images = await imageProvider.getAllImages(nameFilter);
            res.json(images);
        } catch (err) {
            res.status(500).send({ error: "Internal Server Error" });
        }
    });

    app.use(express.json());

    app.put("/api/images/:id", async (req: Request, res: Response): Promise<void> => {
        const { id: imageId } = req.params;
        const { newName } = req.body;

        if (typeof newName !== "string" || newName.trim().length === 0) {
            res.status(400).send({
                error: "Bad Request",
                message: "newName must be a non-empty string"
            });
            return;
        }

        if (newName.length > 100) {
            res.status(422).send({
                error: "Unprocessable Entity",
                message: "Image name exceeds 100 characters"
            });
            return;
        }

        if (!imageId || !imageId.match(/^[a-f\d]{24}$/i)) {
            res.status(404).send({
                error: "Not Found",
                message: "Invalid image ID format"
            });
            return;
        }

        try {
            const matched = await imageProvider.updateImageName(imageId, newName);
            if (matched === 0) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist"
                });
                return;
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).send({
                error: "Internal Server Error",
                message: "Something went wrong while updating the image name"
            });
        }
    });


}

