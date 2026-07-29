/*
==========================================
 THE DOLL'S GUIDE
 Notebook Interface Controller
==========================================
*/


// -----------------------------
// Elements
// -----------------------------

const tabs = document.querySelectorAll(".tab");

const pages = document.querySelectorAll(".page");

const closeButton = document.getElementById("closeButton");

const overlay = document.getElementById("overlay");


// -----------------------------
// Remember current page
// -----------------------------

let currentPage = localStorage.getItem("guidePage") || "controls";


// Load saved page

openPage(currentPage);


// -----------------------------
// Tab switching
// -----------------------------

tabs.forEach(tab => {


    tab.addEventListener("click", () => {


        const selectedPage = tab.dataset.page;


        openPage(selectedPage);


        // Optional sound hook

        playPageSound();


    });


});


// -----------------------------
// Open page function
// -----------------------------

function openPage(pageName){


    pages.forEach(page => {


        page.classList.remove("active");


    });


    tabs.forEach(tab => {


        tab.classList.remove("active");


    });


    const page = document.getElementById(pageName);


    const tab = document.querySelector(
        `[data-page="${pageName}"]`
    );


    if(page){

        page.classList.add("active");

    }


    if(tab){

        tab.classList.add("active");

    }


    localStorage.setItem(
        "guidePage",
        pageName
    );


}


// -----------------------------
// Close notebook
// -----------------------------

closeButton.addEventListener(
"click",
closeGuide
);


function closeGuide(){


    overlay.style.animation =
    "fadeOut .25s forwards";


    setTimeout(()=>{


        overlay.style.display="none";


    },250);


}


// -----------------------------
// ESC key closes menu
// -----------------------------

document.addEventListener(
"keydown",
(event)=>{


    if(event.key==="Escape"){


        closeGuide();


    }


});


// -----------------------------
// Page turn sound
// -----------------------------
//
// Add your own sound later:
//
// assets/page-turn.mp3
//
// Uncomment when ready
//

function playPageSound(){


    /*
    const sound =
    new Audio(
    "assets/page-turn.mp3"
    );

    sound.volume=.35;

    sound.play();
    */


}


// -----------------------------
// Fade animation
// -----------------------------

const style = document.createElement("style");


style.innerHTML = `

@keyframes fadeOut {

from{

opacity:1;

}

to{

opacity:0;

}

}

`;


document.head.appendChild(style);
