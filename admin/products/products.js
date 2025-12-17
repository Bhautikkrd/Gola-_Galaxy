import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("products.js loaded");

const addBtn = document.getElementById("addBtn");
const statusMsg = document.getElementById("statusMsg");

const nameInput = document.getElementById("golaName");
const priceInput = document.getElementById("golaPrice");
const fileInput = document.getElementById("golaImage");

const productsRef = collection(db, "products");

// ---------------- ADD PRODUCT ----------------
addBtn.addEventListener("click", async () => {
  statusMsg.textContent = "Uploading...";
  statusMsg.style.color = "black";

  const name = nameInput.value.trim();
  const price = priceInput.value.trim();
  const file = fileInput.files[0];

  if (!name || !price || !file) {
    statusMsg.textContent = "❌ All fields required";
    statusMsg.style.color = "red";
    return;
  }

  try {
    // 1️⃣ Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gola_upload"); // MUST MATCH
    formData.append("folder", "golas");

    const uploadRes = await fetch(
      "https://api.cloudinary.com/v1_1/dydtmlbsm/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    if (!uploadRes.ok) throw new Error("Cloudinary upload failed");

    const uploadData = await uploadRes.json();

    // 2️⃣ Save to Firestore
    await addDoc(productsRef, {
      name,
      price: Number(price),
      image: uploadData.secure_url,
      createdAt: new Date()
    });

    statusMsg.textContent = "✅ Product added successfully!";
    statusMsg.style.color = "green";

    nameInput.value = "";
    priceInput.value = "";
    fileInput.value = "";

    loadProducts();
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "❌ Upload failed. Try again.";
    statusMsg.style.color = "red";
  }
});

// ---------------- LOAD PRODUCTS ----------------
async function loadProducts() {
  const list = document.getElementById("productsList");
  list.innerHTML = "";

  const snapshot = await getDocs(productsRef);
  snapshot.forEach(doc => {
    const p = doc.data();
    list.innerHTML += `
      <div class="product">
        <img src="${p.image}" width="80">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
      </div>
    `;
  });
}

loadProducts();
