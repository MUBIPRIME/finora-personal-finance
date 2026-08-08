const toast =
document.getElementById("toast");

const title =
document.getElementById("toastTitle");

const message =
document.getElementById("toastMessage");

const icon =
document.getElementById("toastIcon");

const progress =
document.getElementById("toastProgress");

const close =
document.getElementById("toastClose");

let timer;

export function showToast(

titleText,

messageText,

type="success"

){

if(
!toast ||
!title ||
!message ||
!icon ||
!progress ||
!close
){
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