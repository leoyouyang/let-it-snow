var world;
var mymodel;
var allImages = ['#sky'];
var flakes = [];
var bling;

function preload() {
  //bling = loadSound('images/sound.mp3');
}

function setup() {
	noCanvas();
	world = new World('VRScene');
	
	
	//build a house
	var house = new Box({
						x:-2, y:1, z:0, 
						width:4, height:2, depth:2, 
						red:200, green:150, blue:150,
						asset: 'brick',
						repeatX: 4,
						repeatY: 2,
						clickFunction: function(theHouse) {
	            if (theHouse.getAsset() == 'brick') {
	              theHouse.setAsset('stone');
	              //bling.play();
	            }
	            
	            else {
	              theHouse.setAsset('brick');
	              //bling.play();
	            }
	          }
					});
	world.add(house);
	
	
	//build a snowman
	snowman = new Container3D({
	          x:1.3, y:0, z:0
	        });
	world.add(snowman);

	var bottom = new Sphere({
						x:0, y:0.3, z:0,
						radius: 0.3,
						red:242, green:242, blue:242
					});
	snowman.addChild(bottom);

	var middle = new Sphere({
						x:0, y:0.84, z:0,
						radius: 0.24,
						red:242, green:242, blue:242,
					});
	snowman.addChild(middle);
	
	var head = new Sphere({
						x:0, y:1.25, z:0,
						radius: 0.17,
						red:242, green:242, blue:242
					});
	snowman.addChild(head);
	
	var eye1 = new Sphere({
						x:-0.06, y:1.3, z:0.14,
						radius: 0.02,
						red:0, green:0, blue:0
					});
	snowman.addChild(eye1);
	
	var eye2 = new Sphere({
						x:0.06, y:1.3, z:0.14,
						radius: 0.02,
						red:0, green:0, blue:0
					});
	snowman.addChild(eye2);
	
	var mouth = new Sphere({
						x:0, y:1.19, z:0.14,
						radius: 0.02,
						red:0, green:0, blue:0,
						scaleX: 3
					});
	snowman.addChild(mouth);
	
	var arm1 = new Cylinder({
						x:-0.3, y:0.75, z:0,
						height:0.5,
						radius: 0.02,
						red:58, green:30, blue:0,
						rotationX: 45,
						rotationY: 90
					});
	snowman.addChild(arm1);
	
	var arm2 = new Cylinder({
						x:0.3, y:0.75, z:0,
						height:0.5,
						radius: 0.02,
						red:58, green:30, blue:0,
						rotationX: -45,
						rotationY: 90
					});
	snowman.addChild(arm2);
	
	
	//import the 3D model
	mymodel = new DAE({
		asset: 'model',
		x:-1.5, y:1.3, z:1.15,
		scaleX:0.05,
		scaleY:0.05,
		scaleZ:0.05,
	});
	world.add(mymodel);
	

  //create many trees
  for (var i = 0; i < 40; i++) {
		var tx = random(-25, 25);
		var tz = random(-25, 25);
		var ts = random(0.5, 2);
		
		if (tx < -2 || tx > 2) {
		  if (tz < -3 || tz > 3) {
		    tree = new Container3D({
	            x:tx, y:0, z:tz,
	            scaleX:ts, scaleY:ts, scaleZ:ts
	      });
	      
	      world.add(tree);
	  
	      var tree_t = new Cylinder({
						  x:0, y:0.3, z:0,
						  height:0.6,
						  radius: 0.3,
						  red:58, green:30, blue:0,
					   });
	      tree.addChild(tree_t);

	      var tree_l1 = new Cone({
						  x:0, y:1.1, z:0,
						  height:1,
						  radiusBottom: 1.2, radiusTop: 0.4,
						  red:0, green:71, blue:9,
					  });
	      tree.addChild(tree_l1);

	      var tree_l2 = new Cone({
						  x:0, y:2, z:0,
						  height:0.8,
						  radiusBottom: 0.8, radiusTop: 0.2,
						  red:0, green:71, blue:9,
					  });
	      tree.addChild(tree_l2);

	      var tree_l3 = new Cone({
						  x:0, y:2.7, z:0,
						  height:0.6,
						  radiusBottom: 0.5, radiusTop: 0,
						  red:0, green:71, blue:9,
					  });
	      tree.addChild(tree_l3);
		  }
		}
  }
  
  //create a plane
	var g = new Plane({
					x:0, y:0, z:0, 
					width:50, height:50, 
					asset: 'snow',
					repeatX: 100,
					repeatY: 100,
					rotationX:-90, 
					metalness:0.2
				});
	
	world.add(g);
}

var szChange = 0.01;

function draw() {
  //move the user
  if (mouseIsPressed || touchIsDown) {
		world.moveUserForward(0.03);
	}

	var pos = world.getUserPosition();
	
	if (pos.x > 25) {
		world.setUserPosition(-25, pos.y, pos.z);
	}
	else if (pos.x < -25) {
		world.setUserPosition(25, pos.y, pos.z);
	}
	if (pos.z > 25) {
		world.setUserPosition(pos.x, pos.y, -50);
	}
	else if (pos.z < -25) {
		world.setUserPosition(pos.x, pos.y, 50);
	}
	
	
	//move the snowman
	var sz = snowman.getZ();
	
	if (sz > 2 || sz < 0) {
		szChange *= -1;
	}
	
	snowman.setZ(sz + szChange);
	
	
	//create the sky
	var sky = select('#theSky');
	sky.attribute('src', allImages[0]);
	
	
	//create a new flake
	var temp = new Flake(0, 0, -5);
	flakes.push(temp);
	
	//draw all flakes
	for (var i = 0; i < flakes.length; i++) {
		var result = flakes[i].move();
		if (result == "gone") {
			flakes.splice(i, 1);
			i -= 1;
		}
	}
}


function Flake(x,y,z) {
	this.myFlake = new Sphere({
							x:random(-25, 25), y:10, z:random(-25, 25),
							radius:0.05,
							red:255, green:255, blue:255
	});
	
	world.add(this.myFlake);
	
	this.xOffset = random(1000);
	this.zOffset = random(2000, 3000);
	
	this.move = function() {
		var yMovement = -0.03;
		var xMovement = map(noise(this.xOffset), 0, 1, -0.05, 0.05);
		var zMovement = map(noise(this.zOffset), 0, 1, -0.05, 0.05);
		
		this.xOffset += 0.01;
		this.yOffset += 0.01;
		
		this.myFlake.nudge(xMovement, yMovement, zMovement);
		
		var flakeY = this.myFlake.getY();
		
		if (flakeY < -1) {
			world.remove(this.myFlake);
			return "gone";
		}
		
		else {
			return "ok";
		}
	}
}
