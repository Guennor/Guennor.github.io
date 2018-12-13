function World() {
	
	this.bodies=[];
	
	this.update= function() {
		for (var i=0; i<this.bodies.length; i++) {
			this.bodies[i].update();
		}
		this.resolveCollisions();
	}
	
	this.resolveCollisions = function() {
		for (var i=0; i<this.bodies.length-1; i++) {
			for (var j=i+1; j<this.bodies.length; j++){
				if (areColliding(this.bodies[i], this.bodies[j]))
					resolveCollision(this.bodies[i], this.bodies[j]);
			}
		}
	}
	
	this.insertBody= function(body) {
		this.bodies.push(body);
	}
	
	this.draw= function () {
		for (var i=0; i<this.bodies.length; i++) {
			this.bodies[i].draw();
		}
	}
}