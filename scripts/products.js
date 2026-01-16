// Product Listing Page Script
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategoryProducts();
});

// Load products by category
async function loadCategoryProducts(category) {
    const productGrid = document.querySelector('.products-grid, .product-grid');
    if (!productGrid) return;

    try {
        // Show loading
        featuredGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 40px;">Loading products...</p>';

        const response = await getProducts({ category });
        
        if (response.success && response.data && response.data.length > 0) {
            productGrid.innerHTML = '';
            response.data.forEach(product => {
                productGrid.appendChild(createProductCard(product));
            });
        } else {
            productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 40px;">No products found in this category.</p>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Error loading products. Please refresh the page.</p>';
    }
}

// Load products when page loads
loadProducts();
