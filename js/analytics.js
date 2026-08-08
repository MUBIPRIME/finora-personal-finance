import Chart from "chart.js/auto";

import {
    auth,
    db
} from "../src/firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    collection,
    getDocs
} from "firebase/firestore";

const incomeCanvas =
document.getElementById("incomeChart");

const categoryCanvas =
document.getElementById("categoryChart");

let incomeChart;
let categoryChart;

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href="login.html";

        return;

    }

    const snapshot = await getDocs(

        collection(
            db,
            "users",
            user.uid,
            "transactions"
        )

    );

    const transactions=[];

    snapshot.forEach((doc)=>{

        transactions.push(doc.data());

    });

    buildCharts(transactions);

});

function buildCharts(transactions){

    let income=0;

    let expense=0;

    const categories={};

    transactions.forEach((item)=>{

        if(item.type==="income"){

            income+=Number(item.amount);

        }

        else{

            expense+=Number(item.amount);

            categories[item.category]=

            (categories[item.category]||0)

            +

            Number(item.amount);

        }

    });

    if(incomeChart){

        incomeChart.destroy();

    }

    incomeChart=new Chart(

        incomeCanvas,

        {

            type:"bar",

            data:{

                labels:[

                    "Income",

                    "Expenses"

                ],

                datasets:[{

                    label:"₦",

                    data:[

                        income,

                        expense

                    ]

                }]

            }

        }

    );

    if(categoryChart){

        categoryChart.destroy();

    }

    categoryChart=new Chart(

        categoryCanvas,

        {

            type:"pie",

            data:{

                labels:

                Object.keys(categories),

                datasets:[{

                    data:

                    Object.values(categories)

                }]

            }

        }

    );

}