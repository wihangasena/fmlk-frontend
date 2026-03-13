// Homepage Product Loading
document.addEventListener('DOMContentLoaded', async () => {
    await loadFeaturedProducts();
    await loadCategoryPreviews();
});

// Load Featured Products
async function loadFeaturedProducts() {
    const featuredGrid = document.querySelector('.featured-products .product-grid');
    if (!featuredGrid) return;

    try {
        // Show loading state
        featuredGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Loading products...</p>';

        const response = await getProducts({ featured: true, limit: 8 });
        
        if (response.success && response.data && response.data.length > 0) {
            featuredGrid.innerHTML = '';
            response.data.forEach(product => {
                featuredGrid.appendChild(createProductCard(product));
            });
        } else {
            // Show sample products if database is empty
            featuredGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p>No products available yet. Add products to your database!</p>
                    <p style="margin-top: 10px;">Use the API endpoint: POST http://localhost:5000/api/products</p>
                </div>
            `;
            loadSampleProducts(featuredGrid);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        featuredGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Error loading products. Make sure backend server is running!</p>';
        loadSampleProducts(featuredGrid);
    }
}

// Load Category Previews
async function loadCategoryPreviews() {
    const categories = [
        { name: 'sarees', selector: '#sarees-grid' },
        { name: 'dresses', selector: '#dresses-grid' },
        { name: 'tops', selector: '#tops-grid' }
    ];

    for (const category of categories) {
        const grid = document.querySelector(category.selector);
        if (!grid) continue;

        try {
            const response = await getProducts({ category: category.name, limit: 3 });
            
            if (response.success && response.data && response.data.length > 0) {
                grid.innerHTML = '';
                response.data.slice(0, 3).forEach(product => {
                    grid.appendChild(createProductCard(product));
                });
            } else {
                grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; padding: 20px;">No ${category.name} available</p>`;
            }
        } catch (error) {
            console.error(`Error loading ${category.name}:`, error);
            grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: red; padding: 20px;">Error loading ${category.name}</p>`;
        }
    }
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    
    // Make the image area clickable for viewing product
    
    const imageSrc = (product.images && product.images.length > 0 && product.images[0]) 
        ? product.images[0] 
        : 'https://via.placeholder.com/300x400?text=No+Image';
    
    const priceFormatted = typeof product.price === 'number' 
        ? product.price.toLocaleString() 
        : product.price;
    
    card.innerHTML = `
        <div class="product-image" onclick="viewProduct('${product._id}')">
            <img src="${imageSrc}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Image+Not+Found'">
            <div class="product-hover-overlay">
                <span class="quick-view">Quick View</span>
            </div>
            ${product.stock === 0 ? '<span class="product-badge sold-out">Sold Out</span>' : ''}
        </div>
        <div class="product-info">
            <h4 class="product-name" onclick="viewProduct('${product._id}')">${product.name}</h4>
            <p class="product-price">${priceFormatted} LKR</p>
            <div class="product-actions-home" style="display: flex; gap: 8px; margin-top: 10px;">
                <button class="btn-add-cart-home" onclick="event.stopPropagation(); addToCartFromHome('${product._id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${imageSrc}')" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn-buy-now-home" onclick="event.stopPropagation(); buyNowFromHome('${product._id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${imageSrc}')" ${product.stock === 0 ? 'disabled' : ''}>
                    Buy Now
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Add to Cart from Homepage
function addToCartFromHome(productId, productName, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            productId: productId,
            name: productName,
            price: price,
            quantity: 1,
            size: 'M', // Default size
            image: image
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${productName} added to cart!`, 'success');
    updateCartCount();
}

// Buy Now from Homepage
function buyNowFromHome(productId, productName, price, image) {
    // Clear cart and add this product
    const cart = [{
        productId: productId,
        name: productName,
        price: price,
        quantity: 1,
        size: 'M',
        image: image
    }];
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'pages/checkout.html';
}

// Update Cart Count in Header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Generate Star Rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Check if product is in wishlist
function checkIfInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.includes(productId);
}

// Toggle Wishlist
async function toggleWishlist(productId, event) {
    event.stopPropagation();
    const button = event.currentTarget;
    
    try {
        const isInWishlist = checkIfInWishlist(productId);
        
        if (isInWishlist) {
            await removeFromWishlist(productId);
            button.classList.remove('active');
            showNotification('Removed from wishlist', 'info');
        } else {
            await addToWishlist(productId);
            button.classList.add('active');
            showNotification('Added to wishlist!', 'success');
        }
    } catch (error) {
        console.error('Wishlist error:', error);
        showNotification('Error updating wishlist', 'error');
    }
}

// View Product
function viewProduct(productId) {
    window.location.href = `pages/product-detail.html?id=${productId}`;
}

// Quick Add to Cart
async function quickAddToCart(productId, productName, price) {
    try {
        await addToCart(productId, 1, null, null, price);
        showNotification(`${productName} added to cart!`, 'success');
    } catch (error) {
        console.error('Add to cart error:', error);
        showNotification('Error adding to cart', 'error');
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load Sample Products (fallback when database is empty)
function loadSampleProducts(container) {
    const sampleProducts = [
        {
            _id: 'sample1',
            name: 'Elegant Saree',
            description: 'Beautiful traditional saree with intricate designs',
            price: 12500,
            category: 'sarees',
            images: ['https://fmlk.lk/cdn/shop/files/IMG_0126_500x.jpg'],
            sizes: ['One Size'],
            stock: 10,
            featured: true,
            rating: 4.5,
            numReviews: 12
        },
        {
            _id: 'sample2',
            name: 'Summer Dress',
            description: 'Light and comfortable summer dress',
            price: 8900,
            category: 'dresses',
            images: ['https://fmlk.lk/cdn/shop/files/IMG_0081_500x.jpg'],
            sizes: ['S', 'M', 'L'],
            stock: 15,
            featured: true,
            rating: 4,
            numReviews: 8
        },
        {
            _id: 'sample3',
            name: 'Casual Top',
            description: 'Stylish casual top for everyday wear',
            price: 4500,
            category: 'tops',
            images: ['https://fmlk.lk/cdn/shop/files/IMG_0099_500x.jpg'],
            sizes: ['S', 'M', 'L', 'XL'],
            stock: 20,
            featured: true,
            rating: 4.5,
            numReviews: 15
        },
        {
            _id: 'sample4',
            name: 'Designer Saree',
            description: 'Premium designer saree for special occasions',
            price: 25000,
            category: 'sarees',
            images: ['https://fmlk.lk/cdn/shop/files/IMG_0128_500x.jpg'],
            sizes: ['One Size'],
            stock: 5,
            featured: true,
            rating: 5,
            numReviews: 20
        }
    ];
    
    container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; margin-bottom: 20px;">Showing sample products (Database is empty)</p>';
    sampleProducts.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
        color: #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
        color: #ef4444;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
        color: #3b82f6;
    }
    
    .notification i {
        font-size: 20px;
    }
    
    .notification span {
        color: #333;
        font-weight: 500;
    }
    
    .wishlist-btn.active {
        color: #ef4444;
    }
    
    .size-badge {
        display: inline-block;
        padding: 2px 8px;
        background: #f3f4f6;
        border-radius: 4px;
        font-size: 12px;
        margin-right: 4px;
        margin-top: 4px;
    }
`;
document.head.appendChild(style);
