import { useState, useEffect } from "react";
import { Product, CartItem, CheckoutForm } from "@shared/schema";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { CartSidebar } from "@/components/CartSidebar";
import { ProductModal } from "@/components/ProductModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Toast, ToastType } from "@/components/Toast";
import { mockProducts } from "@/lib/products";
import {
  getCartFromStorage,
  saveCartToStorage,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCartItemCount,
} from "@/lib/cart";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getCartFromStorage());
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => addToCart(prev, product, quantity));
    showToast(`${product.name} added to cart!`, "success");
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prev) => updateCartQuantity(prev, productId, quantity));
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prev) => removeFromCart(prev, productId));
    showToast("Item removed from cart", "info");
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  const handleOrderComplete = (orderData: CheckoutForm) => {
    // Simulate order processing
    showToast("Processing order...", "info");

    setTimeout(() => {
      setCart([]);
      setIsCheckoutOpen(false);
      showToast("Order placed successfully! Thank you for your purchase.", "success");
    }, 2000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        cartItemCount={getCartItemCount(cart)}
        onCartToggle={handleCartToggle}
        onSearch={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid
          products={mockProducts}
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
        />
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        cart={cart}
        onClose={handleCartToggle}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <ProductModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
