// ======================================================
// ILAGOM Digital Reader v1.1
// app.js
// PART 1
// ======================================================

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const pdfUrl = "/pdf/book.pdf";

let flipBook = null;
let pdfDocument = null;
let zoom = 1;

const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const progressBar = document.getElementById("progress");
const viewer = document.getElementById("viewer");
const book = document.getElementById("book");

const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const btnZoomIn = document.getElementById("zoomIn");
const btnZoomOut = document.getElementById("zoomOut");
const btnFullscreen = document.getElementById("fullscreen");

const pageInfo = document.getElementById("pageInfo");
const zoomValue = document.getElementById("zoomValue");

async function start() {

    try {

        loading.style.display = "flex";

        loadingText.innerHTML = "Opening book...";

        pdfDocument =
            await pdfjsLib.getDocument(pdfUrl).promise;

        const pages = [];

        for (let i = 1; i <= pdfDocument.numPages; i++) {

            loadingText.innerHTML =
                "Rendering page " +
                i +
                " of " +
                pdfDocument.numPages;

            progressBar.style.width =
                ((i / pdfDocument.numPages) * 100) + "%";

            const page =
                await pdfDocument.getPage(i);

            const scale = Math.min(window.devicePixelRatio || 1, 2.5);

const viewport = page.getViewport({
    scale: 2.5 * scale
});

            const canvas =
                document.createElement("canvas");

            const ctx =
                canvas.getContext("2d");

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({

                canvasContext: ctx,

                viewport: viewport

            }).promise;

            pages.push(

                canvas.toDataURL("image/png")

            );

        }

        loadingText.innerHTML =
            "Preparing FlipBook...";

        flipBook = new St.PageFlip(

            book,

            {

                width: 800,

                height: 1130,

                size: "stretch",

                autoSize: true,

                showCover: true,

                usePortrait: true,

                mobileScrollSupport: true,

                maxShadowOpacity: 0.35

            }

        );

        flipBook.loadFromImages(pages);

        loading.style.display = "none";

        viewer.style.display = "flex";
                pageInfo.innerHTML =
            "Page 1 / " + pdfDocument.numPages;

        flipBook.on("flip", (e) => {

            pageInfo.innerHTML =
                "Page " +
                (e.data + 1) +
                " / " +
                pdfDocument.numPages;

        });

        btnNext.onclick = () => {

            flipBook.flipNext();

        };

        btnPrev.onclick = () => {

            flipBook.flipPrev();

        };

        function updateZoom() {

            book.style.transformOrigin = "top center";

            book.style.transform =
                "scale(" + zoom + ")";

            zoomValue.innerHTML =
                Math.round(zoom * 100) + "%";

        }

        btnZoomIn.onclick = () => {

            zoom = Math.min(3, zoom + 0.2);

            updateZoom();

        };

        btnZoomOut.onclick = () => {

            zoom = Math.max(0.6, zoom - 0.2);

            updateZoom();

        };

        btnFullscreen.onclick = async () => {

            if (!document.fullscreenElement) {

                await document.documentElement.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        };

        updateZoom();

    }

    catch (err) {

        console.error(err);

        loadingText.innerHTML =
            "Unable to load the book.";

        loadingText.style.color = "#ff6b6b";

    }

}

start();