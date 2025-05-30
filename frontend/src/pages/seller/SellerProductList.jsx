import { useState, useEffect } from "react";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

const initialProduct = { name: "", price: "", category: "", description: "", stock: 1, image: null };

const SellerProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(initialProduct);
  const [productImageFile, setProductImageFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts();
      setProducts(res.data || []);
      setError("");
    } catch (err) {
      setError("Cannot load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data || []);
    } catch {}
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(initialProduct);
    setProductImageFile(null);
    setFormError("");
    setShowModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      price: p.price,
      category: p.category?._id || p.category || "",
      description: p.description || "",
      stock: p.stock || 1,
      image: p.image || null
    });
    setProductImageFile(null);
    setFormError("");
    setShowModal(true);
  };

  const handleProductFormChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleProductImageChange = (e) => {
    setProductImageFile(e.target.files[0]);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return setFormError("Product name cannot be empty");
    if (!productForm.price || Number(productForm.price) <= 0) return setFormError("Product price must be greater than 0");
    if (!productForm.category) return setFormError("Please select a category");
    if (!productForm.description.trim()) return setFormError("Please enter a product description");
    if (!productForm.stock || Number(productForm.stock) < 0) return setFormError("Stock must be >= 0");
    if (!editingProduct && !productImageFile) return setFormError("Please select a product image");
    setFormError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("category", productForm.category);
      formData.append("description", productForm.description);
      formData.append("stock", productForm.stock);
      if (productImageFile) formData.append("image", productImageFile);
      let res;
      if (editingProduct) {
        res = await productService.updateProductFormData(editingProduct._id, formData);
      } else {
        res = await productService.createProductFormData(formData);
      }
      setShowModal(false);
      setProductImageFile(null);
      fetchProducts();
    } catch (err) {
      setFormError("An error occurred while saving the product or uploading the image");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      await productService.deleteProduct(productToDelete._id);
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch {
      setError("Cannot delete product");
    } finally {
      setLoading(false);
    }
  };

  // Lọc sản phẩm brand = 'green'
  const greenProducts = products.filter(p => p.brand === 'green');

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-700">Product List</h3>
          <button onClick={openAddProduct} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-bold">+ Add Product</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-green-200 rounded-lg">
            <thead className="bg-green-100">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Price</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Image</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">Loading...</td></tr>
              ) : greenProducts.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">No products</td></tr>
              ) : (
                greenProducts.map((p) => (
                  <tr key={p._id} className="border-t border-green-50">
                    <td className="py-2 px-3 font-semibold text-green-700">{p.name}</td>
                    <td className="py-2 px-3">{p.price?.toLocaleString()}₫</td>
                    <td className="py-2 px-3">{categories.find(c => c._id === (p.category?._id || p.category))?.name || 'Unclassified'}</td>
                    <td className="py-2 px-3">
                      {p.image && <img src={p.image} alt="Product image" className="w-14 h-14 object-cover rounded" />}
                    </td>
                    <td className="py-2 px-3 flex gap-2 items-center">
                      <button onClick={() => openEditProduct(p)} className="bg-yellow-400 text-green-900 px-3 py-1 rounded hover:bg-yellow-500 font-bold">Edit</button>
                      <button onClick={() => openDeleteModal(p)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal thêm/sửa sản phẩm */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 overflow-auto">
          <form onSubmit={handleProductSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative border-2 border-green-200 max-h-[90vh] overflow-y-auto" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed'}}>
            <button type="button" onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            {formError && <div className="text-red-500 mb-2 text-center">{formError}</div>}
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Product Name</label>
              <input name="name" value={productForm.name} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Price</label>
              <input name="price" type="number" value={productForm.price} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Category</label>
              <select name="category" value={productForm.category} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Description</label>
              <textarea name="description" value={productForm.description} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-semibold mb-1">Stock</label>
              <input name="stock" type="number" value={productForm.stock} onChange={handleProductFormChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-6">
              <label className="block text-green-700 font-semibold mb-1">Product Image {editingProduct ? '(skip if not changing image)' : ''}</label>
              <input name="image" type="file" accept="image/*" onChange={handleProductImageChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 bg-white" />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-60">{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
      {/* Modal xác nhận xóa sản phẩm */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative border-2 border-red-200">
            <button type="button" onClick={() => setShowDeleteModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Confirm Delete</h2>
            <p className="text-center mb-6">Are you sure you want to delete the product &quot;{productToDelete?.name}&quot;?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 font-bold">Cancel</button>
              <button onClick={handleDeleteProduct} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductList; 