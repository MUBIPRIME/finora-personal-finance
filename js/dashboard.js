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
    query,
    orderBy,
    limit
} from "firebase/firestore";

// ================================
// ELEMENTS
// ================================

const username =
document.getElementById("username");

const balance =
document.getElementById("balance");

const income =
document.getElementById("income");

const expense =
document.getElementById("expense");

const savings =
document.getElementById("savings");

const transactionList =
document.getElementById("transactionList");

const menuToggle = document.getElementById("menuToggle");

const sidebar = document.querySelector(".sidebar");

const sidebarOverlay = document.getElementById("sidebarOverlay");

// ================================
// ANIMATE NUMBERS
// ================================

function animateValue(

    element,

    start,

    end,

    duration = 1000

){

    let startTime = null;

    function animation(currentTime){

        if(!startTime){

            startTime = currentTime;

        }

        const progress = Math.min(

            (currentTime - startTime) / duration,

            1

        );

        const value = Math.floor(

            progress * (end - start) + start

        );

        element.textContent =

        `₦${value.toLocaleString()}`;

        if(progress < 1){

            requestAnimationFrame(animation);

        }

    }

    requestAnimationFrame(animation);

}

// ================================
// LOAD DASHBOARD
// ================================

onAuthStateChanged(

    auth,

    async(user)=>{

        if(!user){

            window.location.href = "login.html";

            return;

        }

        username.textContent =

        user.displayName ||

        user.email;

        balance.textContent = "Loading...";
        income.textContent = "Loading...";
        expense.textContent = "Loading...";
        savings.textContent = "Loading...";

        transactionList.innerHTML =

        "Loading...";

        try{

            // ================================
            // GET ALL TRANSACTIONS
            // ================================

            const allSnapshot =

            await getDocs(

                collection(

                    db,

                    "users",

                    user.uid,

                    "transactions"

                )

            );

            let totalIncome = 0;

            let totalExpense = 0;

            allSnapshot.forEach((doc)=>{

                const data = doc.data();

                if(data.type === "income"){

                    totalIncome +=

                    Number(data.amount);

                }

                else if(data.type === "expense"){

                    totalExpense +=

                    Number(data.amount);

                }

            });

            const totalSavings =

            totalIncome - totalExpense;

            animateValue(

                income,

                0,

                totalIncome

            );

            animateValue(

                expense,

                0,

                totalExpense

            );

            animateValue(

                savings,

                0,

                totalSavings

            );

            animateValue(

                balance,

                0,

                totalSavings

            );

            // ================================
            // RECENT TRANSACTIONS
            // ================================

            const recentQuery =

            query(

                collection(

                    db,

                    "users",

                    user.uid,

                    "transactions"

                ),

                orderBy(

                    "createdAt",

                    "desc"

                ),

                limit(5)

            );

            const recentSnapshot =

            await getDocs(

                recentQuery

            );

            transactionList.innerHTML = "";

            if(recentSnapshot.empty){

                transactionList.innerHTML =

                "<p>No transactions yet.</p>";

            }

            else{

                recentSnapshot.forEach((doc)=>{

                    const item = doc.data();

                    transactionList.innerHTML += `

                    <div class="transaction-item">

                        <div class="transaction-left">

                            <div class="transaction-icon">

                                ${item.type === "income" ? "💰" : "💸"}

                            </div>

                            <div>

                                <h4>${item.category}</h4>

                                <p>${item.description || "No description"}</p>

                            </div>

                        </div>

                        <div class="transaction-right">

                            <span class="${item.type}">

                                ${item.type === "income" ? "+" : "-"}₦${Number(item.amount).toLocaleString()}

                            </span>

                        </div>

                    </div>

                    `;

                });

            }

        }

        catch(error){

            console.error(error);

            balance.textContent = "Error";

            income.textContent = "Error";

            expense.textContent = "Error";

            savings.textContent = "Error";

            transactionList.innerHTML =

            "<p>Unable to load transactions.</p>";

        }

    }

);

// ================================
// MOBILE SIDEBAR
// ================================

menuToggle.addEventListener("click", () => {

    sidebar.classList.add("show");

    sidebarOverlay.classList.add("show");

});

sidebarOverlay.addEventListener("click", () => {

    sidebar.classList.remove("show");

    sidebarOverlay.classList.remove("show");

});