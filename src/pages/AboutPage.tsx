import { motion } from "framer-motion";
import { Users, Lightbulb, Zap, CheckCircle, Code, Award, Target } from "lucide-react";

export default function AboutPage() {
    // Дані для сторінки "Про нас"
    const company = {
        name: "MyCRM",
        slogan: "Інновації, що створюють майбутнє",
        mission: "Надавати нашим клієнтам передові технологічні рішення, які спрощують повсякденні завдання та підвищують якість життя. Ми прагнемо бути лідерами у сфері розробки інтуїтивно зрозумілих та надійних цифрових продуктів.",
        teamSize: 15,
        foundedYear: 2021,
        values: [
            { icon: Lightbulb, title: "Інноваційність", description: "Постійний пошук нових, креативних рішень." },
            { icon: Users, title: "Співпраця", description: "Відкритість, взаємоповага та командна робота." },
            { icon: Zap, title: "Якість", description: "Бездоганне виконання та надійність наших продуктів." },
        ],
        techStack: [
            { name: "React / Next.js", color: "text-sky-500", iconBg: "bg-sky-100" },
            { name: "TypeScript", color: "text-blue-700", iconBg: "bg-blue-100" },
            { name: "Node.js / Express", color: "text-green-600", iconBg: "bg-green-100" },
            { name: "Python / Django", color: "text-amber-500", iconBg: "bg-amber-100" },
            { name: "PostgreSQL", color: "text-indigo-600", iconBg: "bg-indigo-100" },
            { name: "Tailwind CSS", color: "text-teal-500", iconBg: "bg-teal-100" },
        ],
        milestones: [
            { year: 2021, title: "Заснування компанії та Перший Клієнт", description: "Створення MyCRM і підписання першого великого контракту на розробку SaaS-платформи." },
            { year: 2022, title: "Запуск Core Product V1", description: "Випуск першої версії нашого флагманського продукту, що залучив 1000 активних користувачів." },
            { year: 2023, title: "Міжнародне Партнерство", description: "Розширення географії діяльності та укладення стратегічного партнерства з європейською компанією." },
            { year: 2024, title: "Ріст Команди та Інвестиції", description: "Подвоєння штату співробітників та залучення першого раунду посівних інвестицій." },
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header - Адаптований стиль з ShopWithCart */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Про {company.name}
                        </h1>
                        <p className="text-gray-600 mt-1">{company.slogan}</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Місія та Статистика */}
                <motion.div
                    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb size={24} className="text-blue-600" /> Наша Місія
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {company.mission}
                    </p>

                    <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-4 rounded-xl bg-blue-50/50">
                            <Users size={30} className="text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{company.teamSize}+</p>
                            <p className="text-sm text-gray-500">Членів команди</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50/50">
                            <CheckCircle size={30} className="text-indigo-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{new Date().getFullYear() - company.foundedYear}+</p>
                            <p className="text-sm text-gray-500">Років на ринку</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50/50">
                            <Zap size={30} className="text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">100%</p>
                            <p className="text-sm text-gray-500">Якість та надійність</p>
                        </div>
                    </div>
                </motion.div>

                {/* Наші Цінності */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Наші <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Цінності</span>
                    </h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {company.values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    <value.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Технологічний Стек */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Наш <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Технологічний Стек</span>
                    </h2>
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {company.techStack.map((tech, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${tech.iconBg}`}>
                                    <Code size={20} className={tech.color} />
                                </div>
                                <p className="text-sm font-semibold text-gray-800">{tech.name}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Ключові Досягнення */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                        Ключові <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Досягнення</span>
                    </h2>

                    <motion.div
                        className="space-y-8 relative before:absolute before:inset-y-0 before:left-1/2 before:-ml-0.5 before:w-1 before:bg-gray-200 before:hidden md:before:block"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {company.milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`flex items-center w-full ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
                            >
                                <div className="w-full md:w-1/2 md:pr-8 md:pl-0 pl-4">
                                    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative ${index % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>

                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                                <Award size={20} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 ml-3">{milestone.title}</h3>
                                        </div>

                                        <p className="text-sm text-gray-600 mt-2">{milestone.description}</p>

                                        {/* Рік вказується поза блоком на мобільних і на видному місці на десктопі */}
                                        <div className="mt-4">
                                            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{milestone.year}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Центральний маркер для десктопу */}
                                <div className="hidden md:flex w-16 h-16 rounded-full bg-blue-500 border-4 border-white shadow-md absolute left-1/2 transform -translate-x-1/2 items-center justify-center text-white z-10">
                                    <Target size={24} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </div>
    );
}