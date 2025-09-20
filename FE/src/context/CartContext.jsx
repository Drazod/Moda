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
      // Post each item individually to /cart
      for (const it of newItems) {
        await axiosInstance.post("/cart/add", {
          cakeId: it.id,
          quantity: it.qty
        });
      }
    } catch (err) {
      // Optionally: show notification
    }
  }, []);

  const addToCart = (product, options = {}) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) =>
          it.id === product.id &&
          it.selectedColor === options.selectedColor &&
          it.selectedSize === options.selectedSize
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
            qty: options.qty || 1,
          },
        ];
      }
      syncCartToBackend(updated);
      // After first add, fetch canonical cart from backend to get cartId
      if (prev.length === 0) {
        setTimeout(async () => {
          try {
            const res = await axiosInstance.get("/cart/view");
            if (Array.isArray(res.data?.cartItems)) {
              const mapped = res.data.cartItems.map(item => ({
                id: item.ClothesId,
                cartId: item.cartId,
                name: item.Clothes?.name || '',
                price: item.Clothes?.price || 0,
                qty: item.quantity,
                image: item.Clothes?.mainImgId ? `/path/to/images/${item.Clothes.mainImgId}` : undefined,
              }));
              setItems(mapped);
            }
          } catch {}
        }, 300);
      }
      return updated;
    });
  };

  const removeFromCart = (id, color, size) => {
    setItems((prev) => {
      const updated = prev.filter(
        (it) =>
          !(it.id === id && it.selectedColor === color && it.selectedSize === size)
      );
      // Call DELETE /cart for this item
      (async () => {
        try {
          await axiosInstance.delete("/cart/delete", { data: { cakeId: id, quantity: 0 } });
        } catch (err) {
          // Optionally: show notification
        }
      })();
      syncCartToBackend(updated);
      return updated;
    });
  };

  const updateQty = (id, color, size, qty) => {
    setItems((prev) => {
      const updated = prev.map((it) =>
        it.id === id && it.selectedColor === color && it.selectedSize === size
          ? { ...it, qty }
          : it
      );
      syncCartToBackend(updated);
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
