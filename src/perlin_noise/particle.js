const maximumHealth = 100;
const healthDecrease = 0.5;
const maximumSize = 5;

class Particle {
    constructor(x, y, speed) {
        if (x && y) {
            this.position = createVector(x, y);
        } else {
            this.position = createVector(random(width), random(height));
        }
        this.velocity = createVector(random(1), random(1));
        this.acceleration = createVector(0, 0);
        this.maximumSpeed = speed || random(0.1,1);
        this.size = maximumSize / this.maximumSpeed;
        this.health = maximumHealth;
    }
  
    update(foodPieces) {
        for (let i=foodPieces.length-1; i>=0; i--) {
            const distance = this.position.dist(foodPieces[i]);
            if (distance < this.size-3) {
                this.health = maximumHealth;
                foodPieces.splice(i,1);
                i = -1;
            }
        }
        this.health -= random(healthDecrease);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maximumSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    dead() {
        return this.health <= 0;
    }

    generateNewParticle() {
        if (random(1) < 0.0025) {
            return new Particle(this.position.x, this.position.y, this.maximumSpeed);
        }
        return null;
    }
  
    follow(vectors, scale, cols) {
        const x = floor(this.position.x / scale);
        const y = floor(this.position.y / scale);
        const index = x + y * cols;
        const force = vectors[index];
        this.applyForce(force);
    }
  
    applyForce(force) {
        this.acceleration.add(force);
    }
  
    show() {
        fill(51, map(this.health, 0, maximumHealth, 0, 255));
        noStroke();
        ellipse(this.position.x, this.position.y, this.size);
    }
  
    edges() {
        const { x, y } = this.position;
        const ms = maximumSize;
        this.position.x = (x < -ms) ? width + ms : x % (width + ms);
        this.position.y = (y < -ms) ? height + ms : y % (height + ms);
    }
}