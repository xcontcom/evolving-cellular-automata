var PopulationSize=200;
var fitness=[];
var population=[];
var rulesize=512;

var a=[];
var b=[];
var sizex=145;
var sizey=145;//178;
var size=2;
var rulesnumbers=[];
var cellscount=5;

/// local storage functions ///
async function loadPopulation() {
    try {
        const response = await fetch('storage/population.json'); // Path to your JSON file
        if (!response.ok) {
            throw new Error('Failed to load population data');
        }
        population = await response.json();
        return true;
    } catch (error) {
        console.error('Error loading population:', error);
        return false;
    }
}

async function loadFitness() {
    try {
        const response = await fetch('storage/fitness.json'); // Path to your JSON file
        if (!response.ok) {
            throw new Error('Failed to load fitness data');
        }
        fitness = await response.json();
        return true;
    } catch (error) {
        console.error('Error loading fitness:', error);
        return false;
    }
}
/// local storage functions ///



var randa=[];
function realrand(){
	if(randa.length==0) for(var i=0;i<PopulationSize;i++) randa[i]=i;
	var rem=Math.floor(Math.random()*(randa.length));
	//var rem=randa.length-1;									//not random
	var sp=randa.splice(rem,1)[0];
	return sp;
	//return 176;
}

function clearpage(changenumbers=true){
	var canvas, context, rand;
	for(var n=0;n<cellscount;n++){
		//a[n]=[];
		b[n]=[];
		
		canvas=document.getElementById('c'+n+'0');
		context=canvas.getContext('2d');
		canvas.width=sizex*size, canvas.height=sizey*size;
		context.fillStyle = 'rgb(0,0,0)';
		context.fillRect (0, 0, sizex*size, sizey*size);
		context.fillStyle = 'rgb(255,255,255)';
		
		for(var x=0;x<sizex;x++){
			//a[n][x]=[];
			b[n][x]=[];
			for(var y=0;y<sizey;y++){
				//a[n][x][y]=Math.round(Math.random());
				b[n][x][y]=Math.round(Math.random());
				//a[n][x][y]=1;
				//b[n][x][y]=1;
				//if(Math.round(Math.random()*4)==0) a[n][x][y]=0;
				//if(Math.round(Math.random()*4)==0) b[n][x][y]=0;
				if(b[n][x][y]) context.fillRect (x*size, y*size, size, size);
			}
		}
	}
	
	var c3=document.getElementsByName('c3[]');
	for(var i=0;i<c3.length;i++){
		c3[i].checked=false;
	}
	

	if(changenumbers){
		for(var i=0;i<cellscount;i++){
			rulesnumbers[i]=realrand();
		}
	}

	var hello0=document.getElementById('console-log0');
	hello0.innerHTML=rulesnumbers.join(', ');
	var hello1=document.getElementById('console-log1');
	hello1.innerHTML=fitness.join(', ');
	
}

function countpoints() {
    const temp = new Array(cellscount); // Use a fixed-size array for better performance
    let canvas, context;

    // Cache canvas and context outside the loop
    for (let n = 0; n < cellscount; n++) {
        temp[n] = new Array(sizex);
        canvas = document.getElementById('c' + n + '0');
        context = canvas.getContext('2d');
        canvas.width = sizex * size;
        canvas.height = sizey * size;
        context.fillStyle = 'rgb(0,0,0)';
        context.fillRect(0, 0, sizex * size, sizey * size);
        context.fillStyle = 'rgb(255,255,255)';

        for (let x = 0; x < sizex; x++) {
            temp[n][x] = new Array(sizey);
            const xm = (x - 1 + sizex) % sizex; // Wrap around using modulo
            const xp = (x + 1) % sizex;

            for (let y = 0; y < sizey; y++) {
                const ym = (y - 1 + sizey) % sizey;
                const yp = (y + 1) % sizey;

                // Calculate the bitmask in a single step
                let q = (
                    (b[n][xm][ym] << 8) |
                    (b[n][x][ym] << 7) |
                    (b[n][xp][ym] << 6) |
                    (b[n][xm][y] << 5) |
                    (b[n][x][y] << 4) |
                    (b[n][xp][y] << 3) |
                    (b[n][xm][yp] << 2) |
                    (b[n][x][yp] << 1) |
                    b[n][xp][yp]
                );

                temp[n][x][y] = population[rulesnumbers[n]][q];
                if (temp[n][x][y]) {
                    context.fillRect(x * size, y * size, size, size);
                }
            }
        }
    }

    b = temp; // Update the global `b` array
}



