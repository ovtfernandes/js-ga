const cities = [];
const totalCities = 5;
const totalPermutations = factorial(totalCities);
let count = 0;

let order = [];

let recordDistance;
let bestEver;

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

function shuffleCities() {
    for (let index=0; index<totalCities; index++) {
        const swapIndex = floor(random(cities.length));
        if (swapIndex !== index) {
            [cities[index], cities[swapIndex]] = [cities[swapIndex], cities[index]];
        }
    }
}

function calculateDistance(points, order) {
    let lastPoint = points[order[0]];
    return order.slice(1)
        .reduce((distance, index) => {
            const curPoint = points[index];
            distance += curPoint.dist(lastPoint);
            lastPoint = curPoint;
            return distance;
        }, 0);
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

function nextOrder() {
    // Algorithm for Lexicographic Order
    // https://www.quora.com/How-would-you-explain-an-algorithm-that-generates-permutations-using-lexicographic-ordering
    
    // STEP 1
    let largestI = -1;
    for (let i = order.length - 2; i >= 0; i--) {
        if (order[i] < order[i + 1]) {
            largestI = i;
            i = -1;
        }
    }
    if (largestI === -1) {
        noLoop();
        console.log('finished');
    }

    // STEP 2
    let largestJ = -1;
    for (let j = order.length - 1; j >= 0; j--) {
        if (order[largestI] < order[j]) {
            largestJ = j;
            j = -1;
        }
    }

    // STEP 3: swap largestI and largestJ
    [order[largestI], order[largestJ]] = [order[largestJ], order[largestI]];

    // STEP 4: reverse from largestI + 1 to the end
    let endArray = order.splice(largestI + 1);
    endArray.reverse();
    //order = order.concat(endArray);
    order = order.concat(endArray);

    count++;
}

function newRecord() {
    const distance = calculateDistance(cities, order);
    if (!recordDistance || distance < recordDistance) {
        recordDistance = distance;
        bestEver = order.slice();
    }
}

function setup() {
    createCanvas(400, 600);
    //frameRate(5);

    for (let i=0; i<totalCities; i++) newCity();

    newRecord();
}

function draw() {
    background(0);

    drawCities();
    drawBestPath();
    drawPath();
    
    textSize(32);
    // const txt = order.reduce((s, o) => s + o, '');
    const perc = 100 * (count / totalPermutations);
    const txt = `${nf(perc, 0, 2)}% completed`;
    fill(255);
    text(txt, 10, height/2);

    //shuffleCities();
    nextOrder();
    newRecord();
}

function factorial(n) {
    let f = 1;
    for (let i=Math.min(n,2); i<=n; i++) {
        f *= i;
    }
    return f;
}