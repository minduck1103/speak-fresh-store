import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const roleToPath = {
    admin: '/admin',
    seller: '/seller',
    delivery: '/delivery',
    warehouse: '/warehouse',
    user: '/',
};

const roleToLabel = {
    admin: 'admin',
    seller: 'seller',
    delivery: 'delivery',
    warehouse: 'warehouse',
    user: 'người dùng',
};

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Nếu đã đăng nhập thì chuyển hướng về trang chủ
        if (authService.isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData);
            if (response.success) {
                const userRole = response.user?.role || 'user';
                setRole(userRole);
                setModalOpen(true);
                setTimeout(() => {
                    setModalOpen(false);
                    // Điều hướng chính xác theo role
                    navigate(roleToPath[userRole] || '/');
                }, 1800);
            } else {
                setError(response.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError(err.message || 'Email hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-36">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-8 py-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold">
                            <span className="text-red-500">PEAK</span>
                            <span className="text-orange-400">FRESH</span>
                            <span className="text-green-500 ml-1">🍃</span>
                        </h2>
                        <p className="mt-2 text-gray-600">Đăng nhập vào tài khoản của bạn</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* Modal xác nhận role */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center border border-green-200">
                        <div className="text-green-600 text-2xl mb-2">✅</div>
                        <div className="mb-2 font-semibold">Đăng nhập thành công!</div>
                        <div>Bạn đang đăng nhập với tư cách là <b>{roleToLabel[role] || role}</b></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login; 