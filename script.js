/* ===========================================
   THE DOLL MAKER
   SURVIVAL GUIDE
=========================================== */

// -----------------------------
// Elements
// -----------------------------

const guideImage = document.getElementById("guideImage");

const controlsButton = document.getElementById("controlsButton");
const inventoryButton = document.getElementById("inventoryButton");
const fearButton = document.getElementById("fearButton");

const closeButton = document.getElementById("closeButton");
const overlay = document.getElementById("overlay");

// -----------------------------
// Image Paths
// -----------------------------

const pages = {

    controls: "assets/controls.jpeg",

    inventory: "assets/inventory.jpeg",

    fear: "assets/fearinfo.jpeg"

};

// -----------------------------
// Current Page
// -----------------------------

let currentPage = "controls";

// -----------------------------
// Change Page
// -----------------------------

function showPage(page){

    if(page === currentPage) return;

    guideImage.classList.add("fade");

    setTimeout(() => {

        guideImage.src = pages[page];

        guideImage.onload = () => {

            guideImage.classList.remove("fade");

        };

    },180);

    currentPage = page;

    updateButtons();

}

// -----------------------------
// Active Button
// -----------------------------

function updateButtons(){

    document
        .querySelectorAll(".navButton")
        .forEach(button => {

            button.classList.remove("active");

        });

    if(currentPage === "controls"){

        controlsButton.classList.add("active");

    }

    if(currentPage === "inventory"){

        inventoryButton.classList.add("active");

    }

    if(currentPage === "fear"){

        fearButton.classList.add("active");

    }

}

// -----------------------------
// Button Events
// -----------------------------

controlsButton.addEventListener("click", () => {

    showPage("controls");

});

inventoryButton.addEventListener("click", () => {

    showPage("inventory");

});

fearButton.addEventListener("click", () => {

    showPage("fear");

});

// -----------------------------
// Close Guide
// -----------------------------

function closeGuide(){

    overlay.style.opacity = "0";

    overlay.style.pointerEvents = "none";

    setTimeout(() => {

        overlay.style.display = "none";

    },250);

}

closeButton.addEventListener("click", closeGuide);

// -----------------------------
// ESC Key
// -----------------------------

document.addEventListener("keydown",(event)=>{

    if(event.key === "Escape"){

        closeGuide();

    }

});

// -----------------------------
// Keyboard Shortcuts
// -----------------------------
//
// 1 = Controls
// 2 = Inventory
// 3 = Fear
//

document.addEventListener("keydown",(event)=>{

    if(event.key === "1"){

        showPage("controls");

    }

    if(event.key === "2"){

        showPage("inventory");

    }

    if(event.key === "3"){

        showPage("fear");

    }

});

// -----------------------------
// Initialise
// -----------------------------

updateButtons();
