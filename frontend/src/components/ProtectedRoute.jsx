import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <div className="text-red-600 text-2xl mb-2">⚠️</div>
              <div className="mb-4 font-semibold">Yêu cầu đăng nhập</div>
              <div className="text-gray-600">
                Vui lòng đăng nhập để tiếp tục truy cập trang này
              </div>
            </div>
          </div>
        )}
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      </>
    );
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 