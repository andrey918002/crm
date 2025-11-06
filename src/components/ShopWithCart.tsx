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
    description?: string;
    stock: number;
}

interface CartItem {
    id: number; // cart item id
    product: Product;
    quantity: number;
}

export default function ShopWithCart() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "price">("name");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [addingMap, setAddingMap] = useState<Record<number, number>>({}); // productId -> qty being added

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await apiClient("http://127.0.0.1:8000/api/products/");
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Помилка завантаження товарів:", err);
        }
    };

    const fetchCart = async () => {
        try {
            const data = await apiClient("http://127.0.0.1:8000/api/cart/");
            // expecting array of cart items with product nested or product id
            // normalize to CartItem[] if needed
            const normalized: CartItem[] = (data || []).map((it: any) => ({
                id: it.id,
                product: it.product && typeof it.product === "object" ? it.product : it.product_data || {},
                quantity: it.quantity,
            }));
            setCart(normalized);
        } catch (err) {
            console.error("Помилка завантаження кошика:", err);
        }
    };

    const filtered = products.filter((p) =>
        `${p.name} ${p.description || ""}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return a.price - b.price;
    });

    const changeQtyLocal = (productId: number, qty: number) => {
        setAddingMap((s) => ({ ...s, [productId]: Math.max(1, qty) }));
    };

    const addToCart = async (product: Product, qty = 1) => {
        try {
            const quantity = Math.max(1, qty || addingMap[product.id] || 1);
            // optimistic UI: if product already in cart, increase quantity locally
            const existing = cart.find((c) => c.product.id === product.id);
            if (existing) {
                setCart((c) => c.map((it) => (it.id === existing.id ? { ...it, quantity: it.quantity + quantity } : it)));
            } else {
                // create temp id for optimistic item
                const tempId = Math.floor(Math.random() * 1e9) * -1;
                setCart((c) => [...c, { id: tempId, product, quantity }]);
            }

            await apiClient("http://127.0.0.1:8000/api/cart/", {
                method: "POST",
                body: JSON.stringify({ product: product.id, quantity }),
            });

            // refresh cart from server to get canonical ids
            await fetchCart();
        } catch (err) {
            console.error("Помилка додавання в кошик:", err);
            // revert optimistic change
            await fetchCart();
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        if (!window.confirm("Видалити цей товар з кошика?")) return;
        try {
            // optimistic
            setCart((c) => c.filter((it) => it.id !== cartItemId));
            await apiClient(`http://127.0.0.1:8000/api/cart/${cartItemId}/`, { method: "DELETE" });
            await fetchCart();
        } catch (err) {
            console.error("Помилка видалення з кошика:", err);
            await fetchCart();
        }
    };

    const changeCartQuantity = async (cartItem: CartItem, newQty: number) => {
        if (newQty < 1) return;
        try {
            // best-effort: delete and re-add is not necessary — backend might support PATCH but cart API lacks it in description
            // We'll delete then POST again with same product and new quantity if cart item id exists
            if (cartItem.id) {
                await apiClient(`http://127.0.0.1:8000/api/cart/${cartItem.id}/`, { method: "DELETE" });
                await apiClient("http://127.0.0.1:8000/api/cart/", {
                    method: "POST",
                    body: JSON.stringify({ product: cartItem.product.id, quantity: newQty }),
                });
            }
            await fetchCart();
        } catch (err) {
            console.error("Помилка оновлення кількості:", err);
            await fetchCart();
        }
    };

    const cartTotal = cart.reduce((s, it) => s + it.product.price * it.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Магазин
                            </h1>
                            <p className="text-gray-600 mt-1">{products.length} товар{products.length === 1 ? "" : "ів"}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Пошук товарів..."
                                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                            >
                                <ShoppingCart size={18} />
                                Кошик ({cart.reduce((s, it) => s + it.quantity, 0)})
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            className={`px-3 py-1 rounded-xl border ${sortBy === "name" ? "bg-blue-600 text-white" : "border-gray-300"}`}
                            onClick={() => setSortBy("name")}
                        >
                            Сортувати за назвою
                        </button>
                        <button
                            className={`px-3 py-1 rounded-xl border ${sortBy === "price" ? "bg-blue-600 text-white" : "border-gray-300"}`}
                            onClick={() => setSortBy("price")}
                        >
                            Сортувати за ціною
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {sorted.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                            <ShoppingCart size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">{searchQuery ? "Товари не знайдено" : "Поки немає товарів"}</h3>
                        <p className="text-gray-500">{searchQuery ? "Спробуйте інший запит" : "Додайте товари через API"}</p>
                    </motion.div>
                ) : (
                    <Pagination
                        items={sorted}
                        itemsPerPage={8}
                        renderItem={(product: Product, index: number) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                            {product.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{product.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end ml-4">
                                        <div className="text-lg font-semibold text-gray-900">{product.price} ₴</div>
                                        <div className="text-xs text-gray-500">{product.stock} в наявності</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => changeQtyLocal(product.id, (addingMap[product.id] || 1) - 1)}
                                            className="p-2 rounded-lg border border-gray-200"
                                            title="Менше"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            min={1}
                                            value={addingMap[product.id] || 1}
                                            onChange={(e) => changeQtyLocal(product.id, Number(e.target.value))}
                                            className="w-16 px-3 py-2 border border-gray-200 rounded-xl text-center outline-none"
                                        />
                                        <button
                                            onClick={() => changeQtyLocal(product.id, (addingMap[product.id] || 1) + 1)}
                                            className="p-2 rounded-lg border border-gray-200"
                                            title="Більше"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => addToCart(product, addingMap[product.id] || 1)}
                                        className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        Додати в кошик
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    />
                )}
            </div>

            {/* Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />

                        <motion.aside
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 p-6 shadow-2xl pointer-events-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Кошик</h2>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {cart.length === 0 ? (
                                    <div className="text-center text-gray-500 py-12">Кошик порожній</div>
                                ) : (
                                    cart.map((it) => (
                                        <div key={it.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                                {it.product.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-semibold truncate">{it.product.name}</div>
                                                    <div className="text-sm font-semibold">{it.product.price * it.quantity} ₴</div>
                                                </div>
                                                <div className="text-xs text-gray-500">Ціна: {it.product.price} ₴ • К-ть: {it.quantity}</div>

                                                <div className="flex items-center gap-2 mt-3">
                                                    <button
                                                        onClick={() => changeCartQuantity(it, it.quantity - 1)}
                                                        className="p-1 rounded-lg border"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <div className="px-3 py-1 border rounded-xl">{it.quantity}</div>
                                                    <button onClick={() => changeCartQuantity(it, it.quantity + 1)} className="p-1 rounded-lg border">
                                                        <Plus size={14} />
                                                    </button>

                                                    <button onClick={() => removeFromCart(it.id)} className="ml-auto p-2 text-red-600">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-6 border-t pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm text-gray-500">Проміжний підсумок</div>
                                    <div className="text-lg font-semibold">{cartTotal} ₴</div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-2 border rounded-xl font-medium">Продовжити покупки</button>
                                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                                        <CreditCard size={16} /> Оплатити
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
