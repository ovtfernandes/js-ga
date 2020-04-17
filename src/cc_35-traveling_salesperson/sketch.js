const cities = [];
const totalCities = 10;

let recordDistance;
let bestEver;

function newCity() {
    const v = createVector(random(width), random(height));
    cities.push(v);
}

function drawCities() {
    fill(255);
    cities.forEach(({ x, y }) => {
        ellipse(x, y, 8, 8);
    });
}

function shuffleCities() {
    for (let index=0; index<totalCities; index++) {
        const swapIndex = floor(random(cities.length));
        if (swapIndex !== index) {
            [cities[index], cities[swapIndex]] = [cities[swapIndex], cities[index]];
        }
    }
}

function calculateDistance(points) {
    let lastPoint = points[0];
    return points.slice(1)
        .reduce((distance, curPoint) => {
            distance += curPoint.dist(lastPoint);
            lastPoint = curPoint;
            return distance;
        }, 0);
}

function drawBestPath() {
    if (bestEver) {
        stroke(255, 0, 255);
        strokeWeight(4);
        noFill();
        beginShape();
        bestEver.forEach(({ x, y }) => {
            vertex(x, y);
        });
        endShape();
    }
}

function drawPath() {
    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();
    cities.forEach(({ x, y }) => {
        vertex(x, y);
    });
    endShape();
}

function newRecord() {
    const distance = calculateDistance(cities);
    if (!recordDistance || distance < recordDistance) {
        recordDistance = distance;
        bestEver = cities.slice();
        console.log(distance);
    }
}

function setup() {
    createCanvas(400, 300);

    for (let i=0; i<totalCities; i++) newCity();

    newRecord();
}

function draw() {
    background(0);

    drawCities();
    drawPath();
    drawBestPath();

    shuffleCities();
    newRecord();
}