import { useState, useEffect } from "react";
import axios from "axios";
import { motion, type Variants } from "framer-motion";
import type { contactsType } from "@/types";

export default function ContactTable() {
    const [contacts, setContacts] = useState<contactsType[]>([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/contacts/")
            .then((res) => setContacts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const containerVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
    };

    const rowVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        hover: { scale: 1.02, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" },
    };

    return (
        <motion.div
            className="mt-6 px-4 md:px-6 lg:px-8 grid gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {contacts.map((contact) => (
                <motion.div
                    key={contact.id}
                    className="relative rounded-xl p-5 cursor-pointer overflow-hidden"
                    variants={rowVariants}
                    whileHover="hover"
                >
                    {/* Более мягкий прозрачный градиент */}
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-purple-300/20 blur-xl transition-all duration-500"></span>

                    <motion.div
                        className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <div>
                            <span className="font-semibold text-gray-700">Name:</span>{" "}
                            <span className="text-gray-900">{contact.first_name}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Last Name:</span>{" "}
                            <span className="text-gray-900">{contact.last_name}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Email:</span>{" "}
                            <span className="text-gray-800">{contact.email}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Phone:</span>{" "}
                            <span className="text-gray-900">{contact.phone}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Company:</span>{" "}
                            <span className="text-gray-900">{contact.company}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Created:</span>{" "}
                            <span className="text-gray-900">{contact.created_at}</span>
                        </div>
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    );
}
