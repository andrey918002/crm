import { Link } from "@tanstack/react-router"

export default function Navbar() {
    return (
        <nav
            style={{
                padding: "1rem",
                background: "#eee",
                marginBottom: "2rem",
                display: "flex",
                gap: "1rem",
                listStyle: "none",
            }}
        >
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/about">About Page</Link>
            </li>
        </nav>
    )
}