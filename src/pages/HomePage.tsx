import { useAuth } from "../components/AuthContext.tsx";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, LayoutDashboard, Settings, ShoppingCart, TrendingUp } from "lucide-react";

export default function HomePage() {
    const { user, login, logout } = useAuth();
    const [mode, setMode] = useState<"register" | "login">("register");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.username.trim()) newErrors.username = "Ім'я користувача обов'язкове";
        if (mode === "register") {
            if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Некоректний email";
            if (formData.password.length < 6)
                newErrors.password = "Пароль має містити мінімум 6 символів";
            if (formData.password !== formData.confirmPassword)
                newErrors.confirmPassword = "Паролі не співпадають";
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        setSuccess(null);
        setErrors({});

        try {
            const url =
                mode === "register"
                    ? "http://localhost:8000/api/auth/register/"
                    : "http://localhost:8000/api/auth/login/";

            const body =
                mode === "register"
                    ? {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                    }
                    : {
                        username: formData.username,
                        password: formData.password,
                    };

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const responseText = await res.text();
            let data: any = {};

            try {
                if (responseText) {
                    data = JSON.parse(responseText);
                } else {
                    data = {};
                }
            } catch (jsonError) {
                if (!res.ok) {
                    console.error("Помилка парсингу JSON. Сервер повернув:", responseText);
                    throw new Error(`Помилка: ${res.status} ${res.statusText}. Сервер повернув недійсний формат.`);
                }
            }


            if (!res.ok) {
                const errorMessage = data.detail || data.non_field_errors?.[0] || data.username?.[0] || data.email?.[0] || "Помилка авторизації";
                throw new Error(errorMessage);
            }

            if (mode === "register") {
                setSuccess("Реєстрація успішна! Тепер увійдйть у свій акаунт.");
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
                setMode("login");
            } else {
                login(data.user, data.token);
            }
        } catch (err: any) {
            setErrors({ general: err.message || "Невідома помилка" });
        } finally {
            setLoading(false);
        }
    };

    // Компонент для Карток швидкого достусу
    const QuickAccessCard = ({ title, description, icon: Icon, onClick, color = 'blue' }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className={`w-10 h-10 rounded-full bg-${color}-50 flex items-center justify-center mb-3`}>
                <Icon className={`text-${color}-600`} size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </motion.div>
    );

    // --- СТОРІНКА НЕАВТОРИЗОВАНОГО КОРИСТУВАЧА (Редизайн: Форма на екрані) ---
    if (!user) {
        return (
            // Змінено на звичайний контейнер з мінімалістичним фоном
            <div className="min-h-screen bg-gray-50 p-6 sm:p-10 flex items-center justify-center">

                {/* Контейнер для форми, центрований на сторінці */}
                <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* Ліва частина: Привітання та опис */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                        className="text-center lg:text-left p-4"
                    >
                        <h1 className="mt-[40px] text-5xl font-extrabold text-gray-900 mb-4">
                            Почніть <span className="text-blue-600">Працювати</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Увійдіть або зареєструйтесь, щоб отримати доступ до всіх функцій нашої платформи.
                        </p>
                        <ul className="text-lg text-gray-700 space-y-2 lg:ml-0 ml-4 list-disc list-inside">
                            <li>Швидкий доступ до ваших даних.</li>
                            <li>Безпечні та надійні транзакції.</li>
                            <li>Персоналізовані налаштування.</li>
                        </ul>
                    </motion.div>

                    {/* Права частина: Форма реєстрації/входу */}
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 14 }}
                        className="w-full max-w-sm mx-auto lg:mx-0 relative z-10"
                    >
                        {/* Мінімалістична Картка */}
                        <Card className="shadow-lg bg-white border border-gray-200">
                            <CardHeader className="pt-8 pb-4">
                                <CardTitle className="text-center text-3xl font-bold text-gray-800">
                                    {mode === "register" ? "Створення акаунту" : "Вхід"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Поля форми */}
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="Ім'я користувача"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="border-gray-300 focus:border-blue-600 bg-white"
                                        />
                                        {errors.username && (
                                            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                        )}
                                    </div>

                                    {mode === "register" && (
                                        <div>
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="border-gray-300 focus:border-blue-600 bg-white"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <Input
                                            type="password"
                                            placeholder="Пароль"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="border-gray-300 focus:border-blue-600 bg-white"
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                        )}
                                    </div>

                                    {mode === "register" && (
                                        <div>
                                            <Input
                                                type="password"
                                                placeholder="Підтвердіть пароль"
                                                value={formData.confirmPassword}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                                }
                                                className="border-gray-300 focus:border-blue-600 bg-white"
                                            />
                                            {errors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                            )}
                                        </div>
                                    )}

                                    {errors.general && (
                                        <p className="text-red-500 text-sm text-center">{errors.general}</p>
                                    )}
                                    {success && (
                                        <p className="text-green-600 text-sm text-center">{success}</p>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white transition duration-300 shadow-md"
                                    >
                                        {loading
                                            ? "⏳ Завантаження..."
                                            : mode === "register"
                                                ? "Зареєструватися"
                                                : "Увійти"}
                                    </Button>

                                    <p className="text-center text-sm mt-3 text-gray-600">
                                        {mode === "register" ? (
                                            <>
                                                Вже маєте акаунт?{" "}
                                                <button
                                                    type="button"
                                                    className="text-blue-600 hover:underline font-semibold"
                                                    onClick={() => { setMode("login"); setSuccess(null); setErrors({}); }}
                                                >
                                                    Увійти
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                Немає акаунту?{" "}
                                                <button
                                                    type="button"
                                                    className="text-blue-600 hover:underline font-semibold"
                                                    onClick={() => { setMode("register"); setSuccess(null); setErrors({}); }}
                                                >
                                                    Зареєструватися
                                                </button>
                                            </>
                                        )}
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    // --- СТОРІНКА АВТОРИЗОВАНОГО КОРИСТУВАЧА (Без змін) ---

    const welcomeVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <div className="max-w-full mx-auto space-y-10">
                <motion.div
                    variants={welcomeVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-start justify-between border-b border-gray-200 pb-6"
                >
                    <motion.div variants={welcomeVariants}>
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Вітаю, <span className="text-blue-600">{user.username}</span>!
                        </h1>
                        <p className="text-gray-500 mt-1 text-lg">Панель керування вашим проектом.</p>
                    </motion.div>

                    <motion.div variants={welcomeVariants}>
                        <Button
                            onClick={logout}
                            variant="outline"
                            className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 transition duration-300 shadow-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Вийти</span>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Секція Швидкого Доступу */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Швидкий Доступ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <QuickAccessCard
                            title="Дашборд"
                            description="Огляд ключових метрик та активності."
                            icon={LayoutDashboard}
                            onClick={() => alert("Перехід на Дашборд")}
                            color="blue"
                        />
                        <QuickAccessCard
                            title="Налаштування"
                            description="Керування профілем та параметрами системи."
                            icon={Settings}
                            onClick={() => alert("Перехід на Налаштування")}
                            color="indigo"
                        />
                        <QuickAccessCard
                            title="Магазин"
                            description="Перегляд товарів та управління кошиком."
                            icon={ShoppingCart}
                            onClick={() => alert("Перехід до Магазину")}
                            color="teal"
                        />
                        <QuickAccessCard
                            title="Звіти"
                            description="Аналіз даних та генерація звітів про продажі."
                            icon={TrendingUp}
                            onClick={() => alert("Перехід до Звітів")}
                            color="pink"
                        />
                    </div>
                </motion.div>

                {/* Секція Останньої Активності (Імітація) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Остання Активність</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {[
                            { time: "2 хв. тому", text: "Оновлено Email на 'new.email@example.com'." },
                            { time: "1 год. тому", text: "Додано 3 нові позиції до кошика." },
                            { time: "Вчора", text: "Здійснено вхід з нового пристрою (Київ, Україна)." },
                        ].map((activity, index) => (
                            <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50 transition">
                                <p className="text-gray-700">{activity.text}</p>
                                <span className="text-sm text-gray-400">{activity.time}</span>
                            </div>
                        ))}
                        <div className="p-4 text-center">
                            <Button variant="link" className="text-blue-600 hover:text-blue-700">
                                Переглянути всю історію
                            </Button>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}