import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useLocation } from "react-router-dom";
import axiosInstance from "../configs/axiosInstance";
import gallery5 from "../assets/productdetail/product-image_detail1.png";
import gallery6 from "../assets/productdetail/product-image_detail2.png";
import { useCart } from "../context/CartContext";

const formatVND = (v) =>
  (Number(v) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
  " VND";

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
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });

  const { addToCart, items } = useCart();

  // Chuẩn bị danh sách ảnh: mainImg trước rồi extraImgs
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
        // Lưu size stock vào localStorage để đồng bộ với CartContext (nếu cần)
        if (Array.isArray(res.data.sizes)) {
          let cartSizeQuantities = {};
          try {
            cartSizeQuantities =
              JSON.parse(localStorage.getItem("cartSizeQuantities")) || {};
          } catch {
            cartSizeQuantities = {};
          }
          if (res.data.id) {
            cartSizeQuantities[res.data.id] = {};
            res.data.sizes.forEach((s) => {
              if (s.id && typeof s.quantity === "number") {
                cartSizeQuantities[res.data.id][s.id] = s.quantity;
              }
            });
            localStorage.setItem(
              "cartSizeQuantities",
              JSON.stringify(cartSizeQuantities)
            );
          }
        }
        // set default color & size
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

  // Fetch comments for the product
  useEffect(() => {
    if (!productId) return;
    
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const response = await axiosInstance.get(`/comments/product/${productId}`);
        if (response.data.comments) {
          setComments(response.data.comments);
          setRatingStats(response.data.ratingStats || { averageRating: 0, totalReviews: 0 });
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setComments([]);
        setRatingStats({ averageRating: 0, totalReviews: 0 });
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

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

  // ===== Helpers: sizes/colors =====
  let sizes = [];
  if (Array.isArray(product.sizes)) {
    if (typeof product.sizes[0] === "string") sizes = product.sizes;
    else if (typeof product.sizes[0] === "object" && product.sizes[0].label) {
      sizes = product.sizes.map((s) => s.label);
    }
  }
  const colors = product.colors || [];

  // ===== Stock logic theo size + giỏ hàng hiện tại =====
  const getSelectedSizeId = () => {
    if (
      Array.isArray(product.sizes) &&
      typeof product.sizes[0] === "object" &&
      product.sizes[0].label
    ) {
      const found = product.sizes.find((s) => s.label === selectedSize);
      return found?.id;
    }
    return undefined;
  };

  // Stock thực tế của size đang chọn (fallback stock/quantity tổng)
  const getSizeStock = () => {
    if (
      Array.isArray(product.sizes) &&
      typeof product.sizes[0] === "object" &&
      product.sizes[0].label
    ) {
      const found = product.sizes.find((s) => s.label === selectedSize);
      if (typeof found?.quantity === "number") return found.quantity;
    }
    if (typeof product.stock === "number") return product.stock;
    if (typeof product.quantity === "number") return product.quantity;
    return Infinity;
  };

  // Số lượng đã có trong giỏ cho cùng sản phẩm + size
  const getQtyInCartSameSize = () => {
    const sizeId = getSelectedSizeId();
    return items
      .filter((it) => it.id === product.id && it.sizeId === sizeId)
      .reduce((sum, it) => sum + (it.qty || 0), 0);
  };

  // Tối đa có thể thêm tiếp cho size này (sau khi trừ phần đang có trong giỏ)
  const getMaxQtyAllowed = () => {
    const stock = getSizeStock();
    const inCart = getQtyInCartSameSize();
    return Math.max(0, stock - inCart);
  };

  const maxAllowed = getMaxQtyAllowed();
  const isOutOfStock = maxAllowed <= 0;

  // Stepper quantity
  const incQty = () =>
    setQty((q) => Math.min(q + 1, Math.max(1, maxAllowed)));
  const decQty = () => setQty((q) => Math.max(1, q - 1));
  const onQtyInput = (e) => {
    const v = parseInt(e.target.value, 10);
    const safe = Number.isNaN(v)
      ? 1
      : Math.max(1, Math.min(v, Math.max(1, maxAllowed)));
    setQty(safe);
  };

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
              <button
                onClick={handlePrevImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-4 hover:text-gray-500 text-black text-5xl z-10"
              >
                {"<"}
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 hover:text-gray-500 text-black text-5xl z-10"
              >
                {">"}
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
              <a href="/" className="hover:underline">
                Home
              </a>{" "}
              /{" "}
              <a href="/store" className="hover:underline">
                Store
              </a>{" "}
              / <span className="text-black">{product.name}</span>
            </nav>

            <h1 className="text-4xl text-black font-bold">{product.name}</h1>
            <p className="text-4xl text-black mt-4">
              {formatVND(product.price)}
            </p>

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
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
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
                        // Khi đổi size, reset qty về 1 để tránh vượt max của size mới
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

            {/* Add to cart */}
            <button
              className={`mt-6 py-3 px-6 w-full rounded-lg transition text-white ${
                isOutOfStock ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              }`}
              disabled={isOutOfStock}
              title={isOutOfStock ? "Out of stock for this size" : undefined}
              onClick={() => {
                const sizeId = getSelectedSizeId();
                const safeQty = Math.max(1, Math.min(qty, maxAllowed));
                if (safeQty <= 0) return;
                addToCart(product, {
                  selectedColor,
                  selectedSize,
                  sizeId,
                  qty: safeQty,
                }); // không toast ở đây để tránh trùng – CartContext đã toast
              }}
            >
              {isOutOfStock ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        </div>

        {/* Bottom sections */}
        {product.details && (
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

        <section className="mt-20 px-8">
          <div className="text-center mx-auto">
            <h2 className="text-2xl mb-4 font-Jsans text-[#353535]">
              More about this product
            </h2>
            <p className="font-Jsans font-light text-base text-[#434237] leading-loose">
              {product.information ||
                "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."}
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-10">
            <img src={gallery5} alt="Front View" />
            <img src={gallery6} alt="Back View" />
          </div>
        </section>
                // Reviews
        <section className="mt-20 px-8 mx-auto">
          <div className="flex items-center text-lg">
            <span className="text-4xl font-kaisei text-[#434237] tracking-wide">
              {ratingStats.averageRating.toFixed(1)}
            </span>
            <div className="text-[#434237] mx-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`text-3xl ${
                    star <= Math.round(ratingStats.averageRating) 
                      ? 'text-[#434237]' 
                      : 'text-gray-300'
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
                      {comment.isVerifiedPurchase ? 'Verified Buyer' : 'Customer'}
                    </p>
                    {comment.transactionDetail?.size && (
                      <p className="text-xs text-gray-500">
                        Size: {comment.transactionDetail.size.label}
                      </p>
                    )}
                  </div>
                  <div className="ml-32">
                    <div className="flex items-center mb-2">
                      <span className="text-[#434237] text-base">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`text-xl ${
                              star <= comment.rating 
                                ? 'text-[#434237]' 
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                      <span className="text-[#434237] text-lg ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#353535] font-light max-w-[90%]">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="ml-16 py-20 text-center">
              <p className="text-[#353535]">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
