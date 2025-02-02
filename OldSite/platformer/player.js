/**************************\
 *                        *
 * Player Class           *
 *                        *
 * The controllable       *
 * player character.      *
 *                        *
 * See constructor for    *
 * properties.            *
 *                        *
 * Methods:               *
 * - Constructor:         *
 *   Sets start position  *
 *   & physics constants. *
 * - processInput():      *
 *   Keyboard input.      *
 * - updatePhysics():     *
 *   Update velocity and  *
 *   position.            *
 * - platformCollisions() *
 *   Checks and resolves  *
 *   platform collisions. *
 * - display():           *
 *   Renders the player & *
 *   tutorial.            *
 * - tutorial():          *
 *   Show arrows until    *
 *   player interacts.    *
 *                        *
\**************************/

class Player {
  constructor(x, y) {
    // Tweakable Constants:
    this.size = 20;
    this.speedLimit = 10;
    this.horizontalMovementForce = 0.5;
    this.horizontalAirControlForce = 0.1;
    this.gravityForce = 0.5;
    this.groundFrictionFactor = 0.9;
    this.jumpForce = 15;
    this.dashCooldown = 3;
    this.dashDistance = 100;
    //vars
    this.canDash = true;
    this.jumps = 0;
    this.dashTimer = 0;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);

    // Let there be gravity!
    this.acceleration = createVector(0, this.gravityForce);

    this.onGround = false;
    this.jumping = false;

    this.hasInteracted = false; // Track initial user interaction
    this.jumpTutorial = false;
    this.dashTutorial = false;
    
    this.dashParticles = []; // Store active dash particles
  }

  // Processing user input using keyIsDown() allows
  // us to process multiple simultaneous keys.
  processInput() {
    // Basic horizontal movement:
    // (Note the ternary operators.)
    if (keyIsDown(LEFT_ARROW)) {
      this.acceleration.x = this.onGround
        ? -this.horizontalMovementForce
        : -this.horizontalAirControlForce;
      if (keyIsDown(16)) {
        this.tryDash(-1);
      }
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.acceleration.x = this.onGround
        ? this.horizontalMovementForce
        : this.horizontalAirControlForce;
      if (keyIsDown(16)) {
        this.tryDash(1);
      }
    }
    if (keyIsDown(UP_ARROW)) {
      this.jump();
    }
  }

  // Our standard physic simulation:
  updatePhysics() {
    this.position.x = constrain(this.position.x, 0, width - this.size);
    this.position.y = constrain(this.position.y, 0, height - this.size);
    //print(deltaTime)
    // Apply gravity and velocity
    this.velocity.add(this.acceleration);
    this.velocity.x = constrain(
      this.velocity.x,
      -this.speedLimit,
      this.speedLimit
    );
    this.velocity.y = constrain(
      this.velocity.y,
      -this.speedLimit,
      this.speedLimit
    );
    this.position.add(this.velocity);

    // Clear acceleration while maintaining gravity:
    this.acceleration = createVector(0, this.gravityForce);

    // Basic ground friction, makes for slidey player.
    if (this.onGround) {
      this.velocity.x *= this.groundFrictionFactor;
    }
    //check status of jump & dash
    this.checkJump();
    this.checkDash();

    // Update active dash particles
    for (let i = this.dashParticles.length - 1; i >= 0; i--) {
      const particle = this.dashParticles[i];
      particle.updateLifetime();
      if (!particle.isActive()) {
        this.dashParticles.splice(i, 1);
      }
    }
  }

  // Check for platform collision.
  platformCollisions(platforms) {
    // Find colliding platform, if any.
    const collidingPlatform = platforms.find((platform) =>
      this.isCollidingWith(platform)
    );

    if (collidingPlatform) {
      this.onGround = true;
      this.jumps = 2;
      // Land on the platform:
      this.position.y = collidingPlatform.y - this.size;
      // Stop falling:
      this.velocity.y = 0;
    } else {
      this.onGround = false;
    }
  }

  // Returns Bool: Are platform & player bounded-boxes colliding?
  // Always False, if player is jumping. This allows for jumping up
  // through platforms.
  isCollidingWith(platform) {
    return (
      this.position.x + this.size > platform.x &&
      this.position.x < platform.x + platform.width &&
      this.position.y + this.size >= platform.y &&
      this.position.y + this.size <= platform.y + platform.height &&
      this.velocity.y >= 0
    );
  }

  display() {
    if (this.jumps === 1) {
      fill(250, 50, 250);
    }
    if (this.onGround) {
      if (this.canDash == true) {
        fill(0, 250, 0);
      } else {
        fill(250, 150, 50); // orange on ground
      }
    } else {
      fill(50, 150, 250); // blue in air
    }
    if (this.jumps === 1) {
      fill(250, 50, 250);
    }
    rect(this.position.x, this.position.y, this.size, this.size);

    // Display tutorial if no interaction has occurred
    this.tutorial(this.position.x, this.position.y, this.size);

    // Display Particles
    for (const particle of this.dashParticles) {
      particle.display();
    }
  }
tutorial(x, y, size) {
  push();
  textSize(20);
  textAlign(CENTER, CENTER);
  fill(0);

  if (!this.hasInteracted) {
    // Initial movement tutorial
    text("←", x - size, y + size / 2);
    text("→", x + size * 2, y + size / 2);
    text("Move", x + size / 2, y - size);
    if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
      this.hasInteracted = true;
    }
  } else if (!this.jumpTutorial) {
    // Jump tutorial
    text("↑", x + size / 2, y - size * 1.5);
    text("Jump", x + size / 2, y - size * 2.5);
    if (keyIsDown(UP_ARROW) && this.jumping) {
      this.jumpTutorial = true;
    }
  } else if (!this.dashTutorial) {
    // Dash tutorial
    text("Shift + ← or →", x + size / 2, y - size * 4);
    text("Dash", x + size / 2, y - size * 5);
    if (!this.canDash && this.dashTimer > 0) {
      this.dashTutorial = true;
    }
  }

  pop();
}


  checkJump() {
    if (this.velocity.y === 0) {
      this.jumping = false;
    }
    //print(this.jumps);
    //print(this.jumping)
  }

  jump() {
    if (this.jumps > 0 && !this.jumping) {
      this.jumping = true;
      this.jumps -= 1;
      this.velocity.y -= this.jumpForce;
    }
  }
  checkDash() {
    if (frameCount > this.dashTimer) {
      this.canDash = true;
    }
  }
  tryDash(direction) {
    if (this.canDash === true) {
      // Dash particle creation
      const dashParticle = new PlayerDashParticle(
        this.position.x,
        this.position.y,
        this.size,
        direction,
        this.dashDistance,
        80,
        [0, 250, 0] // Particle color (orange)
      );
      this.dashParticles.push(dashParticle);
      
      // Dash movement
        this.position = createVector(
        this.position.x + direction * this.dashDistance,
        this.position.y, 0
      );
      this.velocity.x = 0;
      
      this.canDash = false;
      this.dashTimer = frameCount + 3 * frameRate();
    }
  }
}
