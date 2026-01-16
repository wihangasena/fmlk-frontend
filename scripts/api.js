// API Configuration
// Change this URL to your deployed backend URL when deploying to production
// For local development: 'http://localhost:5000/api'
// For production: 'https://your-backend-app.onrender.com/api'
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://fmlk-backend.onrender.com/api';  // UPDATE THIS with your Render URL

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Set auth token
const setAuthToken = (token) => localStorage.setItem('authToken', token);

// Remove auth token
const removeAuthToken = () => localStorage.removeItem('authToken');

// API Helper Function
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== AUTH API ====================

// Register user
async function registerUser(name, email, password) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    });
    
    if (data.success && data.token) {
        setAuthToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
}

// Login user
async function loginUser(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    
    if (data.success && data.token) {
        setAuthToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
}

// Logout user
function logoutUser() {
    removeAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    window.location.href = '../index.html';
}

// Get current user
async function getCurrentUser() {
    return await apiRequest('/auth/me', { method: 'GET' });
}

// Check if user is logged in
function isLoggedIn() {
    return !!getAuthToken();
}

// Get user info from localStorage
function getUserInfo() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// ==================== PRODUCTS API ====================

// Get all products
async function getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/products?${queryParams}` : '/products';
    return await apiRequest(endpoint, { method: 'GET' });
}

// Get single product
async function getProduct(productId) {
    return await apiRequest(`/products/${productId}`, { method: 'GET' });
}

// Get featured products
async function getFeaturedProducts() {
    return await apiRequest('/products/featured', { method: 'GET' });
}

// ==================== CART API ====================

// Get user cart
async function getCart() {
    if (!isLoggedIn()) {
        // Return local cart if not logged in
        return {
            success: true,
            data: {
                items: JSON.parse(localStorage.getItem('cart')) || [],
                totalPrice: calculateLocalCartTotal()
            }
        };
    }
    return await apiRequest('/cart', { method: 'GET' });
}

// Add to cart
async function addToCart(productId, quantity, size, color, price) {
    if (!isLoggedIn()) {
        // Store in localStorage if not logged in
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ productId, quantity, size, color, price, name: 'Product' });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        return { success: true, message: 'Added to cart (login to sync)' };
    }
    
    const data = await apiRequest('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, size, color })
    });
    updateCartCount();
    return data;
}

// Update cart item
async function updateCartItem(itemId, quantity) {
    const data = await apiRequest(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
    });
    updateCartCount();
    return data;
}

// Remove from cart
async function removeFromCart(itemId) {
    const data = await apiRequest(`/cart/${itemId}`, { method: 'DELETE' });
    updateCartCount();
    return data;
}

// Clear cart
async function clearCart() {
    if (!isLoggedIn()) {
        localStorage.removeItem('cart');
        updateCartCount();
        return { success: true };
    }
    const data = await apiRequest('/cart', { method: 'DELETE' });
    updateCartCount();
    return data;
}

// ==================== WISHLIST API ====================

// Get wishlist
async function getWishlist() {
    if (!isLoggedIn()) {
        return {
            success: true,
            data: {
                products: JSON.parse(localStorage.getItem('wishlist')) || []
            }
        };
    }
    return await apiRequest('/wishlist', { method: 'GET' });
}

// Add to wishlist
async function addToWishlist(productId) {
    if (!isLoggedIn()) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
        updateWishlistCount();
        return { success: true, message: 'Added to wishlist (login to sync)' };
    }
    
    const data = await apiRequest(`/wishlist/${productId}`, { method: 'POST' });
    updateWishlistCount();
    return data;
}

// Remove from wishlist
async function removeFromWishlist(productId) {
    if (!isLoggedIn()) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        return { success: true };
    }
    
    const data = await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' });
    updateWishlistCount();
    return data;
}

// ==================== ORDERS API ====================

// Create order
async function createOrder(orderData) {
    return await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
}

// Get user orders
async function getMyOrders() {
    return await apiRequest('/orders/myorders', { method: 'GET' });
}

// Get order by ID
async function getOrder(orderId) {
    return await apiRequest(`/orders/${orderId}`, { method: 'GET' });
}

// ==================== HELPER FUNCTIONS ====================

// Calculate local cart total
function calculateLocalCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in UI
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        const count = cart.length;
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Update wishlist count in UI
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const countElement = document.getElementById('wishlistCount');
    if (countElement) {
        countElement.textContent = wishlist.length;
        countElement.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateWishlistCount();
    
    // Update user info in header if logged in
    const user = getUserInfo();
    if (user) {
        const accountLink = document.querySelector('a[title="Account"]');
        if (accountLink) {
            accountLink.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
        }
    }
});
