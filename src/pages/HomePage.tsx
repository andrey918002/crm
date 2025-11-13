import { useAuth } from "../components/AuthContext.tsx";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react"; // <-- 1. Імпортуємо іконку

export default function HomePage() {
    // 2. Додаємо logout до деструктуризації
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
        setErrors({}); // Скидаємо попередні помилки

        try {
            // Змінено 127.0.0.1 на localhost для кращої сумісності з локальною мережею
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

            // 1. Отримання сирого тексту відповіді
            const responseText = await res.text();
            let data: any = {};

            // 2. Спроба розібрати відповідь як JSON
            try {
                // Перевіряємо, чи є відповідь порожньою, перш ніж парсити
                if (responseText) {
                    data = JSON.parse(responseText);
                } else {
                    // Це може бути, якщо сервер повернув 204 No Content або 200 без тіла
                    data = {};
                }
            } catch (jsonError) {
                // Якщо парсинг JSON не вдався (наприклад, це HTML),
                // і статус не є успішним, генеруємо помилку
                if (!res.ok) {
                    console.error("Помилка парсингу JSON. Сервер повернув:", responseText);
                    // Використовуємо загальне повідомлення + статус
                    throw new Error(`Помилка: ${res.status} ${res.statusText}. Сервер повернув недійсний формат.`);
                }
                // Якщо статус успішний, але немає JSON, продовжуємо (наприклад, 204 No Content)
            }


            // 3. Перевірка статусу відповіді
            if (!res.ok) {
                // Якщо є JSON з деталями помилки, використовуємо його
                // Часто Django REST Framework повертає помилки в полі 'detail' або 'non_field_errors'
                const errorMessage = data.detail || data.non_field_errors?.[0] || data.username?.[0] || data.email?.[0] || "Помилка авторизації";
                throw new Error(errorMessage);
            }

            // 4. Успішне виконання
            if (mode === "register") {
                setSuccess("Реєстрація успішна! Тепер увійдйть у свій акаунт.");
                // Очищаємо поля паролів після успішної реєстрації
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
                setMode("login");
            } else {
                // Припускаємо, що data містить data.user та data.token
                login(data.user, data.token);
            }
        } catch (err: any) {
            // Відображення загальної помилки
            setErrors({ general: err.message || "Невідома помилка" });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            // Абсолютний повноекранний оверлей - Світлий, чистий фон
            <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Анімований фон-світіння (м'які кольори) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.3, scale: 1.5 }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute inset-0 bg-teal-200 dark:bg-teal-500 rounded-full blur-3xl opacity-20 transform translate-x-1/4 translate-y-1/4"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.2, scale: 1.5 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
                    className="absolute inset-0 bg-sky-300 dark:bg-sky-500 rounded-full blur-3xl opacity-20 transform -translate-x-1/4 -translate-y-1/4"
                />

                <motion.div
                    // Використання 'key' для перезапуску анімації при зміні mode
                    key={mode}
                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 14 }}
                    className="w-full max-w-sm relative z-10"
                >
                    {/* Glassmorphism Card (Матове скло) */}
                    <Card className="shadow-2xl bg-white/50 backdrop-blur-xl border border-gray-100/30 transition-all duration-500 hover:shadow-sky-300/60 dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:shadow-teal-600/50">
                        <CardHeader className="pt-8 pb-4">
                            <CardTitle className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
                                {mode === "register" ? " Створити акаунт" : " Ласкаво просимо"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Ім'я користувача"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="border-gray-200 focus:border-sky-500 bg-white/70 dark:bg-gray-700/70 dark:border-gray-600 dark:text-gray-100"
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
                                            className="border-gray-200 focus:border-sky-500 bg-white/70 dark:bg-gray-700/70 dark:border-gray-600 dark:text-gray-100"
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
                                        className="border-gray-200 focus:border-sky-500 bg-white/70 dark:bg-gray-700/70 dark:border-gray-600 dark:text-gray-100"
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
                                            className="border-gray-200 focus:border-sky-500 bg-white/70 dark:bg-gray-700/70 dark:border-gray-600 dark:text-gray-100"
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
                                    <p className="text-green-600 text-sm text-center dark:text-green-400">{success}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white transition duration-300 shadow-lg shadow-sky-500/50 dark:shadow-sky-700/50"
                                >
                                    {loading
                                        ? "⏳ Завантаження..."
                                        : mode === "register"
                                            ? "Зареєструватися"
                                            : "Увійти"}
                                </Button>

                                <p className="text-center text-sm mt-3 text-gray-600 dark:text-gray-300">
                                    {mode === "register" ? (
                                        <>
                                            Вже маєте акаунт?{" "}
                                            <button
                                                type="button"
                                                className="text-sky-600 hover:text-sky-700 hover:underline font-semibold dark:text-sky-400 dark:hover:text-sky-300"
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
                                                className="text-sky-600 hover:text-sky-700 hover:underline font-semibold dark:text-sky-400 dark:hover:text-sky-300"
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
        );
    }

    // --- Розділ для авторизованого користувача (user існує) ---

    return (
        <div className="p-10 flex flex-col items-center">
            {/* Кнопка "Вийти" */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full max-w-3xl flex justify-end mb-4"
            >
                <Button
                    onClick={logout} // <-- Викликаємо функцію logout
                    variant="outline"
                    className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 transition duration-300 shadow-md hover:shadow-lg"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Вийти</span>
                </Button>
            </motion.div>

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