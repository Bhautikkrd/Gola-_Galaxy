/* ================================================
   PRODUCT DATA
================================================ */

const items = [
    {name:"પ્લેન ડીશ ગોલા",price:99,type:"dish",img:""},

    {name:"સ્ટ્રોબેરી થી સ્ટાર્ટ",price:149,type:"dish",img:"image/1.png"},
    {name:"મેંગો ની મોજ",price:149,type:"dish",img:"image/2.png"},
    {name:"કાલાખટ્ટા ની કહેર",price:149,type:"dish",img:"image/3.png"},
    {name:"ઓરેન્જ નો આનંદ",price:149,type:"dish",img:"image/4.png"},
    {name:"રોજ ની રમઝટ",price:149,type:"dish",img:"image/5.png"},
    {name:"કાચીકેરી ની કમાલ",price:199,type:"dish",img:"image/6.png"},
    {name:"ચોકલેટ ના ચાહક",price:199,type:"dish",img:"image/7.png"},
    {name:"બ્લૂબેરી ની બબાલ",price:199,type:"dish",img:"image/8.png"},
    {name:"ચોકલેટ કેટબરી નો ચમત્કાર",price:299,type:"dish",img:"image/9.png"},
    {name:"પંચામૃત ની પસંદ",price:299,type:"dish",img:"image/10.png"},
    {name:"માવામલાઈ ની મહેક",price:299,type:"dish",img:"image/11.png"},
    {name:"રાજભોગ નું રજવાડું",price:399,type:"dish",img:"image/12.png"},
    {name:"સ્પેશિયલ કાનગોપી ની કહાની",price:499,type:"dish",img:"image/14.png"},

    // Stick gola
    {name:"સ્ટીક ગોલા (સ્ટ્રોબેરી)",price:60,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (મેંગો)",price:60,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (ઓરેન્જ)",price:60,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (કાલાખટ્ટા)",price:60,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (રોઝ)",price:60,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (બ્લૂબેરી)",price:60,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (કાચીકેરી)",price:60,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (રાજભોગ)",price:60,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (માવામલાઈ)",price:70,type:"stick",img:""},
    {name:"સ્ટીક ગોલા (ચોકલેટ)",price:70,type:"stick",img:""},
];

/* ================================================
   VARIABLES
================================================ */

let cart = [];
let searchTerm = "";
let currentCategory = "all";

let previewIndex = null;
let previewQty = 1;

/* ================================================
   RENDER GRID
================================================ */

function generateBillNumber() {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    // Load previous count from localStorage
    let count = localStorage.getItem("billCount-" + y + m + d);

    if (!count) count = 1;
    else count = Number(count) + 1;

    localStorage.setItem("billCount-" + y + m + d, count);

    return `GG-${y}${m}${d}-${String(count).padStart(3, "0")}`;
}


function renderGrid() {
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";

    items.filter(item => {
        if (currentCategory !== "all" && item.type !== currentCategory) return false;
        if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    })
    .forEach((item, idx) => {
        grid.innerHTML += `
            <div class="card">
                <div class="card-img">
                    ${item.img ? `<img src="${item.img}">` : `<img src="image/logo.png">`}
                </div>
                <h3>${item.name}</h3>
                <div class="price">₹${item.price}</div>

                <button class="btn" id="btn-${idx}" onclick="openPreview(${idx})">Add</button>
            </div>
        `;
    });


    /** Restore “✓ Added” state if item is already in cart */
    cart.forEach(c => {
        const btn = document.getElementById("btn-" + c.index);
        if (btn) {
            btn.classList.add("added");
            btn.innerText = "✓ Added";
        }
    });
}

/* ================================================
   CATEGORY
================================================ */

document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.tab;
        renderGrid();
    });
});

/* ================================================
   SEARCH
================================================ */

document.getElementById("searchInput").addEventListener("input", e => {
    searchTerm = e.target.value;
    renderGrid();
});

/* ================================================
   PREVIEW POPUP
================================================ */

function openPreview(i) {
    previewIndex = i;
    previewQty = 1;

    const item = items[i];

    document.getElementById("previewImg").src = item.img || "image/logo.png";
    document.getElementById("previewName").innerText = item.name;
    document.getElementById("previewPrice").innerText = "₹" + item.price;
    document.getElementById("previewQty").innerText = previewQty;

    document.querySelector(".preview-overlay").style.display = "block";
    const box = document.querySelector(".preview-box");
    box.style.display = "block";
    setTimeout(() => box.style.transform = "translate(-50%,-50%) scale(1)", 20);
}

function closePreview() {
    document.querySelector(".preview-overlay").style.display = "none";
    const box = document.querySelector(".preview-box");
    box.style.transform = "translate(-50%,-50%) scale(.8)";
    setTimeout(() => box.style.display = "none", 200);
}

function updatePreviewQty() {
    if (previewQty < 1) previewQty = 1;
    document.getElementById("previewQty").innerText = previewQty;
}

/* ================================================
   ADD TO CART + BUTTON ANIMATION
================================================ */

function confirmAddToCart() {
    const existing = cart.find(c => c.index === previewIndex);
    if (existing) existing.qty += previewQty;
    else cart.push({ index: previewIndex, qty: previewQty });

    closePreview();
    updateCart();

    // Button animation
    const addBtn = document.getElementById("btn-" + previewIndex);
    if (addBtn) {
        addBtn.classList.add("added");
        addBtn.innerText = "✓ Added";
    }
}

/* ================================================
   CART SYSTEM
================================================ */

