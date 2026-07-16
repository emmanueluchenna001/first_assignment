const products = document.querySelectorAll(".waffle");

const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const orderTotalEl = document.getElementById("orderTotal");
const proceedBtn = document.getElementById("proceed");

const modalOverlay = document.getElementById("modalOverlay");
const modalItemsEl = document.getElementById("modalItems");
const modalTotalEl = document.getElementById("modalTotal");
const startNewOrderBtn = document.getElementById("startNewOrder");

let cart = [];

function parsePrice(priceStr) {
    return parseFloat(priceStr.replace("$", ""));
}

function resetProductCard(product) {
    const addBtn = product.querySelector(".addtoCart");
    const quantityBox = product.querySelector(".quantityBox");
    const count = product.querySelector(".count");

    count.textContent = "0";
    addBtn.style.display = "";
    quantityBox.style.display = "none";
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);

    products.forEach(product => {
        const foodName = product.querySelector(".foodName").textContent;
        if (foodName === name) resetProductCard(product);
    });

    renderCart();
}

function renderCart() {
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="emptyCart">Your cart is empty</p>`;
        cartCountEl.textContent = 0;
        orderTotalEl.textContent = "$0.00";
        proceedBtn.disabled = true;
        return;
    }

    let totalCount = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const lineTotal = parsePrice(item.price) * item.quantity;
        totalCount += item.quantity;
        totalPrice += lineTotal;

        const row = document.createElement("div");
        row.classList.add("cartItemRow");
        row.innerHTML = `
            <div>
                <p class="cartItemName">${item.name}</p>
                <p class="cartItemMeta"><span class="cartItemQty">${item.quantity}x</span> @ ${item.price} <span class="cartItemLineTotal">$${lineTotal.toFixed(2)}</span></p>
            </div>
            <button class="removeItem" data-name="${item.name}">✕</button>
        `;
        cartItemsEl.appendChild(row);
    });

    cartCountEl.textContent = totalCount;
    orderTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
    proceedBtn.disabled = false;

    cartItemsEl.querySelectorAll(".removeItem").forEach(btn => {
        btn.addEventListener("click", () => removeFromCart(btn.dataset.name));
    });
}

products.forEach((product) => {
    const addBtn = product.querySelector(".addtoCart");
    const quantityBox = product.querySelector(".quantityBox");
    const minus = product.querySelector(".minus");
    const plus = product.querySelector(".plus");
    const count = product.querySelector(".count");

    const foodName = product.querySelector(".foodName").textContent;
    const foodPrice = product.querySelector(".price").textContent;
    const foodImg = product.querySelector(".img").src;
    let quantity = 0;

    addBtn.addEventListener("click", () => {
        quantity = 1;
        count.textContent = quantity;

        addBtn.style.display = "none";
        quantityBox.style.display = "flex";

        cart.push({
            name: foodName,
            price: foodPrice,
            quantity: quantity,
            img: foodImg
        });
        renderCart();
    });

    plus.addEventListener("click", () => {
        quantity++;
        count.textContent = quantity;

        const existingItem = cart.find(item => item.name === foodName);
        if (existingItem) existingItem.quantity = quantity;

        renderCart();
    });

    minus.addEventListener("click", () => {
        if (quantity === 0) return;

        quantity--;
        count.textContent = quantity;

        if (quantity === 0) {
            addBtn.style.display = "";
            quantityBox.style.display = "none";
            cart = cart.filter(item => item.name !== foodName);
        } else {
            const existingItem = cart.find(item => item.name === foodName);
            if (existingItem) existingItem.quantity = quantity;
        }

        renderCart();
    });
});

proceedBtn.addEventListener("click", () => {
    if (cart.length === 0) return;

    modalItemsEl.innerHTML = "";
    let orderTotal = 0;

    cart.forEach(item => {
        const lineTotal = parsePrice(item.price) * item.quantity;
        orderTotal += lineTotal;

        const row = document.createElement("div");
        row.classList.add("modalItemRow");
        row.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="modalItemImg">
            <div class="modalItemInfo">
                <p class="modalItemName">${item.name}</p>
                <p class="modalItemMeta"><span class="modalItemQty">${item.quantity}x</span> @ ${item.price}</p>
            </div>
            <p class="modalItemLineTotal">$${lineTotal.toFixed(2)}</p>
        `;
        modalItemsEl.appendChild(row);
    });

    modalTotalEl.textContent = `$${orderTotal.toFixed(2)}`;
    modalOverlay.classList.add("active");
});

startNewOrderBtn.addEventListener("click", () => {
    cart = [];
    products.forEach(resetProductCard);
    renderCart();
    modalOverlay.classList.remove("active");
});

renderCart();