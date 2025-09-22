import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import axiosInstance from "../configs/axiosInstance";

const CartContext = createContext();


export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const cartCreatedUserIdRef = useRef(null);
  const { user } = useAuth();

  // Reset cartCreatedUserIdRef and items when user changes
  useEffect(() => {
    if (!user) {
      cartCreatedUserIdRef.current = null;
      setItems([]);
    }
  }, [user && user.id]);

  // On login/register, create cart if needed and fetch cart items (only once per user)
  useEffect(() => {
    const syncCart = async () => {
      if (user && user.id && cartCreatedUserIdRef.current !== user.id) {
        cartCreatedUserIdRef.current = user.id; // Set immediately to prevent race
        try {
          await axiosInstance.post("/cart/create");
        } catch (err) {
          // Ignore error if cart already exists
        }
        try {
          const res = await axiosInstance.get("/cart/view");
          if (Array.isArray(res.data?.cartItems)) {
            // Map backend cartItems to frontend format
            console.log(res.data.cartItems);
            const mapped = res.data.cartItems.map(item => ({
              id: item.ClothesId,
              cartId: item.cartId,
              cartItemId: item.id,
              name: item.Clothes?.name || '',
              price: item.Clothes?.price || 0,
              qty: item.quantity,
              image: item.Clothes?.mainImgId ? `/path/to/images/${item.Clothes.mainImgId}` : undefined,
              // Add more fields as needed
            }));
            setItems(mapped);
          }
        } catch (err) {
          // Optionally: show notification
        }
      }
    };
    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user.id]);

  // Helper to sync cart to backend
  const syncCartToBackend = useCallback(async (newItems) => {
    try {
      for (const it of newItems) {
        if (it.cartItemId) {
          await axiosInstance.post("/cart/add", {
            cartItemId: it.cartItemId,
            cakeId: it.id,
            quantity: it.qty
          });
        } else {
          await axiosInstance.post("/cart/add", {
            cakeId: it.id,
            quantity: it.qty,
            ...(it.sizeId ? { sizeId: it.sizeId } : {})
          });
        }
      }
    } catch (err) {
      // Optionally: show notification
    }
  }, []);

  // Always sync cart to backend when items change (except on initial mount)
  const isFirstSync = useRef(true);
  useEffect(() => {
    if (isFirstSync.current) {
      isFirstSync.current = false;
      return;
    }
    syncCartToBackend(items);
  }, [items, syncCartToBackend]);

  const addToCart = (product, options = {}) => {
    if (!product || !product.id) {
      alert("Cannot add to cart: product id is missing.");
      return;
    }
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) =>
          it.id === product.id &&
          it.selectedColor === options.selectedColor &&
          it.selectedSize === options.selectedSize &&
          it.sizeId === options.sizeId
      );
      let updated;
      if (idx !== -1) {
        updated = [...prev];
        updated[idx].qty += options.qty || 1;
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images && product.images[0],
            selectedColor: options.selectedColor,
            selectedSize: options.selectedSize,
            sizeId: options.sizeId,
            qty: options.qty || 1,
          },
        ];
      }
  // Don't call syncCartToBackend here! (sync is now handled in useEffect)
      return updated;
    });
    // Use a callback to get the latest state after setItems
    setTimeout(() => {
      // Always fetch canonical cart from backend after add
      axiosInstance.get("/cart/view").then(res => {
        if (Array.isArray(res.data?.cartItems)) {
          const mapped = res.data.cartItems.map(item => ({
            id: item.ClothesId,
            cartId: item.cartId,
            cartItemId: item.id,
            name: item.Clothes?.name || '',
            price: item.Clothes?.price || 0,
            qty: item.quantity,
            image: item.Clothes?.mainImgId ? `/path/to/images/${item.Clothes.mainImgId}` : undefined,
            sizeId: item.sizeId,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
          }));
          setItems(mapped);
        }
      });
    }, 300);
  };

  const removeFromCart = (id, color, size, cartItemId) => {
    setItems((prev) => {
      const updated = prev.filter((it) => it.cartItemId !== cartItemId);
      // Call DELETE /cart for this item using cartItemId if present
      (async () => {
        try {
          await axiosInstance.delete("/cart/delete", { data: { cartItemId } });
        } catch (err) {
          // Optionally: show notification
        }
      })();
      syncCartToBackend(updated);
      return updated;
    });
  };

  const updateQty = (cartItemId, qty) => {
    setItems((prev) => {
      const updated = prev.map((it) =>
        it.cartItemId === cartItemId
          ? { ...it, qty }
          : it
      );
      return updated;
    });
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
