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
let menuIsOpen = false;

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
        if (!menuIsOpen)
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

function toggleMenu() {
    menuIsOpen = !menuIsOpen;
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

function setup() {
    frameRate(60);

    canvas_width = windowWidth/2;
    canvas_height = canvas_width;
    canvas = createCanvas(gridX*zoom, gridY*zoom);

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
}
