const maxForce = 0.1;

function newRandomVector() {
    const vector = p5.Vector.random2D();
    vector.setMag(maxForce);
    return vector;
}

class DNA {
    constructor(genes) {
        if (typeof genes === 'number') {
            this.genes = [];
            for (let i=0; i<lifespan; i++) {
                this.genes.push(newRandomVector());
            }
        } else {
            this.genes = [...genes];
        }
    }

    crossover(partner) {
        const midPoint = floor(random(this.genes.length));
        const newGenes = this.genes.slice(0, midPoint)
            .concat(partner.genes.slice(midPoint));
        return new DNA(newGenes);
    }

    mutation() {
        this.genes = this.genes.map(gene => {
            return random(1) < 0.01 ? newRandomVector() : gene;
        });
    }
}