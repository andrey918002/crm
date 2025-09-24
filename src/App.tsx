import Navbar from "@/components/Navbar.tsx";
import { Outlet } from "@tanstack/react-router"
function App() {
    return (
        <div>
            <div>
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default App
