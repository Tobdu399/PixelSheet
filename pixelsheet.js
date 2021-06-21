// Canvas properties
let canvas;
let scale = 1;
let zoom;
let canvas_width;
let canvas_height;

let brushSize = 20;
let brushColor = "rgb(255, 0, 0)";

let gridX = 36;
let gridY = 19
let showGrid = true;
let toolbarIsOpen = false;
let brushoptionsIsOpen = false;

// Sliders
let scale_slider;
let gridX_slider;
let gridY_slider;
let brush_slider;
let scale_slider_label;
let gridx_slider_label;
let gridy_slider_label;
let brush_slider_label;

// Strokes
let strokes = [];
let stroke_in_progress = [];
let undone_strokes = [];
let pencil_down = false;

// Menu options
let colorsHidden = true;
let optionsHidden = true;

function updateCanvas() {
    if (scale_slider.value != zoom || gridX_slider.value != gridX || gridY_slider.value != gridY) {
        zoom = scale_slider.value;
        scale = zoom/20;
        gridX = gridX_slider.value;
        gridY = gridY_slider.value;
        
        canvas = resizeCanvas(gridX*zoom, gridY*zoom);
    }
}

function drawGrid() {
    if (showGrid) {
        stroke(200);
        strokeWeight(1);

        for (let x=(width/gridX); x<width; x+=width/gridX) {
            line(x, 0, x, height);
        }

        for (let y=height/gridY; y<height; y+=height/gridY) {
            line(0, y, width, y);
        }
    }
}

function mousePressed() {
    if (mouseButton === LEFT && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
        pencil_down = true;
}

function mouseReleased() {
    if (mouseButton === LEFT)
        pencil_down = false;
}

function drawStrokes() {
    for (finished_stroke of strokes) {
        for (let current_stroke=0; current_stroke<finished_stroke.length-1; current_stroke++) {
            stroke(finished_stroke[current_stroke][3]);
            strokeWeight(finished_stroke[current_stroke][2]*scale);
            line(finished_stroke[current_stroke][0]*scale, finished_stroke[current_stroke][1]*scale, finished_stroke[current_stroke+1][0]*scale, finished_stroke[current_stroke+1][1]*scale)
        }
    }

    if (stroke_in_progress.length > 1) {
        for (let current_stroke=0; current_stroke<stroke_in_progress.length-1; current_stroke++) {
            stroke(stroke_in_progress[current_stroke][3]);
            strokeWeight(stroke_in_progress[current_stroke][2]*scale);
            line(stroke_in_progress[current_stroke][0], stroke_in_progress[current_stroke][1], stroke_in_progress[current_stroke+1][0], stroke_in_progress[current_stroke+1][1])
        }
    }

    if (pencil_down) {
        if (!toolbarIsOpen && !brushoptionsIsOpen)
            stroke_in_progress.push([mouseX, mouseY, brushSize, brushColor])
        else {
            if (stroke_in_progress.length > 0) {
                strokes.push(stroke_in_progress);
                stroke_in_progress = [];
            }
        }
    } else if (!pencil_down && stroke_in_progress.length > 0) {
        if (stroke_in_progress.length > 0) {
            strokes.push(stroke_in_progress);
            stroke_in_progress = [];
        }
    }
}

function toggleToolbar() {
    toolbarIsOpen = !toolbarIsOpen;
}

function toggleBrushOptions() {
    brushoptionsIsOpen = !brushoptionsIsOpen;
}

function toggleGrid() {
    showGrid = !showGrid;
}

function updateSliders() {
    scale_slider_label.innerHTML = "Zoom   " + parseFloat(scale_slider.value).toFixed(1);
    gridx_slider_label.innerHTML = "Canvas Width   " + parseInt(gridX_slider.value);
    gridy_slider_label.innerHTML = "Canvas Height   " + parseInt(gridY_slider.value);
}

function updateBrush() {
    brushSize = brush_slider.value;
    brush_slider_label.innerHTML = "Brush size:   " + brushSize;
}

function setColor(color) {
    brushColor = color;
}

function undo() {
    if (strokes.length > 0) {
        undone_strokes.push(strokes[strokes.length-1]);
        strokes.pop();
    }
}

function redo() {
    if (undone_strokes.length > 0) {
        strokes.push(undone_strokes[undone_strokes.length-1]);
        undone_strokes.pop();
    }
}

function clearScreen() {
    strokes = [];
    stroke_in_progress = [];
    undone_strokes = [];
    pencil_down = false;
}

function showOptions() {
    if (optionsHidden && toolbarIsOpen) {
        document.getElementById("toolbar-container").style.display = "block";
        optionsHidden = false;
    } else if (!optionsHidden && !toolbarIsOpen) {
        // Add a delay for hiding the toolbar, so that the menu is certainly closed before the options hide
        setTimeout(() => {
            document.getElementById("toolbar-container").style.display = "none";
            optionsHidden = true;
        }, 400);
    }
}

function showColors() {
    if (colorsHidden && brushoptionsIsOpen) {
        document.getElementById("colorpalette").style.display = "grid";
        colorsHidden = false;
    } else if (!colorsHidden && !brushoptionsIsOpen) {
        // Add a delay for hiding the colors, so that the menu is certainly closed before the colors hide
        setTimeout(() => {
            document.getElementById("colorpalette").style.display = "none";
            colorsHidden = true;
        }, 400);
    }
}

// File handling

function saveSheet() {
    html2canvas(document.getElementById("sheet"))
        .then(canvas => {
            // This code will run once the promise has completed
            let img = canvas.toDataURL("image/png");
            let filename = getFileName();

            if (filename != undefined) {
                download(img, filename);
            }
    });
}

function getFileName() {
    let name = prompt("Please give a name for your sheet. It will be saved in PNG format (default: pixelsheet-unnamed-sheet.png)")
    if (name != null) {
        if (name != "") {
            if (name.substr(name.length-4) != ".png") {
                name += ".png";
            }
            return name;
        } else {
            name = "pixelsheet-unnamed-sheet.png";
            return name;
        }
    }
}

function download(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        // Firefox requires the link to be in the body
        document.body.appendChild(link);

        // simulate click
        link.click();

        // remove the link when done
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}

// ----------------------------------------

function setup() {
    frameRate(60);

    canvas_width = windowWidth/2;
    canvas_height = canvas_width;
    canvas = createCanvas(gridX*zoom, gridY*zoom);
    canvas.id("sheet");

    // Sliders
    scale_slider = document.getElementById("scale-slider");
    gridX_slider = document.getElementById("gridx-slider");
    gridY_slider = document.getElementById("gridy-slider");

    brush_slider = document.getElementById("brush-slider");

    // Sliders' labels
    scale_slider_label = document.getElementById("scale-slider-label");
    gridx_slider_label = document.getElementById("gridx-slider-label");
    gridy_slider_label = document.getElementById("gridy-slider-label");

    brush_slider_label = document.getElementById("brush-slider-label");

}

function draw() {
    background(255);
    updateCanvas();
    drawGrid();
    drawStrokes();
    updateBrush();
    updateSliders();
    showColors();
    showOptions();
}
