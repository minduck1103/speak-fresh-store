import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Pagination, Badge } from 'react-bootstrap';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import cartService from '../services/cartService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name-asc');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    useEffect(() => {
        fetchProducts();
    }, []);

        const fetchProducts = async () => {
            try {
            setLoading(true);
            const [productsResponse, categoriesResponse] = await Promise.all([
                productService.getProducts(),
                categoryService.getCategories()
            ]);
            setProducts(productsResponse.data || []);
            setCategories(categoriesResponse.data || []);
            setError(null);
            } catch (err) {
            setError('Failed to fetch products');
                console.error('Error fetching products:', err);
        } finally {
                setLoading(false);
            }
        };

    const handleAddToCart = (product) => {
        try {
            cartService.addToCart(product);
            toast.success('Sản phẩm đã được thêm vào giỏ hàng');
            // Trigger cart update event
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Filter and sort products
    const filteredProducts = products
        .filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === 'all' || product.category === selectedCategory)
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default: // name-asc
                    return a.name.localeCompare(b.name);
            }
        });

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    <p>{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Container className="py-5">
            {/* Banner Section */}
            <div className="position-relative mb-5">
                <img 
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Products Banner" 
                    className="w-100 rounded-3"
                    style={{ height: '300px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
                    <h1 className="display-4 fw-bold mb-3">Sản phẩm tươi ngon</h1>
                    <p className="lead">Chọn lọc những sản phẩm chất lượng nhất</p>
                </div>
            </div>

            <Row>
                {/* Left Sidebar - Filters */}
                <Col md={3} className="mb-4">
                    <Card className="border-success">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Bộ lọc</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Select 
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="border-success"
                                >
                                    <option value="all">Tất cả danh mục</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Khoảng giá</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="number"
                                        placeholder="Từ"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="border-success"
                                    />
                                    <Form.Control
                                        type="number"
                                        placeholder="Đến"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="border-success"
                                    />
                                </div>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Main Content */}
                <Col md={9}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-success mb-0">Danh sách sản phẩm</h2>
                        <div className="d-flex gap-2">
                            <InputGroup style={{ width: '300px' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button variant="success">
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup>
                            <Form.Select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border-success"
                                style={{ width: '200px' }}
                            >
                                <option value="name-asc">Tên A-Z</option>
                                <option value="name-desc">Tên Z-A</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                            </Form.Select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {currentProducts.length === 0 ? (
                        <div className="text-center py-5">
                            <h4 className="text-muted">Không tìm thấy sản phẩm nào</h4>
                        </div>
                    ) : (
                        <Row>
                            {currentProducts.map((product, idx) => (
                                <Col key={product._id} xs={12} sm={6} md={4} className="mb-4">
                                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                                        <Card className="h-100 border-success product-card">
                                            <div className="position-relative">
                                                <Card.Img 
                                                    variant="top" 
                                                    src={product.images && (product.images[0]?.url || product.images[0]) ? (product.images[0]?.url || product.images[0]) : '/no-image.png'} 
                                                    alt={product.name}
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />
                                                <Badge 
                                                    bg={product.stock > 0 ? "success" : "danger"} 
                                                    className="position-absolute top-0 end-0 m-2"
                                                >
                                                    {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                                                </Badge>
                                            </div>
                                            <Card.Body className="d-flex flex-column">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <Card.Title className="text-success mb-1">{product.name}</Card.Title>
                                                        <div className="text-gray-500 text-sm mb-1">
                                                            Danh mục: {product.category?.name || (categories.find(c => c._id === (product.category?._id || product.category))?.name) || 'Chưa phân loại'}
                                                        </div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <div className="text-warning me-2">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <i 
                                                                        key={i} 
                                                                        className={`fas fa-star ${i < (product.ratings || 0) ? 'text-warning' : 'text-muted'}`}
                                                                    ></i>
                                                                ))}
                                                            </div>
                                                            <small className="text-muted">({product.reviews?.length || 0} đánh giá)</small>
                                                        </div>
                                                        <h5 className="text-success mb-0">
                                                            {product.discount > 0 ? (
                                                                <>
                                                                    <span className="text-lg font-bold text-green-600">
                                                                        {formatPrice(product.price * (1 - product.discount / 100))}
                                                                    </span>
                                                                    <span className="text-sm text-gray-400 line-through ml-2">
                                                                        {formatPrice(product.price)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-lg font-bold text-green-600">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                            )}
                                                        </h5>
                                                        {/* Mô tả ngắn nếu muốn */}
                                                        {product.description && (
                                                            <div className="text-gray-700 text-sm mt-1 line-clamp-2" style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                                                                {product.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-auto">
                                                    <Button 
                                                        variant="success" 
                                                        className="w-100"
                                                        disabled={product.stock <= 0}
                                                        onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                                                    >
                                                        {product.stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination className="custom-green-pagination">
                                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <Pagination.Item
                                        key={number}
                                        active={number === currentPage}
                                        onClick={() => paginate(number)}
                                        className={number === currentPage ? 'bg-success text-white border-success' : 'text-success'}
                                        style={number === currentPage ? { backgroundColor: '#22c55e', borderColor: '#22c55e', color: '#fff' } : { color: '#22c55e' }}
                                    >
                                        {number}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                            </Pagination>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Products; 