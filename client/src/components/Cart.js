import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/cart');
            setCart(response.data);
        } catch (err) {
            setError('Failed to fetch cart');
        }
    };

    const checkout = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/checkout');
            setCart([]);
        } catch (err) {
            setError('Failed to checkout');
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            {error && <p className="error">{error}</p>}

            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.product._id} className="cart-item">
                                <h3>{item.product.name}</h3>
                                <p>{item.product.description}</p>
                                <p>Price: ${item.product.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Subtotal: ${item.product.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: ${calculateTotal()}</h3>
                        <button onClick={checkout}>Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;