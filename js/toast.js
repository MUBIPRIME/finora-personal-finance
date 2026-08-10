let toast =
document.getElementById("toast");

let title =
document.getElementById("toastTitle");

let message =
document.getElementById("toastMessage");

let icon =
document.getElementById("toastIcon");

let progress =
document.getElementById("toastProgress");

let close =
document.getElementById("toastClose");

let timer;

function ensureToastStructure() {
    if (!toast) return false;

    if (title && message && icon && progress && close) {
        return true;
    }

    toast.innerHTML = `
        <div class="toast-icon">
            <i id="toastIcon" class="fa-solid fa-circle-check"></i>
        </div>
        <div class="toast-content">
            <h4 id="toastTitle"></h4>
            <p id="toastMessage"></p>
        </div>
        <button id="toastClose" class="toast-close">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div id="toastProgress" class="toast-progress"></div>
    `;

    title = document.getElementById("toastTitle");
    message = document.getElementById("toastMessage");
    icon = document.getElementById("toastIcon");
    progress = document.getElementById("toastProgress");
    close = document.getElementById("toastClose");

    if (close) {
        close.onclick = () => {
            toast.classList.remove("show");
        };
    }

    return !!toast && !!title && !!message && !!icon && !!progress && !!close;
}

export function showToast(

toastMessage,

type="success"

){

const toastTypes = ["success", "error", "warning", "info"];

type = toastTypes.includes(type) ? type : "success";

const titleText =
    type === "error" ? "Error" :
    type === "warning" ? "Warning" :
    type === "info" ? "Info" :
    "Success";

const messageText = toastMessage ||
    (type === "error" ? "An error occurred." :
     type === "warning" ? "Warning message." :
     type === "info" ? "Information." :
     "Action completed successfully.");

if(!ensureToastStructure()){
    window.alert(`${titleText}: ${messageText}`);
    return;
}

toast.className=`toast ${type}`;

title.textContent=titleText;

message.textContent=messageText;

switch(type){

case "success":

icon.className=
"fa-solid fa-circle-check";

break;

case "error":

icon.className=
"fa-solid fa-circle-xmark";

break;

case "warning":

icon.className=
"fa-solid fa-triangle-exclamation";

break;

case "info":

icon.className=
"fa-solid fa-circle-info";

break;

}

toast.classList.add("show");

progress.style.transition="none";

progress.style.transform="scaleX(1)";

setTimeout(()=>{

progress.style.transition=
"transform 4s linear";

progress.style.transform=
"scaleX(0)";

},50);

clearTimeout(timer);

timer=setTimeout(()=>{

toast.classList.remove("show");

},4000);

}

if(close){

close.onclick=()=>{

toast.classList.remove("show");

};

}