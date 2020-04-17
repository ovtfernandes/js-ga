class Rocket {
    constructor(dna) {
        this.position = createVector(width/2, height);
        this.velocity = createVector();
        this.acceleration = createVector();
        this.completed = false;
        this.crashed = false;

        if (typeof dna === 'number') { // it is the DNA genes size
            this.dna = new DNA(dna);
        } else {
            this.dna = dna;
        }
        this.fitness = 0;

        // time left when completing the course
        this.timeLeft = this.dna.genes.length;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    calculateFitness(target) {
        const d = Math.max(this.position.dist(target), 0.000001);

        this.fitness = map(d, 0, width, width, 0);

        if (this.completed) {
            this.fitness *= this.timeLeft;
        }
        if (this.crashed) {
            this.fitness /= 10;
        }
    }

    update(geneIndex, target, obstacles) {
        const d = this.position.dist(target);
        if (d < 10 && !this.completed) {
            this.completed = true;
            this.timeLeft = this.dna.genes.length - geneIndex;
            this.position = target.copy();
        }

        const { x: rx, y: ry } = this.position;

        obstacles.forEach(({ x, y, w, h }) => {
            if (rx >= x && rx <= x+w && ry >= y && ry <= y+h) {
                this.crashed = true;
            }
        });

        if (rx > width || rx < 0 || ry > height || ry < 0) {
            this.crashed = true;
        }
        

        this.applyForce(this.dna.genes[geneIndex]);

        if (!this.completed && !this.crashed) {
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
            this.acceleration.mult(0);
        }
    }

    show() {
        push();
        noStroke();
        fill(255, 150)
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        rectMode(CENTER)
        rect(0, 0, 25, 5);
        pop();
    }
}