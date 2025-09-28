import { useState, useEffect } from "react"
import axios from "axios"
import { motion,type Variants } from "framer-motion"
import type {contactsType} from "@/types";

export default function ContactTable() {
    const [contacts, setContacts] = useState<contactsType[]>([])
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/contacts/')
            .then(res => setContacts(res.data))
            .catch(err => console.error(err))
    })

    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.3,
            },
        },
    }

    const rowVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { duration: 0.5, ease: "easeInOut" }
        }
    };

    return (
        <div className="overflow-x-auto mt-6">
            <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Last name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Company</th>
                </tr>
                </thead>

                <motion.tbody
                    className="divide-y divide-gray-200"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {contacts.map((contact) => (
                        <motion.tr
                            key={contact.id}
                            className="hover:bg-gray-50 transition"
                            variants={rowVariants}
                        >
                            <td className="px-4 py-2">{contact.id}</td>
                            <td className="px-4 py-2 font-medium">{contact.first_name}</td>
                            <td className="px-4 py-2 text-blue-600">{contact.last_name}</td>
                            <td className="px-4 py-2 text-blue-600">{contact.email}</td>
                            <td className="px-4 py-2">{contact.phone}</td>
                            <td className="px-4 py-2">{contact.company}</td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </table>
        </div>
    )
}
