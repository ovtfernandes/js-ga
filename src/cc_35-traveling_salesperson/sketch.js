const cities = [];
const totalCities = 12;

let order = [];
let population;
const fitnesses = [];
const populationSize = 500;

let recordDistance = Infinity;
let bestEver;
let currentBest;

let status;

function newCity() {
    const v = createVector(random(width), random(height/2));
    cities.push(v);
    order.push(order.length);
}

function drawCity(x, y) {
    ellipse(x, y, 8, 8);
}

function drawBestPath() {
    if (bestEver) {
        push();
        stroke(255);
        strokeWeight(2);
        noFill();
        beginShape();
        bestEver.forEach(index => {
            const { x, y } = cities[index];
            vertex(x, y);
            drawCity(x, y);
        });
        endShape();
        pop();
    }
}

function drawCurrentBestPath() {
    push();
    translate(0, height/2);
    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    currentBest.forEach(index => {
        const { x, y } = cities[index];
        vertex(x, y);
        drawCity(x, y);
    });
    endShape();
    pop();
}

function newRecord(cities, order) {
    let currentRecord = Infinity;
    const distance = calculateDistance(cities, order);
    if (distance < currentRecord) {
        currentRecord = distance;
        currentBest = order.slice();
    }
    if (distance < recordDistance) {
        recordDistance = distance;
        bestEver = order.slice();
    }
    return distance;
}

function setup() {
    createCanvas(800, 700);

    for (let i=0; i<totalCities; i++) newCity();

    population = nextGeneration(populationSize, fitnesses, order);

    status = createP('').style('font-size', '32');
}

function draw() {
    background(0);

    calculateFitnesses(population, fitnesses, cities);
    normalizeFitnesses(fitnesses);
    population = nextGeneration(population, fitnesses);
    //newRecord(cities, population);

    //drawCities();
    drawBestPath();
    drawCurrentBestPath();
}