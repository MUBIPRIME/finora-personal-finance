import "./theme.js";

import {
    loginUser,
    resetPassword
} from "./auth.js";

import {
    showToast
} from "./toast.js";

import {
    validateEmail
} from "./validation.js";

const form =
document.getElementById("loginForm");

const email =
document.getElementById("email");

const password =
document.getElementById("password");

const loginBtn =
document.getElementById("loginBtn");

const forgotPassword =
document.getElementById("forgotPassword");

const togglePassword =
document.getElementById("togglePassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", async (e) => {
        e.preventDefault();

        const emailValue = email.value.trim();
        const validationError = validateEmail(emailValue);

        if (validationError) {
            showToast(validationError, "error");
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

        const result = await resetPassword(emailValue);

        loginBtn.disabled = false;
        loginBtn.innerHTML = "Sign In";

        if (result.success) {
            showToast(result.message, "success");
        } else {
            showToast(result.message, "error");
        }
    });
}

// =======================
// PASSWORD TOGGLE
// =======================

togglePassword.addEventListener("click", () => {

    if(password.type==="password"){

        password.type="text";

        togglePassword.innerHTML=
        '<i class="fa-solid fa-eye-slash"></i>';

    }

    else{

        password.type="password";

        togglePassword.innerHTML=
        '<i class="fa-solid fa-eye"></i>';

    }

});

// =======================
// LOGIN
// =======================

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    loginBtn.disabled=true;

    loginBtn.innerHTML=
    `<i class="fa-solid fa-spinner fa-spin"></i> Signing In`;

    const result=
    await loginUser(

        email.value,

        password.value

    );

    loginBtn.disabled=false;

    loginBtn.innerHTML="Sign In";

    if(result.success){

        showToast("Login Successful");

        setTimeout(()=>{

            window.location.href="dashboard.html";

        },1500);

    }

    else{

        showToast(result.message,"error");

    }

});