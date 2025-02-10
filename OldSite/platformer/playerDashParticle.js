class PlayerDashParticle {
  constructor(playerX, playerY, playerSize, dashDirection, dashLength, lifetime, playerColour) {
    this.size = playerSize;
    this.lifetime = lifetime;
    this.dashLength = dashLength;
    this.dashDirection = dashDirection;
    this.colour = playerColour;

    // Initialize the particle's opacity
    this.opacity = 255;

    // Adjust position based on dashDirection
    if (dashDirection >= 0) {
      this.x = playerX;
      this.y = playerY;
    } else {
      this.x = playerX + this.size;  // Offset for negative direction
      this.y = playerY;
    }
  }

  // Update the particle's lifetime and opacity
  updateLifetime() {
    if (this.lifetime > 0) {
      this.lifetime -= 1; // Decrease lifetime
      this.opacity = map(this.lifetime, 0, 255, 0, 255);
    }
  }

  // Display the particle
  display() {
    push();
    noStroke();

    // Adjust rect position for negative dashDirection
    if (this.dashDirection < 0) {
      fill(this.colour[0], this.colour[1], this.colour[2], this.opacity);
      rect(this.x - this.dashLength, this.y, this.dashLength + this.size, this.size); // Left dash
    } else {
      fill(this.colour[0], this.colour[1], this.colour[2], this.opacity);
      rect(this.x, this.y, this.dashLength + this.size, this.size); // Right dash
    }
    pop();
  }

  // Check if the particle is still active
  isActive() {
    return this.lifetime > 0;
  }
}
