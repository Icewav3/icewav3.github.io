class Collider {
  constructor() {}

  // To be implemented by derived classes
  checkCollision(position, otherGameObject) {
    throw new Error(
      "Method checkCollision must be implemented by derived classes",
    );
  }
}
