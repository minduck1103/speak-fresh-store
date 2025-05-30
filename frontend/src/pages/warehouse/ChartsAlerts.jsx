const ChartsAlerts = () => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-xl shadow p-6 col-span-2">
      <h2 className="text-lg font-bold text-green-700 mb-2">Warehouse Inventory Chart</h2>
      <div className="h-48 flex items-center justify-center text-green-300">[Warehouse Inventory Chart - Placeholder]</div>
    </div>
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-green-700 mb-2">Alerts & Notifications</h2>
      <ul className="text-sm text-green-800 space-y-2">
        <li>🍌 Banana stock is running low</li>
        <li>🍎 Order #123 needs to be shipped urgently</li>
        <li className="text-red-500">🍇 Grapes stock is below minimum level!</li>
      </ul>
    </div>
  </section>
);

export default ChartsAlerts; 