function count100(c){
	var cm=c-1
	var temp;
	var xp, yp, xm, ym, q;
	
	for(var i=0;i<cm;i++){
		temp=[];
		for(var n=0;n<cellscount;n++){
			temp[n]=[];
			for(var x=0;x<sizex;x++){
				xm=x-1;
				if(xm==-1) xm=sizex-1;
				xp=x+1;
				if(xp==sizex) xp=0;
				temp[n][x]=[];
				for(var y=0;y<sizey;y++){
					ym=y-1;
					if(ym==-1) ym=sizey-1;
					yp=y+1;
					if(yp==sizey) yp=0;
					//q=''+a[n][x][y]+b[n][xm][ym]+b[n][x][ym]+b[n][xp][ym]+b[n][xm][y]+b[n][x][y]+b[n][xp][y]+b[n][xm][yp]+b[n][x][yp]+b[n][xp][yp];
					//q=''+b[n][xm][ym]+b[n][x][ym]+b[n][xp][ym]+b[n][xm][y]+b[n][x][y]+b[n][xp][y]+b[n][xm][yp]+b[n][x][yp]+b[n][xp][yp];
					//q=parseInt(q, 2);
					q=b[n][xm][ym];
					q=(q<<1)+b[n][x][ym];
					q=(q<<1)+b[n][xp][ym];
					q=(q<<1)+b[n][xm][y];
					q=(q<<1)+b[n][x][y];
					q=(q<<1)+b[n][xp][y];
					q=(q<<1)+b[n][xm][yp];
					q=(q<<1)+b[n][x][yp];
					q=(q<<1)+b[n][xp][yp];
					temp[n][x][y]=population[rulesnumbers[n]][q];
				}
			}
		}
		//a=b;
		b=temp;
	}
	countpoints();
}

function genofond(){
	var canvas=document.getElementById('blanc');
	var context=canvas.getContext('2d');
	canvas.width=512, canvas.height=200;
	context.fillStyle = 'rgb(0,0,0)';
	context.fillRect (0, 0, 512, 200);
	context.fillStyle = 'rgb(255,255,255)';
	
	for(var y=0;y<200;y++){
		for(var x=0;x<512;x++){
			if(population[y][x]==1) context.fillRect (x, y, 1, 1);
		}
	}	
}

async function init() {
    // Create canvases and UI elements
    var canv = document.getElementById('canv');
    for (var n = 0; n < cellscount; n++) {
        var canvas1 = document.createElement('canvas');
        var canvasId = "c" + n + "0";
        canvas1.setAttribute("id", canvasId);
        var div1 = document.createElement('div');
        div1.setAttribute("class", "canv0");
        var div2 = document.createElement('div');
        div2.appendChild(canvas1);

        var inp1 = document.createElement('input');
        inp1.setAttribute("type", "checkbox");
        inp1.setAttribute("name", "c3[]");
        inp1.setAttribute("value", "1");
        var div3 = document.createElement('div');
        div3.appendChild(inp1);

        div1.appendChild(div2);
        div1.appendChild(div3);

        canv.appendChild(div1);
    }

    // Load population and fitness data
    const populationLoaded = await loadPopulation();
    const fitnessLoaded = await loadFitness();

    if (!populationLoaded || !fitnessLoaded) {
        console.log('Failed to load population or fitness data. Initializing new population.');
        newPopulation();
    }

    // Initialize the rest of the UI
    var canv = document.getElementById('canv2');
    var canvas1 = document.createElement('canvas');
    var canvasId = "blanc";
    canvas1.setAttribute("id", canvasId);
    var div1 = document.createElement('div');
    div1.setAttribute("class", "canv0");
    var div2 = document.createElement('div');
    div2.appendChild(canvas1);
    div1.appendChild(div2);
    canv.appendChild(div1);
    genofond();

    clearpage();
}

