let resolvePromise;

// ================================
// SHOW CONFIRM MODAL
// ================================

export function showConfirm(title, message) {

    const modal =
    document.getElementById("confirmModal");

    const confirmTitle =
    document.getElementById("confirmTitle");

    const confirmMessage =
    document.getElementById("confirmMessage");

    const confirmOk =
    document.getElementById("confirmOk");

    const confirmCancel =
    document.getElementById("confirmCancel");

    confirmTitle.textContent = title;

    confirmMessage.textContent = message;

    modal.classList.add("show");

    return new Promise((resolve) => {

        resolvePromise = resolve;

        confirmOk.onclick = () => {

            modal.classList.remove("show");

            resolve(true);

        };

        confirmCancel.onclick = () => {

            modal.classList.remove("show");

            resolve(false);

        };

        modal.onclick = (e) => {

            if (e.target === modal) {

                modal.classList.remove("show");

                resolve(false);

            }

        };

        document.onkeydown = (e) => {

            if (e.key === "Escape") {

                modal.classList.remove("show");

                resolve(false);

            }

        };

    });

}