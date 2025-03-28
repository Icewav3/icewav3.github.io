class Saucer extends GameObject {
  /**
   * Creates a new instance of Saucer.
   *
   * @param {p5.Vector} position - The position of the saucer as a vector.
   * @param {p5.Vector} [velocity=createVector(0, 0)] - The velocity of the saucer as a vector.
   * @param {number} [rotation=0] - The rotation of the saucer in radians or degrees.
   * @param {number} [angularVelocity=0] - The angular velocity of the saucer.
   * @param {Collider} [collider=CircleCollider.constructCollider(10)] - The collider for this saucer.
   * @param {color} [color] - The color of the saucer.
   * @param {float} [drag=1] - The drag applied to the saucer's movement.
   * @param {boolean} [isActive=true] - Indicates whether the saucer is active.
   * @param {number} [size=1] - Scale factor for the saucer's size
   * @param {number} shootDelay
   */
  constructor(
    position,
    velocity = createVector(0, 0),
    rotation = 0,
    angularVelocity = 0,
    collider = CircleCollider.constructCollider(10),
    color,
    drag = 1,
    isActive = true,
    size = 1,
    shootDelay = 3000,
  ) {
    super(
      position,
      velocity,
      rotation,
      angularVelocity,
      collider,
      color,
      drag,
      isActive,
    );
    this.size = size;
    this.shootDelay = shootDelay;
    this.bulletLifetime = 1000;
    this.bulletVelocityMult = 10;
    this.bullets = [];
    this.canShoot = true;
    this.ImproveAimScore = 1000;
  }

  update() {
    super.update();
    this.updateBullets();
    if (this.canShoot) {
      this.tryShoot();
    }
  }

  draw() {
    const wrappedX = super.screenWrap(this.position.x, width);
    const wrappedY = super.screenWrap(this.position.y, height);
    this.drawBullets();
    push();
    noStroke();
    fill(this.color || "orange");

    // Body of the saucer (ellipse)
    ellipse(wrappedX, wrappedY, 40 * this.size, 20 * this.size);

    // Dome of the saucer (smaller ellipse)
    fill("lightblue");
    ellipse(wrappedX, wrappedY - 8 * this.size, 20 * this.size, 10 * this.size);
    pop();
  }

  checkCollision(collidingGameObject) {
    return super.checkCollision(collidingGameObject);
  }
  tryShoot(playerShip) {
    if (!playerShip) return;

    if (this.size > 1) {
      // large saucer
      // very bad accuracy (high value means more random deviation)
      this.shoot(playerShip, 0.5);
    } else if (playerShip.score > this.ImproveAimScore) {
      // small saucer with good accuracy
      this.shoot(playerShip, 0.1); // Good accuracy = small random deviation
    } else {
      // small saucer with average accuracy
      this.shoot(playerShip, 0.25); // Average accuracy
    }
  }

  // Bullets
  shoot(playerShip, accuracy) {
    if (this.canShoot) {
      this.canShoot = false;
      this.timerId = setTimeout(() => {
        this.shootCallback();
      }, this.shootDelay);

      // Calculate direction vector toward player ship
      let directionToPlayer = p5.Vector.sub(playerShip.position, this.position);
      // Get angle from direction vector
      let angleToPlayer = directionToPlayer.heading();

      // Calculate base vector angle with random offset based on accuracy
      const randomOffset = random(-accuracy, accuracy);
      let bulletVector = p5.Vector.fromAngle(angleToPlayer + randomOffset);

      // Set position
      let bulletPosition = bulletVector.copy();
      // Move bullet to the tip of the saucer
      bulletPosition.mult(20);
      // Add ship position
      bulletPosition.add(this.position);
      // Calculate velocity
      let bulletVelocity = bulletVector.copy();
      //Mult by multiplier
      bulletVelocity.mult(this.bulletVelocityMult);

      let bullet = new Bullet(
        bulletPosition,
        bulletVelocity,
        angleToPlayer + randomOffset, // Use angleToPlayer instead of this._rotation
        0,
        CircleCollider.constructCollider(3),
        "orange",
        1,
        true,
        this.bulletLifetime,
      );
      this.bullets.push(bullet);
    }
  }

  shootCallback() {
    this.canShoot = true;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      if (bullet.isActive) {
        bullet.update();
      } else {
        this.bullets.splice(i, 1);
      }
    }
  }

  drawBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
    }
  }
}
