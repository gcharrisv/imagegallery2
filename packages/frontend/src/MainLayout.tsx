import { Link, Outlet } from "react-router-dom";
import { Header } from "./Header.tsx";

interface MainLayoutProps {
    authToken: string;
    onLogout: () => void;
}

export function MainLayout({ authToken, onLogout }: MainLayoutProps) {
    return (
        <>
            <Header />
            <nav>
                <Link to="/">Home</Link> |{" "}
                <Link to="/upload">Upload</Link> |{" "}
                {authToken
                    ? <button onClick={onLogout}>Logout</button>
                    : <Link to="/login">Login</Link>}
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}
