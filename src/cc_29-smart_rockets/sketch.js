let population;
const lifespan = 400;
let lifeLabel;
let maxfitLabel;
let higherfitLabel;
let target;
const obstacles = [];
let higherFitness = 0;
let higherFitnessGen = 0;

function newObstacle(x, y, w, h) {
    obstacles.push({ x, y, w, h });
}

function setup() {
    createCanvas(400, 300);

    population = new Population(lifespan);

    lifeLabel = createP();
    maxfitLabel = createP();
    higherfitLabel = createP();

    target = createVector(width/2, 50);

    [
        [78, 120, 250, 10],
        // [73, 120, 10, 40], // these will only work with a pathfinding algorithm
        // [328, 120, 10, 40],
        // [115, 155, 10, 40],
        [0, 190, 120, 10],
        // [275, 155, 10, 40],
        [280, 190, 120, 10],
    ].forEach(([x, y, w, h]) => newObstacle(x, y, w, h));
}

function draw() {
    background(0);

    const maxfit = population.run(target, obstacles);
    if (maxfit !== null) {
        maxfitLabel.html(`Generation ${population.generation-1} - maxfit: ${maxfit}`);
        if (maxfit > higherFitness) {
            higherFitness = maxfit;
            higherFitnessGen = population.generation-1;
            higherfitLabel.html(`Higher fitness: ${higherFitness} (gen ${higherFitnessGen})`);
        }
    }
    lifeLabel.html(`Lifespan: ${population.count}`);

    fill(255);
    obstacles.forEach(({ x, y, w, h}) => rect(x, y, w, h));

    ellipse(target.x, target.y, 16, 16);
}