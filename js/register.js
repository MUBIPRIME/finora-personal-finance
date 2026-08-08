import "./theme.js";

import {
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateTerms
} from "./validation.js";

import { showToast } from "./toast.js";

import { registerUser } from "./auth.js";

// ================================
// ELEMENTS
// ================================

const form = document.getElementById("registerForm");

const fullName = document.getElementById("fullName");

const email = document.getElementById("email");

const password = document.getElementById("password");

const confirmPassword =
document.getElementById("confirmPassword");

const terms =
document.getElementById("terms");

const registerBtn =
document.getElementById("registerBtn");

const strengthFill =
document.getElementById("strengthFill");

const strengthText =
document.getElementById("strengthText");

password.addEventListener("input", () => {

    const value = password.value;

    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 2) {

        strengthFill.style.width = "33%";
        strengthFill.style.background = "#ef4444";
        strengthText.textContent = "Weak Password";

    }

    else if (score <= 4) {

        strengthFill.style.width = "66%";
        strengthFill.style.background = "#f59e0b";
        strengthText.textContent = "Medium Password";

    }

    else {

        strengthFill.style.width = "100%";
        strengthFill.style.background = "#22c55e";
        strengthText.textContent = "Strong Password";

    }

});

// ================================
// PASSWORD TOGGLE
// ================================

const togglePassword =
document.getElementById("togglePassword");

const toggleConfirmPassword =
document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";

        toggleConfirmPassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        confirmPassword.type = "password";

        toggleConfirmPassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

// ================================
// LOADING BUTTON
// ================================

function setLoading(isLoading) {

    if (isLoading) {

        registerBtn.disabled = true;

        registerBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Creating Account...
        `;

    } else {

        registerBtn.disabled = false;

        registerBtn.innerHTML = `
            Create Account
        `;

    }

}

// ================================
// REGISTER
// ================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    let error = "";

    error = validateName(fullName.value);

    if (error) {

        showToast(error, "error");

        return;

    }

    error = validateEmail(email.value);

    if (error) {

        showToast(error, "error");

        return;

    }

    error = validatePassword(password.value);

    if (error) {

        showToast(error, "error");

        return;

    }

    error = validateConfirmPassword(

        password.value,

        confirmPassword.value

    );

    if (error) {

        showToast(error, "error");

        return;

    }

    error = validateTerms(terms.checked);

    if (error) {

        showToast(error, "error");

        return;

    }

    setLoading(true);

    const result = await registerUser(

        fullName.value,

        email.value,

        password.value

    );

    setLoading(false);

    if (result.success) {

        showToast(result.message);

        setTimeout(() => {

            window.location.href = "login.html";

        }, 2500);

    }

    else {

        showToast(result.message, "error");

    }

});