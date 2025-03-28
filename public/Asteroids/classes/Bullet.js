class Bullet extends GameObject {
  /**
   * Creates a new instance of Bullet with the specified parameters.
   *
   * @param {p5.Vector} position - The position of the bullet as a vector.
   * @param {p5.Vector} [velocity=createVector(0, 0)] - The velocity of the bullet as a vector. Defaults to a vector with zero magnitude.
   * @param {number} rotation - The rotation of the bullet in radians or degrees.
   * @param {number} angularVelocity - The angular velocity of the bullet.
   * @param {Collider} collider - The collider for this bullet.
   * @param {color} color - The color of the bullet.
   * @param {float} drag - The drag coefficient for the bullet.
   * @param {boolean} isActive - Indicates whether the bullet is active.
   * @param {number} [lifetime=1000] - Time in milliseconds until the bullet deactivates.
   */
  constructor(
    position,
    velocity = createVector(0, 0),
    rotation = 0,
    angularVelocity = 0,
    collider = CircleCollider.constructCollider(3),
    color,
    drag = 1,
    isActive = true,
    lifetime = 1000,
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

    // Store the lifetime property
    this.lifetime = lifetime;

    // Set up the timer that will deactivate the bullet after lifetime milliseconds
    this.timerId = setTimeout(() => {
      this.lifetimeCallback();
    }, this.lifetime);
  }

  lifetimeCallback() {
    this.isActive = false;
    // Clear the timer to prevent memory leaks
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  update() {
    if (this.isActive) {
      super.update();
    }
  }

  draw() {
    if (this.isActive) {
      super.draw();
    }
  }

  checkCollision(collidingGameObject) {
    if (!(collidingGameObject instanceof GameObject)) {
      //print("Colliding object is not a GameObject");
      return false;
    }
    if (collidingGameObject instanceof Ship) {
      //print("Bullet collided with ship");
      return false;
    }
    let destroyed = super.checkCollision(collidingGameObject);
    if (destroyed) {
      this.isActive = false;
      collidingGameObject.isActive = false;
    }

    return destroyed;
  }

  destroy() {
    clearTimeout(this.timerId);
  }
}
