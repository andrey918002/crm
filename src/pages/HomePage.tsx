import { useAuth } from "../components/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
    const { user, login } = useAuth();
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

        try {
            const url =
                mode === "register"
                    ? "http://127.0.0.1:8000/api/auth/register/"
                    : "http://127.0.0.1:8000/api/auth/login/";

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

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || "Помилка авторизації");

            if (mode === "register") {
                setSuccess("Реєстрація успішна! Тепер увійдіть у свій акаунт.");
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

    if (!user) {
        return (
            // Абсолютний повноекранний оверлей з новим яскравим фоном
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-indigo-900 z-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Анімований фон-світіння */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.3, scale: 1.5 }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"
                />

                <motion.div
                    // Використання 'key' для перезапуску анімації при зміні mode
                    key={mode}
                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    className="w-full max-w-md relative z-10"
                >
                    <Card className="shadow-2xl border-2 border-indigo-400/50 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-indigo-500/50">
                        <CardHeader>
                            <CardTitle className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                                {mode === "register" ? "🚀 Реєстрація" : "🔑 Вхід до акаунту"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Ім'я користувача"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="border-indigo-300 focus:ring-indigo-500"
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
                                            className="border-indigo-300 focus:ring-indigo-500"
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
                                        className="border-indigo-300 focus:ring-indigo-500"
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
                                            className="border-indigo-300 focus:ring-indigo-500"
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
                                    className="w-full h-10 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition duration-300"
                                >
                                    {loading
                                        ? "⏳ Зачекайте..."
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
                                                className="text-indigo-600 hover:underline font-medium"
                                                onClick={() => setMode("login")}
                                            >
                                                Увійти
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Немає акаунту?{" "}
                                            <button
                                                type="button"
                                                className="text-indigo-600 hover:underline font-medium"
                                                onClick={() => setMode("register")}
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
        );
    }

    // Основний контент сайту, що відображається після успішного входу
    return (
        <div className="p-10 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl font-extrabold text-blue-700">Вітаю, {user.username}!</h1>
                <p className="text-gray-500 mt-2 text-lg">Ви успішно увійшли в акаунт. Починаймо роботу!</p>
            </motion.div>

            {/* --- Невеликий блок інформації --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-3xl"
            >
                <Card className="shadow-xl border border-gray-100 bg-white p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm6 4a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                            Ваш персональний простір
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <p className="text-gray-600">
                            Цей розділ є початковою точкою вашого досвіду на платформі. Тут ви знайдете важливі посилання та швидкий доступ до основних функцій:
                        </p>
                        <ul className="list-disc list-inside text-left ml-4 space-y-1 text-gray-700">
                            <li>Перегляд останніх оновлень.</li>
                            <li>Налаштування вашого профілю.</li>
                            <li>Створення нового проекту або завдання.</li>
                        </ul>
                        <div className="flex justify-start space-x-4 pt-4">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Перейти до Дашборду
                            </Button>
                            <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                                Налаштування Профілю
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}