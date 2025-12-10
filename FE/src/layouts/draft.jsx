        {/* footer rail */}
    <div className="mx-5 mb-5 pt-4" style={{ background: railBg }}>
        <div className={`transition-transform duration-500 ease-in-out ${showPaymentModal ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
            <div className="mx-1 p-4">
                <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                    <span className="font-medium">Sub Total</span>
                    <span className="font-semibold">{formatVND(subtotal)}</span>
                </div>

                {voucherDiscount ? (
                <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                    <span className="font-medium">After Voucher</span>
                    <span className="font-semibold">{formatVND(totalAfterVoucher)}</span>
                </div>
                ) : null}

                <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                    <span className="font-medium">Available Points</span>
                    <span className="font-semibold">{availablePoints}</span>
                </div>

                <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                    <span className="font-medium">Use Points</span>
                    <input
                        type="number"
                        min={0}
                        max={maxUsablePoints}
                        value={pointsToUse}
                        onChange={(e) => {
                        let val = parseInt(e.target.value, 10);
                        if (isNaN(val) || val < 0) val = 0;
                        if (val > maxUsablePoints) val = maxUsablePoints;
                        setPointsToUse(val);
                        }}
                        className="w-24 px-2 py-1 rounded border border-gray-300 text-right"
                        style={{ background: fieldBg }}
                    />
                </div>

                <div className="mb-1 flex items-center justify-between text-[12px] text-gray-600">
                    <span className="font-light">
                        Max: {formatVND(Math.floor(totalAfterVoucher * 0.5))} (50% of price)
                    </span>
                    <span />
                </div>

                {pointsUsed > 0 && (
                <div className="mb-1 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                    <span className="font-medium">Points Used</span>
                    <span className="font-semibold">- {formatVND(pointsUsed)}</span>
                </div>
                )}
                <div className="relative overflow-hidden">
                {/* Default View - Slides out to left */}
                    <div className="mb-3 flex items-center justify-between text-[15px] text-[#2f2f2f]">
                        <span className="font-medium">Total to Pay</span>
                        <span className="font-semibold">{formatVND(total)}</span>
                    </div>

                    <div className="flex gap-4">
                        <NavLink to="/store" className="text-center flex-1 rounded-full border border-black/30 bg-[#CDC2AF] py-3 text-[15px] font-medium text-[#2f2f2f] hover:bg-black/10">
                            Continue Shopping
                        </NavLink>
                        <button
                            className="flex-1 rounded-full py-3 text-[15px] font-semibold text-white hover:opacity-95"
                            style={{ background: darkBtn }}
                            onClick={handleCheckout}
                        >
                            Check Out
                        </button>
                    </div>

                    <p className="mt-3 text-center text-[11px] text-black/60">
                    By selecting "Check Out" you are agreeing to our{" "}
                        <a href="#" className="underline">
                            Terms & Conditions
                        </a>
                    </p>
                
                </div>
            </div>
        </div>
        {/* Payment Methods - Slides in from right */}
        <div className={`transition-transform duration-500 ease-in-out ${showPaymentModal ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="space-y-3">
                <p className="text-base font-semibold text-[#2f2f2f] mb-3">Select Payment Method</p>
                  
                <button
                onClick={() => setSelectedPaymentMethod("MOMO")}
                className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                    selectedPaymentMethod === "MOMO"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-300 hover:border-pink-300"
                }`}
                >
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        M
                    </div>
                    <div className="text-left">
                        <div className="font-semibold text-[#2f2f2f]">MoMo E-Wallet</div>
                        <div className="text-xs text-gray-600">Pay with MoMo app</div>
                    </div>
                </button>

                <button
                onClick={() => setSelectedPaymentMethod("VNPAY")}
                className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                    selectedPaymentMethod === "VNPAY"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300"
                }`}
                >
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        VNPAY
                    </div>
                    <div className="text-left">
                        <div className="font-semibold text-[#2f2f2f]">VNPay</div>
                        <div className="text-xs text-gray-600">Pay with VNPay gateway</div>
                    </div>
                </button>

                <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setSelectedPaymentMethod("");
                      }}
                      className="flex-1 py-3 rounded-full border border-gray-400 text-[#2f2f2f] text-[15px] font-medium hover:bg-gray-100"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={!selectedPaymentMethod}
                      className="flex-1 py-3 rounded-full text-white text-[15px] font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: darkBtn }}
                    >
                      Continue
                    </button>
                </div>
            </div>
        </div>
    </div>