import { CartItem, Product } from "@shared/schema";

const CART_STORAGE_KEY = "marketplace_cart";

export function getCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
}

export function addToCart(cart: CartItem[], product: Product, quantity: number = 1): CartItem[] {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }
  
  return [...cart, { ...product, quantity }];
}

export function removeFromCart(cart: CartItem[], productId: number): CartItem[] {
  return cart.filter(item => item.id !== productId);
}

export function updateCartQuantity(cart: CartItem[], productId: number, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  return cart.map(item =>
    item.id === productId
      ? { ...item, quantity }
      : item
  );
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartItemCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.quantity, 0);
}
