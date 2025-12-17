alert("products.js loaded");

import { db } from "../firebase.js";


import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const addBtn = document.getElementById("addBtn");
const productList = document.getElementById("productList");

const CLOUD_NAME = "dydtmlbsm";
const UPLOAD_PRESET = "gola_products";

addBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const imageFile = document.getElementById("image").files[0];

  if (!name || !price || !imageFile) {
    alert("Please fill all fields");
    return;
  }

  try {
    // 🔼 1. Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error("Image upload failed");
    }

    // 🧾 2. Save product data to Firestore
    await addDoc(collection(db, "products"), {
      name: name,
      price: price,
      image: data.secure_url,
      createdAt: new Date()
    });

    alert("Gola added successfully 🧊");
    location.reload();

  } catch (err) {
    console.error(err);
    alert("Error adding product");
  }
});

// 🔽 Load products
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const p = doc.data();

    productList.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0">
        <img src="${p.image}" width="80" />
        <p><strong>${p.name}</strong></p>
        <p>₹${p.price}</p>
      </div>
    `;
  });
}

loadProducts();
