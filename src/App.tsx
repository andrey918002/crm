import Navbar from "@/components/Navbar.tsx";
import { Outlet } from "@tanstack/react-router"
function App() {
    return (
        <>
            <div>
                <Navbar />
                <Outlet />
            </div>
        </>
    )
}

export default App
