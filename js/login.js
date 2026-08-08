import "./theme.js";

import {
    loginUser
} from "./auth.js";

import {
    showToast
} from "./toast.js";

const form =
document.getElementById("loginForm");

const email =
document.getElementById("email");

const password =
document.getElementById("password");

const loginBtn =
document.getElementById("loginBtn");

const togglePassword =
document.getElementById("togglePassword");

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