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
    if (!categoryForm.name.trim()) return setFormError("Category name cannot be empty");
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
      setFormError("Error saving category");
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
      setError("Cannot delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-green-700">Category List</h3>
        <button onClick={openAddCategory} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-bold">+ Add Category</button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-6 text-gray-400">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-6 text-gray-400">No categories</td></tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-t border-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{category.name}</td>
                  <td className="py-2 px-3">{category.description || "No description"}</td>
                  <td className="py-2 px-3 flex gap-2 items-center">
                    <button onClick={() => openEditCategory(category)} className="bg-yellow-400 text-green-900 px-3 py-1 rounded hover:bg-yellow-500 font-bold">Edit</button>
                    <button onClick={() => openDeleteModal(category)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold">Delete</button>
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
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            {formError && <div className="text-red-500 mb-2 text-center">{formError}</div>}
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Category Name</label>
              <input name="name" value={categoryForm.name} onChange={handleCategoryFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Description</label>
              <textarea name="description" value={categoryForm.description} onChange={handleCategoryFormChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" rows={3} />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">{editingCategory ? 'Update' : 'Add'}</button>
          </form>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative border-2 border-red-200">
            <button type="button" onClick={() => setShowDeleteModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Confirm Delete</h2>
            <p className="text-center mb-6">Are you sure you want to delete the category "{categoryToDelete?.name}"?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 font-bold">Cancel</button>
              <button onClick={handleDeleteCategory} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCategoryList; 