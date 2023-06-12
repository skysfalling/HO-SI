const paletteDir = "/palettes";
var colorPath = "./palettes/resurrect-64.txt";
var colorLink = "There is no link to this palette.";

const paletteMenu = document.getElementById("palette_menu");
var filePaths = [];

// << PALETTES >>
directoryLoadPalettes();

// document.addEventListener("DOMContentLoaded", loadPalette(colorPath, colorLink));
function directoryLoadPalettes()
{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './palettes/');
    xhr.onload = () => {
        const parser = new DOMParser();
        const html = parser.parseFromString(xhr.response, 'text/html');
        const fileList = Array.from(html.querySelectorAll('a')).map(a => a.href).filter(href => href.endsWith('.txt'));
        filePaths = fileList.map(file => "./palettes/" + file.slice(file.lastIndexOf("/") + 1));
        console.log(filePaths);

        // create palette objects and append them to palette_menu
        const paletteMenu = document.getElementById("palette_menu");
        filePaths.forEach((filename, index) => {
            const paletteObj = document.createElement("div");
            paletteObj.className = "menu_square";
            paletteObj.innerHTML = `<h1>${index}</h1>`;
        
            // Add an event listener to the div to load the corresponding palette when clicked
            paletteObj.addEventListener("click", () => {
                removePalette();
                loadPalette(filename);
            });
            
            paletteMenu.appendChild(paletteObj);
        });

        // load first palette
        if (filePaths.length > 0)
        {
            loadPalette(filePaths[0]);
        }
    }
    xhr.send();


}

// >> LOAD PALETTE >>
function loadPalette(path) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // split text file by "#"
                const rows = xhr.responseText.trim().split("#");
                const paletteHolder = document.querySelector("#palette_holder");

                /*
                // web link to palette at top of holder
                const link = document.createElement("a");
                link.className = "color-header";
                link.innerText = colorLink;
                link.href = colorLink;
                link.target = "_blank"; // to open in a new tab
                paletteHolder.appendChild(link);
                */

                // << GENERATE PALETTE >>
                for (let i = 1; i < rows.length; i++) {
                    // create swatch holder
                    const swatchHolder = document.createElement("div");
                    swatchHolder.className = "swatch_holder";
                    paletteHolder.appendChild(swatchHolder);

                    // text header
                    const row = rows[i].split("\n");
                    const h1 = document.createElement("h1");
                    h1.className = "color-header";
                    h1.innerText = row[0];
                    swatchHolder.appendChild(h1);

                    // create color boxes
                    for (let j = 1; j < row.length - 1; j++) {
                        const colorBox = document.createElement("div");
                        colorBox.className = "color-box";
                        colorBox.style.backgroundColor = "#" + row[j];

                        // wait for a click
                        colorBox.addEventListener("click", function() {
                            copyToClipboard(row[j].trim("\n"));
                        });

                        swatchHolder.appendChild(colorBox);
                    }
                }
            } else {
                console.log("Failed to load color palette: " + xhr.status);
            }
        }
    };
    xhr.open("GET", path);
    xhr.send();
}

// >> REMOVE PALETTE >>
function removePalette() {
    const colorBoxes = document.querySelectorAll(".color-box");
    for (let i = 0; i < colorBoxes.length; i++) {
        colorBoxes[i].remove();
    }

    const headers = document.querySelectorAll(".color-header");
    for (let i = 0; i < headers.length; i++) {
        headers[i].remove();
    }

    const swatches = document.querySelectorAll(".swatch_holder");
    for (let i = 0; i < swatches.length; i++) {
        swatches[i].remove();
    }
}

// >> COPY TO CLIPBOARD >>
function copyToClipboard(hexValue, colorLink) {
    const el = document.createElement("textarea");
    el.value = hexValue;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    const alertEl = document.createElement("div");
    alertEl.textContent = "Copied to clipboard: " + hexValue;
    alertEl.style.position = "fixed";
    alertEl.style.top = "50%";
    alertEl.style.left = "50%";
    alertEl.style.transform = "translateX(-50%)";
    alertEl.style.backgroundColor = "#323353";
    alertEl.style.color = "#fff";
    alertEl.style.padding = "10px";
    alertEl.style.borderRadius = "0px";
    document.body.appendChild(alertEl);

    setTimeout(function() {
        alertEl.style.opacity = "0";
        setTimeout(function() {
        document.body.removeChild(alertEl);
        }, 1000);
    }, 2000);
}

