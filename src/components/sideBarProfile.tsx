import { useState } from "react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function SidebarProfile({ sidebarOpen }: { sidebarOpen: boolean }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="cursor-pointer p-4 border-t border-gray-200/30">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <button className="relative flex items-center gap-3 w-full text-left p-2 rounded-lg overflow-hidden transition cursor-pointer">
                        {/* Liquid hover эффект */}
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 hover:opacity-20 blur-xl transition-all duration-300"></span>

                        {/* Аватар */}
                        <img
                            src="https://github.com/shadcn.png"
                            alt="user"
                            className="w-8 h-8 rounded-full relative z-10"
                        />

                        {/* Информация о пользователе */}
                        {sidebarOpen && (
                            <div className="relative z-10">
                                <p className="text-sm font-medium text-gray-900">shadcn</p>
                                <p className="text-xs text-gray-500">m@example.com</p>
                            </div>
                        )}
                    </button>
                </SheetTrigger>

                {/* Панель с настройками профиля */}
                <SheetContent side="right" className="w-80 p-6 bg-white text-gray-900">
                    <h2 className="text-lg font-semibold mb-4">Налаштування профілю</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm block mb-1">Ім'я</label>
                            <input
                                type="text"
                                defaultValue="shadcn"
                                className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="text-sm block mb-1">Пошта</label>
                            <input
                                type="email"
                                defaultValue="m@example.com"
                                className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-900"
                            />
                        </div>
                        <Button className="w-full cursor-pointer">Сохранить</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

