/* ==========================================
   ELEMENTS
========================================== */

const guideImage =
    document.getElementById("guideImage");

const controlsButton =
    document.getElementById("controlsButton");

const inventoryButton =
    document.getElementById("inventoryButton");

const fearButton =
    document.getElementById("fearButton");

const closeButton =
    document.getElementById("closeButton");

const overlay =
    document.getElementById("overlay");

/* ==========================================
   GUIDE PAGES
========================================== */

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

/* ==========================================
   STARTING PAGE FROM URL
========================================== */

const urlParameters =
    new URLSearchParams(window.location.search);

const requestedPage =
    urlParameters.get("page")?.toLowerCase();

let currentPage =
    pages[requestedPage]
        ? requestedPage
        : "controls";

/* ==========================================
   ACTIVE BUTTON
========================================== */

function updateButtons() {

    controlsButton.classList.remove("active");
    inventoryButton.classList.remove("active");
    fearButton.classList.remove("active");

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

/* ==========================================
   SHOW PAGE
========================================== */

function showPage(pageName, animate = true) {

    if (!pages[pageName]) {
        pageName = "controls";
    }

    const selectedPage = pages[pageName];

    if (!animate) {
        currentPage = pageName;
        guideImage.src = selectedPage.image;
        guideImage.alt = selectedPage.alt;
        updateButtons();
        return;
    }

    if (currentPage === pageName) {
        return;
    }

    guideImage.classList.add("fade");

    window.setTimeout(() => {

        currentPage = pageName;

        guideImage.src = selectedPage.image;
        guideImage.alt = selectedPage.alt;

        updateButtons();

        guideImage.addEventListener(
            "load",
            () => {
                guideImage.classList.remove("fade");
            },
            { once: true }
        );

        if (guideImage.complete) {
            guideImage.classList.remove("fade");
        }

    }, 180);
}

/* ==========================================
   MENU BUTTONS
========================================== */

controlsButton.addEventListener("click", () => {
    showPage("controls");
});

inventoryButton.addEventListener("click", () => {
    showPage("inventory");
});

fearButton.addEventListener("click", () => {
    showPage("fear");
});

/* ==========================================
   CLOSE BUTTON
========================================== */

closeButton.addEventListener("click", () => {

    console.log("Close button clicked.");

    if (
        typeof PortalsSdk !== "undefined" &&
        typeof PortalsSdk.closeIframe === "function"
    ) {
        console.log("Closing through Portals SDK.");
        PortalsSdk.closeIframe();
        return;
    }

    /*
       This fallback only runs when viewing the
       GitHub page outside Portals.
    */

    console.warn(
        "Portals SDK unavailable. Hiding browser preview."
    );

    overlay.style.display = "none";
});

/* ==========================================
   ESCAPE KEY
========================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (
            typeof PortalsSdk !== "undefined" &&
            typeof PortalsSdk.closeIframe === "function"
        ) {
            PortalsSdk.closeIframe();
        } else {
            overlay.style.display = "none";
        }
    }
});

/* ==========================================
   RECEIVE PORTALS MESSAGES
========================================== */

if (
    typeof PortalsSdk !== "undefined" &&
    typeof PortalsSdk.setMessageListener === "function"
) {
    PortalsSdk.setMessageListener((message) => {

        try {
            const data = JSON.parse(message);
            const pageName =
                data.page?.toLowerCase();

            if (pages[pageName]) {
                showPage(pageName);
            }

        } catch (error) {
            console.warn(
                "Invalid Portals message:",
                message
            );
        }
    });
}

/* ==========================================
   INITIALISE
========================================== */

showPage(currentPage, false);
