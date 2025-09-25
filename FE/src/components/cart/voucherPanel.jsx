import React, { useEffect, useState } from "react";
import discountImg from "../../assets/cart/discount.png";
import axiosInstance from '../../configs/axiosInstance';

export default function VoucherPanel({ onClose, onApply }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get('/coupon/available');
      // Only show active and not expired coupons
      const now = new Date();
      const filtered = (res.data.coupons || []).filter(c => c.isActive && new Date(c.expiryDate) > now && c.stock > 0);
      setVouchers(filtered);
    } catch (err) {
      setError('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[10000] bg-black/40" onClick={onClose} />
      <div
        className="absolute left-1/2 top-1/2 z-[10001] w-[min(500px,96vw)] -translate-x-1/2 -translate-y-1/2 overflow-auto  shadow-2xl ring-1 ring-black/10"
        style={{ background: "#E6DAC4" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h4 className="text-[22px] font-bold text-[#353535]">Available vouchers</h4>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-black/10 hover:bg-black/20"
          >
            ✕
          </button>
        </div>

        <div className="px-3 pb-3">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : vouchers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No vouchers available.</div>
          ) : (
            vouchers.map((v) => (
              <div key={v.id} className="flex items-center gap-3 py-3">
                <img src={discountImg} alt="" className="h-20 w-20 object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="text-[20px] font-medium text-[#353535]">{v.description}</p>
                  <p className="text-[16px] text-[#353535]">Discount: {v.discount}{v.discount < 1 ? ' (percent)' : ''}</p>
                  <p className="text-xs text-gray-500">Expires: {new Date(v.expiryDate).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">Stock: {v.stock}</p>
                </div>
                <button
                  onClick={() => onApply(v.couponCode)}
                  className="rounded-full border border-black/30 px-4 py-1 text-[20px] font-medium hover:bg-black/10"
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
