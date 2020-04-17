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
            const order = pickOne(population, fitnesses);
            mutate(order);
            return order;
        });
    }
}

function mutate(order) {
    const i = floor(random(order.length));
    const j = floor(random(order.length));
    [order[i], order[j]] = [order[j], order[i]];
}