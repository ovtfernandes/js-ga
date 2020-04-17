const cities = [];
const totalCities = 10;

let order = [];
let population;
const fitnesses = [];
const populationSize = 10;

let recordDistance = Infinity;
let bestEver;

let status;

function newCity() {
    const v = createVector(random(width), random(height/2));
    cities.push(v);
    order.push(order.length);
}

function drawCities() {
    fill(255);
    cities.forEach(({ x, y }) => {
        ellipse(x, y, 8, 8);
    });
}

function drawBestPath() {
    if (bestEver) {
        push();
        stroke(255, 0, 255);
        strokeWeight(4);
        noFill();
        beginShape();
        bestEver.forEach(index => {
            const { x, y } = cities[index];
            vertex(x, y);
        });
        endShape();
        pop();
    }
}

function drawPath() {
    push();
    translate(0, height/2);
    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();
    order.forEach(index => {
        const { x, y } = cities[index];
        vertex(x, y);
    });
    endShape();
    pop();
}

function newRecord(cities, order) {
    const distance = calculateDistance(cities, order);
    if (distance < recordDistance) {
        recordDistance = distance;
        bestEver = order.slice();
    }
    return distance;
}

function setup() {
    createCanvas(400, 600);

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

    drawCities();
    drawBestPath();
    drawPath();
}