document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position to account for sticky header
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // -20 for a little extra space

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Search Functionality ---
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const productCards = document.querySelectorAll('.product-card');

    searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        searchOverlay.classList.toggle('active');
        if (searchOverlay.classList.contains('active')) {
            searchInput.focus(); // Focus on the input when it opens
        } else {
            searchInput.value = ''; // Clear search when closing
            filterProducts(''); // Show all products
        }
    });

    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = ''; // Clear search when closing
        filterProducts(''); // Show all products
    });

    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterProducts(searchTerm);
    });

    function filterProducts(searchTerm) {
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDescription = card.querySelector('p').textContent.toLowerCase();
            const isVisible = productName.includes(searchTerm) || productDescription.includes(searchTerm);
            card.style.display = isVisible ? 'block' : 'none'; // Use 'block' or flex/grid display
        });
    }

    // --- Add to Cart Functionality (Basic, non-persistent) ---
    let cartCount = 0;
    const cartCountSpan = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Simple in-memory cart (resets on page refresh)
    let cartItems = [];

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.productName;
            const productPrice = parseFloat(button.dataset.price);

            // Check if it's an "Enquire Now" button for poultry
            if (button.classList.contains('enquire-btn')) {
                alert(`Thank you for your interest in ${productName}! Please contact us for details.`);
                // Optionally redirect to contact page or open a modal form
                window.location.href = '#contact';
                return; // Stop further cart logic for enquiry items
            }

            // For regular "Add to Cart" items (eggs)
            cartCount++;
            cartCountSpan.textContent = cartCount;
            alert(`${productName} added to cart!`); // Simple confirmation

            // Add item to in-memory cart array (for a more detailed cart later)
            cartItems.push({
                name: productName,
                price: productPrice,
                quantity: 1 // For this basic example, quantity is always 1 per click
            });

            console.log("Current Cart:", cartItems); // For debugging
        });
    });

    // --- Delivery Information Check ---
    const pincodeInput = document.getElementById('pincode-input');
    const checkDeliveryBtn = document.getElementById('check-delivery-btn');
    const deliveryResultDiv = document.getElementById('delivery-result');

    // Define supported pin codes for Vijayawada and nearby (example)
    const supportedPincodes = [
        '520001', // Buckinghampet
        '520002', // Gandhinagar
        '520003', // Durga Agraharam
        '520004', // Machavaram
        '520005', // Bhavanipuram
        '520006', // Satyanarayanapuram
        '520007', // Autonagar
        '520008', // Kothapeta
        '520010', // Ajit Singh Nagar
        '520011', // Payakapuram
        '521108', // Gannavaram (nearby)
        '522235'  // Guntur (nearby, example)
    ];

    checkDeliveryBtn.addEventListener('click', () => {
        const enteredPincode = pincodeInput.value.trim();

        // Basic validation for 6-digit number
        if (!/^\d{6}$/.test(enteredPincode)) {
            deliveryResultDiv.textContent = 'Please enter a valid 6-digit Pin Code.';
            deliveryResultDiv.className = 'delivery-result not-available';
            return;
        }

        if (supportedPincodes.includes(enteredPincode)) {
            deliveryResultDiv.textContent = `Delivery available for ${enteredPincode}! Estimated delivery: 1-2 business days.`;
            deliveryResultDiv.className = 'delivery-result available';
        } else {
            deliveryResultDiv.textContent = `Currently, we do not deliver to ${enteredPincode}. Please contact us for bulk orders.`;
            deliveryResultDiv.className = 'delivery-result not-available';
        }
    });
});