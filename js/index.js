const PRODUCTS_URL = 'http://localhost:3000/products';
const CART_URL = 'http://localhost:3000/cart';

let productsList = [];
let cartList = [];

document.addEventListener("DOMContentLoaded", async function () {
    await showProducts();
});

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) 
            throw new Error("Some Internal Error Occurred");
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        alert(error.message);
    }
}

async function showProducts() {
    productsList = await fetchData(PRODUCTS_URL) || [];
    displayProducts(productsList);
}

function displayProducts(products) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    products.forEach(product => {
        const productCard = `
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <img src="${product.image}" alt="${product.name}" class="card-img-top">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Rating: ${product.rating}</small>
                            <small class="text-muted">Price: ₹ ${product.price}</small>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="addToCart(${product.id})">Add to cart</button>
                    </div>
                </div>
            </div>
        `;
        content.insertAdjacentHTML('beforeend', productCard);
    });
}

async function addToCart(productId) {
    console.log('Adding product to cart:', productId);
console.log(`ProductList :` ,productsList);
    const product = productsList.find(p => p.id == productId);
    console.log('Found product:', product);

    if (!product) {
        console.log('Product not found or invalid productId:', productId);
        return;
    }

    try {
        const cartItems = await fetchData(CART_URL) || [];
        console.log('Current cart items:', cartItems);

        const isInCart = cartItems.some(item => item.id == productId);
        console.log('Is product already in cart?', isInCart);

        if (isInCart) {
            alert(`${product.name} is already in your cart.`);
            return;
        }

        const response = await fetch(CART_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        const responseData = await response.json();
        console.log('Response from server:', responseData);

        alert(`${product.name} has been added to your cart.`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart.');
    }
}


async function showCart() {
    cartList = await fetchData(CART_URL) || [];
    displayCart(cartList);
}

function displayCart(cartItems) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    if (cartItems.length === 0) {
        content.innerHTML = '<h6>Your cart is empty!</h6>';
        return;
    }
    cartItems.forEach(product => {
        const cartItem = `
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <img src="${product.image}" alt="${product.name}" class="card-img-top">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Rating: ${product.rating}</small>
                            <small class="text-muted">Price: ₹ ${product.price}</small>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${product.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
        content.insertAdjacentHTML('beforeend', cartItem);
    });
}

async function removeFromCart(productId) {
    try {
        await fetch(`${CART_URL}/${productId}`, {
            method: 'DELETE',
        });
        alert('Product has been removed from your cart.');
        showCart();
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Failed to remove product from cart.');
    }
}

async function searchProduct(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = productsList.filter(product =>
        product.name.toLowerCase().includes(searchInput)
    );
    displayProducts(filteredProducts);
}

document.querySelector('form').addEventListener('submit', searchProduct);
