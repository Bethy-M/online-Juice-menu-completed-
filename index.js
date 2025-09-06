const menuDiv = document.getElementById("menu");
const cartIcon = document.getElementById("bag");

let cart = [];
const discountCode = "FRESH10";


async function loadMenu() {
  try {
    const res = await fetch("https://render-express-deployment-98oj.onrender.com/menu");
    const menuItems = await res.json();
    menuDiv.innerHTML = "";

    menuItems.forEach((item) => {
      const card = document.createElement("div");
      card.className = "strawberry";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="ingredients">
          <h1>${item.name}</h1>
          <p>${item.ingredients.join(", ")}</p>
          <p class="price">${item.price}$</p>
          <button class="addcart">Add to cart</button>
        </div>
      `;

      card.querySelector(".addcart").addEventListener("click", () => {
        cart.push(item);
      });

      menuDiv.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load menu:", err);
    menuDiv.innerHTML = "<p style='color:red; text-align:center;'>⚠ Failed to load menu. Please try again later.</p>";
  }
}


function showCartPopup() {
  const existing = document.getElementById("cart-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "cart-popup";
  popup.style.position = "fixed";
  popup.style.top = "80px";
  popup.style.right = "30px";
  popup.style.width = "300px";
  popup.style.backgroundColor = "#fff";
  popup.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
  popup.style.padding = "20px";
  popup.style.zIndex = "999";
  popup.style.borderRadius = "12px";
  popup.style.maxHeight = "400px";
  popup.style.overflowY = "auto";

  if (cart.length === 0) {
    popup.innerHTML = "<p>Your cart is empty.</p>";
    document.body.appendChild(popup);
    return;
  }

  const list = document.createElement("ul");
  list.style.listStyle = "none";
  list.style.padding = "0";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.style.marginBottom = "8px";
    li.style.fontSize = "14px";
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button data-index="${index}" style="float:right;color:orange;background:none;border:none;cursor:pointer;">✖</button>
    `;
    list.appendChild(li);
  });

  let total = cart.reduce((sum, item) => sum + item.price, 0);
  const totalDisplay = document.createElement("p");
  totalDisplay.innerText = `Total: $${total.toFixed(2)}`;
  totalDisplay.style.marginTop = "10px";

  const discountInput = document.createElement("input");
  discountInput.placeholder = "Enter discount code";
  discountInput.style.width = "100%";
  discountInput.style.marginTop = "10px";
  discountInput.style.padding = "6px";
  discountInput.style.borderRadius = "4px";
  discountInput.style.border = "1px solid #ccc";

  const applyBtn = document.createElement("button");
  applyBtn.innerText = "Apply Discount";
  applyBtn.style.marginTop = "10px";
  applyBtn.style.width = "100%";
  applyBtn.style.cursor = "pointer";
  applyBtn.style.backgroundColor = "#efda7c";
  applyBtn.style.border = "none";
  applyBtn.style.padding = "8px";
  applyBtn.style.borderRadius = "6px";

  applyBtn.addEventListener("click", () => {
    const code = discountInput.value.trim().toUpperCase();
    if (code === discountCode) {
      total *= 0.9;
      totalDisplay.innerText = `Total (10% off): $${total.toFixed(2)}`;
    } else {
      alert("Invalid discount code!");
    }
  });

  const checkoutBtn = document.createElement("button");
  checkoutBtn.innerText = "Checkout";
  checkoutBtn.style.marginTop = "10px";
  checkoutBtn.style.width = "100%";
  checkoutBtn.style.cursor = "pointer";
  checkoutBtn.style.backgroundColor = "#4CAF50";
  checkoutBtn.style.color = "white";
  checkoutBtn.style.border = "none";
  checkoutBtn.style.padding = "8px";
  checkoutBtn.style.borderRadius = "6px";

  checkoutBtn.addEventListener("click", checkout);

  popup.appendChild(list);
  popup.appendChild(totalDisplay);
  popup.appendChild(discountInput);
  popup.appendChild(applyBtn);
  popup.appendChild(checkoutBtn);
  document.body.appendChild(popup);

  popup.querySelectorAll("button[data-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      cart.splice(index, 1);
      showCartPopup();
    });
  });
}


async function checkout() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  try {
    const res = await fetch("https://render-express-deployment-98oj.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total })
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Order placed successfully!");
      cart = [];
      showCartPopup();
    } else {
      alert("❌ Order failed. Try again.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("⚠ Failed to place order. Please try again later.");
  }
}


cartIcon.addEventListener("click", showCartPopup);
window.addEventListener("DOMContentLoaded", loadMenu);
