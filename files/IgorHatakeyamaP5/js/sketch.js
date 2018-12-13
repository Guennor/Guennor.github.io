var circle1;

function setup() {
	createCanvas(2000,1000);
	world1= new World();
	
	for(i=0; i<50; i++) {
	circle1= new Circle();
	world1.insertBody(circle1);	
	}
}

function draw() {
	background(55,55,55);
	
	circle1.draw();
	world1.draw();
	circle1.update();
	world1.update();
}
