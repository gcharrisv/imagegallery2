import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ValidRoutes } from "./shared/ValidRoutes.js";
import { connectMongo } from "./connectMongo.js";
import { ImageProvider } from "./ImageProvider.js";
import { registerImageRoutes } from "./routes/imageRoutes.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { CredentialsProvider } from "./CredentialsProvider.js";
import { verifyAuthToken } from "./routes/authMiddleware.js";

dotenv.config();

const mongoClient = connectMongo();
await mongoClient.connect();

const imageProvider = new ImageProvider(mongoClient);

const app = express();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ABS_STATIC_PATH = path.resolve(__dirname, STATIC_DIR);
const INDEX_HTML_PATH = path.join(ABS_STATIC_PATH, "index.html");

const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR || "uploads";


app.use(express.static(ABS_STATIC_PATH));
app.use(express.json());
app.use("/api", verifyAuthToken);

app.use("/uploads", express.static(process.env.IMAGE_UPLOAD_DIR || "uploads"));

app.locals.JWT_SECRET = process.env.JWT_SECRET;
const credsProvider = new CredentialsProvider(mongoClient);

registerAuthRoutes(app, credsProvider);
registerImageRoutes(app, imageProvider);

app.get("/api/hello", (_req, res) => {
    res.send("Hello world");
});

for (const route of Object.values(ValidRoutes)) {
    app.get(route, (_req, res) => {
        res.sendFile(INDEX_HTML_PATH);
    });
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

