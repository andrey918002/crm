import Navbar from "./components/Navbar";
import { Outlet, useRouterState } from "@tanstack/react-router"

function App() {
    const routerState = useRouterState();
    const pathname = routerState.location.pathname;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    return (
        <div>
            <div className="app">
                {!isAuthPage && <Navbar />}
                <Outlet />
            </div>
        </div>
    )
}

export default App