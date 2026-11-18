import { signup } from "../core/firebaseAuth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-body");

  if (!form) {
    console.log("Form not found ❌");
    return;
  }

  console.log("JS Loaded ✅");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submit triggered ✅");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      await signup(email, password);
      window.location.href = "landing_page.html";
    } catch (err) {
      console.error(err);
      alert("Signup failed ❌");
    }
  });
});