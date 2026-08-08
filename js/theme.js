import { auth, db } from "../src/firebase/firebase-config.js";

import { onAuthStateChanged } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

// ================================
// LOAD THEME IMMEDIATELY
// ================================

const savedTheme = localStorage.getItem("theme");

if(savedTheme){

    applyTheme(savedTheme);

}

// ================================
// APPLY THEME
// ================================

export function applyTheme(theme){

    if(theme === "dark"){

        document.documentElement.classList.add("dark");

    }

    else if(theme === "light"){

        document.documentElement.classList.remove("dark");

    }

    else{

        const prefersDark =

        window.matchMedia(

            "(prefers-color-scheme: dark)"

        ).matches;

        document.documentElement.classList.toggle(

            "dark",

            prefersDark

        );

    }

}

// ================================
// LOAD SAVED THEME
// ================================

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        return;

    }

    try{

        const settingsRef = doc(

            db,

            "users",

            user.uid,

            "preferences",

            "settings"

        );

        const settingsSnap = await getDoc(settingsRef);

        if(settingsSnap.exists()){

            applyTheme(

                settingsSnap.data().theme || "light"

            );

        }

    }

    catch(error){

        console.error(

            "Theme Error:",

            error

        );

    }

});