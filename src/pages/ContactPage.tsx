import { motion } from "framer-motion"
import ContactTable from "@/components/ContactTable.tsx";

export default function ContactPage() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.7}}
            className="w-full mt-[50px] max-[639px]:mt-[80px]"
        >
            <h1 className="text-center font-semibold text-5xl">Contact</h1>

            <div>
                <ContactTable/>
            </div>
        </motion.div>
    )
}