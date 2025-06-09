import { ImageGrid } from "./ImageGrid.tsx";
import type { IApiImageData } from "../../../backend/src/common/ApiImageData.ts";

interface Props {
    imageData: IApiImageData[];
    isLoading: boolean;
    isError: boolean;
    searchPanel: React.ReactNode;
}


export function AllImages({ imageData, isLoading, isError, searchPanel }: Props) {
    if (isLoading) return <p>Loading images...</p>;
    if (isError) return <p style={{ color: "red" }}>Failed to load images.</p>;

    return (
        <>
            <h2>All Images</h2>
            {searchPanel}
            <ImageGrid images={imageData} />
        </>
    );
}

