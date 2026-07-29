/* ==========================================
   ELEMENTS
========================================== */

const guideImage = document.getElementById("guideImage");

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

   Examples:

   ?page=controls
   ?page=inventory
   ?page=fear
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
   UPDATE ACTIVE BUTTON
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
   BUTTON EVENTS
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

    /*
     Try the common Portals SDK locations.
    */

    const portalsSdk =
        window.PortalsSdk ||
        window.portalsSdk ||
        window.parent?.PortalsSdk;

    if (
        portalsSdk &&
        typeof portalsSdk.closeIframe === "function"
    ) {
        portalsSdk.closeIframe();
        return;
    }

    /*
     Send a fallback message to the parent window.
     This may work if Portals listens for iframe
     close messages.
    */

    try {
        window.parent.postMessage(
            {
                type: "closeIframe",
                action: "closeIframe"
            },
            "*"
        );
    } catch (error) {
        console.warn(
            "Could not send close message.",
            error
        );
    }

    /*
     Browser fallback. This hides the guide when
     testing directly outside Portals.
    */

    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";

    window.setTimeout(() => {
        overlay.style.display = "none";
    }, 200);
}

closeButton.addEventListener("click", closeGuide);

/* ==========================================
   KEYBOARD
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
   OPTIONAL PORTALS MESSAGES
========================================== */

function handleGuideMessage(message) {

    let data = message;

    if (typeof message === "string") {
        try {
            data = JSON.parse(message);
        } catch {
            data = {
                page: message
            };
        }
    }

    const pageName =
        data?.page?.toLowerCase();

    if (pages[pageName]) {
        showPage(pageName);
    }
}

if (
    window.PortalsSdk &&
    typeof window.PortalsSdk.setMessageListener === "function"
) {
    window.PortalsSdk.setMessageListener(
        handleGuideMessage
    );
}

window.addEventListener("message", (event) => {
    handleGuideMessage(event.data);
});

/* ==========================================
   INITIALISE
========================================== */

showPage(currentPage, false);
