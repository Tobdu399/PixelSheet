// Canvas properties
let canvas;
let scale = 1;
let zoom;
let canvas_width;
let canvas_height;

let gridX = 36;
let gridY = 19

// Sliders
let scale_slider;
let gridX_slider;
let gridY_slider;

// Strokes
let strokes = [];
let stroke_in_progress = [];
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
    stroke(200);
    strokeWeight(1);

    for (let x=width/gridX; x<width; x+=width/gridX) {
        line(x, 0, x, height);
    }

    for (let y=height/gridY; y<height; y+=height/gridY) {
        line(0, y, width, y);
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
    fill(0);

    if (pencil_down) {
        stroke_in_progress.push([mouseX, mouseY])
    } else if (!pencil_down && stroke_in_progress.length > 0) {
        strokes.push(stroke_in_progress);
        stroke_in_progress = [];
    }
    
    if (stroke_in_progress.length > 1) {
        for (let current_stroke=0; current_stroke<stroke_in_progress.length-1; current_stroke++) {
            stroke(0);
            strokeWeight(2);
            line(stroke_in_progress[current_stroke][0], stroke_in_progress[current_stroke][1], stroke_in_progress[current_stroke+1][0], stroke_in_progress[current_stroke+1][1])
        }
    }

    for (finished_stroke of strokes) {
        for (let current_stroke=0; current_stroke<finished_stroke.length-1; current_stroke++) {
            stroke(0);
            strokeWeight(2);
            line(finished_stroke[current_stroke][0]*scale, finished_stroke[current_stroke][1]*scale, finished_stroke[current_stroke+1][0]*scale, finished_stroke[current_stroke+1][1]*scale)
        }
    }
}

function setup() {
    frameRate(50);

    canvas_width = windowWidth/2;
    canvas_height = canvas_width;
    canvas = createCanvas(gridX*zoom, gridY*zoom);

    scale_slider = document.getElementById("scale-slider")
    gridX_slider = document.getElementById("gridx-slider")
    gridY_slider = document.getElementById("gridy-slider")
}

function draw() {
    background(255);
    updateCanvas();
    drawGrid();
    drawStrokes();
}
