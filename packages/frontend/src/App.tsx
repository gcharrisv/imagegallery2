import { Routes, Route } from "react-router";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { MainLayout } from "./MainLayout.tsx";
import { useEffect, useState } from "react";
import type { IApiImageData } from "csc437-monorepo-backend/src/common/ApiImageData.ts";

function App() {
    const [imageData, setImageData] = useState<IApiImageData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetch("/api/images")
            .then(res => {
                if (!res.ok) throw new Error("Request failed");
                return res.json();
            })
            .then(data => setImageData(data))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route
                    index
                    element={
                        <AllImages
                            imageData={imageData}
                            isLoading={isLoading}
                            isError={isError}
                        />
                    }
                />
                <Route path="upload" element={<UploadPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route
                    path="images/:imageId"
                    element={
                        <ImageDetails
                            imageData={imageData}
                            isLoading={isLoading}
                            isError={isError}
                            setImageData={setImageData}
                        />
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;

