const mutationRate = 0.01;

function pickOne(list, probs) {
    let index = -1;
    let r = random(1);

    while (r>0) {
        r -= probs[++index];
    }

    return list[index].slice();
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

function calculateFitnesses(population, fitnesses, cities) {
    population.forEach((order, index) => {
        fitnesses[index] = 1 / (newRecord(cities, order) + 1);
    });
}

function normalizeFitnesses(fitnesses) {
    const sum = fitnesses.reduce((total, fit) => total+fit, 0);
    for (let i=0; i<fitnesses.length; i++) {
        fitnesses[i] /= sum;
    }
}

function nextGeneration(population, fitnesses, order) {
    if (typeof population === 'number') { // create a population
        const newPopulation = [];
        for (let i=0; i<population; i++) {
            const shuffledOrder = shuffle(order);
            newPopulation.push(shuffledOrder);
        }
        return newPopulation;
    } else {
        return population.map(() => {
            const parentA = pickOne(population, fitnesses);
            const parentB = pickOne(population, fitnesses);
            const child = crossOver(parentA, parentB);
            mutate(child);
            return child;
        });
    }
}

function crossOver(parentA, parentB) {
    const start = floor(random(parentA.length-1));
    const end = floor(random(start+1, parentA.length));
    const child = parentA.slice(start, end);
    parentB.forEach(city => {
        if (!child.includes(city)) {
            child.push(city);
        }
    });
    return child;
}

function mutate(order) {
    for (let n=0; n<order.length; n++) {
        if (random(1) < mutationRate) {
            const i = floor(random(order.length));
            const j = (i+1) % order.length;
            [order[i], order[j]] = [order[j], order[i]];
        }
    }
}