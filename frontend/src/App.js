import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './pages/products.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App; 