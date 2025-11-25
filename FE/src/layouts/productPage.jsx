import React, { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useLocation } from "react-router-dom";
import axiosInstance from "../configs/axiosInstance";
import { useCart } from "../context/CartContext";
import FulfillmentOptions from "../components/FulfillmentOptions";
import ShareProductButton from "../components/product/ShareProductButton";
import toast from "react-hot-toast";

const formatVND = (v) =>
  (Number(v) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND";

const ProductDetail = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Comments & rating
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });

  // Other products (carousel)
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  // ➕ rating + số cmt cho từng sp gợi ý
  const [statsMap, setStatsMap] = useState({}); // { [id]: { avg, total } }

  // Fulfillment options
  const [showFulfillment, setShowFulfillment] = useState(false);
  const [fulfillmentData, setFulfillmentData] = useState(null);

  const { addToCart, items } = useCart();

  // ===== Images list: main first, then extra =====
  const imageUrls = [
    product?.mainImg?.url,
    ...(product?.extraImgs ? product.extraImgs.map((i) => i.url) : []),
  ].filter(Boolean);

  useEffect(() => {
    if (!productId) {
      setError("No product id provided");
      setLoading(false);
      return;
    }
    setLoading(true);
    axiosInstance
      .get(`/clothes/${productId}`)
      .then((res) => {
        setProduct(res.data);

        // Sync size stock to localStorage for CartContext (optional)
        if (Array.isArray(res.data.sizes)) {
          let cartSizeQuantities = {};
          try {
            cartSizeQuantities =
              JSON.parse(localStorage.getItem("cartSizeQuantities") || "{}") || {};
          } catch {
            cartSizeQuantities = {};
          }
          if (res.data.id) {
            cartSizeQuantities[res.data.id] = {};
            res.data.sizes.forEach((s) => {
              if (s.id && typeof s.totalQuantity === "number") {
                cartSizeQuantities[res.data.id][s.id] = s.totalQuantity;
              }
            });
            localStorage.setItem("cartSizeQuantities", JSON.stringify(cartSizeQuantities));
          }
        }

        // defaults
        if (res.data.colors?.length) setSelectedColor(res.data.colors[0]);
        if (res.data.sizes?.length) {
          const first = res.data.sizes[0];
          setSelectedSize(typeof first === "object" ? first.label : first);
        }
        setError(null);
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [productId]);

  // Fetch comments
  useEffect(() => {
    if (!productId) return;

    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const response = await axiosInstance.get(`/comments/product/${productId}`);
        if (response.data?.comments) {
          setComments(response.data.comments);
          setRatingStats(response.data.ratingStats || { averageRating: 0, totalReviews: 0 });
        } else {
          setComments([]);
          setRatingStats({ averageRating: 0, totalReviews: 0 });
        }
      } catch {
        setComments([]);
        setRatingStats({ averageRating: 0, totalReviews: 0 });
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  // Fetch list for carousel (no related needed)
  useEffect(() => {
    if (!productId) return;

    const toArray = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.results)) return data.results;
      if (Array.isArray(data?.clothes)) return data.clothes;
      return [];
    };

    let cancelled = false;

    const fetchAll = async () => {
      setRelatedLoading(true);
      try {
        const res = await axiosInstance.get("/clothes/list");
        const raw = toArray(res.data);

        // Remove current product and de-duplicate
        const arr = raw
          .filter((p) => String(p?.id) !== String(productId))
          .filter(
            ((seen) => (p) =>
              seen.has(String(p.id)) ? false : (seen.add(String(p.id)), true))(new Set())
          );

        if (!cancelled) setRelatedProducts(arr);
      } catch {
        if (!cancelled) setRelatedProducts([]);
      } finally {
        if (!cancelled) setRelatedLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Lấy rating & số cmt cho tối đa 12 sp đầu
  useEffect(() => {
    if (!relatedProducts?.length) return;
    const top = relatedProducts.slice(0, 12);
    Promise.allSettled(
      top.map((p) =>
        axiosInstance.get(`/comments/product/${p.id}`).then((res) => ({
          id: p.id,
          avg: res.data?.ratingStats?.averageRating || 0,
          total:
            (Array.isArray(res.data?.comments) && res.data.comments.length) ||
            res.data?.ratingStats?.totalReviews ||
            0,
        }))
      )
    ).then((results) => {
      const map = {};
      results.forEach((r) => {
        if (r.status === "fulfilled") map[r.value.id] = { avg: r.value.avg, total: r.value.total };
      });
      setStatsMap(map);
    });
  }, [relatedProducts]);

  // ===== Stock helpers =====
  let sizes = [];
  if (Array.isArray(product?.sizes)) {
    if (typeof product.sizes[0] === "string") sizes = product.sizes;
    else if (typeof product.sizes[0] === "object" && product.sizes[0].label) {
      sizes = product.sizes.map((s) => s.label);
    }
  }
  const colors = product?.colors || [];

  const getSelectedSizeId = () => {
    if (
      Array.isArray(product?.sizes) &&
      typeof product.sizes[0] === "object" &&
      product.sizes[0].label
    ) {
      const found = product.sizes.find((s) => s.label === selectedSize);
      return found?.id;
    }
    return undefined;
  };

  const getSizeStock = () => {
    if (
      Array.isArray(product?.sizes) &&
      typeof product.sizes[0] === "object" &&
      product.sizes[0].label
    ) {
      const found = product.sizes.find((s) => s.label === selectedSize);
      if (typeof found?.totalQuantity === "number") return found.totalQuantity;
    }
    if (typeof product?.stock === "number") return product.stock;
    if (typeof product?.totalQuantity === "number") return product.totalQuantity;
    return Infinity;
  };

  const getQtyInCartSameSize = () => {
    const sizeId = getSelectedSizeId();
    return items
      .filter((it) => it.id === product?.id && it.sizeId === sizeId)
      .reduce((sum, it) => sum + (it.qty || 0), 0);
  };

  const getMaxQtyAllowed = () => {
    const stock = getSizeStock();
    const inCart = getQtyInCartSameSize();
    return Math.max(0, stock - inCart);
  };

  const maxAllowed = getMaxQtyAllowed();
  const isOutOfStock = maxAllowed <= 0;

  // Stepper
  const incQty = () => setQty((q) => Math.min(q + 1, Math.max(1, maxAllowed)));
  const decQty = () => setQty((q) => Math.max(1, q - 1));
  const onQtyInput = (e) => {
    const v = parseInt(e.target.value, 10);
    const safe = Number.isNaN(v) ? 1 : Math.max(1, Math.min(v, Math.max(1, maxAllowed)));
    setQty(safe);
  };

  // ===== Carousel refs & handlers =====
  const sliderRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = sliderRef.current;
    if (!el) return;
    const EPS = 2;
    setCanLeft(el.scrollLeft > EPS);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - EPS);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateArrows();
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, [relatedProducts.length]);

  const scrollByAmount = (dir = 1) => {
    const el = sliderRef.current;
    if (!el) return;
    const first = el.querySelector("a");
    if (first) {
      const cs = getComputedStyle(el);
      const gapStr = cs.gap || cs.columnGap || cs.rowGap || "0";
      const gap = parseFloat(gapStr) || 0;
      const cardW = first.getBoundingClientRect().width + gap;
      el.scrollBy({ left: dir * cardW, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.9), behavior: "smooth" });
    }
    setTimeout(updateArrows, 300);
  };

  const handleNextImage = () => {
    if (!imageUrls.length) return;
    setCurrentImageIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1));
  };
  const handlePrevImage = () => {
    if (!imageUrls.length) return;
    setCurrentImageIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl">Loading product...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl text-red-500">{error}</span>
      </div>
    );
  }
  if (!product) return null;

  return (
    <div className="relative-container noise-overlay min-h-screen flex flex-col">
      <Header />

      <div className="pt-40 text-gray-800 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 px-12 mx-auto">
          {/* LEFT – Images */}
          <div className="lg:col-span-2">
            <div className="relative w-full flex items-center justify-center">
              <img
                src={imageUrls[currentImageIndex]}
                alt="Product Main"
                className="w-[80%] h-auto object-contain"
              />

              {/* Chevron buttons */}
              <button
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                           h-10 w-10 flex items-center justify-center rounded-full
                           text-[#353535] hover:text-black transition"
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                           h-10 w-10 flex items-center justify-center rounded-full
                           text-[#353535] hover:text-black transition"
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="flex ml-16 space-x-4 mt-4">
              {product.extraImgs?.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-[150px] w-auto cursor-pointer border border-gray-300 hover:border-black"
                  onClick={() => setCurrentImageIndex(idx + 1)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT – Details */}
          <div className="font-Jsans text-[#353535]">
            <nav className="text-gray-500 text-sm mb-4">
              <a href="/" className="hover:underline">Home</a> /{" "}
              <a href="/store" className="hover:underline">Store</a> /{" "}
              <span className="text-black">{product.name}</span>
            </nav>

            <h1 className="text-4xl text-black font-bold">{product.name}</h1>
            <p className="text-4xl text-black mt-4">{formatVND(product.price)}</p>

            {/* Tabs */}
            <div className="flex mt-4 border-b border-gray-300">
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "description"
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Product Description
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "materials"
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("materials")}
              >
                Materials
              </button>
            </div>

            {activeTab === "description" && (
              <p className="mt-4">{product.description}</p>
            )}
            {activeTab === "materials" && (
              <p className="mt-4">
                {product.material || "High-quality materials, ethically sourced."}
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mt-4">
                <p className="text-black font-semibold">
                  Product color: <span>{selectedColor}</span>
                </p>
                <p className="mt-2 font-light">Select a color</p>
                <div className="flex space-x-10 mt-2">
                  {colors.map((color, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 cursor-pointer ${
                        selectedColor === color ? "border-black" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mt-4">
                <p className="text-black font-semibold">Product size</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setQty(1);
                      }}
                      className={`w-12 h-12 border font-Jsans text-xl text-center bg-[#F5F5F5]/50 rounded cursor-pointer ${
                        selectedSize === size
                          ? "border-black/50 font-bold bg-[#F5F5F5]"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity stepper */}
            <div className="mt-5">
              <p className="text-black font-semibold mb-2">Quantity</p>
              <div className="inline-flex items-center rounded-full border border-black/20 bg-[#efe5d6] px-2">
                <button
                  onClick={decQty}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/10"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                >
                  –
                </button>
                <input
                  value={qty}
                  onChange={onQtyInput}
                  className="w-12 text-center bg-transparent outline-none"
                />
                <button
                  onClick={incQty}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/10"
                  aria-label="Increase quantity"
                  disabled={qty >= Math.max(1, maxAllowed)}
                  title={
                    qty >= Math.max(1, maxAllowed)
                      ? `Chỉ còn ${maxAllowed} sản phẩm cho size này`
                      : undefined
                  }
                >
                  +
                </button>
              </div>
              {Number.isFinite(maxAllowed) && (
                <div className="mt-1 text-sm text-gray-600">
                  Còn lại {maxAllowed} sản phẩm cho size này
                </div>
              )}
            </div>

            {/* Show Fulfillment Options button (if inventory allows) */}
            {!isOutOfStock && !showFulfillment && (
              <div className="mt-6 flex gap-2">
                <button
                  className="flex-1 py-3 px-6 rounded-lg transition text-white bg-[#434237] hover:bg-[#353535]"
                  onClick={() => setShowFulfillment(true)}
                >
                  Choose Fulfillment Option
                </button>
                {product && <ShareProductButton product={product} />}
              </div>
            )}

            {/* Fulfillment Options Panel */}
            {showFulfillment && !isOutOfStock && (
              <div className=" mx-auto max-w-5xl ">
                <FulfillmentOptions
                  product={product}
                  selectedSize={selectedSize}
                  requestedQty={qty}
                  onSelect={(fulfillmentChoice) => {
                    setFulfillmentData(fulfillmentChoice);
                    const sizeId = getSelectedSizeId();
                    const safeQty = Math.max(1, Math.min(qty, maxAllowed));
                    
                    // Convert fulfillment data to API format
                    let fulfillmentPayload = { method: fulfillmentChoice.method };
                    
                    if (fulfillmentChoice.method === 'ship') {
                      // For shipping, use the first source (primary source)
                      const primarySource = fulfillmentChoice.allocation?.items?.[0];
                      if (primarySource) {
                        fulfillmentPayload.sourceBranchId = primarySource.branchId || null;
                        fulfillmentPayload.allocationNote = fulfillmentChoice.allocation.items
                          .map(item => `${item.quantity} from ${item.location}`)
                          .join(', ');
                      }
                    } else if (fulfillmentChoice.method === 'pickup') {
                      // For pickup, use pickupBranchId instead of sourceBranchId
                      fulfillmentPayload.pickupBranchId = fulfillmentChoice.store?.branchId || null;
                      fulfillmentPayload.allocationNote = fulfillmentChoice.option?.label || 'Pickup at store';
                    }
                    
                    // Add to cart with fulfillment metadata
                    addToCart(product, {
                      selectedColor,
                      selectedSize,
                      sizeId,
                      qty: safeQty,
                      fulfillment: fulfillmentPayload
                    });

                    // Show success message based on fulfillment method
                    if (fulfillmentChoice.method === 'ship') {
                      const sources = fulfillmentChoice.allocation.items.map(i => i.location).join(', ');
                      toast.success(`Added to cart! Ships from: ${sources}`);
                    } else if (fulfillmentChoice.method === 'pickup') {
                      const option = fulfillmentChoice.option;
                      if (option.id === 'split') {
                        toast.success(`Added! Pickup ${option.pickupQty} + Ship ${option.shipQty}`);
                      } else if (option.id === 'transfer') {
                        toast.success(`Added! Will be ready for pickup on ${new Date(option.eta).toLocaleDateString()}`);
                      } else if (option.id === 'reduce') {
                        toast.success(`Added ${option.pickupQty} items for pickup today`);
                      } else if (option.id === 'ship-all') {
                        toast.success('Added to cart! Will ship to home');
                      }
                    }

                    // Reset fulfillment UI
                    setShowFulfillment(false);
                    setFulfillmentData(null);
                  }}
                />
                <button
                  className="mt-4 text-blue-500 hover:underline"
                  onClick={() => {
                    setShowFulfillment(false);
                    setFulfillmentData(null);
                  }}
                >
                  ← Back to product
                </button>
              </div>
            )}

            {/* Quick Add to cart (if user doesn't want fulfillment options) */}
            {!isOutOfStock && !showFulfillment && (
              <button
                className="mt-3 py-3 px-6 w-full rounded-lg transition text-gray-700 border border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  const sizeId = getSelectedSizeId();
                  const safeQty = Math.max(1, Math.min(qty, maxAllowed));
                  if (safeQty <= 0) return;
                  // Default: ship from warehouse
                  addToCart(product, { 
                    selectedColor, 
                    selectedSize, 
                    sizeId, 
                    qty: safeQty,
                    fulfillment: { method: 'ship' }
                  });
                  toast.success('Added to cart! Default: Ship to Home');
                }}
              >
                Quick Add (Ship to Home)
              </button>
            )}

            {/* Out of stock button */}
            {isOutOfStock && (
              <div className="mt-6 flex gap-2">
                <button
                  className=" flex-1 py-3 px-6 w-full rounded-lg transition text-white bg-gray-400"
                  disabled={true}
                  title="Out of stock for this size"
                >
                  Out of stock
                </button>
                {product && <ShareProductButton product={product} />}
              </div>
            )}
          </div>
        </div>



        {/* Details blocks */}
        {!showFulfillment && product.details && (
          <div
            className="border-t border-[#434237] mt-20 mx-8"
            style={{ borderTopWidth: "0.5px" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-48 mt-20 px-20 mx-auto">
              {Object.keys(product.details).map((key) => (
                <div key={key} className="text-left">
                  <h3 className="font-Jsans font-extralight text-base">
                    {key.toUpperCase()}
                  </h3>
                  <h3 className="mt-2 font-Jsans text-xl text-[#434237]">
                    {product.details[key].title}
                  </h3>
                  <p className="mt-2 font-Jsans font-light text-base text-[#353535]">
                    {product.details[key].description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More about this product (no gallery images) */}
        {!showFulfillment && (
          <section className="mt-20 px-8">
            <div className="text-center mx-auto">
              <h2 className="text-2xl mb-4 font-Jsans text-[#353535]">More about this product</h2>
              <p className="font-Jsans font-light text-base text-[#434237] leading-loose">
                {product.information ||
                  "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."}
              </p>
            </div>
          </section>
        )}

        {/* Reviews (before suggestions) */}
        {!showFulfillment && (
          <section className="mt-20 px-8 mx-auto">
          <div className="flex items-center text-lg">
            <span className="text-4xl font-kaisei text-[#434237] tracking-wide">
              {Number(ratingStats.averageRating || 0).toFixed(1)}
            </span>
            <div className="text-[#434237] mx-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-3xl ${
                    star <= Math.round(ratingStats.averageRating || 0)
                      ? "text-[#434237]"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="pt-2 text-2xl font-Jsans font-light text-[#353535]">
              | {ratingStats.totalReviews} reviews
            </span>
          </div>

          {commentsLoading ? (
            <div className="ml-16 py-20 text-center">
              <p className="text-[#353535]">Loading reviews...</p>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="ml-16 py-20 border-b border-[#434237] font-Jsans text-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr] gap-4 items-justify-start">
                  <div>
                    <p className="text-2xl text-[#353535]">{comment.user.name}</p>
                    <p className="text-sm font-light text-[#353535]">
                      {comment.isVerifiedPurchase ? "Verified Buyer" : "Customer"}
                    </p>
                    {comment.transactionDetail?.size && (
                      <p className="text-xs text-gray-500">
                        Size: {comment.transactionDetail.size.label}
                      </p>
                    )}
                  </div>
                  <div className="lg:ml-32">
                    <div className="flex items-center mb-2">
                      <span className="text-[#434237] text-base">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xl ${
                              star <= comment.rating ? "text-[#434237]" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                      <span className="text-[#434237] text-lg lg:ml-2 ml-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#353535] font-light max-w-[90%]">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="ml-16 py-20 text-center">
              <p className="text-[#353535]">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
          </section>
        )}

        {/* Suggestions carousel — bottom (đÃ SỬA) */}
        {!showFulfillment && (!relatedLoading && relatedProducts.length === 0) ? null : (
          <section className="mt-20 px-8 relative">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-Jsans text-[#353535]">Gợi ý sản phẩm khác</h2>
              {!relatedLoading && relatedProducts.length > 0 && (
                <a href="/store" className="text-sm text-gray-600 hover:underline">
                  Xem thêm
                </a>
              )}
            </div>

            {relatedLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full h-56 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded mt-3 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                {/* side fade overlays (match #f5edde background) */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[rgba(245,237,222,1)] to-[rgba(245,237,222,0)]" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[rgba(245,237,222,1)] to-[rgba(245,237,222,0)]" />

                {/* Chevron arrows */}
                <button
                  onClick={() => canLeft && scrollByAmount(-1)}
                  aria-label="Scroll left"
                  aria-disabled={!canLeft}
                  className={`hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10
                              h-10 w-10 items-center justify-center rounded-full
                              text-[#353535] hover:text-black transition
                              ${canLeft ? "opacity-100" : "opacity-40 pointer-events-none"}`}
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  onClick={() => canRight && scrollByAmount(1)}
                  aria-label="Scroll right"
                  aria-disabled={!canRight}
                  className={`hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10
                              h-10 w-10 items-center justify-center rounded-full
                              text-[#353535] hover:text-black transition
                              ${canRight ? "opacity-100" : "opacity-40 pointer-events-none"}`}
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Slider */}
                <div
                  ref={sliderRef}
                  className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pr-2"
                  style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
                >
                  {relatedProducts.map((p) => {
                    const img =
                      p?.mainImg?.url ||
                      (Array.isArray(p?.extraImgs) && p.extraImgs[0]?.url) ||
                      "";
                    const sizesText =
                      Array.isArray(p?.sizes) && p.sizes.length > 0
                        ? (typeof p.sizes[0] === "object" ? p.sizes.map((s) => s.label) : p.sizes).join(", ")
                        : "Free size";
                    const colors = Array.isArray(p?.colors) ? p.colors.slice(0, 6) : [];
                    const stats = statsMap[p.id] || { avg: 0, total: 0 };

                    return (
                      <a
                        key={p.id}
                        href={`/product?id=${p.id}`}
                        className="
                          min-w-[80%] sm:min-w-[48%] md:min-w-[33.3333%] lg:min-w-[25%]
                          max-w-[360px] group block rounded-lg overflow-hidden hover:shadow-md transition-shadow
                          bg-transparent border-none
                        "
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        {/* Ảnh nhỏ đồng đều */}
                        <div className="w-full aspect-[3/4] overflow-hidden bg-[#f0e7d8]">
                          {img ? (
                            <img
                              src={img}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          {/* swatch + size + tim */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {colors.map((c, i) => (
                                <span
                                  key={i}
                                  className="inline-block h-3.5 w-3.5 rounded-full border border-black/10"
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                              {Array.isArray(p?.colors) && p.colors.length > 6 && (
                                <span className="text-[11px] text-gray-600 ml-1">+{p.colors.length - 6}</span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-600">{sizesText}</div>
                            <button
                              type="button"
                              onClick={(e) => e.preventDefault()}
                              className="ml-2 text-gray-500 hover:text-[#353535]"
                              aria-label="Yêu thích"
                              title="Thêm vào yêu thích"
                            >
                              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                              </svg>
                            </button>
                          </div>

                          <h3 className="text-base font-medium text-[#353535] line-clamp-2">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-sm text-black">{formatVND(p.price)}</p>

                          <div className="mt-1 flex items-center gap-1 text-[13px] text-[#353535]">
                            <span className="text-[15px] leading-none">
                              {"★★★★★".slice(0, Math.round(stats.avg)) + "☆☆☆☆☆".slice(Math.round(stats.avg))}
                            </span>
                            <span className="ml-1">{(stats.avg || 0).toFixed(1)}</span>
                            <span className="text-gray-500">({stats.total})</span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
