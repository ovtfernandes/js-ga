let vehicles = [];
const foodPieces = [];
const poisonPieces = [];
let debugCheckbox;

function newRandomPosition() {
    const x = random(width);
    const y = random(height);
    return createVector(x, y);
}

function newFood() {
    foodPieces.push(newRandomPosition());
}

function newPoison() {
    poisonPieces.push(newRandomPosition());
}

function drawPiece(x, y) {
    noStroke();
    ellipse(x, y, 4, 4);
}

function setup() {
    createCanvas(640, 360);

    for (let i=0; i<50; i++) {
        const { x, y } = newRandomPosition();
        vehicles.push(new Vehicle(x, y));
    }

    for (let i=0; i<40; i++) { newFood() }

    for (let i=0; i<20; i++) { newPoison() }

    debugCheckbox = createCheckbox('Debug');
    debugCheckbox.checked(true);
}

function draw() {
    background(51);

    if (random(1) < 0.1) { newFood() }

    if (random(1) < 0.01) { newPoison() }

    foodPieces.forEach(({ x, y }) => {
        fill(0,255,0);
        drawPiece(x, y);
    });

    poisonPieces.forEach(({ x, y }) => {
        fill(255,0,0);
        drawPiece(x, y);
    });

    // Call the appropriate steering behaviors for our agents
    for (let index=vehicles.length-1; index >= 0; index--) {
        const vehicle = vehicles[index];
        vehicle.boundaries();
        vehicle.behaviors(foodPieces, poisonPieces);
        vehicle.update();
        vehicle.display(debugCheckbox.checked());

        const newVehicle = vehicle.clone();
        if (newVehicle) {
            vehicles.push(newVehicle);
        }

        if (vehicle.dead()) {
            const x = vehicle.position.x;
            const y = vehicle.position.y;
            foodPieces.push(createVector(x, y));
            vehicles.splice(index, 1);
        }
    }
}