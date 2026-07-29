/* ==========================================
   PORTALS TASK
========================================== */

const IFRAME_TASK_NAME = "Information Menu";

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
        image: "assets/controls.png",
        alt: "Controls information"
    },

    inventory: {
        image: "assets/inventory.png",
        alt: "Inventory information"
    },

    fear: {
        image: "assets/fearinfo.png",
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
   ACTIVE MENU BUTTON
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
   SHOW GUIDE PAGE
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
        updateButtons();
        return;
    }

    guideImage.classList.add("fade");

    window.setTimeout(() => {
        currentPage = pageName;

        guideImage.src = selectedPage.image;
        guideImage.alt = selectedPage.alt;

        updateButtons();

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

/* ==========================================
   MENU BUTTON EVENTS
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
   CLOSE GUIDE
========================================== */

function closeGuide() {
    if (typeof PortalsSdk !== "undefined") {

        /*
           Reset the Portals task from Active
           back to Not Active.

           This removes the task-owned iframe
           effect and allows it to open again.
        */

        if (
            typeof PortalsSdk.sendMessageToUnity ===
            "function"
        ) {
            PortalsSdk.sendMessageToUnity(
                JSON.stringify({
                    TaskName: IFRAME_TASK_NAME,
                    TaskTargetState:
                        "SetActiveToNotActive",
                    Delay: 0
                })
            );
        }

        /*
           Close the visible iframe immediately.
        */

        if (
            typeof PortalsSdk.closeIframe ===
            "function"
        ) {
            PortalsSdk.closeIframe();
        }

        return;
    }

    /*
       Browser-preview fallback.
    */

    overlay.style.display = "none";
}

closeButton.addEventListener("click", closeGuide);

/* ==========================================
   ESCAPE KEY
========================================== */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeGuide();
    }

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
