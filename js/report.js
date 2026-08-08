import "./theme.js";

import {
    auth,
    db
} from "../src/firebase/firebase-config.js";

import { showConfirm } from "./confirm-modal.js";
import { showToast } from "./toast.js";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    updateDoc,
    doc
} from "firebase/firestore";

// ================================
// ELEMENTS
// ================================

// ================================
// CONFIRM MODAL
// ================================

const confirmModal =
document.getElementById("confirmModal");

const confirmTitle =
document.getElementById("confirmTitle");

const confirmMessage =
document.getElementById("confirmMessage");

const confirmCancel =
document.getElementById("confirmCancel");

const confirmOk =
document.getElementById("confirmOk");

const table =
document.getElementById("transactionTable");

const searchInput =
document.getElementById("searchInput");

const filterType =
document.getElementById("filterType");

// ================================
// EDIT MODAL
// ================================

const modal =
document.getElementById("editModal");

const editAmount =
document.getElementById("editAmount");

const editCategory =
document.getElementById("editCategory");

const editDescription =
document.getElementById("editDescription");

const editDate =
document.getElementById("editDate");

const saveEdit =
document.getElementById("saveEdit");

const cancelEdit =
document.getElementById("cancelEdit");



// ================================
// VARIABLES
// ================================

let transactions = [];

let selectedId = null;

// ================================
// DELETE TRANSACTION
// ================================

async function deleteTransaction(id){

    const confirmed = await showConfirm(

        "Delete Transaction",

        "Are you sure you want to permanently delete this transaction?"

    );

    if(!confirmed){

        return;

    }

    try{

        await deleteDoc(

            doc(

                db,

                "users",

                auth.currentUser.uid,

                "transactions",

                id

            )

        );

        transactions = transactions.filter(

            item => item.id !== id

        );

        renderTransactions();

        showToast(

            "Deleted",

            "Transaction deleted successfully.",

            "success"

        );

    }

    catch(error){

        console.error(error);

        showToast(

            "Error",

            error.message,

            "error"

        );

    }

}

// ================================
// OPEN EDIT MODAL
// ================================

function openEditModal(id){

    const transaction =

    transactions.find(

        item => item.id === id

    );

    if(!transaction){

        return;

    }

    selectedId = id;

    editAmount.value =
    transaction.amount;

    editCategory.value =
    transaction.category;

    editDescription.value =
    transaction.description || "";

    editDate.value =
    transaction.date;

    modal.style.display = "flex";

}

// ================================
// CLOSE MODAL
// ================================

cancelEdit.addEventListener(

    "click",

    ()=>{

        modal.style.display="none";

    }

);
// ================================
// RENDER TRANSACTIONS
// ================================

function renderTransactions(){

    const search =
    searchInput.value.toLowerCase();

    const filter =
    filterType.value;

    table.innerHTML = "";

    const filtered = transactions.filter((item)=>{

        const matchSearch =

            item.category
            .toLowerCase()
            .includes(search)

            ||

            (item.description || "")
            .toLowerCase()
            .includes(search);

        const matchFilter =

            filter === "all"

            ||

            item.type === filter;

        return matchSearch && matchFilter;

    });

    if(filtered.length===0){

        table.innerHTML=`

        <tr>

            <td colspan="6">

                No matching transactions.

            </td>

        </tr>

        `;

        return;

    }

    filtered.forEach((item)=>{

        table.innerHTML += `

        <tr>

            <td>${item.date}</td>

            <td class="${item.type}">

                ${item.type.toUpperCase()}

            </td>

            <td>${item.category}</td>

            <td>${item.description || "-"}</td>

            <td>

                ₦${Number(item.amount).toLocaleString()}

            </td>

            <td>

                <button
                class="edit-btn"
                data-id="${item.id}">

                    ✏

                </button>

                <button
                class="delete-btn"
                data-id="${item.id}">

                    🗑

                </button>

            </td>

        </tr>

        `;

    });

    // ============================
    // DELETE BUTTONS
    // ============================

    document.querySelectorAll(".delete-btn")

    .forEach((button)=>{

        button.addEventListener(

            "click",

            ()=>{

                deleteTransaction(

                    button.dataset.id

                );

            }

        );

    });

    // ============================
    // EDIT BUTTONS
    // ============================

    document.querySelectorAll(".edit-btn")

    .forEach((button)=>{

        button.addEventListener(

            "click",

            ()=>{

                openEditModal(

                    button.dataset.id

                );

            }

        );

    });

}

// ================================
// SEARCH
// ================================

searchInput.addEventListener(

    "input",

    renderTransactions

);

// ================================
// FILTER
// ================================

filterType.addEventListener(

    "change",

    renderTransactions

);

// ================================
// SAVE EDIT
// ================================

saveEdit.addEventListener(

    "click",

    async()=>{

        if(!selectedId){

            return;

        }

        try{

            await updateDoc(

                doc(

                    db,

                    "users",

                    auth.currentUser.uid,

                    "transactions",

                    selectedId

                ),

                {

                    amount:Number(

                        editAmount.value

                    ),

                    category:
                    editCategory.value,

                    description:
                    editDescription.value,

                    date:
                    editDate.value

                }

            );

            const transaction =

            transactions.find(

                item=>item.id===selectedId

            );

            if(transaction){

                transaction.amount =
                Number(editAmount.value);

                transaction.category =
                editCategory.value;

                transaction.description =
                editDescription.value;

                transaction.date =
                editDate.value;

            }

            modal.style.display="none";

            renderTransactions();

        showToast(

    "Updated",

    "Transaction updated successfully.",

    "success"

);

        }

        catch(error){

            console.error(error);

            alert(error.message);

        }

    }

);

// ================================
// LOAD DATA FROM FIRESTORE
// ================================

onAuthStateChanged(

    auth,

    async(user)=>{

        if(!user){

            window.location.href="login.html";

            return;

        }

        try{

            const q = query(

                collection(

                    db,

                    "users",

                    user.uid,

                    "transactions"

                ),

                orderBy(

                    "createdAt",

                    "desc"

                )

            );

            const snapshot =

            await getDocs(q);

            transactions = [];

            snapshot.forEach((document)=>{

                transactions.push({

                    id:document.id,

                    ...document.data()

                });

            });

            renderTransactions();

        }

        catch(error){

            console.error(

                "Error loading transactions:",

                error

            );

          showToast(

    "Error",

    "Unable to load transactions.",

    "error"

);
        }

    }

);

// ================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ================================

window.addEventListener(

    "click",

    (event)=>{

        if(event.target===modal){

            modal.style.display="none";

        }

    }

);

// ================================
// ESC KEY CLOSES MODAL
// ================================

document.addEventListener(

    "keydown",

    (event)=>{

        if(event.key==="Escape"){

            modal.style.display="none";

        }

    }

);