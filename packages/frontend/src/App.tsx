import { Routes, Route, Navigate } from "react-router";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { MainLayout } from "./MainLayout.tsx";
import { useRef, useState } from "react";
import type { IApiImageData } from "csc437-monorepo-backend/src/common/ApiImageData.ts";
import { ImageSearchForm } from "./images/ImageSearchForm";
import type { ReactNode } from "react";

function ProtectedRoute(
    { authToken, children }: { authToken: string; children: ReactNode }
) {
    return authToken ? children : <Navigate to="/login" replace />;
}

function App() {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") ?? "");
    const [imageData, setImageData] = useState<IApiImageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [searchString, setSearchString] = useState("");
    const requestIdRef = useRef(0);

    async function fetchImages(filter?: string) {
        const thisRequestId = ++requestIdRef.current;
        setIsLoading(true);
        setIsError(false);

        try {
            const query = filter ? `?name=${encodeURIComponent(filter)}` : "";
            const res = await fetch(`/api/images${query}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!res.ok) throw new Error("Request failed");
            const data = await res.json();
            if (thisRequestId === requestIdRef.current) setImageData(data);
        } catch {
            if (thisRequestId === requestIdRef.current) setIsError(true);
        } finally {
            if (thisRequestId === requestIdRef.current) setIsLoading(false);
        }
    }

    function handleAuthToken(token: string) {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
        fetchImages();
    }

    function handleImageSearch() {
        fetchImages(searchString);
    }

    const searchPanel = (
        <ImageSearchForm
            searchString={searchString}
            onSearchStringChange={setSearchString}
            onSearchRequested={handleImageSearch}
        />
    );

    return (
        <Routes>
            <Route path="/" element={<MainLayout authToken={authToken} onLogout={() => {
                setAuthToken("");
                localStorage.removeItem("authToken");
            }} />}>
                <Route
                    index
                    element={
                        <ProtectedRoute authToken={authToken}>
                            <AllImages
                                imageData={imageData}
                                isLoading={isLoading}
                                isError={isError}
                                searchPanel={searchPanel}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="upload"
                    element={
                        <ProtectedRoute authToken={authToken}>
                            <UploadPage authToken={authToken} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="images/:imageId"
                    element={
                        <ProtectedRoute authToken={authToken}>
                            <ImageDetails
                                imageData={imageData}
                                isLoading={isLoading}
                                isError={isError}
                                setImageData={setImageData}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route path="login" element={<LoginPage isRegistering={false} onAuthToken={handleAuthToken} />} />
                <Route path="register" element={<LoginPage isRegistering={true} onAuthToken={handleAuthToken} />} />
            </Route>
        </Routes>
    );
}

export default App;

