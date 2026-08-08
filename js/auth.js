import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
    sendEmailVerification
} from "firebase/auth";

import {
    doc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";

import {
    auth,
    db
} from "../src/firebase/firebase-config.js";

// ================================
// REGISTER USER
// ================================

export async function registerUser(
    fullName,
    email,
    password
) {

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        await updateProfile(user, {
            displayName: fullName
        });

        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                fullName,
                email,
                photoURL: "",
                currency: "NGN",
                theme: "light",
                monthlyBudget: 0,
                totalIncome: 0,
                totalExpense: 0,
                totalSavings: 0,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            }
        );

        await sendEmailVerification(user);

        return {
            success: true,
            message: "Account created successfully. Please verify your email."
        };

    } catch (error) {

        console.log("Firebase Error:", error);
        console.log("Code:", error.code);
        console.log("Message:", error.message);

        let message = "Something went wrong.";

        switch (error.code) {

            case "auth/email-already-in-use":
                message = "This email is already registered.";
                break;

            case "auth/invalid-email":
                message = "Invalid email address.";
                break;

            case "auth/weak-password":
                message = "Password is too weak.";
                break;

            case "auth/network-request-failed":
                message = "Please check your internet connection.";
                break;

            case "auth/unauthorized-domain":
                message = "This website is not authorized for Firebase auth. Add your domain to Firebase console.";
                break;

            case "auth/operation-not-allowed":
                message = "Email/password sign-in is disabled in Firebase Auth settings.";
                break;

            default:
                message = error.message;

        }

        return {
            success: false,
            message
        };

    }

}

// ================================
// LOGIN USER
// ================================

export async function loginUser(
    email,
    password
) {

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        return {
            success: true,
            user: userCredential.user
        };

    } catch (error) {

        let message = "Unable to login.";

        switch (error.code) {

            case "auth/user-not-found":
                message = "No account found with this email.";
                break;

            case "auth/wrong-password":
                message = "Incorrect password.";
                break;

            case "auth/invalid-credential":
                message = "Incorrect email or password.";
                break;

            case "auth/network-request-failed":
                message = "Please check your internet connection.";
                break;

            case "auth/unauthorized-domain":
                message = "This website is not authorized for Firebase auth. Add your domain to Firebase console.";
                break;

            default:
                message = error.message;

        }

        return {
            success: false,
            message
        };

    }

}

// ================================
// RESET PASSWORD
// ================================

export async function resetPassword(email) {

    try {

        await sendPasswordResetEmail(auth, email);

        return {
            success: true,
            message: "Password reset email sent."
        };

    } catch (error) {

        return {
            success: false,
            message: error.message
        };

    }

}

// ================================
// LOGOUT USER
// ================================

export async function logoutUser() {

    await signOut(auth);

}