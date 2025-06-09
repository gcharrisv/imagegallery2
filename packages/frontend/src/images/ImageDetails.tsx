import { useParams } from "react-router";
import type { IApiImageData } from "../../../backend/src/common/ApiImageData.ts";
import { ImageNameEditor } from "./ImageNameEditor.tsx";

interface Props {
    imageData: IApiImageData[];
    isLoading: boolean;
    isError: boolean;
    setImageData: (newData: IApiImageData[]) => void;
}

export function ImageDetails({ imageData, isLoading, isError, setImageData }: Props) {
    const { imageId } = useParams();

    if (isLoading) return <p>Loading image details...</p>;
    if (isError) return <p style={{ color: "red" }}>Failed to load image data.</p>;

    const image = imageData.find(img => img.id === imageId);
    if (!image) return <p>Image not found</p>;

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>

            <ImageNameEditor
                initialValue={image.name}
                imageId={image.id}
                onUpdate={(newName) => {
                    const updated = imageData.map(img =>
                        img.id === image.id ? { ...img, name: newName } : img
                    );
                    setImageData(updated);
                }}
            />

            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    );
}

