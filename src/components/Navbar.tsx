import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Home, Info, Phone, Settings, MessageCircle, Ticket, LucideShoppingBag } from "lucide-react"
import { useAuth } from "./AuthContext";
type childrenType = React.ReactNode
interface NavbarProps {
    children?: childrenType
}
const menuItems = [
    { to: "/", label: "Головна", icon: <Home className="h-5 w-5" /> },
    { to: "/about", label: "Про нас", icon: <Info className="h-5 w-5" /> },
    { to: "/contact", label: "Контакти", icon: <Phone className="h-5 w-5" /> },
    { to: "/shop", label: "Магазин", icon: <LucideShoppingBag className="h-5 w-5" /> },
    { to: "/chat", label: "Чат", icon: <MessageCircle className="h-5 w-5" /> },
    { to: "/task", label: "Задачi", icon: <Ticket className="h-5 w-5" /> },
    { to: "/setting", label: "Налаштування", icon: <Settings className="h-5 w-5" /> },
]

export default function Navbar({ children }: NavbarProps) {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-white text-gray-900">
            {/* ---------- Desktop Sidebar ---------- */}
            <motion.aside
                animate={{ width: sidebarOpen ? 260 : 80 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="hidden sm:flex relative flex-col shadow-2xl shrink-0"
                style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRight: "1px solid rgba(200,200,200,0.3)",
                }}
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-200/40 relative">
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center font-bold text-white shadow-md">
                                    M
                                </div>
                                <div>
                                    <h2 className="font-semibold">MyCRM</h2>
                                    <p className="text-xs text-gray-500">Enterprise</p>
                                </div>
                            </motion.div>
                        )}


                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="cursor-pointer flex justify-center p-2 rounded-lg transition"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

                {/* Sidebar nav */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs uppercase text-gray-500 mb-3 tracking-wider"
                            >
                                Меню
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <ul className="space-y-2">
                        {menuItems.map((item, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    to={item.to}
                                    className="cursor-pointer relative flex items-center gap-3 px-3 py-2 rounded-lg transition group overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition"></span>
                                    {item.icon}
                                    <AnimatePresence>
                                        {sidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="relative"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </nav>

                <Link
                    to="/setting"
                    className="relative flex items-center gap-3 w-full text-left p-2 rounded-lg overflow-hidden transition cursor-pointer"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 hover:opacity-20 blur-xl transition-all duration-300"></span>
                    <img
                        src="https://github.com/shadcn.png"
                        alt="user"
                        className="w-8 h-8 rounded-full relative z-10"
                    />
                    {sidebarOpen && user && (
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-900">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    )}
                </Link>
            </motion.aside>

            {/* ---------- Mobile Top Navbar ---------- */}
            <header className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center font-bold text-white shadow-md">
                            M
                        </div>
                        <span className="font-semibold">MyCRM</span>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-gray-200 bg-white"
                        >
                            <ul className="flex flex-col p-2">
                                {menuItems.map((item, i) => (
                                    <Link
                                        key={i}
                                        to={item.to}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </ul>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>

            {/* ---------- Page Content ---------- */}
            <div className="page-content flex-1 p-6 overflow-y-auto sm:ml-0 sm:mt-0 mt-[64px]">
                {children}
            </div>
        </div>
    )
}
