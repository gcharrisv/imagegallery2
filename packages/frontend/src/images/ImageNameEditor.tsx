import { useState } from "react";

interface INameEditorProps {
    initialValue: string;
    imageId: string;
    onUpdate: (newName: string) => void;
}

export function ImageNameEditor({ initialValue, onUpdate }: INameEditorProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [input, setInput] = useState(initialValue);
    const [isWorking, setIsWorking] = useState(false);
    const [error, setError] = useState(false);

    async function handleSubmitPressed() {
        setIsWorking(true);
        setError(false);
        try {
            const res = await fetch("/api/images"); // fake request
            if (!res.ok) throw new Error("Request failed");

            onUpdate(input); // update local state
            setIsEditingName(false);
        } catch {
            setError(true);
        } finally {
            setIsWorking(false);
        }
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name{" "}
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={isWorking}
                    />
                </label>
                <button onClick={handleSubmitPressed} disabled={input.length === 0 || isWorking}>
                    Submit
                </button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
                {isWorking && <p>Working...</p>}
                {error && <p style={{ color: "red" }}>Something went wrong.</p>}
            </div>
        );
    }

    return (
        <div style={{ margin: "1em 0" }}>
            <button onClick={() => setIsEditingName(true)}>Edit name</button>
        </div>
    );
}
