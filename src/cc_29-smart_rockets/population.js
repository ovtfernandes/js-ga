class Population {
    constructor(lifespan) {
        this.populationSize = 100;
        this.count = 0;
        this.lifespan = lifespan;
        this.matingPool = [];

        this.initializeRockets();
    }

    initializeRockets() {
        this.rockets = [];
        for (let i=0; i<this.populationSize; i++) {
            this.rockets.push(new Rocket(this.lifespan));
        }
    }

    evaluate(target) {
        let maxfit = 0;
        this.rockets.forEach(rocket => {
            rocket.calculateFitness(target);
            maxfit = Math.max(rocket.fitness, maxfit);
        });

        this.matingPool = [];

        this.rockets.forEach(rocket => {
            rocket.fitness /= maxfit;
            const n = rocket.fitness * 100;
            for (let i=0; i<n; i++) {
                this.matingPool.push(rocket);
            }
        });

        return maxfit;
    }

    selection() {
        this.rockets = [];
        for (let i=0; i<this.populationSize; i++) {
            const parentA = random(this.matingPool).dna;
            const parentB = random(this.matingPool).dna;
            const child = parentA.crossover(parentB);
            child.mutation();
            this.rockets.push(new Rocket(child));
        }
    }

    run(target, obstacles) {
        this.rockets.forEach(rocket => {
            rocket.update(this.count, target, obstacles);
            rocket.show();
        });
        this.count++;
        if (this.count === this.lifespan) {
            const maxfit = this.evaluate(target);
            this.selection();
            this.count = 0;

            return maxfit;
        }

        return null;
    }
}