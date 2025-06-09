import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

interface LoginPageProps {
    isRegistering: boolean;
    onAuthToken: (token: string) => void;
}

export function LoginPage({ isRegistering, onAuthToken }: LoginPageProps) {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();

    const [error, setError] = React.useState("");
    const [isPending, setIsPending] = React.useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsPending(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        const endpoint = isRegistering ? "/auth/register" : "/auth/login";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const body = await res.json();
                setError(body.message || "Unexpected error");
                return;
            }

            const data = await res.json();
            onAuthToken(data.token);
            navigate("/");
        } catch {
            setError("Could not reach server.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <h2>{isRegistering ? "Register a new account" : "Login"}</h2>
            <form className="LoginPage-form" onSubmit={handleSubmit}>
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} name="username" required disabled={isPending} />

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} name="password" type="password" required disabled={isPending} />

                <input type="submit" value="Submit" disabled={isPending} />

                {error && <p style={{ color: "red" }} aria-live="polite">{error}</p>}
            </form>
            {!isRegistering && (
                <p>
                    Don’t have an account? <Link to="/register">Register here</Link>.
                </p>
            )}
        </>
    );
}
