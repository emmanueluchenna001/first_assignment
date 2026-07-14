const products = document.querySelectorAll(".waffle");

let cart = [];

products.forEach((product) =>{
    const addBtn = product.querySelector(".addtoCart");
    const quantityBox = product.querySelector(".quantityBox");
    const minus = product.querySelector(".minus");
    const plus = product.querySelector(".plus");
    const count = product.querySelector(".count");

    const foodName = product.querySelector(".foodName").textContent;
    const foodPrice = product.querySelector(".price").textContent;
    let quantity = 0;

    // console.log(addBtn)
    addBtn.addEventListener("click", () => {
        quantity = 1;
        count.textContent = quantity;

        addBtn.style.display = "none";
        quantityBox.style.display = "flex";

        const existingItem = cart.find(item => item.name === foodName);
        if (existingItem){
            existingItem.quantity++;
        } else {
            cart.push({
                name:foodName,
                price: foodPrice,
                quantity: 1
            });
        }
        renderCart();

        console.log(cart);
    });

    plus.addEventListener("click", () =>{
        quantity++;
        count.textContent = quantity;

        const existingItem = cart.find(item => item.name === foodName);
        if(existingItem){
            existingItem.quantity = quantity;
        }
        renderCart();
    });

    minus.addEventListener("click", () =>{
        if(quantity > 0){
            quantity--;
            count.textContent = quantity;

            const existingItem = cart.find(item => item.name === foodName);
            if (existingItem){
                existingItem.quantity = quantity;
            }
            renderCart();
        }
    });

});

const orderTotal = document.getElementById("orderTotal")
const cartItems = document.getElementById("cartItems");
function renderCart(){
    cartItems.innerHTML = "";
    cart.forEach((item) => {
        const price = Number(item.price.replace("$", ""));
        const total = price * item.quantity;

        
        
        cartItems.innerHTML += `
        <div class="cart-item">
            <p>${item.name}</p>
            <span>${item.quantity}x</span>
            <span>@ $${price.toFixed(2)}</span>
            <strong>$${total.toFixed(2)}</strong>
            <hr>
        </div>
        `;
    });
    let totalPrice = cart.reduce((total, item) =>{
        const price = Number(item.price.replace("$", ""));
        return total + (price * item.quantity);
    }, 0);
    
    orderTotal.textContent = `$${totalPrice.toFixed(2)}`;
}