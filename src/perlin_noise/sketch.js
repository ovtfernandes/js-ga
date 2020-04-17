const twodIncrement = 0.1;
const zIncrement = 0.0003;
const scale = 10;
let cols, rows;

let zoff = 0;

const particles = [];
const flowfield = [];
const foodPieces = [];

let popSizeLabel;

function updateFlowField() {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
            const index = x + y * cols;
            const angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
            const v = p5.Vector.fromAngle(angle);
            v.setMag(1);
            flowfield[index] = v;
            xoff += twodIncrement;
        }
        yoff += twodIncrement;
        zoff += zIncrement;
    }
}

function newFood() {
    foodPieces.push(createVector(random(width), random(height)));
}

function setup() {
    createCanvas(400, 400);

    cols = floor(width / scale);
    rows = floor(height / scale);

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    for (let i=0; i<20; i++) {
        newFood();
    }

    popSizeLabel = createP().style('font-size', '32');
}

function draw() {
    background(171);

    popSizeLabel.html(`Population size: ${particles.length}`);

    updateFlowField();

    if (foodPieces.length < 100 && random(1) < 0.05) {
        newFood();
    }

    fill(255, 200);
    noStroke();
    foodPieces.forEach(({ x, y }) => {
        ellipse(x, y, 3);
    });

    for (let i=particles.length-1; i>=0; i--) {
        const particle = particles[i];
        if (particle.dead()) {
            particles.splice(i,1);
        } else {
            particle.follow(flowfield, scale, cols);
            const newParticle = particle.generateNewParticle();
            if (newParticle) {
                particles.push(newParticle);
            }
            particle.update(foodPieces);
            particle.edges();
            particle.show();
        }
    }
}