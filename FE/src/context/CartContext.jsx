import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import axiosInstance from "../configs/axiosInstance";
import toast from "react-hot-toast";

const CartContext = createContext();

// ===== Helpers =====
const SYNC_DEBOUNCE_MS = 200;

// Chuẩn hoá map item từ API -> FE
const mapCartItems = (apiItems = []) =>
  apiItems.map((item) => ({
    id: item.ClothesId,
    cartId: item.cartId,
    cartItemId: item.id,
    name: item.Clothes?.name ?? "",
    price: item.Clothes?.price ?? 0,
    qty: item.quantity,
    image:
      item.imageUrl || // nếu sau này snapshot ảnh ở CartItem
      item?.Clothes?.mainImg?.url || // BE đã include mainImg
      "",
    sizeId: item.sizeId,
    label: item.Size?.label ?? "",
    selectedColor: item.selectedColor ?? null,
    selectedSize: item.selectedSize ?? null,
    // Fulfillment data
    fulfillmentMethod: item.fulfillmentMethod ?? null,
    sourceBranchId: item.sourceBranchId ?? null,
    sourceBranchName: item.sourceBranch?.name ?? null,
    pickupBranchId: item.pickupBranchId ?? null,
    pickupBranchName: item.pickupBranch?.name ?? null,
    allocationNote: item.allocationNote ?? null,
  }));

// Áp hạn mức local (nếu bạn lưu stock tạm ở localStorage)
const clampByLocal = (items) => {
  let cartSizeQuantities = {};
  try {
    cartSizeQuantities =
      JSON.parse(localStorage.getItem("cartSizeQuantities")) || {};
  } catch {}
  return items.map((it) => {
    const allowed = cartSizeQuantities?.[it.id]?.[it.sizeId];
    if (typeof allowed === "number" && it.qty > allowed) {
      return { ...it, qty: allowed };
    }
    return it;
  });
};

