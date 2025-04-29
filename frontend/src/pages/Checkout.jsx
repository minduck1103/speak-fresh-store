import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import cartService from "../services/cartService";

const paymentMethods = [
  { label: "Thanh toán khi nhận hàng (COD)", value: "cod" },
  { label: "Chuyển khoản ngân hàng", value: "bank" },
  { label: "Ví điện tử Momo", value: "momo" },
  { label: "Thẻ tín dụng/Ghi nợ", value: "card" },
];
const shippingMethods = [
  { label: "Giao hàng tiêu chuẩn (2-3 ngày)", value: "standard", fee: 20000 },
  { label: "Giao hàng nhanh (trong ngày)", value: "express", fee: 40000 },
  { label: "Nhận tại cửa hàng", value: "pickup", fee: 0 },
];

const Checkout = () => {
  const [payment, setPayment] = useState(paymentMethods[0].value);
  const [shipping, setShipping] = useState(shippingMethods[0].value);
  const [info, setInfo] = useState({ name: "", phone: "", address: "", city: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Lấy sản phẩm trong giỏ hàng
  const cartItems = cartService.getCartItems();
  const itemsPrice = cartItems.reduce((sum, item) => sum + (item.price * (1 - (item.discount || 0) / 100) * item.quantity), 0);
  const shippingFee = shippingMethods.find(m => m.value === shipping)?.fee || 0;
  const totalPrice = itemsPrice + shippingFee;

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Chuẩn hóa dữ liệu gửi lên API
      const DEFAULT_IMAGE = "https://via.placeholder.com/150?text=No+Image";
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          product: item.productId,
          image: item.image && typeof item.image === 'string' && item.image.trim() !== '' ? item.image : DEFAULT_IMAGE
        })),
        shippingInfo: {
          name: info.name,
          phoneNo: info.phone,
          city: info.city,
          address: info.address
        },
        paymentInfo: { method: payment },
        itemsPrice,
        taxPrice: 0,
        shippingPrice: shippingFee,
        totalAmount: totalPrice
      };
      console.log('orderData gửi lên:', orderData);
      await createOrder(orderData);
      cartService.clearCart();
      setSuccess(true);
    } catch (err) {
      setError("Đặt hàng thất bại. Vui lòng đăng nhập và thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 min-h-screen flex items-center justify-center py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✔️</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-700 mb-6">Cảm ơn bạn đã mua sắm tại Speak Fresh. Đơn hàng của bạn đang được xử lý.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/")} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">Mua sắm tiếp</button>
            <button onClick={() => navigate("/orders")} className="w-full bg-white border border-green-500 text-green-600 font-bold py-3 rounded-lg hover:bg-green-50 transition-colors text-lg">Xem đơn hàng</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen py-10 mt-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Thanh toán đơn hàng</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-700 mb-2">Tóm tắt đơn hàng</h2>
          {cartItems.length === 0 ? (
            <div className="text-gray-500">Giỏ hàng của bạn đang trống.</div>
          ) : (
            <div className="border border-green-200 rounded-lg p-4 mb-4">
              <ul className="divide-y divide-green-100 mb-2">
                {cartItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between py-2 items-center">
                    <div>
                      <span className="font-semibold text-green-700">{item.name}</span>
                      <span className="ml-2 text-gray-500">x{item.quantity}</span>
                    </div>
                    <div className="text-green-600 font-bold">{(item.price * (1 - (item.discount || 0) / 100) * item.quantity).toLocaleString()}₫</div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between py-1">
                <span>Tạm tính:</span>
                <span>{itemsPrice.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee === 0 ? "Miễn phí" : shippingFee.toLocaleString() + "₫"}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-green-700 text-lg">
                <span>Tổng cộng:</span>
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-green-700 font-semibold mb-1">Họ tên người nhận</label>
              <input type="text" name="name" value={info.name} onChange={handleChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-green-700 font-semibold mb-1">Số điện thoại</label>
              <input type="tel" name="phone" value={info.phone} onChange={handleChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1">Thành phố</label>
            <input type="text" name="city" value={info.city} onChange={handleChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1">Địa chỉ nhận hàng</label>
            <input type="text" name="address" value={info.address} onChange={handleChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-2">Phương thức vận chuyển</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shippingMethods.map((m) => (
                <label key={m.value} className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition-colors ${shipping === m.value ? "border-green-600 bg-green-50" : "border-green-200"}`}>
                  <input type="radio" name="shipping" value={m.value} checked={shipping === m.value} onChange={() => setShipping(m.value)} className="mr-2 accent-green-600" />
                  <span className="font-semibold text-green-700">{m.label}</span>
                  <span className="ml-auto text-green-500 font-bold">{m.fee === 0 ? "Miễn phí" : m.fee.toLocaleString() + "₫"}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-2">Phương thức thanh toán</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((m) => (
                <label key={m.value} className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition-colors ${payment === m.value ? "border-green-600 bg-green-50" : "border-green-200"}`}>
                  <input type="radio" name="payment" value={m.value} checked={payment === m.value} onChange={() => setPayment(m.value)} className="mr-2 accent-green-600" />
                  <span className="font-semibold text-green-700">{m.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading || cartItems.length === 0} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg disabled:opacity-60">{loading ? "Đang xử lý..." : "Đặt hàng"}</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 