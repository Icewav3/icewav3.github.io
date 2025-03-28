class GameObject {
  /**
   * Creates a new instance of the object with the specified parameters.
   *
   * @param {p5.Vector} position - The position of the object as a vector.
   * @param {p5.Vector} [velocity=createVector(0, 0)] - The velocity of the object as a vector. Defaults to a vector with zero magnitude.
   * @param {number} rotation - The rotation of the object in radians or degrees.
   * @param {number} angularVelocity
   * @param {Collider} collider - The collider for this game object
   * @param {color} color - The color of the object
   * @param {float} drag
   * @param {boolean} isActive - Indicates whether the object is active.
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
  ) {
    this.position = position;
    this.velocity = velocity;
    this._rotation = rotation;
    this.angularVelocity = angularVelocity;
    this.drag = drag;
    this.color = color;
    this.isActive = isActive;
    this.collider = collider;
  }
  getPosition() {
    return this.position;
  }
  getRotation() {
    return this._rotation;
  }
  getVelocity() {
    return this.velocity;
  }

  update() {
    if (this.isActive) {
      this.rotation += this.angularVelocity;
      this.position = p5.Vector.add(this.position, this.velocity);
      this.velocity = p5.Vector.mult(this.velocity, this.drag);
      this.position.x = this.screenWrap(this.position.x, width);
      this.position.y = this.screenWrap(this.position.y, height);
    } else {
      //print("This object is inactive");
    }
  }

  draw() {
    if (this.isActive) {
      push();
      fill(this.color);

      if (this.collider instanceof PolygonCollider) {
        beginShape();
        for (let v of this.collider.vertices) {
          vertex(v.x + this.position.x, v.y + this.position.y);
        }
        endShape(CLOSE);
      } else if (this.collider instanceof CircleCollider) {
        circle(this.position.x, this.position.y, this.collider.radius * 2);
      }

      pop();
    } else {
      //print("This object is inactive");
    }
  }

  checkCollision(collidingGameObject) {
    if (!this.collider || !collidingGameObject.collider) {
      return false;
    }
    return this.collider.checkCollision(this.position, collidingGameObject);
  }

  screenWrap(value, max) {
    return ((value % max) + max) % max;
  }
  destroy() {}
}
