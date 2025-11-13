import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Bell, Camera, Save, AlertTriangle } from "lucide-react";

// Компонент для форми вводу
const InputField = ({ label, type = "text", value, name, onChange, icon: Icon, placeholder }: any) => (
    <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon className="text-gray-400" size={18} />
                </div>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                // Мінімалістичний стиль: тонка рамка, фокус на синьому кольорі
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-0 outline-none transition-all ${Icon ? 'pl-10' : ''} text-gray-800`}
            />
        </div>
    </div>
);

// Компонент для секції (карточка) - Зменшено тіні та рамки
const SettingSection = ({ title, children, icon: Icon }: any) => (
    <motion.div
        // Збільшена ширина контейнера
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Icon size={20} className="text-blue-600" /> {title}
        </h2>
        {children}
    </motion.div>
);

export default function SettingPage() {
    const [profile, setProfile] = useState({
        name: "Олександр Коваленко",
        email: "oleksandr.k@novasphere.com",
        avatarUrl: "https://via.placeholder.com/150/007bff/ffffff?text=OK",
    });
    const [security, setSecurity] = useState({
        twoFactor: true,
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = (section: string) => {
        alert(`Зміни в розділі "${section}" збережено!`);
    };

    return (
        // Мінімалістичний фон без градієнтів
        <div className="min-h-screen bg-gray-50">
            {/* Header - Спрощений */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-gray-900" // Прибрано градієнт тексту
                    >
                        Налаштування
                    </motion.h1>
                    <p className="text-gray-500 mt-1">Керування профілем, безпекою та сповіщеннями.</p>
                </div>
            </div>

            {/* Основний контент - Ширший контейнер */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Меню (імітація, можна розширити) */}
                <motion.div
                    className="space-y-2 lg:col-span-1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <a href="#" className="flex items-center p-3 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition">
                        <User size={20} className="mr-3" /> Профіль
                    </a>
                    <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                        <Lock size={20} className="mr-3" /> Безпека
                    </a>
                    <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                        <Bell size={20} className="mr-3" /> Сповіщення
                    </a>
                </motion.div>

                {/* Форми Налаштувань */}
                <div className="space-y-8 lg:col-span-2">

                    {/* 1. Налаштування Особистої Інформації */}
                    <SettingSection title="Особиста Інформація" icon={User}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
                            {/* Аватар */}
                            <div className="relative flex-shrink-0">
                                <img
                                    className="h-20 w-20 rounded-full object-cover border border-gray-200"
                                    src={profile.avatarUrl}
                                    alt="Аватар користувача"
                                />
                                <button
                                    className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-300 text-gray-600 rounded-full shadow-md hover:bg-gray-100 transition"
                                    title="Змінити аватар"
                                >
                                    <Camera size={14} />
                                </button>
                            </div>

                            <div className="flex-grow space-y-4 max-w-md">
                                <InputField
                                    label="Повне ім'я"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    icon={User}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 max-w-md">
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                icon={Mail}
                            />
                        </div>

                        {/* Мінімалістична кнопка збереження */}
                        <motion.button
                            onClick={() => handleSave("Особиста Інформація")}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Save size={18} /> Зберегти зміни
                        </motion.button>
                    </SettingSection>

                    {/* 2. Безпека та Пароль */}
                    <SettingSection title="Безпека та Пароль" icon={Lock}>
                        <div className="space-y-4 max-w-md">
                            <InputField
                                label="Новий Пароль"
                                type="password"
                                placeholder="Введіть новий пароль"
                                icon={Lock}
                            />
                            <InputField
                                label="Підтвердження Паролю"
                                type="password"
                                placeholder="Повторіть новий пароль"
                                icon={Lock}
                            />
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
                                <div className="flex items-center">
                                    <Lock size={20} className="text-gray-500 mr-3" />
                                    <div>
                                        <p className="font-medium text-gray-700">Двофакторна Автентифікація (2FA)</p>
                                        <p className="text-sm text-gray-500">Додатковий рівень захисту облікового запису.</p>
                                    </div>
                                </div>
                                {/* Мінімалістичний перемикач */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={security.twoFactor}
                                        onChange={() => setSecurity(s => ({ ...s, twoFactor: !s.twoFactor }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                                </label>
                            </div>
                        </div>

                        <motion.button
                            onClick={() => handleSave("Безпека")}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Save size={18} /> Оновити пароль
                        </motion.button>
                    </SettingSection>

                    {/* 3. Сповіщення */}
                    <SettingSection title="Налаштування Сповіщень" icon={Bell}>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100">
                                <p className="font-medium text-gray-700">Email-сповіщення про покупки</p>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100">
                                <p className="font-medium text-gray-700">Push-сповіщення про нові товари</p>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked={false} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                                </label>
                            </div>

                            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg flex items-start mt-6">
                                <AlertTriangle size={20} className="mt-0.5 mr-3 flex-shrink-0" />
                                <p className="text-sm">
                                    Зверніть увагу: Вимкнення всіх сповіщень може призвести до пропуску важливих оновлень чи інформації про замовлення.
                                </p>
                            </div>
                        </div>
                    </SettingSection>

                </div>
            </div>
        </div>
    );
}