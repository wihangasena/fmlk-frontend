// ================================================
// FMLK - Advanced Product Filter System
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterSidebar = document.getElementById('filterSidebar');
    const filterOverlay = document.getElementById('filterOverlay');
    const mobileFilterBtn = document.getElementById('mobileFilterBtn');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');
    const productGrid = document.getElementById('productGrid');
    const productCount = document.getElementById('productCount');
    const noResults = document.getElementById('noResults');
    const activeFiltersContainer = document.getElementById('activeFilters');
    const sortSelect = document.getElementById('sortSelect');
    
    // Function to get current product cards (dynamically loaded)
    function getProductCards() {
        return document.querySelectorAll('.product-card');
    }

    // Filter State
    let activeFilters = {
        price: 'all',
        categories: [],
        colors: [],
        sizes: [],
        occasions: [],
        sleeves: [],
        inStockOnly: true
    };

    // Don't initialize filters immediately - wait for products to load
    // initializeFilters();

    // ================================================
    // Mobile Filter Toggle
    // ================================================
    if (mobileFilterBtn) {
        mobileFilterBtn.addEventListener('click', () => {
            filterSidebar.classList.add('active');
            filterOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', closeFilterSidebar);
    }

    if (filterOverlay) {
        filterOverlay.addEventListener('click', closeFilterSidebar);
    }

    function closeFilterSidebar() {
        if (filterSidebar) filterSidebar.classList.remove('active');
        if (filterOverlay) filterOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ================================================
    // Filter Group Toggle (Collapse/Expand)
    // ================================================
    const filterGroupHeaders = document.querySelectorAll('.filter-group-header');
    filterGroupHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const filterGroup = header.parentElement;
            filterGroup.classList.toggle('collapsed');
        });
    });

    // ================================================
    // Sort Functionality
    // ================================================
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortProducts(sortSelect.value);
        });
    }

    function sortProducts(sortType) {
        if (!productGrid) return;
        const cards = Array.from(productCards);
        
        cards.sort((a, b) => {
            const priceA = parseInt(a.dataset.price) || 0;
            const priceB = parseInt(b.dataset.price) || 0;
            const nameA = (a.querySelector('.product-title')?.textContent || '').toLowerCase();
            const nameB = (b.querySelector('.product-title')?.textContent || '').toLowerCase();

            switch (sortType) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name-az':
                    return nameA.localeCompare(nameB);
                case 'newest':
                    return -1;
                default:
                    return 0;
            }
        });

        // Re-append sorted cards
        cards.forEach(card => {
            productGrid.appendChild(card);
        });
    }

    // ================================================
    // Price Filter
    // ================================================
    const priceRadios = document.querySelectorAll('input[name="price"]');
    priceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            activeFilters.price = radio.value;
            applyFilters();
            updateActiveFilterTags();
        });
    });

    // ================================================
    // Category/Fabric/Style Checkbox Filters
    // ================================================
    const categoryCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const filterType = checkbox.dataset.filter;
            const value = checkbox.value;

            if (filterType === 'fabric' || filterType === 'style') {
                updateArrayFilter('categories', value, checkbox.checked);
            } else if (filterType === 'occasion') {
                updateArrayFilter('occasions', value, checkbox.checked);
            } else if (filterType === 'sleeve') {
                updateArrayFilter('sleeves', value, checkbox.checked);
            }

            applyFilters();
            updateActiveFilterTags();
        });
    });

    function updateArrayFilter(filterName, value, isChecked) {
        if (isChecked) {
            if (!activeFilters[filterName].includes(value)) {
                activeFilters[filterName].push(value);
            }
        } else {
            activeFilters[filterName] = activeFilters[filterName].filter(v => v !== value);
        }
    }

    // ================================================
    // Color Filter
    // ================================================
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatch.classList.toggle('selected');
            const color = swatch.dataset.color;
            updateArrayFilter('colors', color, swatch.classList.contains('selected'));
            applyFilters();
            updateActiveFilterTags();
        });
    });

    // ================================================
    // Size Filter
    // ================================================
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            const size = btn.dataset.size;
            updateArrayFilter('sizes', size, btn.classList.contains('selected'));
            applyFilters();
            updateActiveFilterTags();
        });
    });

    // ================================================
    // Availability Toggle
    // ================================================
    const inStockToggle = document.getElementById('inStockOnly');
    if (inStockToggle) {
        inStockToggle.addEventListener('change', () => {
            activeFilters.inStockOnly = inStockToggle.checked;
            applyFilters();
            updateActiveFilterTags();
        });
    }

    // ================================================
    // Clear All Filters
    // ================================================
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', clearAllFilters);
    }

    function clearAllFilters() {
        // Reset filter state
        activeFilters = {
            price: 'all',
            categories: [],
            colors: [],
            sizes: [],
            occasions: [],
            sleeves: [],
            inStockOnly: true
        };

        // Reset UI elements
        priceRadios.forEach(radio => {
            radio.checked = radio.value === 'all';
        });

        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        colorSwatches.forEach(swatch => {
            swatch.classList.remove('selected');
        });

        sizeButtons.forEach(btn => {
            btn.classList.remove('selected');
        });

        if (inStockToggle) {
            inStockToggle.checked = true;
        }

        if (sortSelect) {
            sortSelect.value = 'default';
        }

        applyFilters();
        updateActiveFilterTags();
    }

    // Make clearAllFilters available globally
    window.clearAllFilters = clearAllFilters;

    // ================================================
    // Apply Filters
    // ================================================
    function applyFilters() {
        const productCards = getProductCards();
        let visibleCount = 0;

        productCards.forEach(card => {
            let showCard = true;

            // Price filter
            if (activeFilters.price !== 'all') {
                const cardPrice = parseInt(card.dataset.price) || 0;
                const [minPrice, maxPrice] = activeFilters.price.split('-').map(Number);
                if (cardPrice < minPrice || cardPrice > maxPrice) {
                    showCard = false;
                }
            }

            // Category/Fabric/Style filter
            if (showCard && activeFilters.categories.length > 0) {
                const cardCategory = card.dataset.category || '';
                if (!activeFilters.categories.includes(cardCategory)) {
                    showCard = false;
                }
            }

            // Color filter
            if (showCard && activeFilters.colors.length > 0) {
                const cardColor = card.dataset.color || '';
                if (!activeFilters.colors.includes(cardColor)) {
                    showCard = false;
                }
            }

            // Size filter
            if (showCard && activeFilters.sizes.length > 0) {
                const cardSizes = (card.dataset.size || '').split(',');
                const hasMatchingSize = activeFilters.sizes.some(size => cardSizes.includes(size));
                if (!hasMatchingSize) {
                    showCard = false;
                }
            }

            // Occasion filter
            if (showCard && activeFilters.occasions.length > 0) {
                const cardOccasions = (card.dataset.occasion || '').split(',');
                const hasMatchingOccasion = activeFilters.occasions.some(occasion => cardOccasions.includes(occasion));
                if (!hasMatchingOccasion) {
                    showCard = false;
                }
            }

            // Sleeve filter
            if (showCard && activeFilters.sleeves.length > 0) {
                const cardSleeve = card.dataset.sleeve || '';
                if (!activeFilters.sleeves.includes(cardSleeve)) {
                    showCard = false;
                }
            }

            // In Stock filter
            if (showCard && activeFilters.inStockOnly) {
                const isInStock = card.dataset.stock === 'true';
                if (!isInStock) {
                    showCard = false;
                }
            }

            // Show/Hide card with animation
            if (showCard) {
                card.style.display = 'block';
                card.style.opacity = '1';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });

        // Update product count
        if (productCount) {
            productCount.textContent = visibleCount;
        }

        // Show/hide no results message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
        if (productGrid) {
            productGrid.style.display = visibleCount === 0 ? 'none' : 'grid';
        }
    }

    // ================================================
    // Active Filter Tags
    // ================================================
    function updateActiveFilterTags() {
        if (!activeFiltersContainer) return;

        activeFiltersContainer.innerHTML = '';

        // Price tag
        if (activeFilters.price !== 'all') {
            const priceLabel = getPriceLabel(activeFilters.price);
            addFilterTag('Price: ' + priceLabel, () => {
                activeFilters.price = 'all';
                const allPriceRadio = document.querySelector('input[name="price"][value="all"]');
                if (allPriceRadio) allPriceRadio.checked = true;
                applyFilters();
                updateActiveFilterTags();
            });
        }

        // Category tags
        activeFilters.categories.forEach(cat => {
            addFilterTag(capitalizeFirst(cat), () => {
                activeFilters.categories = activeFilters.categories.filter(c => c !== cat);
                const checkbox = document.querySelector(`input[value="${cat}"]`);
                if (checkbox) checkbox.checked = false;
                applyFilters();
                updateActiveFilterTags();
            });
        });

        // Color tags
        activeFilters.colors.forEach(color => {
            addFilterTag('Color: ' + capitalizeFirst(color), () => {
                activeFilters.colors = activeFilters.colors.filter(c => c !== color);
                const swatch = document.querySelector(`.color-swatch[data-color="${color}"]`);
                if (swatch) swatch.classList.remove('selected');
                applyFilters();
                updateActiveFilterTags();
            });
        });

        // Size tags
        activeFilters.sizes.forEach(size => {
            addFilterTag('Size: ' + size.toUpperCase(), () => {
                activeFilters.sizes = activeFilters.sizes.filter(s => s !== size);
                const btn = document.querySelector(`.size-btn[data-size="${size}"]`);
                if (btn) btn.classList.remove('selected');
                applyFilters();
                updateActiveFilterTags();
            });
        });

        // Occasion tags
        activeFilters.occasions.forEach(occasion => {
            addFilterTag(capitalizeFirst(occasion), () => {
                activeFilters.occasions = activeFilters.occasions.filter(o => o !== occasion);
                const checkbox = document.querySelector(`input[value="${occasion}"][data-filter="occasion"]`);
                if (checkbox) checkbox.checked = false;
                applyFilters();
                updateActiveFilterTags();
            });
        });

        // Sleeve tags
        activeFilters.sleeves.forEach(sleeve => {
            addFilterTag('Sleeve: ' + capitalizeFirst(sleeve), () => {
                activeFilters.sleeves = activeFilters.sleeves.filter(s => s !== sleeve);
                const checkbox = document.querySelector(`input[value="${sleeve}"][data-filter="sleeve"]`);
                if (checkbox) checkbox.checked = false;
                applyFilters();
                updateActiveFilterTags();
            });
        });
    }

    function addFilterTag(text, removeCallback) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.innerHTML = `${text} <button class="remove-tag" aria-label="Remove filter"><i class="fas fa-times"></i></button>`;
        tag.querySelector('.remove-tag').addEventListener('click', removeCallback);
        activeFiltersContainer.appendChild(tag);
    }

    function getPriceLabel(priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (min === 0) return `Under ${formatPrice(max)}`;
        if (max >= 999999) return `Above ${formatPrice(min)}`;
        return `${formatPrice(min)} - ${formatPrice(max)}`;
    }

    function formatPrice(price) {
        return price.toLocaleString() + ' LKR';
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ================================================
    // View Toggle (Grid/List)
    // ================================================
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            if (productGrid) {
                if (view === 'list') {
                    productGrid.classList.add('list-view');
                } else {
                    productGrid.classList.remove('list-view');
                }
            }
        });
    });

    // ================================================
    // Initialize
    // ================================================
    function initializeFilters() {
        applyFilters();
    }
    
    // Make initializeFilters available globally so it can be called after products load
    window.initializeFilters = initializeFilters;
});

// ================================================
// FAQ Accordion (Keep existing functionality)
// ================================================
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            if (answer) answer.classList.toggle('active');
            
            if (icon) {
                if (answer && answer.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            }
        });
    });
});
