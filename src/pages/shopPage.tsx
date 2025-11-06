import { motion } from "framer-motion"
import ShopWithCart from "@/components/ShopWithCart.tsx";

export default function ShopPage() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.7}}
            className="w-full mt-[50px] max-[639px]:mt-[80px]"
        >
            <div>
                <ShopWithCart/>
            </div>
        </motion.div>
    )
}