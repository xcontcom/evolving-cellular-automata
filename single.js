var k;
var a=[];
var rulesize=512;
var rule=[];
var sizex=233;
var sizey=233;
var size=2;

function nexta(){
	rule=[0,0,0,1,1,1,0,1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,1,1,1,1,1,1,0,0,0,1,1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,1,0,0,1,1,0,1,1,0,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,1,1,0,1,1,0,0,1,0,0,0,0,0,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,1,0,1,1,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,0,0,0,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,0,1,0,1,1,0,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,0,0,1,0,0,1,1,1,1,1,1,1,1,0,1];
	rule=[0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,1,1,0,0,1,1,0,1,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,1,1,0,1,1,0,1,0,1,0,1,0,1,1,0,1,0,0,0,0,0,1,1,0,1,0,0,0,0,1,1,1,1,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,1,1,0,1,0,1,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,0,1,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,1,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,1,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,0,1,1,0,1,1,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,1,1,1,0,0,0,1,1,0,1,1,1,0,1,0,1,1,0,1,0,0,1,1,1,0,1,1,1,0,0,1,0,0,1,1,0,0,0,1,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,1,0,1,1,1];
	clearpage();
}

function clearpage(){
	k=0;
	var hello=document.getElementById('console-log0');
	hello.innerHTML=k;
	var canvas, context, rand;
	canvas=document.getElementById('myCanvas');
	context=canvas.getContext('2d');
	canvas.width=sizex*size, canvas.height=sizey*size;
	context.fillStyle = 'rgb(0,0,0)';
	context.fillRect (0, 0, sizex*size, sizey*size);
	context.fillStyle = 'rgb(255,255,255)';
	context.fillRect (255*size, 255*size, size, size);
	
	for(var x=0;x<sizex;x++){
		a[x]=[]
		for(var y=0;y<sizey;y++){
			a[x][y]=Math.round(Math.random());
			if(a[x][y]) context.fillRect(x*size, y*size, 1*size, 1*size);
		}
	}
	//a[0][0]=1;
}

function test(){
	countpoints();
}

function init(){
	nexta();
}

var timerId;
function start(){
	if(!timerId){
		timerId = setInterval(function() {
			countpoints();
		}, 1);
	}
	
};
function stop(){
	if(timerId){
		clearInterval(timerId);
		timerId=false;
	}
};
function countpoints() {
	k++;
    
    let canvas, context;

	const temp = new Array(sizex);
	canvas=document.getElementById('myCanvas');
	context = canvas.getContext('2d');
	canvas.width = sizex * size;
	canvas.height = sizey * size;
	context.fillStyle = 'rgb(0,0,0)';
	context.fillRect(0, 0, sizex * size, sizey * size);
	context.fillStyle = 'rgb(255,255,255)';

	for (let x = 0; x < sizex; x++) {
		temp[x] = new Array(sizey);
		const xm = (x - 1 + sizex) % sizex; // Wrap around using modulo
		const xp = (x + 1) % sizex;

		for (let y = 0; y < sizey; y++) {
			const ym = (y - 1 + sizey) % sizey;
			const yp = (y + 1) % sizey;

			// Calculate the bitmask in a single step
			let q = (
				(a[xm][ym] << 8) |
				(a[x][ym] << 7) |
				(a[xp][ym] << 6) |
				(a[xm][y] << 5) |
				(a[x][y] << 4) |
				(a[xp][y] << 3) |
				(a[xm][yp] << 2) |
				(a[x][yp] << 1) |
				a[xp][yp]
			);

			temp[x][y] = rule[q];
			if (temp[x][y]) {
				context.fillRect(x * size, y * size, size, size);
			}
		}
	}

    a = temp; // Update the global `b` array
	
	var hello=document.getElementById('console-log0');
	hello.innerHTML=k;
}