import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Building2, Calendar, Search, Plus, X, Edit2, Trash2 } from "lucide-react";
import { apiClient } from "@/api/apiClient";

interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
    created_at: string;
}

export default function ContactManager() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date">("name");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const data = await apiClient("http://127.0.0.1:8000/api/contacts/");
            setContacts(data);
        } catch (err) {
            console.error("Помилка завантаження контактів:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingContact) {
                const updatedContact = await apiClient(
                    `http://127.0.0.1:8000/api/contacts/${editingContact.id}/`,
                    {
                        method: "PUT",
                        body: JSON.stringify(formData),
                    }
                );
                setContacts(contacts.map(c => c.id === editingContact.id ? updatedContact : c));
            } else {
                const newContact = await apiClient("http://127.0.0.1:8000/api/contacts/", {
                    method: "POST",
                    body: JSON.stringify(formData),
                });
                setContacts([...contacts, newContact]);
            }
            resetForm();
        } catch (err) {
            console.error("Помилка:", err);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Ви впевнені, що хочете видалити контакт ${name}?`)) return;
        try {
            await apiClient(`http://127.0.0.1:8000/api/contacts/${id}/`, { method: "DELETE" });
            setContacts(contacts.filter(c => c.id !== id));
        } catch (err) {
            console.error("Помилка видалення:", err);
        }
    };

    const openEditModal = (contact: Contact) => {
        setEditingContact(contact);
        setFormData({
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ first_name: "", last_name: "", email: "", phone: "", company: "" });
        setEditingContact(null);
        setIsModalOpen(false);
    };

    const filteredContacts = contacts.filter(contact =>
        `${contact.first_name} ${contact.last_name} ${contact.email} ${contact.company}`.toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const sortedContacts = [...filteredContacts].sort((a, b) => {
        if (sortBy === "name") {
            return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        } else {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    const getInitials = (firstName: string, lastName: string) =>
        `${firstName[0]}${lastName[0]}`.toUpperCase();

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Контакти
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {filteredContacts.length} {filteredContacts.length === 1 ? 'контакт' : filteredContacts.length < 5 ? 'контакти' : 'контактів'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
                        >
                            <Plus size={20} />
                            Додати контакт
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Пошук за ім'ям, email або компанією..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>

                    {/* Sorting */}
                    <div className="flex gap-2 mt-4">
                        <button
                            className={`px-3 py-1 rounded-xl border ${sortBy === "name" ? "bg-blue-600 text-white" : "border-gray-300"}`}
                            onClick={() => setSortBy("name")}
                        >
                            Сортувати за ім’ям
                        </button>
                        <button
                            className={`px-3 py-1 rounded-xl border ${sortBy === "date" ? "bg-blue-600 text-white" : "border-gray-300"}`}
                            onClick={() => setSortBy("date")}
                        >
                            Сортувати за датою
                        </button>
                    </div>
                </div>
            </div>

            {/* Contacts Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {sortedContacts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                            <User size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchQuery ? "Контакти не знайдено" : "Немає контактів"}
                        </h3>
                        <p className="text-gray-500">
                            {searchQuery ? "Спробуйте змінити параметри пошуку" : "Почніть додавати контакти"}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                    >
                        {sortedContacts.map((contact, index) => (
                            <motion.div
                                key={contact.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Avatar and Actions */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                            {getInitials(contact.first_name, contact.last_name)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                                {contact.first_name} {contact.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                                <Building2 size={14} className="flex-shrink-0" />
                                                <span className="truncate">{contact.company || "Без компанії"}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                                        <button
                                            onClick={() => openEditModal(contact)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Редагувати"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contact.id, `${contact.first_name} ${contact.last_name}`)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Видалити"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Mail size={16} className="text-gray-400 flex-shrink-0" />
                                        <a href={`mailto:${contact.email}`} className="text-sm hover:text-blue-600 transition truncate">
                                            {contact.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Phone size={16} className="text-gray-400 flex-shrink-0" />
                                        <a href={`tel:${contact.phone}`} className="text-sm hover:text-blue-600 transition">
                                            {contact.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-500 text-xs pt-2 border-t border-gray-100">
                                        <Calendar size={14} className="flex-shrink-0" />
                                        <span>Додано {formatDate(contact.created_at)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative pointer-events-auto max-h-[90vh] overflow-y-auto"
                            >
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <X size={20} />
                                </button>

                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {editingContact ? "Редагувати контакт" : "Новий контакт"}
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ім'я *
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                                placeholder="Введіть ім'я"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Прізвище *
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                                placeholder="Введіть прізвище"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Телефон *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                            placeholder="+380 XX XXX XX XX"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Компанія
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                            placeholder="Назва компанії"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                                        >
                                            Скасувати
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition"
                                        >
                                            {editingContact ? "Зберегти" : "Додати"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