function updateCart() {
    const bar = document.querySelector(".cart-bar");
    const barText = document.getElementById("cartText");
    const list = document.querySelector(".cart-items");
    const totalBox = document.querySelector(".cart-total");

    if (cart.length === 0) {
        bar.style.display = "none";
        document.body.classList.remove("cart-open");
        list.innerHTML = "";
        totalBox.innerHTML = "₹0";

        // Reset all Add buttons
        items.forEach((item, i) => {
            const btn = document.getElementById("btn-" + i);
            if (btn) {
                btn.classList.remove("added");
                btn.innerText = "Add";
            }
        });

        return;
    }

    bar.style.display = "block";

    let itemCount = 0;
    cart.forEach(c => itemCount += c.qty);

    barText.innerHTML = `🛒 View Cart (${itemCount})`;

    list.innerHTML = "";
    let total = 0;

    cart.forEach((c, idx) => {
        const item = items[c.index];
        const subtotal = item.price * c.qty;
        total += subtotal;

    list.innerHTML += `
    <div class="cart-item">

        <div class="item-left">
            <div class="item-number">${idx + 1}.</div>
            <div>
                <div class="item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price} × ${c.qty} = ₹${subtotal}</div>
            </div>
        </div>

        <div class="item-right">
            <button class="qty-round" onclick="changeQty(${idx},-1)">−</button>
            <span>${c.qty}</span>
            <button class="qty-round" onclick="changeQty(${idx},1)">+</button>
            <button class="remove-btn" onclick="removeItem(${idx})">×</button>
        </div>

    </div>
`;

    });

    totalBox.innerHTML = `🧾 Final Total: <span id="totalAmount">₹${total}</span>`;

}

function changeQty(i, delta) {
    cart[i].qty += delta;

    if (cart[i].qty <= 0) {
        cart.splice(i, 1);
    }

    updateCart();
}

function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
}

/* CART OPEN/CLOSE */

function openCart() { document.body.classList.add("cart-open"); }
function closeCart() { document.body.classList.remove("cart-open"); }



/* ================================================
   WHATSAPP CHECKOUT
================================================ */

const track = document.getElementById("sliderTrack");
const thumb = document.getElementById("slideThumb");
const progress = document.getElementById("slideProgress");
const slideText = document.getElementById("slideText");

let dragging = false;
let startX = 0;

function startDrag(e) {
    dragging = true;
    thumb.classList.add("dragging");
    startX = e.touches ? e.touches[0].clientX : e.clientX;
}

function drag(e) {
    if (!dragging) return;

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let dx = clientX - startX;

    let max = track.offsetWidth - thumb.offsetWidth;
    dx = Math.max(0, Math.min(dx, max));

    thumb.style.left = dx + "px";
    progress.style.width = (dx + thumb.offsetWidth / 2) + "px";

    let percent = dx / max;

if (percent >= 0.95) {   // 95% = must slide almost fully
    completeSlide();
    return;
}

}

function completeSlide() {
    dragging = false;

    track.classList.add("success");
    slideText.innerText = "Order Sent ✔";

    if (navigator.vibrate) navigator.vibrate(80);

    checkout(); // CALL YOUR WHATSAPP ORDER FUNCTION

    setTimeout(() => resetSlider(), 1500);
}

function stopDrag() {
    if (!dragging) return;
    dragging = false;
    resetSlider();
}

function resetSlider() {
    thumb.classList.remove("dragging");
    thumb.style.left = "0px";
    progress.style.width = "0%";
    slideText.innerText = "Slide to Order on WhatsApp";
    track.classList.remove("success");
}

/* Events */
thumb.addEventListener("mousedown", startDrag);
thumb.addEventListener("touchstart", startDrag);

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", drag);

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);


function checkout() {
    if (cart.length === 0) return;

   const billNo = generateBillNumber();
const customerName = document.getElementById("customerName").value.trim();

if (!customerName) {
    alert("Please enter customer name");
    return;
}

let msg = `✨ *GOLA GALAXY — PREMIUM ORDER BILL* ✨\n`;
msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
msg += `🧾 *Bill No:* ${billNo}\n`;
msg += `👤 *Customer:* ${customerName}\n`;
msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
msg += `🍧 *Your Order Details:* \n\n`;

let total = 0;

cart.forEach((c, i) => {
    const item = items[c.index];
    const amount = item.price * c.qty;
    total += amount;

    msg += `${i + 1}) *${item.name}*\n`;
    msg += `   ➜ Qty: *${c.qty}*   |   Amount: *₹${amount}*\n\n`;
});

// OPTIONAL DISCOUNT (remove if not needed)
let discount = 0;
// discount = Math.floor(total * 0.05); // example: 5% discount
let finalTotal = total - discount;

msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
msg += `💵 *Subtotal:* ₹${total}\n`;
if (discount > 0) {
    msg += `🏷️ *Discount:* -₹${discount}\n`;
}
msg += `💰 *FINAL TOTAL:* ₹${finalTotal}\n`;
msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;

// Notes
let notes = document.getElementById("notes").value;
if (notes) {
    msg += `📝 *Notes:* ${notes}\n`;
}

// Extra premium footer
msg += `⏱ *Prep Time:* 3–5 minutes\n`;
msg += `📍 *Gola Galaxy — Taste of the Stars*\n`;
msg += `✨ Thank you for your order! ✨\n`;
msg += `━━━━━━━━━━━━━━━━━━━━━━`;


    window.open("https://wa.me/917405824022?text=" + encodeURIComponent(msg));
}

/* ================================================
   DARK MODE
================================================ */

function toggleTheme() {
    document.body.classList.toggle("dark");
}

/* INIT */
renderGrid();
updateCart();
