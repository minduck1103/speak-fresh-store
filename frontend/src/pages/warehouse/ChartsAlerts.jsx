const ChartsAlerts = () => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-xl shadow p-6 col-span-2">
      <h2 className="text-lg font-bold text-green-700 mb-2">Biểu đồ nhập/xuất kho</h2>
      <div className="h-48 flex items-center justify-center text-green-300">[Biểu đồ nhập/xuất kho - Placeholder]</div>
    </div>
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-green-700 mb-2">Thông báo & Cảnh báo</h2>
      <ul className="text-sm text-green-800 space-y-2">
        <li>🍌 Lô hàng chuối sắp đến hạn nhập</li>
        <li>🍎 Đơn hàng #123 cần xuất gấp</li>
        <li className="text-red-500">🍇 Sản phẩm nho dưới mức tồn kho tối thiểu!</li>
      </ul>
    </div>
  </section>
);

export default ChartsAlerts; 