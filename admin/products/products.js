import { db, storage } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const addBtn = document.getElementById("addBtn");
const productList = document.getElementById("productList");

addBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const imageFile = document.getElementById("image").files[0];

  if (!name || !price || !imageFile) {
    alert("Please fill all fields");
    return;
  }

  try {
    // 1️⃣ Upload image to Firebase Storage
    const imageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageURL = await getDownloadURL(imageRef);

    // 2️⃣ Save product data to Firestore
    await addDoc(collection(db, "products"), {
      name: name,
      price: price,
      image: imageURL,
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
    const data = doc.data();

    productList.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0">
        <img src="${data.image}" width="80" />
        <p><strong>${data.name}</strong></p>
        <p>₹${data.price}</p>
      </div>
    `;
  });
}

loadProducts();
