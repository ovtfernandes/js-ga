const mutationRate = 0.01;

class Vehicle {
    constructor(x, y, dna) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 4;
        this.maxspeed = 5;
        this.maxforce = 0.5;

        this.health = 1;

        if (dna) {
            this.dna = dna.map((gene, index) => {
                let mutation = 0;
                if (random(1) < mutationRate) {
                    if (index > 1) {
                        mutation = random(-10, 10);
                    } else {
                        mutation = random(-0.1, 0.1)
                    }
                }
                return gene + mutation;
            });
        } else {
            this.dna = [
                random(-2,2), // food weight
                random(-2,2), // poison weight
                random(0, 100), // food perception
                random(0, 100), // poison perception
            ];
        }
    }

    // Method to update location
    update() {
        this.health -= 0.005;
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset acceleration to 0 each cycle
        this.acceleration.mult(0);
    }

    applyForce(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    behaviors(good, bad) {
        const steerG = this.eat(good, 0.2, this.dna[2]);
        const steerB = this.eat(bad, -1, this.dna[3]);

        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);

        this.applyForce(steerG);
        this.applyForce(steerB);
    }

    clone() {
        if (random(1) < 0.002) {
            const { x, y } = this.position;
            return new Vehicle(x, y, this.dna);
        }
        return null;
    }

    eat(list, nutrition, perception) {
        let record = Infinity;
        let closest = null;

        for (let index=list.length-1; index >= 0; index--) {
            const item = list[index];
            const distance = this.position.dist(item);
            
            if (distance < this.maxspeed) {
                list.splice(index, 1);
                this.health += nutrition;
            } else if (distance < record && distance < perception) {
                record = distance;
                closest = item;
            }
        }

        return closest ? this.seek(closest) : createVector(0,0);
    }

    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
        const desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

        // Scale to maximum speed
        desired.setMag(this.maxspeed);

        // Steering = Desired minus velocity
        const steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force

        return steer;
    }

    dead() {
        return this.health <= 0;
    }

    display(debug = false) {
        // Draw a triangle rotated in the direction of velocity
        const theta = this.velocity.heading() + PI / 2;
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        
        if (debug) {
            this.displayDebug();
        }

        const gr = color(0, 255, 0);
        const rd = color(255, 0, 0);
        const col = lerpColor(rd, gr, this.health);

        fill(col);
        stroke(col);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }

    displayDebug() {
        strokeWeight(3);
        stroke(0,255,0);
        noFill();
        line(0, 0, 0, -this.dna[0]*25);
        ellipse(0, 0, this.dna[2] * 2);
        strokeWeight(2);
        stroke(255,0,0);
        line(0, 0, 0, -this.dna[1]*25);
        ellipse(0, 0, this.dna[3] * 2);
    }

    boundaries() {
        const d = 25;
        let desired = null;

        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > width - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }
}