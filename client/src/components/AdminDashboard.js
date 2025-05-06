import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
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

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', newProduct);
            setNewProduct({ name: '', description: '', price: '', stock: '' });
            fetchProducts();
        } catch (err) {
            setError('Failed to add product');
        }
    };

    const updateStock = async (productId, newStock) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${productId}`, {
                stock: newStock
            });
            fetchProducts();
        } catch (err) {
            setError('Failed to update stock');
        }
    };

    const updatePrice = async (productId, newPrice) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${productId}`, {
                price: newPrice
            });
            fetchProducts();
        } catch (err) {
            setError('Failed to update price');
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            {error && <p className="error">{error}</p>}
            
            <div className="add-product-form">
                <h3>Add New Product</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Add Product</button>
                </form>
            </div>

            <div className="products-list">
                <h3>Products</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => updatePrice(product._id, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={product.stock}
                                        onChange={(e) => updateStock(product._id, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => updateStock(product._id, product.stock + 1)}>+</button>
                                    <button onClick={() => updateStock(product._id, Math.max(0, product.stock - 1))}>-</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;