import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products');
        }
    };

    const addToCart = async (productId) => {
        try {
            await axios.post('http://localhost:5000/api/users/cart', {
                productId,
                quantity: 1
            });
        } catch (err) {
            setError('Failed to add to cart');
        }
    };

    return (
        <div className="customer-dashboard">
            <h2>Products</h2>
            {error && <p className="error">{error}</p>}
            <Link to="/cart" className="cart-link">View Cart</Link>
            
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>In Stock: {product.stock}</p>
                        <button
                            onClick={() => addToCart(product._id)}
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomerDashboard;