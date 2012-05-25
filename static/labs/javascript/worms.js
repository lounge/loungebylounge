
var container, canvas, context;
var WIDTH, HEIGHT, moveColor, moveTimer;
				
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
				context.fillStyle = "rgb(0, 0, 0)";
				context.fillRect (0, 0, WIDTH, HEIGHT);

				worms = new Array();

				window.addEventListener('mousemove', onWindowMouseMove, false);
				
				setInterval(loop, 1000/60);
				
			}

			function onWindowMouseMove(event) {
			
				mouseX = event.clientX;
				mouseY = event.clientY;
				
				
				clearInterval(moveTimer);
				
				moveTimer = setTimeout('setMoveColor()', 50);
				
				
				
			}
			
			function setMoveColor() {
				moveColor = "rgba(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ",1)";
			}

			function loop() {
				
				var pi2 = Math.PI * 2;
			
				if (worms.length < 500) {
				
					worms.push(new Worm(mouseX, mouseY));
					
					
					
				}

				// var loopColor;
				// if (worms.length % 100 === 0) {
					// loopColor = "rgba(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ",1)";
				// }
				
				context.beginPath();
				//context.strokeStyle = "#ffffff";

				for (var i = 0; i < worms.length; i++) {
					
					var worm = worms[i],
					speed = worm.speed,
					life = worm.life ++,
					max_life = worm.max_life,
					rw = worm.rw += Math.random() - .5,
					x = worm.x += Math.cos(rw) * speed,
					y = worm.y += Math.sin(rw) * speed;
					color = worm.color;
				
					//var branch = branches[i];
					worm.life ++;

					if (worm.life > 500) {
					
						worms.shift();
						continue;
					
					}

					
					context.moveTo(worm.x, worm.y);
					context.arc(x, y, 10, 0, pi2, false);
					context.strokeStyle = moveColor;
					context.fillStyle = moveColor;
					

					worm.rw += Math.random() - 0.5;
					worm.x += Math.cos(worm.rw);
					worm.y += Math.sin(worm.rw);

					context.lineTo(worm.x, worm.y);
					
				}
				
				context.fill();

				context.stroke();
				context.closePath();

				context.fillStyle = "rgba(0, 0, 0, 0.1)";
				context.fillRect (0, 0, WIDTH, HEIGHT);
			}

			var Worm = function(x, y) {
			
				this.color = "rgba(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ", 0.4)";
				//this.color = "rgba(255,255,255,1)";
				this.life = 0;
				this.speed = Math.random() + 2;
				this.x = x;
				this.y = y;
				this.rw = Math.random() * 1;
				
			}