var selectcounter=0;
function selectc(){
	stop();
	var c3=document.getElementsByName('c3[]');
	for(var i=0;i<c3.length;i++){
		if(c3[i].checked){
			fitness[rulesnumbers[i]]++;
		}
	}
	saveFitness();
	clearpage();
	selectcounter++;
	var hello2=document.getElementById('console-log2');
	hello2.innerHTML="selections: "+selectcounter;
}


function sortf(c, d) {
	if (c[1] < d[1]) return 1;
	else if (c[1] > d[1]) return -1;
	else return 0;
}


function evolute(){
	stop();
	var sizehalf=PopulationSize/2;
	var sizequarter=sizehalf/2;
	var mutation=document.getElementById("mutatepercent").value*1;
	var mutategen=document.getElementById("mutategen").value*1;
	
	var arrayt=[]; //create temp array
	for(var n=0; n<PopulationSize; n++){ //join with fitness for sort
		arrayt[n]=[];
		arrayt[n][0]=population[n];
		arrayt[n][1]=fitness[n];
		arrayt[n][2]=n; //index of parent for new population;
	}
	
	arrayt.sort(sortf); //sort
	arrayt.length=sizehalf; //we've got temp array with half of cells (more adapted individs)
	population=[];
	fitness=[];
	

	
	// crossover //
	for(var i=0; i<sizequarter; i++){
		var i0=i*4;
		var i1=i*4+1;
		var i2=i*4+2;
		var i3=i*4+3;
		
		var removed1=Math.floor(Math.random()*(arrayt.length));
		var parent1f = arrayt.splice(removed1,1);
		var parent1=parent1f[0][0]; //take first parent from temp array
		var removed2=Math.floor(Math.random()*(arrayt.length));
		var parent2f = arrayt.splice(removed2,1);
		var parent2=parent2f[0][0]; //take second parent from temp array
		//console.log(parent1f[0][1], parent1f[0][2], parent2f[0][1], parent2f[0][2])
		
		var child1=[];
		var child2=[];
		
		for(var j=0; j<rulesize; j++){
			var gen=Math.round(Math.random());
			if(gen==1){
				child1[j]=parent1[j];
				child2[j]=parent2[j];
			}else{
				child1[j]=parent2[j];
				child2[j]=parent1[j];
			}
		}

		
		population[i0]=parent1; //put them back to population
		population[i1]=parent2;
		population[i2]=child1;
		population[i3]=child2;
			
		fitness[i0]=0;
		fitness[i1]=0;
		fitness[i2]=0;
		fitness[i3]=0;
	}
	// crossover //
	
	// mutation //
	var m=100/mutation;
	var m2=mutategen;//0
	for(var i=0; i<PopulationSize; i++){
		var rnd=Math.floor(Math.random()*(m))+1;
		if(rnd==1){
			var rnd2=Math.floor(Math.random()*(m2))+1;
			for(var j=0;j<rnd2;j++){
				var gen=Math.floor(Math.random()*(rulesize));
				if(population[i][gen])
					population[i][gen]=0;
				else
					population[i][gen]=1;
			}
		}
	}
	// mutation //
	
	//savePopulation();
	//saveFitness();
	genofond();
	clearpage();
	selectcounter=0;
}

function recreate(){
	stop();
	//newPopulation();
	clearpage();
	genofond();
}

function onestep(){
	countpoints();
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
function clearc(){
	clearpage(false);
}

function t(){
	for(var n=0;n<PopulationSize;n++) console.log("population["+n+"]=["+population[n].join(',')+"];");
}