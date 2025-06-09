import React, { useState } from "react";
import "./LoginPage.css";

export function UploadPage({ authToken }: { authToken: string }) {
    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("green");
    const [isPending, setIsPending] = useState(false);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setMessage("");

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/images", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            setMessage("Image uploaded successfully!");
            setMessageColor("green");
        } catch {
            setMessage("Upload failed.");
            setMessageColor("red");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <h2>Upload</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="imageInput">Choose image to upload: </label>
                    <input
                        id="imageInput"
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        onChange={handleFileChange}
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label htmlFor="titleInput">
                        <span>Image title: </span>
                        <input
                            id="titleInput"
                            name="name"
                            required
                            disabled={isPending}
                        />
                    </label>
                </div>

                {preview && (
                    <div>
                        <img
                            style={{ width: "20em", maxWidth: "100%" }}
                            src={preview}
                            alt="Preview of selected file"
                        />
                    </div>
                )}

                <input
                    type="submit"
                    value="Confirm upload"
                    disabled={isPending}
                />

                {message && (
                    <p aria-live="polite" style={{ color: messageColor }}>
                        {message}
                    </p>
                )}
            </form>
        </>
    );
}
