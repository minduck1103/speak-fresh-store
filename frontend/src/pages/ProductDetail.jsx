import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import cartService from "../services/cartService";
import { toast } from "react-toastify";
import RelatedProducts from "./RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProduct(id);
        setProduct(res.data || res);
        setSelectedImage(res.data?.image || res.data?.images?.[0]?.url || res.images?.[0]?.url || res.images?.[0] || "");
        setSelectedLevel(res.data?.level?.[0] || res.level?.[0] || "");
        setError("");
      } catch (err) {
        setError("Không tìm thấy sản phẩm hoặc có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantity = (type) => {
    setQuantity((prev) => (type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    cartService.addToCart({ ...product, quantity });
    toast.success("Sản phẩm đã được thêm vào giỏ hàng");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleBuyNow = () => {
    cartService.addToCart({ ...product, quantity });
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/checkout");
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Gallery */}
        <div className="flex flex-col md:w-1/2 items-center">
          <div className="w-full flex flex-col items-center">
            <img
              src={selectedImage || product.image || product.images?.[0]?.url || product.images?.[0] || '/no-image.png'}
              alt="Sản phẩm"
              className="w-full max-w-md h-80 object-cover rounded-lg border-2 border-green-200 shadow"
            />
            <div className="flex gap-2 mt-4">
              {(product.images || []).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || img}
                  alt="thumb"
                  className={`w-16 h-16 object-cover rounded border-2 cursor-pointer transition-all duration-200 ${selectedImage === (img.url || img) ? "border-green-500" : "border-gray-200"}`}
                  onClick={() => setSelectedImage(img.url || img)}
                />
              ))}
            </div>
            <div className="text-center text-gray-500 text-sm mt-2">
              <span className="inline-block"><i className="fa fa-search"></i> Di chuột để phóng to</span>
            </div>
          </div>
        </div>
        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < (product.ratings || 0) ? '' : 'text-gray-300'}`}></i>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews?.length || 0} đánh giá)</span>
          </div>
          <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-green-700 font-semibold ">
            <span className="text-[30px]">Nhãn hiệu {product.brand || product.category?.name}</span>
            {product.sku && <><span className="text-gray-400 text-xs">|</span><span className="text-gray-500 text-xs">SKU:{product.sku}</span></>}
          </div>
          <div className="flex items-center gap-3 mt-2">
            {product.level && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Level: {selectedLevel}</span>
            )}
            <div className="flex gap-2">
              {(product.level || []).map((lv) => (
                <button
                  key={lv}
                  className={`px-3 py-1 rounded-full border text-xs font-semibold transition-colors duration-200 ${selectedLevel === lv ? "bg-green-500 text-white border-green-500" : "bg-white text-green-700 border-green-400 hover:bg-green-50"}`}
                  onClick={() => setSelectedLevel(lv)}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>
          </div>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-2xl font-bold text-green-600">{product.price?.toLocaleString()}₫</span>
            {product.oldPrice && <span className="text-gray-400 line-through text-lg">{product.oldPrice?.toLocaleString()}₫</span>}
            {product.oldPrice && <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">Tiết kiệm {(product.oldPrice-product.price).toLocaleString()}₫</span>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold">Kho:</span>
            <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>{product.stock > 0 ? "Còn hàng" : "Hết hàng"}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-semibold">Số lượng:</span>
            <button onClick={() => handleQuantity("dec")} className="w-8 h-8 rounded-full border border-green-400 text-green-600 hover:bg-green-50">-</button>
            <span className="w-8 text-center">{quantity}</span>
            <button onClick={() => handleQuantity("inc")} className="w-8 h-8 rounded-full border border-green-400 text-green-600 hover:bg-green-50">+</button>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 bg-white border border-green-500 text-green-600 font-bold py-3 rounded-lg hover:bg-green-50 transition-colors" onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
            <button className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors" onClick={handleBuyNow}>ĐẶT HÀNG NGAY</button>
          </div>
          {/* Dịch vụ giao hàng/quà tặng */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-green-700 text-sm font-semibold">
            <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2"><i className="fas fa-shipping-fast text-green-500"></i> Giao hàng COD Toàn quốc</div>
            <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2"><i className="fas fa-bolt text-yellow-500"></i> Giao hàng hoả tốc tại TP.HCM</div>
            <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2"><i className="fas fa-gift text-pink-500"></i> Thiết kế và gói quà tặng</div>
            <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2"><i className="fas fa-store text-green-600"></i> Cung cấp hàng giá sỉ cho shop</div>
          </div>
          {/* Social share */}
          <div className="flex gap-3 mt-2">
            <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><i className="fab fa-facebook-f"></i></button>
            <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><i className="fab fa-pinterest-p"></i></button>
            <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><i className="fab fa-twitter"></i></button>
            <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><i className="far fa-envelope"></i></button>
          </div>
        </div>
      </div>
      {/* Description & Reviews */}
      <div className="max-w-5xl mx-auto mt-8 bg-white rounded-xl shadow p-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h2 className="text-xl font-bold text-green-700 mb-2">Mô tả</h2>
          <p className="text-orange-600 font-semibold mb-2 whitespace-pre-line">{product.description}</p>
          <div className="text-gray-700 whitespace-pre-line">{product.details}</div>
        </div>
        <div className="md:w-1/3 border-l border-gray-100 pl-8">
          <h2 className="text-xl font-bold text-green-700">Phản hồi từ khách hàng</h2>
          <div className="flex items-center gap-2 ">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="font-bold">{product.ratings || 5.0}</span>
            <span className="text-gray-500 text-sm">trên 5 sao</span>
          </div>
          <div className=" text-gray-500 text-xs">Dựa trên {product.reviews?.length || 0} đánh giá</div>
          <div className="space-y-2">
            {(product.reviews || []).map((r, idx) => (
              <div key={idx} className="bg-green-50 rounded p-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-700">{r.name || r.user}</span>
                  <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                </div>
                <div className="text-gray-700 text-sm">{r.comment}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-green-100 text-green-700 font-bold py-2 rounded hover:bg-green-200 transition-colors">Viết đánh giá</button>
        </div>
      </div>
      {/* Related Products Section */}
      <RelatedProducts currentProduct={product} />
    </div>
  );
};

export default ProductDetail; 