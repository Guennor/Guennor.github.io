function Circle() {

	this.x=random(2000)+30;
	this.y=random(1000)+30;
	
	this.diameter=10+random(80);
    

    var speedMultiplier = 5;
    var speed = tryLerp(speedMultiplier,0,this.diameter/100);
    this.vx=-1+random(2) * speed;
	this.vy=-1+random(2) * speed;
    
	this.r=random(255);
	this.g=random(255);
	this.b=random(255);

	this.draw=function() {
		stroke(255);
		fill(this.r, this.g, this.b);
		ellipse(this.x, this.y, this.diameter, this.diameter);
	}
	
	this.update=function() {
		this.x+=this.vx;
		this.y+=this.vy;
		
		if (this.x + (this.diameter/2) > 2000) {
			this.vx = -this.vx
		}
		
		if (this.x - (this.diameter/2) <0) {
			this.vx= -this.vx
		}
		if (this.y + (this.diameter/2) > 1000) {
			this.vy = -this.vy
		}
		
		if (this.y - (this.diameter/2) <0) {
			this.vy= -this.vy
		}
	}
}


function tryLerp (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    }


function resolveCollision (a,b) {
    this.speed ++;
	//defining a_color variables
	var ar_color= a.r;
	var ag_color= a.g;
	var ab_color= a.b;
	//defining b_color variables
	var br_color= b.r;
	var bg_color= b.g;
	var bb_color= b.b;
    
	//assigning 'a' colors to 'b'
	a.r= br_color;
	a.g= bg_color;
	a.b= bb_color;
	//assigning 'b' colors to 'a'
	b.r= ar_color;
	b.g= ag_color;
	b.b= ab_color;
	
	//reversing velocity 'a'
	a.vx= 0 -a.vx;
	a.vy= 0 -a.vy;
	//reversing velocity 'b'
	b.vx= 0 -b.vx;
	b.vy= 0 -b.vy;
}

function areColliding(a,b) {
	//assigning a variable to the distance function
	var distance= dist(a.x, a.y, b.x, b.y);
	//if statement to check distance between circles
	if (distance< (a.diameter/2) + (b.diameter/2)) {
		return true;
	} else {
		return false;
	}
}