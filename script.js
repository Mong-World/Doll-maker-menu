/* ===========================================
   THE DOLL MAKER
   SURVIVAL GUIDE
=========================================== */

/* -------------------------------------------
   ELEMENTS
------------------------------------------- */

const guideImage = document.getElementById("guideImage");

const controlsButton = document.getElementById("controlsButton");
const inventoryButton = document.getElementById("inventoryButton");
const fearButton = document.getElementById("fearButton");

const closeButton = document.getElementById("closeButton");
const overlay = document.getElementById("overlay");

/* -------------------------------------------
   PAGE SETTINGS
------------------------------------------- */

const pages = {
    controls: {
        image: "assets/controls.jpeg",
        alt: "Controls information"
    },

    inventory: {
        image: "assets/inventory.jpeg",
        alt: "Inventory information"
    },

    fear: {
        image: "assets/fearinfo.jpeg",
        alt: "Fear information"
    }
};

/* -------------------------------------------
   STARTING PAGE FROM URL

   Normal:
   https://mong-world.github.io/Doll-maker/

   Inventory:
   https://mong-world.github.io/Doll-maker/?page=inventory

   Fear:
   https://mong-world.github.io/Doll-maker/?page=fear
------------------------------------------- */

const urlParameters = new URLSearchParams(window.location.search);

const requestedPage = urlParameters
    .get("page")
    ?.toLowerCase();

let currentPage = pages[requestedPage]
    ? requestedPage
    : "controls";

/* -------------------------------------------
   SHOW PAGE
------------------------------------------- */

function showPage(pageName, animate = true) {

    if (!pages[pageName]) {
        pageName = "controls";
    }

    if (pageName === currentPage && animate) {
        updateButtons();
        return;
    }

    const newPage = pages[pageName];

    if (!animate) {
        guideImage.src = newPage.image;
        guideImage.alt = newPage.alt;

        currentPage = pageName;

        updateButtons();
        return;
    }

    guideImage.classList.add("fade");

    window.setTimeout(() => {

        guideImage.src = newPage.image;
        guideImage.alt = newPage.alt;

        currentPage = pageName;

        updateButtons();

        /*
         Remove the fade when the new image
         has finished loading.
        */

        if (guideImage.complete) {
            guideImage.classList.remove("fade");
        } else {
            guideImage.addEventListener(
                "load",
                () => {
                    guideImage.classList.remove("fade");
                },
                { once: true }
            );
        }

    }, 180);
}

/* -------------------------------------------
   ACTIVE BUTTON
------------------------------------------- */

function updateButtons() {

    const buttons = [
        controlsButton,
        inventoryButton,
        fearButton
    ];

    buttons.forEach((button) => {
        button.classList.remove("active");
    });

    if (currentPage === "controls") {
        controlsButton.classList.add("active");
    }

    if (currentPage === "inventory") {
        inventoryButton.classList.add("active");
    }

    if (currentPage === "fear") {
        fearButton.classList.add("active");
    }
}

/* -------------------------------------------
   NAVIGATION CLICKS
------------------------------------------- */

controlsButton.addEventListener("click", () => {
    showPage("controls");
});

inventoryButton.addEventListener("click", () => {
    showPage("inventory");
});

fearButton.addEventListener("click", () => {
    showPage("fear");
});

/* -------------------------------------------
   CLOSE GUIDE
------------------------------------------- */

function closeGuide() {

    /*
     Inside Portals, properly close the iframe.
    */

    if (
        window.PortalsSdk &&
        typeof window.PortalsSdk.closeIframe === "function"
    ) {
        window.PortalsSdk.closeIframe();
        return;
    }

    /*
     Browser preview fallback.
    */

    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";

    window.setTimeout(() => {
        overlay.style.display = "none";
    }, 250);
}

closeButton.addEventListener("click", closeGuide);

/* -------------------------------------------
   KEYBOARD CONTROLS
------------------------------------------- */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeGuide();
    }

    /*
     Only use these shortcuts while the
     guide iframe is open.
    */

    if (event.key === "1") {
        showPage("controls");
    }

    if (event.key === "2") {
        showPage("inventory");
    }

    if (event.key === "3") {
        showPage("fear");
    }
});

/* -------------------------------------------
   OPTIONAL PORTALS MESSAGES

   A Portals "Send Message To Iframes" effect
   can send:

   {"page":"inventory"}

   This switches an iframe that is already open.
------------------------------------------- */

function enablePortalsMessages() {

    if (
        !window.PortalsSdk ||
        typeof window.PortalsSdk.setMessageListener !== "function"
    ) {
        return;
    }

    window.PortalsSdk.setMessageListener((message) => {

        try {
            const data = JSON.parse(message);

            if (
                typeof data.page === "string" &&
                pages[data.page.toLowerCase()]
            ) {
                showPage(data.page.toLowerCase());
            }

        } catch (error) {
            console.warn(
                "The guide received an invalid Portals message:",
                message
            );
        }
    });
}

/* -------------------------------------------
   INITIALISE
------------------------------------------- */

showPage(currentPage, false);
enablePortalsMessages();
