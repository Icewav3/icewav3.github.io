class Asteroid extends GameObject {
  /**
   * @param {p5.Vector} position
   * @param {p5.Vector} velocity
   * @param {number} rotation
   * @param {float} angularVelocity
   * @param {Collider} collider
   * @param {color} color
   * @param {int} size 30 = large, 20 = medium, 10 = small
   * @param {boolean} isActive
   */
  constructor(
    position,
    velocity,
    rotation,
    angularVelocity,
    collider,
    color,
    size,
    isActive = true,
  ) {
    super(
      position,
      velocity,
      rotation,
      angularVelocity,
      collider,
      color,
      1,
      isActive,
    );
    this.splitForce = 1.1;
    this.size = size;
  }

  draw() {
    super.draw();
  }

  update() {
    super.update();
  }

  split() {
    const asteroids = [];

    if (this.size <= 10) {
      return [];
    }

    const newSize = this.size >= 30 ? 20 : 10;
    const splitMultiplier =
      this.size >= 30 ? this.splitForce : this.splitForce * this.splitForce;

    // Create velocity vectors for the two new asteroids
    const velocity1 = this.velocity.copy().mult(splitMultiplier);
    const velocity2 = this.velocity.copy().mult(-splitMultiplier);

    // Add slight position offset to prevent immediate collision
    const position1 = this.position
      .copy()
      .add(velocity1.copy().normalize().mult(2));
    const position2 = this.position
      .copy()
      .add(velocity2.copy().normalize().mult(2));

    // Create the two new asteroids
    const asteroid1 = Asteroid.createAsteroid(
      position1,
      velocity1,
      0,
      random(-1, 1),
      CircleCollider.constructCollider(this.collider.radius / 2),
      this.color,
      newSize,
    );

    const asteroid2 = Asteroid.createAsteroid(
      position2,
      velocity2,
      0,
      random(-1, 1),
      CircleCollider.constructCollider(this.collider.radius / 2),
      this.color,
      newSize,
    );

    return [asteroid1, asteroid2];
  }

  getScore() {
    let score = 0;
    if (this.size >= 30) {
      score = 20;
    } else if (this.size === 20) {
      score = 50;
    } else if (this.size <= 10) {
      score = 100;
    }
    return score;
  }

  checkCollision(collidingGameObject) {
    return super.checkCollision(collidingGameObject);
  }

  destroy() {
    return this.split();
  }
  //Factory Method
  static createAsteroid(
    position,
    velocity,
    rotation,
    angularVelocity,
    collider,
    color,
    size,
  ) {
    return new Asteroid(
      position,
      velocity,
      rotation,
      angularVelocity,
      collider,
      color,
      size,
    );
  }
}
