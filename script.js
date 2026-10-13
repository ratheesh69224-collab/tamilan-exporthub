
"use strict";

// Shop WhatsApp number: replace with your real number
const SHOP_WHATSAPP = "919876543210";

// Product prices per kg
const PRODUCTS = {
    "Turmeric": 100,
    "Black Pepper": 250,
    "Cardamom": 400,
    "Rice": 60
};

let cart = [];

// ADD TO CART BUTTONS
document.querySelectorAll(".add-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const qtyId = button.dataset.qty;
        const qtyInput = document.getElementById(qtyId);

        if (!qtyInput) {
            alert("Quantity input not found: " + qtyId);
            return;
        }

        const quantity = Number(qtyInput.value);

        if (!Number.isInteger(quantity) ||
            quantity < 1 || quantity > 1000) {
            alert("Enter quantity between 1 and 1000 kg.");
            return;
        }

        if (!Object.hasOwn(PRODUCTS, name) ||
            PRODUCTS[name] !== price) {
            alert("Product information is incorrect.");
            return;
        }

        const existing = cart.find(item => item.name === name);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        updateCart();
        alert(name + " added to cart!");
    });
});

// UPDATE CART DISPLAY AND TOTAL
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartCount || !cartTotal) {
        console.error("Check cartItems, cart-count and cartTotal IDs in HTML.");
        return;
    }

    cartItems.replaceChildren();

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }

    cart.forEach(function (item) {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        count += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-row";

        const details = document.createElement("span");
        details.textContent =
            item.name + " — " + item.quantity + " kg — ₹" + subtotal;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            cart = cart.filter(product => product.name !== item.name);
            updateCart();
        });

        row.append(details, removeButton);
        cartItems.appendChild(row);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toFixed(2);
}

// CLEAR CART
const clearButton = document.getElementById("clearCart");

if (clearButton) {
    clearButton.addEventListener("click", function () {
        cart = [];
        updateCart();
    });
}

// WHATSAPP CHECKOUT
const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const address = document.getElementById("customerAddress").value.trim();

        if (cart.length === 0) {
            alert("Please add products to your cart first.");
            return;
        }

        if (!name || !phone || !address) {
            alert("Please fill in all customer details.");
            return;
        }

        if (!/^\d{10,15}$/.test(SHOP_WHATSAPP) ||
            SHOP_WHATSAPP === "919876543210") {
            alert("Enter your shop WhatsApp number in script.js.");
            return;
        }

        let total = 0;
        let message = "NEW ORDER - TAMILAN EXPORT HUB\n\n";
        message += "Customer: " + name + "\n";
        message += "Phone: " + phone + "\n";
        message += "Address: " + address + "\n\n";
        message += "ORDER DETAILS:\n";

        cart.forEach(function (item) {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            message += item.name + " - " + item.quantity +
                " kg × ₹" + item.price + " = ₹" + subtotal + "\n";
        });

        message += "\nTotal: ₹" + total.toFixed(2);
        message += "\nPlease confirm availability and delivery charges.";

        const url = "https://wa.me/" + SHOP_WHATSAPP +
            "?text=" + encodeURIComponent(message);

        window.open(url, "_blank");
    });
}

// INITIAL CART DISPLAY
updateCart();
