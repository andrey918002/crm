import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    Search,
    Plus,
    Minus,
    X,
    Trash2,
    CreditCard,
} from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { Pagination } from "@/components/Pagination.tsx";

interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
}

interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

// 🌐 Базовий URL для API
const BASE_URL = "http://127.0.0.1:8000/api";

export default function ShopWithCart() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"asc" | "desc">("asc");
    const [addingMap, setAddingMap] = useState<Record<number, number>>({});
    const [balance, setBalance] = useState(1000); // 💰 базовий баланс користувача

    // ===================== API =====================
    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const fetchProducts = async () => {
        try {
            // GET http://127.0.0.1:8000/api/products/
            const data = await apiClient(`${BASE_URL}/products/`);
            setProducts(data);
        } catch (error) {
            console.error("Помилка завантаження товарів:", error);
        }
    };

    const fetchCart = async () => {
        try {
            // GET http://127.0.0.1:8000/api/cart/
            const data = await apiClient(`${BASE_URL}/cart/`);
            setCart(data);
        } catch (error) {
            console.error("Помилка завантаження кошика:", error);
        }
    };

    // ===================== CART =====================
    const addToCart = async (product: Product) => {
        try {
            setAddingMap((prev) => ({ ...prev, [product.id]: 1 }));
            // POST http://127.0.0.1:8000/api/cart/ (Додавання нового товару/позиції)
            await apiClient(`${BASE_URL}/cart/`, {
                method: "POST",
                body: JSON.stringify({ product: product.id, quantity: 1 }), // Використовуємо 'product' як в прикладі API
            });
            fetchCart();
        } catch (error) {
            console.error("Помилка додавання у кошик:", error);
        } finally {
            setAddingMap((prev) => {
                const copy = { ...prev };
                delete copy[product.id];
                return copy;
            });
        }
    };

    const removeFromCart = async (item: CartItem) => {
        try {
            // DELETE http://127.0.0.1:8000/api/cart/<id>/ (Видалення елемента кошика)
            await apiClient(`${BASE_URL}/cart/${item.id}/`, { method: "DELETE" });
            fetchCart();
        } catch (error) {
            console.error("Помилка видалення:", error);
        }
    };

    const changeCartQuantity = async (item: CartItem, delta: number) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return removeFromCart(item);

        try {
            // 🛑 ВИПРАВЛЕНО: Використовуємо POST http://127.0.0.1:8000/api/cart/
            // Припускаємо, що API обробляє повторний POST як оновлення
            // (хоча PATCH /api/cart/<id>/ був би RESTful-коректнішим)
            // Повертаємося до POST, як було в оригінальній логіці, але з коректним ключем:
            await apiClient(`${BASE_URL}/cart/`, {
                method: "POST",
                body: JSON.stringify({
                    product: item.product.id, // Використовуємо 'product' як в прикладі API
                    quantity: newQuantity,
                }),
            });
            fetchCart();
        } catch (error) {
            console.error("Помилка оновлення кількості:", error);
        }
    };

    // --- (Решта коду без змін) ---

    // ===================== CHECKOUT =====================
    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        if (cartTotal === 0) {
            alert("Ваш кошик порожній 🛒");
            return;
        }
        if (balance < cartTotal) {
            alert("Недостатньо коштів на балансі 💸");
            return;
        }
        setBalance((prev) => prev - cartTotal);
        setCart([]);
        alert(`✅ Оплата успішна! Залишок: ${(balance - cartTotal).toFixed(2)} ₴`);
    };

    // ===================== FILTER + SORT =====================
    const filteredProducts = products
        .filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) =>
            sortBy === "asc" ? a.price - b.price : b.price - a.price
        );

    // ===================== UI =====================
    return (
        <div className="min-h-screen  p-4 md:p-8">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Магазин
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {products.length} товар
                        {products.length === 1 ? "" : "ів"}
                    </p>

                    {/* 💰 Баланс користувача */}
                    <div className="mt-2 text-sm text-gray-700">
                        Баланс:{" "}
                        <span className="font-semibold text-green-600">
                            {balance.toFixed(2)} ₴
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Пошук..."
                            className="pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setSortBy(sortBy === "asc" ? "desc" : "asc")}
                        className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition"
                    >
                        {sortBy === "asc" ? "↑ Дешевше" : "↓ Дорожче"}
                    </button>

                    <button
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        className="relative px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white flex items-center gap-2"
                    >
                        <ShoppingCart size={18} />
                        Кошик
                        {cart.length > 0 && (
                            <span className="ml-2 bg-white text-indigo-600 font-semibold rounded-full px-2 text-sm">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* PRODUCTS */}
            <Pagination
                items={filteredProducts}
                itemsPerPage={8}
                renderItem={(product) => (
                    <motion.div
                        key={product.id}
                        layout
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center"
                        whileHover={{ scale: 1.02 }}
                    >
                        <img
                            src={product.image || "https://via.placeholder.com/150"}
                            alt={product.name}
                            className="w-32 h-32 object-cover mb-3 rounded-lg"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">
                            {product.name}
                        </h2>
                        <p className="text-indigo-600 font-bold mb-2">
                            {product.price} ₴
                        </p>
                        <button
                            onClick={() => addToCart(product)}
                            disabled={addingMap[product.id]}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                        >
                            {addingMap[product.id] ? "..." : <Plus size={16} />}
                            Додати
                        </button>
                    </motion.div>
                )}
            />

            {/* CART PANEL */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-2xl p-6 overflow-y-auto z-50"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart size={22} /> Кошик
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-center">Кошик порожній</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between bg-gray-50 rounded-xl p-3"
                                    >
                                        <div>
                                            <p className="font-semibold">{item.product.name}</p>
                                            <p className="text-gray-600 text-sm">
                                                {item.product.price} ₴ × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => changeCartQuantity(item, -1)}
                                                className="p-1 border rounded-lg hover:bg-gray-200"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => changeCartQuantity(item, 1)}
                                                className="p-1 border rounded-lg hover:bg-gray-200"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t pt-4">
                                    <p className="flex justify-between text-lg font-semibold">
                                        <span>Разом:</span> <span>{cartTotal.toFixed(2)} ₴</span>
                                    </p>

                                    <button
                                        onClick={handleCheckout}
                                        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                                    >
                                        <CreditCard size={16} /> Оплатити
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}