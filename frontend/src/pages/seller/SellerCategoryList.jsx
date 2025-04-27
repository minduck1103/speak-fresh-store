import { useState } from "react";
import categoryService from "../../services/categoryService";

const initialCategory = { name: "", description: "" };

const SellerCategoryList = ({ categories, onReloadCategories }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState(initialCategory);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm(initialCategory);
    setFormError("");
    setShowModal(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || ""
    });
    setFormError("");
    setShowModal(true);
  };

  const handleCategoryFormChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return setFormError("Tên danh mục không được để trống");
    setFormError("");
    setLoading(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, categoryForm);
      } else {
        await categoryService.createCategory(categoryForm);
      }
      setShowModal(false);
      onReloadCategories();
    } catch (err) {
      setFormError("Có lỗi xảy ra khi lưu danh mục");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    try {
      await categoryService.deleteCategory(categoryToDelete._id);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      onReloadCategories();
    } catch (err) {
      setError("Không thể xóa danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-green-700">Danh sách danh mục</h3>
        <button onClick={openAddCategory} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-bold">+ Thêm danh mục</button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3">Tên</th>
              <th className="py-2 px-3">Mô tả</th>
              <th className="py-2 px-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-6 text-gray-400">Đang tải...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-6 text-gray-400">Không có danh mục</td></tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-t border-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{category.name}</td>
                  <td className="py-2 px-3">{category.description || "Không có mô tả"}</td>
                  <td className="py-2 px-3 flex gap-2 items-center">
                    <button onClick={() => openEditCategory(category)} className="bg-yellow-400 text-green-900 px-3 py-1 rounded hover:bg-yellow-500 font-bold">Sửa</button>
                    <button onClick={() => openDeleteModal(category)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa danh mục */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <form onSubmit={handleCategorySubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative border-2 border-green-200">
            <button type="button" onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
            {formError && <div className="text-red-500 mb-2 text-center">{formError}</div>}
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Tên danh mục</label>
              <input name="name" value={categoryForm.name} onChange={handleCategoryFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Mô tả</label>
              <textarea name="description" value={categoryForm.description} onChange={handleCategoryFormChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" rows={3} />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">{editingCategory ? 'Cập nhật' : 'Thêm mới'}</button>
          </form>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative border-2 border-red-200">
            <button type="button" onClick={() => setShowDeleteModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Xác nhận xóa</h2>
            <p className="text-center mb-6">Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}"?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 font-bold">Hủy</button>
              <button onClick={handleDeleteCategory} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 font-bold">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCategoryList; 