import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Home, Info, History, Star, Settings } from "lucide-react"
import SidebarProfile from "@/components/sideBarProfile.tsx"

export default function Navbar({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="flex min-h-screen bg-white text-gray-900">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: sidebarOpen ? 260 : 80 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative flex flex-col shadow-2xl"
                style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRight: "1px solid rgba(200,200,200,0.3)",
                }}
            >
                {/* Верх: логотип + кнопка */}
                <div className="p-4 flex items-center justify-between border-b border-gray-200/40 relative">
                    <AnimatePresence>
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
                    </AnimatePresence>

                    {/* Кнопка бургер фиксируем абсолютной */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="cursor-pointer flex justify-center mt-[3px] mb-[3px] p-2 rounded-lg overflow-hidden transition"
                    >
                        <Menu className=" z-10 h-5 w-5" />
                    </button>
                </div>

                {/* Навигация */}
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
                        {[
                            { to: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
                            { to: "/about", label: "About", icon: <Info className="h-5 w-5" /> },
                            { to: "/history", label: "History", icon: <History className="h-5 w-5" /> },
                            { to: "/favorites", label: "Favorites", icon: <Star className="h-5 w-5" /> },
                            { to: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
                        ].map((item, i) => (
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
                                    {/* Liquid hover эффект */}
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

                {/* Профиль */}
                <SidebarProfile sidebarOpen={sidebarOpen} />
            </motion.aside>

            {/* Контент */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}
