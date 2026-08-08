import "./theme.js";

import { auth, db } from "../src/firebase/firebase-config.js";

import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { showToast } from "./toast.js";

import { applyTheme } from "./theme.js";

// ================================
// ELEMENTS
// ================================

const displayName = document.getElementById("displayName");

const email = document.getElementById("email");

const theme = document.getElementById("theme");

const currency = document.getElementById("currency");

const language = document.getElementById("language");

const logoutBtn = document.getElementById("logoutBtn");

const deleteAccountBtn = document.getElementById("deleteAccountBtn");

const changePassword = document.getElementById("changePassword");

const saveSettingsBtn = document.getElementById("saveSettingsBtn");

const settingsStatus = document.getElementById("settingsStatus");

// ================================
// VARIABLES
// ================================

let currentUser = null;

// ================================
// CHECK LOGIN
// ================================

onAuthStateChanged(
  auth,

  async (user) => {
    if (!user) {
      window.location.href = "login.html";

      return;
    }

    currentUser = user;

    displayName.textContent = user.displayName || "Finora User";

    email.textContent = user.email;

    await loadSettings();
  },
);
// ================================
// LOAD SETTINGS
// ================================

async function loadSettings() {
  try {
    const settingsRef = doc(
      db,

      "users",

      currentUser.uid,

      "preferences",

      "settings",
    );

    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      return;
    }

    const data = settingsSnap.data();

    theme.value = data.theme || "light";

applyTheme(data.theme || "light");

    currency.value = data.currency || "NGN";

    language.value = data.language || "English";
  } catch (error) {
    console.error(error);
  }
}

// ================================
// UNSAVED CHANGES
// ================================

function enableSave() {
  saveSettingsBtn.disabled = false;

  settingsStatus.textContent = "You have unsaved changes.";
}

theme.addEventListener(
  "change",

  enableSave,
);

currency.addEventListener(
  "change",

  enableSave,
);

language.addEventListener(
  "change",

  enableSave,
);
// ================================
// SAVE SETTINGS
// ================================

async function saveSettings() {
  saveSettingsBtn.disabled = true;

  saveSettingsBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

  try {
    await setDoc(
      doc(
        db,

        "users",

        currentUser.uid,

        "preferences",

        "settings",
      ),

      {
        theme: theme.value,

        currency: currency.value,

        language: language.value,
      },
    );
    localStorage.setItem("theme", theme.value);
applyTheme(theme.value);

    settingsStatus.textContent = "All changes saved.";

    showToast(
      "Settings Saved",

      "Your preferences updated successfully.",

      "success",
    );
  } catch (error) {
    showToast(
      "Error",

      error.message,

      "error",
    );
  } finally {
    saveSettingsBtn.innerHTML =
      '<i class="fa-solid fa-floppy-disk"></i> Save Changes';

    saveSettingsBtn.disabled = true;
  }
}

logoutBtn.addEventListener(
  "click",

  async () => {
    try {
      await signOut(auth);

      showToast(
        "Logged Out",

        "See you again!",

        "success",
      );

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } catch (error) {
      showToast(
        "Error",

        error.message,

        "error",
      );
    }
  },
);



changePassword.addEventListener(
  "click",

  async () => {
    try {
      await sendPasswordResetEmail(
        auth,

        currentUser.email,
      );

      showToast(
        "Email Sent",

        "Password reset email sent successfully.",

        "success",
      );
    } catch (error) {
      showToast(
        "Error",

        error.message,

        "error",
      );
    }
  },
);



deleteAccountBtn.addEventListener(
  "click",

  async () => {
    const confirmed = confirm(
      "Are you sure you want to permanently delete your account?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(currentUser);

      showToast(
        "Account Deleted",

        "Your account has been removed.",

        "success",
      );

      setTimeout(() => {
        window.location.href = "register.html";
      }, 1500);
    } catch (error) {
      showToast(
        "Error",

        error.message,

        "error",
      );
    }
  },
);

saveSettingsBtn.addEventListener(
  "click",

  saveSettings,
);
