import React, { useState, useEffect } from "react";
import api from "../../services/api";

const initialProduct = { name: "", price: "", category: "", stock: 0, description: "", image: "" };
const initialCategory = { name: "", description: "" };

const AdminProducts = () => {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [productForm, setProductForm] = useState(initialProduct);
  const [categoryForm, setCategoryForm] = useState(initialCategory);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [productImageFile, setProductImageFile] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [tab]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/api/v1/products"),
        api.get("/api/v1/categories")
      ]);
      let prods = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.data || [];
      let cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [];
      setProducts(prods);
      setCategories(cats);
    } catch {
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // PRODUCT CRUD
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(initialProduct);
    setProductImageFile(null);
    setFormError("");
    setShowProductModal(true);
  };
  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      price: p.price,
      category: p.category?._id || p.category || "",
      stock: p.stock || 0,
      description: p.description || "",
      image: p.image || ""
    });
    setProductImageFile(null);
    setFormError("");
    setShowProductModal(true);
  };
  const handleProductFormChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };
  const handleProductImageChange = (e) => {
    setProductImageFile(e.target.files[0]);
  };
  const saveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return setFormError("Product name cannot be empty");
    if (!productForm.price || Number(productForm.price) <= 0) return setFormError("Product price must be greater than 0");
    if (!productForm.category) return setFormError("Please select category");
    if (!productForm.description.trim()) return setFormError("Please enter product description");
    if (!editingProduct && !productImageFile) return setFormError("Please select product image");
    setFormError("");
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("category", productForm.category);
      formData.append("stock", productForm.stock);
      formData.append("description", productForm.description);
      if (productImageFile) formData.append("image", productImageFile);
      if (editingProduct) {
        await api.put(`/api/v1/products/${editingProduct._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post(`/api/v1/products`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowProductModal(false);
      fetchAll();
    } catch {
      setFormError("An error occurred while saving the product");
    } finally {
      setSaving(false);
    }
  };
  const openDeleteProduct = (p) => {
    setDeleteTarget(p);
    setDeleteType("product");
    setShowDeleteModal(true);
  };
  const confirmDeleteProduct = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/v1/products/${deleteTarget._id}`);
      setShowDeleteModal(false);
      fetchAll();
    } catch {
      setFormError("Unable to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // CATEGORY CRUD
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm(initialCategory);
    setFormError("");
    setShowCategoryModal(true);
  };
  const openEditCategory = (c) => {
    setEditingCategory(c);
    setCategoryForm({ name: c.name, description: c.description });
    setFormError("");
    setShowCategoryModal(true);
  };
  const handleCategoryFormChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };
  const saveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return setFormError("Tên danh mục không được để trống");
    setSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/api/v1/categories/${editingCategory._id}`, categoryForm);
      } else {
        await api.post(`/api/v1/categories`, categoryForm);
      }
      setShowCategoryModal(false);
      fetchAll();
    } catch {
      setFormError("Có lỗi xảy ra khi lưu danh mục");
    } finally {
      setSaving(false);
    }
  };
  const openDeleteCategory = (c) => {
    setDeleteTarget(c);
    setDeleteType("category");
    setShowDeleteModal(true);
  };
  const confirmDeleteCategory = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/v1/categories/${deleteTarget._id}`);
      setShowDeleteModal(false);
      fetchAll();
    } catch {
      setFormError("Không thể xóa danh mục");
    } finally {
      setDeleting(false);
    }
  };

  // UI
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-green-700 mb-6 flex items-center gap-2 drop-shadow">🍏 Manage Products & Categories</h1>
      <div className="flex gap-4 mb-4">
        <button className={`px-4 py-2 rounded font-bold ${tab === "products" ? "bg-green-600 text-white" : "bg-green-100 text-green-700"}`} onClick={() => setTab("products")}>Products</button>
        <button className={`px-4 py-2 rounded font-bold ${tab === "categories" ? "bg-green-600 text-white" : "bg-green-100 text-green-700"}`} onClick={() => setTab("categories")}>Categories</button>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : tab === "products" ? (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-green-700">Product List</h2>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="find..."
                value={searchProduct}
                onChange={e => setSearchProduct(e.target.value)}
                className="border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
              />
              <button onClick={openAddProduct} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold shadow">+ Add Product</button>
            </div>
          </div>
          <table className="w-full text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="py-2 px-3">Product Name</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Price</th>
                <th className="py-2 px-3">Stock</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase())).map(p => (
                <tr key={p._id} className="border-b hover:bg-green-50 transition">
                  <td className="py-2 px-3 font-semibold text-green-700">{p.name}</td>
                  <td className="py-2 px-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      {categories.find(c => c._id === (p.category?._id || p.category))?.name || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-green-700 font-bold">{p.price?.toLocaleString()}₫</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-green-200 text-green-800' : 'bg-red-100 text-red-600'}`}>{p.stock > 0 ? p.stock : 'Hết hàng'}</span>
                  </td>
                  <td className="py-2 px-3 text-center flex gap-2 justify-center">
                    <button onClick={() => openEditProduct(p)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-xs">Edit</button>
                    <button onClick={() => openDeleteProduct(p)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-green-700">Category List</h2>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="find..."
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
              />
              <button onClick={openAddCategory} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold shadow">+ Thêm danh mục</button>
            </div>
          </div>
          <table className="w-full text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="py-2 px-3">Category Name</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.filter(c => c.name.toLowerCase().includes(searchCategory.toLowerCase())).map(c => (
                <tr key={c._id} className="border-b hover:bg-green-50 transition">
                  <td className="py-2 px-3 font-semibold text-green-700">{c.name}</td>
                  <td className="py-2 px-3">{c.description}</td>
                  <td className="py-2 px-3 text-center flex gap-2 justify-center">
                    <button onClick={() => openEditCategory(c)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-xs">Sửa</button>
                    <button onClick={() => openDeleteCategory(c)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-xs">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal sản phẩm */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form onSubmit={saveProduct} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-fadeIn" encType="multipart/form-data">
            <h2 className="text-xl font-bold mb-4 text-green-700">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            {formError && <div className="text-red-500 mb-2 text-center">{formError}</div>}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Product Name</label>
              <input name="name" value={productForm.name} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Price</label>
              <input name="price" type="number" value={productForm.price} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Category</label>
              <select name="category" value={productForm.category} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500">
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Description</label>
              <textarea name="description" value={productForm.description} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-6">
              <label className="block font-semibold mb-1">Stock</label>
              <input name="stock" type="number" value={productForm.stock} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-6">
              <label className="block font-semibold mb-1">Product Image {editingProduct ? '(skip if no change)' : ''}</label>
              <input name="image" type="file" accept="image/*" onChange={handleProductImageChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 bg-white" />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal danh mục */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form onSubmit={saveCategory} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-green-700">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            {formError && <div className="text-red-500 mb-2 text-center">{formError}</div>}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Category Name</label>
              <input name="name" value={categoryForm.name} onChange={handleCategoryFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-6">
              <label className="block font-semibold mb-1">Description</label>
              <textarea name="description" value={categoryForm.description} onChange={handleCategoryFormChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete <span className="font-bold">{deleteType === 'product' ? deleteTarget?.name : deleteTarget?.name}</span>?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
              <button onClick={deleteType === 'product' ? confirmDeleteProduct : confirmDeleteCategory} disabled={deleting} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60">{deleting ? 'Đang xóa...' : 'Xóa'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 