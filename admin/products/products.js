import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔗 Cloudinary config
const CLOUD_NAME = "dydtmlbsm";
const UPLOAD_PRESET = "gola_products_free";

// 🔘 Elements
const addBtn = document.getElementById("addBtn");
const productList = document.getElementById("productList");
const statusMsg = document.getElementById("statusMsg");

// ➕ Add Product
addBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const imageFile = document.getElementById("image").files[0];

  // Reset UI
  statusMsg.style.color = "green";
  statusMsg.textContent = "";

  if (!name || !price || !imageFile) {
    statusMsg.style.color = "red";
    statusMsg.textContent = "❌ Please fill all fields";
    return;
  }

  try {
    // Disable button
    addBtn.disabled = true;
    addBtn.textContent = "Uploading...";

    // 🟡 Uploading image
    statusMsg.textContent = "Uploading image to Cloudinary...";

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dydtmlbsm/auto/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    // 🟢 Saving product
    statusMsg.textContent = "Saving product...";

    await addDoc(collection(db, "products"), {
      name: name,
      price: price,
      image: data.secure_url,
      createdAt: new Date()
    });

    // ✅ Success
    statusMsg.textContent = "✅ Gola added successfully!";
    addBtn.disabled = false;
    addBtn.textContent = "Add Gola";

    // Reload to show new product
    setTimeout(() => {
      location.reload();
    }, 1000);

  } catch (err) {
    console.error(err);
    statusMsg.style.color = "red";
    statusMsg.textContent = "❌ Upload failed. Try again.";
    addBtn.disabled = false;
    addBtn.textContent = "Add Gola";
  }
});

// 📦 Load Products
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const p = doc.data();

    productList.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0; display:flex; gap:10px; align-items:center">
        <img src="${p.image}" width="80" height="80" style="object-fit:cover;border-radius:6px"/>
        <div>
          <p><strong>${p.name}</strong></p>
          <p>₹${p.price}</p>
        </div>
      </div>
    `;
  });
}

// Load on page open
loadProducts();
