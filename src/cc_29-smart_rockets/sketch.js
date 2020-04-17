let population;
const lifespan = 400;
let lifeLabel;
let maxfitLabel;
let target;
const obstacles = [];

function newObstacle(x, y, w, h) {
    obstacles.push({ x, y, w, h });
}

function setup() {
    createCanvas(400, 300);

    population = new Population(lifespan);

    lifeLabel = createP();
    maxfitLabel = createP();

    target = createVector(width/2, 50);

    newObstacle(100, 150, 200, 10);
}

function draw() {
    background(0);

    const maxfit = population.run(target, obstacles);
    if (maxfit !== null) {
        maxfitLabel.html(maxfit);
    }
    lifeLabel.html(population.count);

    fill(255);
    obstacles.forEach(({ x, y, w, h}) => rect(x, y, w, h));

    ellipse(target.x, target.y, 16, 16);
}