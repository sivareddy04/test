document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables ---
    const cartIcon = document.querySelector('.cart-icon');
    const cartCountSpan = document.querySelector('.cart-icon span');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalSpan = document.getElementById('cartTotal');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const overlay = document.querySelector('.overlay');

    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card'); // All product cards

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const enquireNowButtons = document.querySelectorAll('.enquire-now-btn');
    const deliveryForm = document.getElementById('deliveryForm');
    const formMessage = document.getElementById('formMessage');

    let cart = []; // Array to store cart items

    // --- Utility Functions ---

    // Function to toggle overlay
    const toggleOverlay = (show) => {
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    };

    // Function to render cart items
    const renderCart = () => {
        cartItemsContainer.innerHTML = ''; // Clear previous items
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartCountSpan.textContent = '0';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <span class="item-price">₹ ${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
            cartCountSpan.textContent = cart.length; // Number of unique items in cart
        }

        cartTotalSpan.textContent = `₹ ${total.toFixed(2)}`;

        // Add event listeners for new cart item buttons
        cartItemsContainer.querySelectorAll('.cart-item-controls button').forEach(button => {
            button.addEventListener('click', handleCartItemQuantity);
        });
        cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    };

    // --- Event Listeners for Cart ---

    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        toggleOverlay(true);
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        toggleOverlay(false);
    });

    overlay.addEventListener('click', () => {
        // Close both cart and search if overlay is clicked
        cartSidebar.classList.remove('active');
        searchOverlay.classList.remove('active');
        toggleOverlay(false);
    });

    // --- Add to Cart Logic ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.name.replace(/\s+/g, '-').toLowerCase(); // Simple ID from name
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').dataset.price);
            const productImage = productCard.querySelector('img').src;

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            renderCart();
            // Optional: Show a small notification "Item added to cart!"
            alert(`${productName} added to cart!`);
        });
    });

    // Handle quantity changes in cart sidebar
    const handleCartItemQuantity = (e) => {
        const itemId = e.target.dataset.id;
        const action = e.target.dataset.action;
        const item = cart.find(i => i.id === itemId);

        if (item) {
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease') {
                item.quantity--;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== itemId); // Remove if quantity is 0 or less
                }
            }
            renderCart();
        }
    };

    // Remove item from cart
    const removeFromCart = (e) => {
        const itemId = e.target.dataset.id;
        cart = cart.filter(item => item.id !== itemId);
        renderCart();
    };

    // --- Enquire Now Logic ---
    enquireNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;

            // Pre-fill message in the contact form with enquiry details
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `Enquiry for: ${productName} (Price: ${productPrice}). Please provide more details or quantity needed.`;
                // Scroll to contact form
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                // Optional: Highlight the form
                formMessage.textContent = 'Please fill the form below with your enquiry details.';
                formMessage.className = 'form-message'; // Reset class
                formMessage.style.display = 'block';
            } else {
                alert(`You clicked "Enquire Now" for: ${productName} (${productPrice}). Please contact us directly at +91 98765 43210 or info@yourfarmeggs.in`);
            }
        });
    });


    // --- Delivery Form Submission ---
    deliveryForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission

        // In a real application, you would send this data to a server
        // using fetch() or XMLHttpRequest.
        const formData = new FormData(deliveryForm);
        const formValues = {};
        for (let [key, value] of formData.entries()) {
            formValues[key] = value;
        }

        console.log('Form Submitted (Client-Side Only):', formValues);

        // Display success message
        formMessage.textContent = 'Your order/enquiry has been submitted! We will contact you shortly.';
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        formMessage.style.display = 'block';

        // Clear the form after a short delay
        setTimeout(() => {
            deliveryForm.reset();
            formMessage.style.display = 'none';
        }, 5000); // Clear after 5 seconds
    });


    // --- Search Functionality ---

    searchIcon.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        toggleOverlay(true);
        searchInput.focus(); // Focus on input field
    });

    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        toggleOverlay(false);
        searchInput.value = ''; // Clear search input
        filterProducts(''); // Show all products again
    });

    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterProducts(searchTerm);
    });

    function filterProducts(searchTerm) {
        productCards.forEach(card => {
            const productName = card.dataset.name.toLowerCase();
            const productCategory = card.dataset.category.toLowerCase(); // Check category too for better search

            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                card.style.display = 'block'; // Show product
            } else {
                card.style.display = 'none'; // Hide product
            }
        });
    }

    // --- Initial Render ---
    renderCart(); // Initialize cart display on page load
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
        // Optionally close mobile nav if implemented
    });
});

// For the "View all products" link in the egg section
document.querySelector('.products-section .view-all .btn-link').addEventListener('click', function(e) {
    e.preventDefault();
    // This could ideally link to a separate 'all eggs' page,
    // but for this single page, it scrolls to the egg section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    alert('This "View all eggs" link would typically go to a dedicated egg products page in a multi-page site.');
});

// For the "Contact for Bulk Poultry" link in the poultry section
document.querySelector('.poultry-section .view-all .btn-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    // You could also pre-fill the message for bulk poultry here if needed
    const messageField = document.getElementById('message');
    if (messageField) {
        messageField.value = 'Bulk poultry enquiry. Please specify type and quantity of birds needed.';
        messageField.focus();
    }
});

// For the "Proceed to Checkout" button in the cart
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length > 0) {
        // Here you would redirect to a checkout page or trigger a more complex modal
        alert('Proceeding to Checkout! (This is a placeholder. In a real site, you would go to a checkout page)');
        // Close cart sidebar and overlay
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        // Optionally scroll to contact form if checkout means enquiry for now
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        // You might want to pre-fill the form with cart details
        const messageField = document.getElementById('message');
        if (messageField) {
            let cartSummary = cart.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ');
            messageField.value = `Order from cart: ${cartSummary}. Total: ${cartTotalSpan.textContent}. Please confirm delivery details.`;
            messageField.focus();
        }
    } else {
        alert('Your cart is empty. Please add items before checking out.');
    }
});