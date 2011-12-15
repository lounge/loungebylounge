
var container, canvas, context;
var WIDTH, HEIGHT;
				
var worms, mouseX, mouseY;

			function initWorms() {
				
				
			
				container = document.getElementById('container');

				WIDTH = window.innerWidth;
				HEIGHT = window.innerHeight;

				var canvas = document.createElement("canvas");
				canvas.width = WIDTH;
				canvas.height = HEIGHT;
				container.appendChild(canvas);

				context = canvas.getContext("2d");
				context.fillStyle = "rgb(255, 255, 255)";
				context.fillRect (0, 0, WIDTH, HEIGHT);

				worms = new Array();

				window.addEventListener('mousemove', onWindowMouseMove, false);
				
				setInterval(loop, 1000/60);
				
			}

			function onWindowMouseMove(event) {
			
				mouseX = event.clientX;
				mouseY = event.clientY;
				
			}

			function loop() {
				
				var pi2 = Math.PI * 2;
			
				if (worms.length < 500) {
				
					worms.push(new Worm(mouseX, mouseY));
					
				}

				context.beginPath();
				context.strokeStyle = "#000000";

				for (var i = 0; i < worms.length; i++) {
					
					var worm = worms[i],
					speed = worm.speed,
					life = worm.life ++,
					max_life = worm.max_life,
					rw = worm.rw += Math.random() - .5,
					x = worm.x += Math.cos(rw) * speed,
					y = worm.y += Math.sin(rw) * speed;
				
					//var branch = branches[i];
					worm.life ++;

					if (worm.life > 500) {
					
						worms.shift();
						continue;
					
					}

					context.moveTo(worm.x, worm.y);
					context.arc(x, y, 1, 1, pi2, false);

					worm.rw += Math.random() - 0.5;
					worm.x += Math.cos(worm.rw);
					worm.y += Math.sin(worm.rw);

					context.lineTo(worm.x, worm.y);
					
				}

				context.stroke();
				context.closePath();

				context.fillStyle = "rgba(255, 255, 255, 0.1)";
				context.fillRect (0, 0, WIDTH, HEIGHT);
			}

			var Worm = function(x, y) {
			
				this.life = 0;
				this.speed = Math.random() + 2;
				this.x = x;
				this.y = y;
				this.rw = Math.random() * 1;
				
			}