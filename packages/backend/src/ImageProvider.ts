import { Collection, MongoClient, ObjectId } from "mongodb";
import type { IApiImageData } from "./common/ApiImageData.js";

interface IImageDocument {
    _id?: ObjectId;
    src: string;
    name: string;
    authorId: ObjectId;
    [key: string]: any;
}

interface IUserDocument {
    _id?: ObjectId;
    username: string;
    email: string;
    [key: string]: any;
}

export class ImageProvider {
    private imageCollection: Collection<IImageDocument>;
    private userCollection: Collection<IUserDocument>;

    constructor(private readonly mongoClient: MongoClient) {
        const imageCol = process.env.IMAGES_COLLECTION_NAME;
        const userCol = process.env.USERS_COLLECTION_NAME;
        if (!imageCol || !userCol) throw new Error("Missing collection names in .env");

        this.imageCollection = this.mongoClient.db().collection<IImageDocument>(imageCol);
        this.userCollection = this.mongoClient.db().collection<IUserDocument>(userCol);
    }

    async getAllImages(nameFilter?: string): Promise<IApiImageData[]> {
        const pipeline: any[] = [
            {
                $lookup: {
                    from: this.userCollection.collectionName,
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            {
                $project: {
                    id: { $toString: "$_id" },
                    src: 1,
                    name: 1,
                    author: {
                        id: { $toString: "$author._id" },
                        username: "$author.username"
                    }
                }
            }
        ];

        if (nameFilter) {
            pipeline.unshift({ $match: { name: { $regex: nameFilter, $options: "i" } } });
        }

        return this.imageCollection.aggregate(pipeline).toArray() as Promise<IApiImageData[]>;
    }

    async updateImageName(imageId: string, newName: string): Promise<number> {
        const result = await this.imageCollection.updateOne(
            { _id: new ObjectId(imageId) },
            { $set: { name: newName } }
        );
        return result.matchedCount;
    }

}


