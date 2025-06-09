import express from "express";
import type { Request, Response } from "express";
import { CredentialsProvider } from "../CredentialsProvider.js";
import { generateAuthToken } from "../authUtils.js";

export function registerAuthRoutes(app: express.Application, credsProvider: CredentialsProvider) {
    app.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send({
                error: "Bad Request",
                message: "Missing username or password"
            });
            return;
        }

        const success = await credsProvider.registerUser(username, password);
        if (!success) {
            res.status(409).send({
                error: "Conflict",
                message: "Username already taken"
            });
            return;
        }

        res.status(201).end();
    });

    app.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send({
                error: "Bad Request",
                message: "Missing username or password"
            });
            return;
        }

        const valid = await credsProvider.verifyPassword(username, password);
        if (!valid) {
            res.status(401).send({
                error: "Unauthorized",
                message: "Incorrect username or password"
            });
            return;
        }

        const token = await generateAuthToken(username, req.app.locals.JWT_SECRET);
        res.send({ token });
    });
}