// Fetch giỏ canonical từ server
const fetchCanonical = async () => {
  const res = await axiosInstance.get("/cart/view");
  const apiItems = Array.isArray(res.data?.cartItems) ? res.data.cartItems : [];
  return clampByLocal(mapCartItems(apiItems));
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  // Dùng để chỉ tạo/fetch cart một lần mỗi user đăng nhập
  const cartCreatedUserIdRef = useRef(null);

  // Dùng để bỏ qua sync lần mount đầu
  const isFirstSync = useRef(true);

  // Khoá chống re-entrancy trong khi sync
  const syncingRef = useRef(false);

  // Debounce timer cho sync
  const debounceTimerRef = useRef(null);

  // Lưu JSON string của canonical gần nhất để tránh setItems lại y chang
  const lastCanonicalRef = useRef(null);

  // Ghi nhớ item vừa thay đổi gần nhất để chỉ sync 1 item thay vì cả mảng
  const lastChangedItemRef = useRef(null);

  // ============ RESET khi logout ============
  useEffect(() => {
    if (!user) {
      cartCreatedUserIdRef.current = null;
      setItems([]);
      lastCanonicalRef.current = null;
      lastChangedItemRef.current = null;
    }
  }, [user?.id]);

  // ============ Khi login: tạo cart nếu cần + fetch cart ============
  useEffect(() => {
    const syncOnLogin = async () => {
      if (user?.id && cartCreatedUserIdRef.current !== user.id) {
        cartCreatedUserIdRef.current = user.id;
        try {
          await axiosInstance.post("/cart/create"); // nếu đã tồn tại sẽ bỏ qua
        } catch {}
        try {
          const canonical = await fetchCanonical();
          lastCanonicalRef.current = JSON.stringify(canonical);
          setItems(canonical);
        } catch {}
      }
    };
    syncOnLogin();
  }, [user?.id]);

  // ============ SYNC lên BE + REFETCH canonical (debounced) ============
  useEffect(() => {
    // Lần đầu mount bỏ qua
    if (isFirstSync.current) {
      isFirstSync.current = false;
      return;
    }

    if (syncingRef.current) return;
    if (!lastChangedItemRef.current) return; // Only sync if there was a change

    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      if (syncingRef.current) return;
      syncingRef.current = true;

      try {
        const one = lastChangedItemRef.current;

        if (one) {
          // Send the changed item to backend
          await axiosInstance.post("/cart/add", {
            ...(one.cartItemId ? { cartItemId: one.cartItemId } : {}),
            cakeId: one.id,
            sizeId: one.sizeId,
            quantity: one.qty,
            ...(one.fulfillmentMethod ? { fulfillmentMethod: one.fulfillmentMethod } : {}),
            ...(one.sourceBranchId ? { sourceBranchId: one.sourceBranchId } : {}),
            ...(one.pickupBranchId ? { pickupBranchId: one.pickupBranchId } : {}),
            ...(one.allocationNote ? { allocationNote: one.allocationNote } : {}),
          });
        }

        // Don't fetch canonical and setItems - this causes infinite loop
        // The backend will handle the state, we trust our local state
      } catch (error) {
        console.error('Cart sync error:', error);
        // Optionally show error to user
        // toast.error('Failed to sync cart');
      } finally {
        syncingRef.current = false;
        lastChangedItemRef.current = null;
      }
    }, SYNC_DEBOUNCE_MS);

    return () => clearTimeout(debounceTimerRef.current);
  }, [items]);

  // ============ Public API cho UI ============
  const addToCart = useCallback((product, options = {}) => {
    if (!product?.id) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } flex items-center gap-3 bg-[#B91C1C] text-white px-4 py-3 rounded-lg shadow-lg`}
          >
            <div className="font-medium">Thiếu mã sản phẩm, không thể thêm vào giỏ.</div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-2 text-xs underline"
            >
              Đóng
            </button>
          </div>
        ),
        { duration: 2200 }
      );
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

      let next;
      let toastPayload = {
        name: product.name,
        color: options.selectedColor ?? null,
        size: options.selectedSize ?? null,
        img:
          product?.imageUrl ||
          product?.mainImg?.url ||
          (Array.isArray(product?.images) ? product.images[0] : "") ||
          "",
      };

      // Extract fulfillment data from options
      const fulfillmentMethod = options.fulfillment?.method || null;
      const sourceBranchId = options.fulfillment?.sourceBranchId || null;
      const pickupBranchId = options.fulfillment?.pickupBranchId || null;
      const allocationNote = options.fulfillment?.allocationNote || null;

      if (idx !== -1) {
        next = [...prev];
        const updated = { 
          ...next[idx], 
          qty: next[idx].qty + (options.qty || 1),
          // Update fulfillment data if provided
          ...(fulfillmentMethod ? { fulfillmentMethod } : {}),
          ...(sourceBranchId ? { sourceBranchId } : {}),
          ...(pickupBranchId ? { pickupBranchId } : {}),
          ...(allocationNote ? { allocationNote } : {}),
        };
        next[idx] = updated;
        lastChangedItemRef.current = updated;
      } else {
        const fresh = {
          id: product.id,
          name: product.name,
          price: product.price,
          image:
            product?.imageUrl ||
            product?.mainImg?.url ||
            (Array.isArray(product?.images) ? product.images[0] : "") ||
            "",
          selectedColor: options.selectedColor ?? null,
          selectedSize: options.selectedSize ?? null,
          sizeId: options.sizeId ?? null,
          qty: options.qty || 1,
          // Add fulfillment data
          fulfillmentMethod,
          sourceBranchId,
          pickupBranchId,
          allocationNote,
        };
        next = [...prev, fresh];
        lastChangedItemRef.current = fresh;
      }

      // 🔔 Toast custom – mini card hợp màu trang, nổi bật
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border`}
            style={{
              background: "#434237", // nền đậm
              color: "#fff",
              borderColor: "#BFAF92", // viền be
            }}
            role="status"
            aria-live="polite"
          >
            {toastPayload.img ? (
              <img
                src={toastPayload.img}
                alt=""
                className="w-10 h-10 rounded object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-black/20 grid place-items-center text-sm">
                🛍
              </div>
            )}

            <div className="min-w-[160px]">
              <div className="font-semibold leading-tight">{toastPayload.name}</div>
              <div className="text-[12px] opacity-80 leading-tight">
                Đã thêm vào giỏ
                {toastPayload.size ? ` • Size: ${toastPayload.size}` : ""}
                {toastPayload.color ? ` • ${toastPayload.color}` : ""}
              </div>
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-2 text-xs underline opacity-90 hover:opacity-100"
              title="Đóng thông báo"
            >
              Đóng
            </button>
          </div>
        ),
        { duration: 2200, position: "top-right" }
      );

      return next;
    });
  }, []);

  const removeFromCart = useCallback((id, color, size, cartItemId) => {
    setItems((prev) => {
      const updated = prev.filter((it) => it.cartItemId !== cartItemId);
      // gọi API xoá (không chờ, useEffect sẽ refetch canonical sau khi state đổi)
      (async () => {
        try {
          await axiosInstance.delete("/cart/delete", { data: { cartItemId } });
        } catch {}
      })();
      return updated;
    });
  }, []);

  const updateQty = useCallback((cartItemId, qty) => {
    setItems((prev) => {
      const updated = prev.map((it) =>
        it.cartItemId === cartItemId ? { ...it, qty } : it
      );
      const changed = updated.find((it) => it.cartItemId === cartItemId) || null;
      lastChangedItemRef.current = changed;
      return updated;
    });
  }, []);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}