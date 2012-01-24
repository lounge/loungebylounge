
var timer;

function initSphere() {
	
	var pause = document.getElementById('pause');
	var start = document.getElementById('start');
	
	
	pause.addEventListener('click', function() {
		clearInterval(timer);
	}, false);
	
	start.addEventListener('click', function() {
		timer = setInterval( function() {
			    canvas.width = canvas.width;
			
			    time += .1
			
			    i = 1000
			    
			    var r1 = Math.round(Math.random() * 255);
			    var r2 = Math.round(Math.random() * 255);
			    var r3 = Math.round(Math.random() * 255);
			
			    while( i-- ) {
			    	    	
			    	if (i % 100 == 0)
			    	{
			    		r1 =  Math.round(Math.random() * 255);
						r2 =  Math.round(Math.random() * 255);
						r3 =  Math.round(Math.random() * 255);
			    	}
			        r =  (w+h)/2 * ( sin( ( time + i * .3 ) * ( .4 + ( sin(time/100000) / .3  * PI ) ) ) / PI )		
			
					context.fillStyle = "rgb(" + r1 + "," + r2 + "," + r3 + ")";  
			        context.fillRect( sin(i) * r + w/2, 
			                          cos(i) * r + h/2, 
			                          8, 
			                          8 )        
			    }
			}, 16 )
	}, false);

	var d = document,
	    canvas = d.body.appendChild( d.createElement( 'canvas' ) ),
	    context = canvas.getContext( '2d' ),
	    time = 0,
	    w = canvas.width = d.width,
	    h = canvas.height = d.height,
	    cos = Math.cos,
	    sin = Math.sin,
	    PI = Math.PI;
	    
	
	
}

function pause() {
	
}

function start() {
	
	

}

