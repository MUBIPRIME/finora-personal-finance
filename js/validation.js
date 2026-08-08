// ================================
// EMAIL VALIDATION
// ================================

export function validateEmail(email) {

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {

        return "Email is required.";

    }

    if (!emailRegex.test(email)) {

        return "Please enter a valid email address.";

    }

    return "";

}

// ================================
// FULL NAME VALIDATION
// ================================

export function validateName(name) {

    if (!name.trim()) {

        return "Full name is required.";

    }

    if (name.length < 3) {

        return "Name must be at least 3 characters.";

    }

    if (name.length > 50) {

        return "Name is too long.";

    }

    return "";

}

// ================================
// PASSWORD VALIDATION
// ================================

export function validatePassword(password) {

    if (!password) {

        return "Password is required.";

    }

    if (password.length < 8) {

        return "Password must be at least 8 characters.";

    }

    if (!/[A-Z]/.test(password)) {

        return "Password must contain an uppercase letter.";

    }

    if (!/[a-z]/.test(password)) {

        return "Password must contain a lowercase letter.";

    }

    if (!/[0-9]/.test(password)) {

        return "Password must contain a number.";

    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {

        return "Password must contain a special character.";

    }

    return "";

}

// ================================
// CONFIRM PASSWORD
// ================================

export function validateConfirmPassword(

    password,

    confirmPassword

) {

    if (password !== confirmPassword) {

        return "Passwords do not match.";

    }

    return "";

}

// ================================
// TERMS
// ================================

export function validateTerms(checked) {

    if (!checked) {

        return "Please accept the Terms & Conditions.";

    }

    return "";

}