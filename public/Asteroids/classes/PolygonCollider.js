class PolygonCollider extends Collider {
  constructor(gameObject, vertices) {
    super(gameObject);
    this.vertices = vertices;
    this.normals = this.calculateNormals();
  }

  static create(gameObject, vertices) {
    return new PolygonCollider(gameObject, vertices);
  }

  calculateNormals() {
    let normals = [];
    for (let i = 0; i < this.vertices.length; i++) {
      // Get current vertex and next vertex
      let current = this.vertices[i];
      let next = this.vertices[(i + 1) % this.vertices.length];

      // Calculate edge vector
      let edge = p5.Vector.sub(next, current);

      // Calculate normal (perpendicular vector)
      let normal = createVector(-edge.y, edge.x).normalize();
      normals.push(normal);
    }
    return normals;
  }

  checkCollision(otherCollider) {
    // Only handle polygon-to-polygon collisions
    if (otherCollider instanceof PolygonCollider) {
      return this.checkPolygonCollision(otherCollider);
    }
    return false;
  }

  checkPolygonCollision(otherPolygonCollider) {
    let isColliding = true;
    let min1, max1, min2, max2;
    let combinedNormals = this.normals.concat(otherPolygonCollider.normals);

    for (let i = 0; i < combinedNormals.length; i++) {
      min1 = Infinity;
      max1 = -Infinity;
      min2 = Infinity;
      max2 = -Infinity;

      // Project this polygon's vertices onto the axis
      for (let v of this.vertices) {
        let projectedVertex = p5.Vector.add(v, this.gameObject.position);
        let projection = projectedVertex.dot(combinedNormals[i]);
        if (projection < min1) min1 = projection;
        if (projection > max1) max1 = projection;
      }

      // Project other polygon's vertices onto the axis
      for (let v of otherPolygonCollider.vertices) {
        let projectedVertex = p5.Vector.add(
          v,
          otherPolygonCollider.gameObject.position,
        );
        let projection = projectedVertex.dot(combinedNormals[i]);
        if (projection < min2) min2 = projection;
        if (projection > max2) max2 = projection;
      }

      // Check for gap
      if (!(min1 < max2 && min1 > min2) && !(min2 < max1 && min2 > min1)) {
        isColliding = false;
        break;
      }
    }

    return isColliding;
  }
}
