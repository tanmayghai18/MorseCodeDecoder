(function() {

window.fullofstars = window.fullofstars || {};

window.fullofstars.PointMassBody = PointMassBody;

function PointMassBody(mass, position, velocity) {
    this.mass = mass;
    this.invMass = 1.0 / mass;
    this.position = position;
    this.velocity = velocity;
    this.force = new THREE.Vector3(0,0,0);
    this.prevForce = new THREE.Vector3(0,0,0);
}
PointMassBody.prototype = Object.create(Object.prototype);


var tempVec = new THREE.Vector3(0,0,0); // To avoid allocations during updates
var tempVec2 = new THREE.Vector3(0,0,0); // To avoid allocations during updates
PointMassBody.prototype.updateAndResetForce = function(dt) {
	var accelerationFactor = this.invMass * dt;
	var force = this.force;
	var velocity = this.velocity;
	tempVec.set(force.x*accelerationFactor, force.y*accelerationFactor, force.z*accelerationFactor);
	this.velocity.add(tempVec);
	tempVec.set(velocity.x*dt, velocity.y*dt, velocity.z*dt);
	this.position.add(tempVec);
    this.prevForce.copy(force);
	this.force.set(0,0,0);
};

PointMassBody.verletPositionStep = function(bodies, dt) {
    // Highly inlined for performance
    var velocityishX = 0.0, velocityishY = 0.0, velocityishZ = 0.0;
    for(var i=0, len=bodies.length; i<len; i++) {
        var body = bodies[i];
        var accelerationFactor = body.invMass * dt * 0.5;
        var position = body.position;
        var velocity = body.velocity;
        var force = body.force;
        var prevForce = body.prevForce;

        velocityishX = velocity.x;
        velocityishY = velocity.y;
        velocityishZ = velocity.z;

        velocityishX += force.x*accelerationFactor;
        velocityishY += force.y*accelerationFactor;
        velocityishZ += force.z*accelerationFactor;

        //VERLET: position += timestep * (velocity + timestep * acceleration / 2);
        position.x += velocityishX*dt;
        position.y += velocityishY*dt;
        position.z += velocityishZ*dt;

        prevForce.x = force.x;
        prevForce.y = force.y;
        prevForce.z = force.z;
    }
};

PointMassBody.verletAccelerationStep = function(bodies, dt) {
    // Highly inlined for performance
    for(var i=0, len=bodies.length; i<len; i++) {
        var body = bodies[i];
        var force = body.force;
        var velocity = body.velocity;
        var prevForce = body.prevForce;
        //VERLET: velocity += timestep * (acceleration + newAcceleration) / 2;
        var accelerationFactor = body.invMass * dt * 0.5;

        velocity.x += (force.x+prevForce.x)*accelerationFactor;
        velocity.y += (force.y+prevForce.y)*accelerationFactor;
        velocity.z += (force.z+prevForce.z)*accelerationFactor;

        prevForce.x = force.x;
        prevForce.y = force.y;
        prevForce.z = force.z;

        force.x = force.y = force.z = 0.0;
    }
};


PointMassBody.velocityVerletUpdate = function(bodies, dt, isPositionStep) {
    if(isPositionStep) {
        PointMassBody.verletPositionStep(bodies, dt);
    } else {
        PointMassBody.verletAccelerationStep(bodies, dt);
    }
};


fullofstars.createTwoTierSmartGravityApplicator = function(attractedCelestials, attractingCelestials) {
    var applicator = {closeInteractionCount: 0};
    var attractingIsAttracted = attractingCelestials === attractedCelestials;

    var pairForces = _.map(attractedCelestials, function() { return new THREE.Vector3(0, 0, 0); });

    var currentFarAttractedIndex = 0;




    applicator.applypairForces = function() {
        for(var i=0, len=attractedCelestials.length; i<len; i++) {
            attractedCelestials[i].force.add(pairForces[i]);
        }
    }


    applicator.handleBlackHoles = function() {
      // Highly inlined for performance
      var typicalStarMass = fullofstars.TYPICAL_STAR_MASS;
      var universeScaleRecipr = fullofstars.UNIVERSE_SCALE_RECIPROCAL;
      var gravitationalConstant = fullofstars.GRAVITATIONAL_CONSTANT;
      var gravityEpsilon = fullofstars.GRAVITY_EPSILON;
      var gravityEpsilonSqrd = gravityEpsilon*gravityEpsilon;


      var sqrDist = 0.0, force;
      var temp_force = new THREE.Vector3(0,0,0); // To avoid allocations during updates
      var DARK_FORCE_COEFFICIENT = 4*Math.pow(10, -20) * gravitationalConstant;
      for (var i = 0, len=attractedCelestials.length; i<len; i ++ ){ // iterate through all bodies
        for (var j = 0; j < fullofstars.NUMBLACKHOLES; j ++ ){ //iterate through all blackholes
          if (attractingIsAttracted && i == j){ //skip if bodies, bodies interaction and objects are the same
            continue;
          }

          var body1 = attractedCelestials[i];
          var body2 = attractingCelestials[j];

          var body1pos = body1.position;
          var body2pos = body2.position;

          var sqrDist = body1pos.distanceToSquared(body2pos) * universeScaleRecipr * universeScaleRecipr;
          var dist =  Math.sqrt(sqrDist);
          force = fullofstars.GRAVITATIONAL_CONSTANT * body1.mass * body2.mass / Math.pow(sqrDist + gravityEpsilonSqrd, 3/2);

          // var darkForce = DARK_FORCE_COEFFICIENT * gravitationalConstant
          force += DARK_FORCE_COEFFICIENT * (body1.mass * body2.mass / dist);

          var bodyforce = body1.force;
          temp_force.subVectors(body2.position, body1.position).normalize().multiplyScalar(force);
          bodyforce.add(temp_force);
        }
      }

    };

    applicator.handlePairForces = function(bodyCountToUpdatePairForcesFor){
      var typicalStarMass = fullofstars.TYPICAL_STAR_MASS;
      var universeScaleRecipr = fullofstars.UNIVERSE_SCALE_RECIPROCAL;
      var gravitationalConstant = fullofstars.GRAVITATIONAL_CONSTANT;
      var gravityEpsilon = fullofstars.GRAVITY_EPSILON;
      var gravityEpsilonSqrd = gravityEpsilon*gravityEpsilon;

      var body1To2X = 0.0, body1To2Y = 0.0; body1To2Z = 0.0;

      var attractedCount = attractedCelestials.length;
      var sqrDist = 0.0, force = 0.0;
      var temp_force = new THREE.Vector3(0,0,0); // To avoid allocations during updates

      for(var n=0; n<bodyCountToUpdatePairForcesFor; n++) {
          currentFarAttractedIndex++;
          if(currentFarAttractedIndex >= attractedCount) {
              currentFarAttractedIndex = 0;
          }
          var body1 = attractedCelestials[currentFarAttractedIndex];

          var farForce = pairForces[currentFarAttractedIndex];
          farForce.set(0,0,0);
          var attractedBody = attractedCelestials[currentFarAttractedIndex];

          for(var j=fullofstars.NUMBLACKHOLES; j<fullofstars.BODYCOUNT; j++) {
              if(attractingIsAttracted && j == currentFarAttractedIndex) {
                continue;
              }
              temp_force.set(0,0,0);
              var body2 = attractingCelestials[j];

              var sqrDist = body1.position.distanceToSquared(body2.position) * universeScaleRecipr * universeScaleRecipr;
              force = fullofstars.GRAVITATIONAL_CONSTANT * body1.mass * body2.mass / Math.pow(sqrDist + gravityEpsilonSqrd, 3/2);
              temp_force.subVectors(body2.position, body1.position).normalize().multiplyScalar(force);
              farForce.add(temp_force);

          }
          pairForces[currentFarAttractedIndex] = farForce;
        }
    };

    applicator.updateForces = function(bodyCountToUpdatePairForcesFor) {
        applicator.handleBlackHoles();
        applicator.handlePairForces(bodyCountToUpdatePairForcesFor);
        applicator.applypairForces();
    };
    return applicator;
}




fullofstars.createGravitySystem = function(particleCount, typicalMass, numBlackHole, blackholepos) {
    var bodies = [];

    var typicalStarSpeed = 7*Math.pow(10, 10) * fullofstars.UNIVERSE_SCALE;
    console.log("typical star speed", typicalStarSpeed);
    var side = 2300.0;

    var BLACK_HOLE_MASS = fullofstars.TYPICAL_STAR_MASS * 5000;

    for (var p = 0; p < particleCount; p++) {

        if(p < numBlackHole) {
            var mass = BLACK_HOLE_MASS;

            var dist = side * 2 * Math.random();
            // var pX = dist * Math.random() * 4 - dist * 2;
            // var pY = (dist * Math.random() * 2 - dist);
            // var pZ = dist * Math.random() * 4 - dist * 2;
            var pX = 0;
            var pY = 0;
            var pZ =0;


            var vel = new THREE.Vector3(pX, pY, pZ);
            vel.normalize();
            var requiredSpeed = typicalStarSpeed * 1.8 + typicalStarSpeed * 0.1 * Math.log(1.1+(10*dist/side));
            var xVel = vel.z * requiredSpeed;
            var yVel = vel.y * requiredSpeed;
            var zVel = -vel.x * requiredSpeed;
            // var xVel = 0;
            // var yVel = 0;
            // var zVel = 0
            var body = new PointMassBody(mass, new THREE.Vector3(pX, pY, pZ), new THREE.Vector3(xVel, yVel, zVel));

          }
        else if (numBlackHole > 0){
            var mass = typicalMass * 2 * Math.random() * Math.random();

            var closest_bh = Math.floor(Math.random() * (numBlackHole));
            var bh_pos = bodies[closest_bh].position;
            var dist = side * 0.8 * Math.random();
            var pX = dist * Math.random() * 2 - dist + bh_pos.x;
            var pY = (dist * Math.random() * 2 - dist)/2 + bh_pos.y;
            var pZ = dist * Math.random() * 2 - dist + bh_pos.z;

            var vel = new THREE.Vector3(pX - bh_pos.x, pY - bh_pos.y, pZ- bh_pos.z);
            vel.normalize();
            var requiredSpeed = typicalStarSpeed * 1.8 + typicalStarSpeed * 0.1 * Math.log(1.1+(10*dist/side));
            var xVel = vel.z * requiredSpeed;
            var yVel = vel.y * requiredSpeed;
            var zVel = -vel.x * requiredSpeed;
            var body = new PointMassBody(mass, new THREE.Vector3(pX, pY, pZ), new THREE.Vector3(xVel, yVel, zVel));


        } else {
          var mass = typicalMass * 2 * Math.random() * Math.random();

          var closest_bh = Math.floor(Math.random() * (blackholepos.length));
          var bh_pos = blackholepos[closest_bh];
          var dist = side * 0.8 * Math.random();
          var pX = dist * Math.random() * 2 - dist + bh_pos.x;
          var pY = (dist * Math.random() * 2 - dist)/2 + bh_pos.y;
          var pZ = dist * Math.random() * 2 - dist + bh_pos.z;

          var vel = new THREE.Vector3(pX - bh_pos.x, pY - bh_pos.y, pZ- bh_pos.z);
          vel.normalize();
          var requiredSpeed = typicalStarSpeed * 1.8 + typicalStarSpeed * 0.1 * Math.log(1.1+(10*dist/side));
          var xVel = vel.z * requiredSpeed;
          var yVel = vel.y * requiredSpeed;
          var zVel = -vel.x * requiredSpeed;
          var body = new PointMassBody(mass, new THREE.Vector3(pX, pY, pZ), new THREE.Vector3(xVel, yVel, zVel));

        }
        bodies.push(body);

      }
    return bodies;
};


})();
