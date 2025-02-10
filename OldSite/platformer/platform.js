/**************************\
 *                        *
 * Platform Class         *
 *                        *
 * Represents a platform  *
 * in the game world.     *
 *                        *
 * - x, y: Coordinates of *
 *   the top-left corner. *
 * - width, height:       *
 *   Dimensions.          *
 *                        *
 * Methods:               *
 * - display(): Renders   *
 *   as a rectangle.      *
 *                        *
\**************************/

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  display() {
    fill(100);
    rect(this.x, this.y, this.width, this.height);
  }
}

// Ohhhhh so tiny, so elegant. We ❤️ short classes. So SRP.