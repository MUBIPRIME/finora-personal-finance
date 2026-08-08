import "./theme.js";

import {
    auth,
    db
} from "../src/firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    collection,
    getDocs,
    getDoc,
    setDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";

import {
    showToast
} from "./toast.js";

// ================================
// ELEMENTS
// ================================

const form =
document.getElementById("budgetForm");

const overview =
document.getElementById("budgetOverview");

const submitBtn =
form.querySelector(".submit-btn");

// ================================
// CATEGORIES
// ================================

const categories = [

    "Food",

    "Transport",

    "Shopping",

    "Bills",

    "Entertainment",

    "Health",

    "Education",

    "Other"

];

let currentUser = null;
// ================================
// LOAD USER
// ================================

onAuthStateChanged(

    auth,

    async(user)=>{

        if(!user){

            window.location.href="login.html";

            return;

        }

        currentUser=user;

        await loadBudgets();

        await loadOverview();

    }

);

// ================================
// SAVE BUDGETS
// ================================

form.addEventListener(

    "submit",

    async(e)=>{

        e.preventDefault();

        submitBtn.disabled=true;

        submitBtn.innerHTML=

        '<i class="fa-solid fa-spinner fa-spin"></i> Saving Budgets...';

        try{

            const budgetData={};

            categories.forEach(category=>{

                budgetData[category]=

                Number(

                    document.getElementById(category).value

                )||0;

            });

            budgetData.createdAt=

            serverTimestamp();

            await setDoc(

                doc(

                    db,

                    "users",

                    currentUser.uid,

                    "budgets",

                    "monthly"

                ),

                budgetData

            );

            showToast(

                "Budget Saved",

                "Monthly budgets updated successfully.",

                "success"

            );

            await loadOverview();

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

            submitBtn.innerHTML="Save Budgets";

        }

    }

);
// ================================
// LOAD SAVED BUDGETS
// ================================

async function loadBudgets(){

    try{

        const budgetRef = doc(

            db,

            "users",

            currentUser.uid,

            "budgets",

            "monthly"

        );

        const budgetSnap = await getDoc(

            budgetRef

        );

        if(!budgetSnap.exists()){

            return;

        }

        const data = budgetSnap.data();

        categories.forEach(category=>{

            document.getElementById(category).value =

            data[category] || "";

        });

    }

    catch(error){

        console.error(

            "Error loading budgets:",

            error

        );

    }

}

// ================================
// LOAD BUDGET OVERVIEW
// ================================

async function loadOverview(){

    overview.innerHTML =

    "<p>Loading budget overview...</p>";

    try{

        // Load budgets

        const budgetRef = doc(

            db,

            "users",

            currentUser.uid,

            "budgets",

            "monthly"

        );

        const budgetSnap =

        await getDoc(budgetRef);

        const budgets =

        budgetSnap.exists()

        ? budgetSnap.data()

        : {};

        // Load transactions

        const transactionSnap =

        await getDocs(

            collection(

                db,

                "users",

                currentUser.uid,

                "transactions"

            )

        );

        const spent = {};

        categories.forEach(category=>{

            spent[category]=0;

        });

        transactionSnap.forEach(document=>{

            const data = document.data();

            if(

                data.type==="expense"

                &&

                spent[data.category]!==undefined

            ){

                spent[data.category]+=

                Number(data.amount);

            }

        });

        renderOverview(

            budgets,

            spent

        );

    }

    catch(error){

        console.error(error);

    }

}
// ================================
// RENDER BUDGET OVERVIEW
// ================================

function renderOverview(budgets, spent){

    overview.innerHTML="";

    categories.forEach(category=>{

        const budget=

        Number(budgets[category])||0;

        const spentAmount=

        Number(spent[category])||0;

        const remaining=

        budget-spentAmount;

        const percentage=

        budget===0

        ?0

        :Math.min(

            (spentAmount/budget)*100,

            100

        );

        let statusClass="good";

        let statusText="🟢 On Track";

        if(budget===0){

            statusClass="warning";

            statusText="⚪ No Budget";

        }

        else if(percentage>=100){

            statusClass="danger";

            statusText="🔴 Budget Exceeded";

        }

        else if(percentage>=80){

            statusClass="warning";

            statusText="🟠 Almost Full";

        }

        const card=document.createElement("div");

        card.className="budget-item";

        card.innerHTML=`

        <h3>

            ${getCategoryIcon(category)}

            ${category}

        </h3>

        <div class="budget-row">

            <span>Budget</span>

            <strong>

                ₦${budget.toLocaleString()}

            </strong>

        </div>

        <div class="budget-row">

            <span>Spent</span>

            <strong>

                ₦${spentAmount.toLocaleString()}

            </strong>

        </div>

        <div class="budget-row">

            <span>Remaining</span>

            <strong>

                ₦${remaining.toLocaleString()}

            </strong>

        </div>

        <div class="progress">

            <div

                class="progress-bar"

                style="width:${percentage}%">

            </div>

        </div>

        <div class="budget-row">

            <span>${percentage.toFixed(0)}%</span>

            <span

                class="status ${statusClass}">

                ${statusText}

            </span>

        </div>

        `;

        overview.appendChild(card);

    });

}

// ================================
// CATEGORY ICONS
// ================================

function getCategoryIcon(category){

    switch(category){

        case "Food":

            return "🍔";

        case "Transport":

            return "🚌";

        case "Shopping":

            return "🛍";

        case "Bills":

            return "💡";

        case "Entertainment":

            return "🎬";

        case "Health":

            return "🏥";

        case "Education":

            return "📚";

        default:

            return "📦";

    }

}