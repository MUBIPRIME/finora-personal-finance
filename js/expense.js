import "./theme.js";

import { auth, db } from "../src/firebase/firebase-config.js";

import { onAuthStateChanged } from "firebase/auth";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";

import { showToast } from "./toast.js";

// ================================
// ELEMENTS
// ================================

const form =
document.getElementById("expenseForm");

const submitBtn =
document.querySelector(".submit-btn");

// ================================
// USER
// ================================

let currentUser = null;

// ================================
// CHECK LOGIN
// ================================

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href="login.html";

        return;

    }

    currentUser=user;

});

// ================================
// SAVE EXPENSE
// ================================

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    if(!currentUser){

        showToast(

            "Please Wait",

            "Loading your account...",

            "warning"

        );

        return;

    }

    submitBtn.disabled=true;

  submitBtn.innerHTML = `
<i class="fa-solid fa-spinner fa-spin"></i>
Saving...
`;

    try{

        const amount=Number(

            document.getElementById("amount").value

        );

        const category=

        document.getElementById("category").value;

        const description=

        document.getElementById("description").value;

        const date=

        document.getElementById("date").value;


        // ===========================
        // SAVE TRANSACTION
        // ===========================

        await addDoc(

            collection(

                db,

                "users",

                currentUser.uid,

                "transactions"

            ),

            {

                type:"expense",

                amount,

                category,

                description,

                date,

                createdAt:serverTimestamp()

            }

        );

        // ===========================
        // UPDATE TOTALS
        // ===========================

        const userRef=

        doc(

            db,

            "users",

            currentUser.uid

        );

        const userSnap=

        await getDoc(userRef);

        const data=

        userSnap.data();

        await updateDoc(

            userRef,

            {

                totalExpense:

                Number(data.totalExpense)+amount,

                totalSavings:

                Number(data.totalSavings)-amount

            }

        );

        showToast(

            "Expense Added",

            "Expense saved successfully.",

            "success"

        );

        form.reset();

    }

    catch(error){

        console.error(error);

        showToast(

            "Error",

            error.message,

            "error"

        );

    }

    finally{

        submitBtn.disabled=false;

        submitBtn.textContent="Save Expense";

    }

});