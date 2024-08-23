// Initialize the page when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
});

// Initialize page elements and event listeners
function initializePage() {
    // Retrieve the logged-in user's name from local storage
    const userName = localStorage.getItem('loggedInUserName') || 'User';
    document.getElementById('userName').textContent = userName;

    // List of fruits with their prices
    const fruits = [
        { name: 'Apple', price: 1.2 },
        { name: 'Banana', price: 0.5 },
        { name: 'Cherry', price: 2.0 },
        { name: 'Date', price: 3.0 },
        { name: 'Elderberry', price: 1.5 },
        { name: 'Fig', price: 2.5 },
        { name: 'Grape', price: 1.0 },
        { name: 'Honeydew', price: 3.5 },
        { name: 'Kiwi', price: 1.8 },
        { name: 'Lemon', price: 0.7 }
    ];

    // Retrieve the cart from local storage or initialize it if it doesn't exist
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Render the list of fruits on the page
    renderFruits(fruits);

    // Update the cart modal with the current cart items
    updateCartModal(cart);

    // Add event listeners for various elements
    document.getElementById('cart').addEventListener('click', () => showCart());
    document.getElementById('cartCloseBtn').addEventListener('click', () => hideCart());
    document.getElementById('checkoutBtn').addEventListener('click', () => checkout(cart));
    document.getElementById('editInfo').addEventListener('click', () => window.location.href = 'register.html?edit=true');
    document.getElementById('logout').addEventListener('click', () => logout());
}

// Render the list of fruits and their add-to-cart buttons
function renderFruits(fruits) {
    const fruitList = document.getElementById('fruitList');
    fruitList.innerHTML = ''; // Clear existing fruit items

    fruits.forEach(fruit => {
        const fruitItem = document.createElement('div');
        fruitItem.className = 'fruit-item';
        fruitItem.innerHTML = `
            <h3>${fruit.name}</h3>
            <p>$${fruit.price.toFixed(2)}</p>
            <button onclick="addToCart('${fruit.name}', ${fruit.price})">Add to Cart</button>
        `;
        fruitList.appendChild(fruitItem);
    });
}

// Display a notification message to the user
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
}

// Add a fruit to the cart and update the cart modal
window.addToCart = function (fruitName, fruitPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (!cart[fruitName]) {
        cart[fruitName] = { price: fruitPrice, quantity: 0 };
    }
    cart[fruitName].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${fruitName} added to cart!`);
    updateCartModal(cart);
}

// Update the cart modal with the current cart items and total price
function updateCartModal(cart) {
    const cartDetails = document.getElementById('cartDetails');
    const totalPriceElem = document.getElementById('totalPrice');
    cartDetails.innerHTML = ''; // Clear existing cart details
    let totalPrice = 0;

    for (const [fruitName, { price, quantity }] of Object.entries(cart)) {
        const itemTotal = price * quantity;
        totalPrice += itemTotal;
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <p>${fruitName} - Quantity: ${quantity}, Price: $${price.toFixed(2)}, Total: $${itemTotal.toFixed(2)}
            <button onclick="decreaseQuantity('${fruitName}')">Remove 1</button></p>
        `;
        cartDetails.appendChild(cartItem);
    }

    totalPriceElem.textContent = totalPrice.toFixed(2);
}

// Remove one quantity of a fruit from the cart and update the modal
window.decreaseQuantity = function (fruitName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[fruitName]) {
        if (cart[fruitName].quantity > 1) {
            cart[fruitName].quantity -= 1;
        } else {
            delete cart[fruitName];
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartModal(cart);
    }
}

// Show the cart modal
function showCart() {
    document.getElementById('cartModal').style.display = 'block';
    updateCartModal(JSON.parse(localStorage.getItem('cart')) || {});
}

// Hide the cart modal
function hideCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Handle the checkout process by saving the cart to user orders
function checkout(cart) {
    const userEmail = localStorage.getItem('loggedInUserEmail');
    if (userEmail) {
        const userOrders = JSON.parse(localStorage.getItem('userOrders')) || {};
        userOrders[userEmail] = userOrders[userEmail] || [];
        userOrders[userEmail].push(cart);
        localStorage.setItem('userOrders', JSON.stringify(userOrders));
        localStorage.removeItem('cart');
        alert('Checkout successful! Your order has been saved.');
        hideCart();
    } else {
        alert('Please log in to checkout.');
    }
}

// Log out the user and redirect to the login page
function logout() {
    localStorage.removeItem('loggedInUserName');
    localStorage.removeItem('loggedInUserEmail');
    window.location.href = 'login.html';
}
    