
// Global configuration
/** @constant {number} PopulationSize - Number of CA rules */
const PopulationSize = 200;
/** @type {number[]} fitness - Fitness scores for each rule */
let fitness = [];
/** @type {number[][]} population - Array of 512-bit CA rules */
let population = [];
/** @constant {number} rulesize - Bits per rule (2^9 for Moore neighborhood) */
const rulesize = 512;

/** @type {number[][][]} a - Unused CA grid array (kept for compatibility) */
let a = [];
/** @type {number[][][]} b - Active CA grid array for visualization */
let b = [];
/** @type {number} sizex - Grid width */
let sizex = 145;
/** @type {number} sizey - Grid height */
let sizey = 145;
/** @constant {number} size - Pixel size per cell */
const size = 2;
/** @type {number[]} rulesnumbers - Indices of rules to display */
let rulesnumbers = [];
/** @constant {number} cellscount - Number of canvas elements */
const cellscount = 5;

// --------------------- Local Storage Functions ---------------------

/**
 * Loads population from server storage.
 * @returns {Promise<boolean>} True if loaded, false on error
 */
async function loadPopulation() {
    try {
        const response = await fetch('storage/population.json');
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

/**
 * Loads fitness from server storage.
 * @returns {Promise<boolean>} True if loaded, false on error
 */
async function loadFitness() {
    try {
        const response = await fetch('storage/fitness.json');
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

/**
 * Saves population to server storage.
 * @returns {Promise<boolean>} True if saved, false on error
 */
async function savePopulation() {
    try {
        const response = await fetch('/save-population', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(population)
        });
        if (!response.ok) {
            throw new Error('Failed to save population data');
        }
        return true;
    } catch (error) {
        console.error('Error saving population:', error);
        return false;
    }
}

/**
 * Saves fitness to server storage.
 * @returns {Promise<boolean>} True if saved, false on error
 */
async function saveFitness() {
    try {
        const response = await fetch('/save-fitness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fitness)
        });
        if (!response.ok) {
            throw new Error('Failed to save fitness data');
        }
        return true;
    } catch (error) {
        console.error('Error saving fitness:', error);
        return false;
    }
}

// --------------------- Utility Functions ---------------------

/** @type {number[]} randa - Array for random rule selection */
let randa = [];

/**
 * Selects a random rule index without replacement.
 * @returns {number} Rule index
 */
function realrand() {
    if (randa.length === 0) {
        for (let i = 0; i < PopulationSize; i++) randa[i] = i;
    }
    const rem = Math.floor(Math.random() * randa.length);
    return randa.splice(rem, 1)[0];
}

/**
 * Initializes the UI with random CA grids and rule indices.
 * @param {boolean} [changenumbers=true] - Whether to select new rule indices
 */
function clearpage(changenumbers = true) {
    // Initialize canvases
    for (let n = 0; n < cellscount; n++) {
        b[n] = [];
        const canvas = document.getElementById(`c${n}0`);
        const context = canvas.getContext('2d');
        canvas.width = sizex * size;
        canvas.height = sizey * size;
        context.fillStyle = 'rgb(0,0,0)';
        context.fillRect(0, 0, sizex * size, sizey * size);
        context.fillStyle = 'rgb(255,255,255)';

        for (let x = 0; x < sizex; x++) {
            b[n][x] = [];
            for (let y = 0; y < sizey; y++) {
                b[n][x][y] = Math.round(Math.random());
                if (b[n][x][y]) {
                    context.fillRect(x * size, y * size, size, size);
                }
            }
        }
    }

    // Reset checkboxes
    const c3 = document.getElementsByName('c3[]');
    for (let i = 0; i < c3.length; i++) {
        c3[i].checked = false;
    }

    // Update rule indices
    if (changenumbers) {
        for (let i = 0; i < cellscount; i++) {
            rulesnumbers[i] = realrand();
        }
    }

    // Update UI displays
    document.getElementById('console-log0').innerHTML = rulesnumbers.join(', ');
    document.getElementById('console-log1').innerHTML = fitness.join(', ');
}

// --------------------- CA Simulation ---------------------

/**
 * Updates CA grids by applying rules and rendering to canvases.
 */
function countpoints() {
    const temp = new Array(cellscount);
    for (let n = 0; n < cellscount; n++) {
        temp[n] = new Array(sizex);
        const canvas = document.getElementById(`c${n}0`);
        const context = canvas.getContext('2d');
        canvas.width = sizex * size;
        canvas.height = sizey * size;
        context.fillStyle = 'rgb(0,0,0)';
        context.fillRect(0, 0, sizex * size, sizey * size);
        context.fillStyle = 'rgb(255,255,255)';

        for (let x = 0; x < sizex; x++) {
            temp[n][x] = new Array(sizey);
            const xm = (x - 1 + sizex) % sizex;
            const xp = (x + 1) % sizex;

            for (let y = 0; y < sizey; y++) {
                const ym = (y - 1 + sizey) % sizey;
                const yp = (y + 1) % sizey;

                // Compute neighborhood bitmask
                const q = (
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

    b = temp; // Update active grid
}

/**
 * Runs multiple CA iterations.
 * @param {number} c - Number of iterations
 */
function count100(c) {
    const cm = c - 1;
    for (let i = 0; i < cm; i++) {
        const temp = new Array(cellscount);
        for (let n = 0; n < cellscount; n++) {
            temp[n] = new Array(sizex);
            for (let x = 0; x < sizex; x++) {
                const xm = (x - 1 + sizex) % sizex;
                const xp = (x + 1) % sizex;
                temp[n][x] = new Array(sizey);
                for (let y = 0; y < sizey; y++) {
                    const ym = (y - 1 + sizey) % sizey;
                    const yp = (y + 1) % sizey;

                    // Compute neighborhood bitmask
                    const q = (
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
                }
            }
        }
        b = temp;
    }
    countpoints();
}

// --------------------- Visualization ---------------------

/**
 * Renders the population as a 512x200 genotype map.
 */
function genofond() {
    const canvas = document.getElementById('blanc');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 200;
    context.fillStyle = 'rgb(0,0,0)';
    context.fillRect(0, 0, 512, 200);
    context.fillStyle = 'rgb(255,255,255)';

    for (let y = 0; y < 200; y++) {
        for (let x = 0; x < 512; x++) {
            if (population[y][x] === 1) {
                context.fillRect(x, y, 1, 1);
            }
        }
    }
}

// --------------------- Initialization ---------------------

/**
 * Initializes the UI, loads data, and sets up canvases.
 */
async function init() {
    // Create canvas elements for CA grids
    const canv = document.getElementById('canv');
    for (let n = 0; n < cellscount; n++) {
        const canvas1 = document.createElement('canvas');
        const canvasId = `c${n}0`;
        canvas1.setAttribute('id', canvasId);
        const div1 = document.createElement('div');
        div1.setAttribute('class', 'canv0');
        const div2 = document.createElement('div');
        div2.appendChild(canvas1);

        const inp1 = document.createElement('input');
        inp1.setAttribute('type', 'checkbox');
        inp1.setAttribute('name', 'c3[]');
        inp1.setAttribute('value', '1');
        const div3 = document.createElement('div');
        div3.appendChild(inp1);

        div1.appendChild(div2);
        div1.appendChild(div3);
        canv.appendChild(div1);
    }

    // Load data
    const populationLoaded = await loadPopulation();
    const fitnessLoaded = await loadFitness();

    if (!populationLoaded || !fitnessLoaded) {
        console.log('Failed to load data. Please ensure server is running.');
        // Note: Client-side newPopulation not implemented; rely on server
    }

    // Create genotype canvas
    const canv2 = document.getElementById('canv2');
    const canvas1 = document.createElement('canvas');
    canvas1.setAttribute('id', 'blanc');
    const div1 = document.createElement('div');
    div1.setAttribute('class', 'canv0');
    const div2 = document.createElement('div');
    div2.appendChild(canvas1);
    div1.appendChild(div2);
    canv2.appendChild(div1);
    genofond();

    clearpage();
}

// --------------------- Genetic Algorithm ---------------------

/** @type {number} selectcounter - Tracks number of user selections */
let selectcounter = 0;

/**
 * Increments fitness for selected rules and saves changes.
 */
async function selectc() {
    stop();
    const c3 = document.getElementsByName('c3[]');
    for (let i = 0; i < c3.length; i++) {
        if (c3[i].checked) {
            fitness[rulesnumbers[i]]++;
        }
    }
    await saveFitness();
    clearpage();
    selectcounter++;
    document.getElementById('console-log2').innerHTML = `selections: ${selectcounter}`;
}

/**
 * Comparison function for sorting rules by fitness (descending).
 * @param {Array} c - Rule array with fitness
 * @param {Array} d - Rule array with fitness
 * @returns {number} Comparison result
 */
function sortf(c, d) {
    if (c[1] < d[1]) return 1;
    else if (c[1] > d[1]) return -1;
    else return 0;
}

/**
 * Evolves the population using crossover and mutation.
 */
async function evolute() {
    stop();
    const sizehalf = PopulationSize / 2;
    const sizequarter = sizehalf / 2;
    const mutation = document.getElementById('mutatepercent').value * 1;
    const mutategen = document.getElementById('mutategen').value * 1;

    // Combine rules with fitness for sorting
    const arrayt = [];
    for (let n = 0; n < PopulationSize; n++) {
        arrayt[n] = [];
        arrayt[n][0] = population[n];
        arrayt[n][1] = fitness[n];
        arrayt[n][2] = n;
    }

    // Keep top 50% by fitness
    arrayt.sort(sortf);
    arrayt.length = sizehalf;
    population = [];
    fitness = [];

    // Crossover: Create two children from two parents
    for (let i = 0; i < sizequarter; i++) {
        const i0 = i * 4;
        const i1 = i * 4 + 1;
        const i2 = i * 4 + 2;
        const i3 = i * 4 + 3;

        // Select random parents
        const removed1 = Math.floor(Math.random() * arrayt.length);
        const parent1f = arrayt.splice(removed1, 1);
        const parent1 = parent1f[0][0];
        const removed2 = Math.floor(Math.random() * arrayt.length);
        const parent2f = arrayt.splice(removed2, 1);
        const parent2 = parent2f[0][0];

        const child1 = [];
        const child2 = [];

        // Randomly swap genes
        for (let j = 0; j < rulesize; j++) {
            const gen = Math.round(Math.random());
            if (gen === 1) {
                child1[j] = parent1[j];
                child2[j] = parent2[j];
            } else {
                child1[j] = parent2[j];
                child2[j] = parent1[j];
            }
        }

        // Add parents and children to new population
        population[i0] = parent1;
        population[i1] = parent2;
        population[i2] = child1;
        population[i3] = child2;

        fitness[i0] = 0;
        fitness[i1] = 0;
        fitness[i2] = 0;
        fitness[i3] = 0;
    }

    // Mutation: Randomly flip genes
    const m = 100 / mutation;
    const m2 = mutategen;
    for (let i = 0; i < PopulationSize; i++) {
        const rnd = Math.floor(Math.random() * m) + 1;
        if (rnd === 1) {
            const rnd2 = Math.floor(Math.random() * m2) + 1;
            for (let j = 0; j < rnd2; j++) {
                const gen = Math.floor(Math.random() * rulesize);
                population[i][gen] = population[i][gen] ? 0 : 1;
            }
        }
    }

    await savePopulation();
    await saveFitness();
    genofond();
    clearpage();
    selectcounter = 0;
}

/**
 * Resets the UI and clears grids.
 */
function recreate() {
    stop();
    clearpage();
    genofond();
}

// --------------------- Animation Controls ---------------------

/**
 * Advances the CA simulation by one step.
 */
function onestep() {
    countpoints();
}

/** @type {number|boolean} timerId - Interval ID for animation */
let timerId;

/**
 * Starts continuous CA simulation.
 */
function start() {
    if (!timerId) {
        timerId = setInterval(countpoints, 1);
    }
}

/**
 * Stops continuous CA simulation.
 */
function stop() {
    if (timerId) {
        clearInterval(timerId);
        timerId = false;
    }
}

/**
 * Clears grids without changing rule indices.
 */
function clearc() {
    clearpage(false);
}

/**
 * Prints all population rules to console (for debugging).
 */
function t() {
    for (let n = 0; n < PopulationSize; n++) {
        console.log(`population[${n}]=[${population[n].join(',')}]`);
    }
}

// Start initialization
//init();
