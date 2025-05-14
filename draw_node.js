const fs = require('fs');
const path = require('path');

/** @constant {number} PopulationSize - Number of CA rules in the population */
const PopulationSize = 200;
/** @type {number[]} fitness - Fitness scores for each rule */
let fitness = [];
/** @type {number[][]} population - Array of 512-bit CA rules */
let population = [];
/** @constant {number} rulesize - Number of bits per rule (2^9 for Moore neighborhood) */
const rulesize = 512;

/** @type {number} sizex - Grid width (configurable) */
let sizex = 89;
/** @type {number} sizey - Grid height (configurable) */
let sizey = 89;
/** @type {number} maxIterations - Number of CA iterations per evaluation */
let maxIterations = 50;

/** @type {number} mutation - Mutation probability (percent) */
let mutation = 20;
/** @type {number} mutategen - Maximum genes to mutate per rule */
let mutategen = 32;

/** @constant {number} newPopulationDensity - Initial live cell probability for rules */
const newPopulationDensity = 0.35;

// Configuration for fitness evaluation
/** @constant {number} patchSize - Size of patches for symmetry checks */
const patchSize = 3;
/** @constant {number} minDensity - Minimum live cell density for valid grids */
const minDensity = 0.3;
/** @constant {number} maxDensity - Maximum live cell density for valid grids */
const maxDensity = 0.4;

// --------------------- File Storage Functions ---------------------

/** @constant {string} storagePath - Directory for JSON storage */
const storagePath = path.join(__dirname, 'storage');

/**
 * Creates the storage directory if it doesn't exist.
 */
function ensureStorageDir() {
    if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath);
    }
}

/**
 * Saves population and fitness to JSON files.
 * @returns {boolean} True on success
 */
function savePopulation() {
    ensureStorageDir();
    fs.writeFileSync(path.join(storagePath, 'population.json'), JSON.stringify(population));
    fs.writeFileSync(path.join(storagePath, 'fitness.json'), JSON.stringify(fitness));
    return true;
}

/**
 * Loads population and fitness from JSON files.
 * @returns {boolean} True if loaded, false if files don't exist
 */
function resumePopulation() {
    ensureStorageDir();
    if (!fs.existsSync(path.join(storagePath, 'population.json')) || !fs.existsSync(path.join(storagePath, 'fitness.json'))) {
        return false;
    }
    population = JSON.parse(fs.readFileSync(path.join(storagePath, 'population.json'), 'utf8'));
    fitness = JSON.parse(fs.readFileSync(path.join(storagePath, 'fitness.json'), 'utf8'));
    return true;
}

/**
 * Initializes a new population with random rules.
 */
function newPopulation() {
    population = [];
    fitness = [];
    ensureStorageDir();
    // Clear existing storage files
    fs.readdirSync(storagePath).forEach(file => fs.unlinkSync(path.join(storagePath, file)));
    for (let n = 0; n < PopulationSize; n++) {
        population[n] = [];
        fitness[n] = 0;
        for (let i = 0; i < rulesize; i++) {
            population[n][i] = Math.random() < newPopulationDensity ? 1 : 0; // Sparse initialization
        }
    }
    savePopulation();
}

// --------------------- Heatmap and Best Population Storage ---------------------

/** @constant {string} heatmapFile - Path to fitness heatmap JSON */
const heatmapFile = path.join(storagePath, 'heatmap.json');
/** @constant {string} heatmapAverageFile - Path to average fitness heatmap JSON */
const heatmapAverageFile = path.join(storagePath, 'heatmapAverage.json');
/** @constant {string} bestPopulationPath - Path to best population JSON */
const bestPopulationPath = path.join(storagePath, 'bestPopulation.json');
/** @constant {string} bestAverageFitnessPath - Path to best average fitness JSON */
const bestAverageFitnessPath = path.join(storagePath, 'bestAverageFitness.json');

/** @type {number} bestAverageFitness - Tracks the highest average fitness */
let bestAverageFitness = -Infinity;

/**
 * Calculates the average fitness of the population.
 * @returns {number} Average fitness
 */
function calculateAverageFitness() {
    let sumFitness = 0;
    for (let i = 0; i < PopulationSize; i++) {
        sumFitness += fitness[i];
    }
    return sumFitness / PopulationSize;
}

/**
 * Saves the current population as the best if its average fitness is higher.
 * @param {number} averageFitness - Current average fitness
 */
function saveBestPopulation(averageFitness) {
    ensureStorageDir();
    fs.writeFileSync(bestPopulationPath, JSON.stringify(population));
    fs.writeFileSync(bestAverageFitnessPath, JSON.stringify(averageFitness));
    console.log(`Saved best population with average fitness: ${averageFitness}`);
}

/**
 * Loads the best population and its average fitness.
 * @returns {boolean} True if loaded, false if not found
 */
function loadBestPopulation() {
    if (fs.existsSync(bestPopulationPath) && fs.existsSync(bestAverageFitnessPath)) {
        population = JSON.parse(fs.readFileSync(bestPopulationPath, 'utf8'));
        bestAverageFitness = JSON.parse(fs.readFileSync(bestAverageFitnessPath, 'utf8'));
        console.log(`Loaded best population with average fitness: ${bestAverageFitness}`);
        return true;
    }
    return false;
}

/**
 * Loads the best average fitness.
 * @returns {boolean} True if loaded, false if not found
 */
function loadBestAverageFitness() {
    if (fs.existsSync(bestAverageFitnessPath)) {
        bestAverageFitness = JSON.parse(fs.readFileSync(bestAverageFitnessPath, 'utf8'));
        console.log(`Loaded bestAverageFitness: ${bestAverageFitness}`);
        return true;
    }
    console.log("No bestAverageFitness found. Keeping default value: -Infinity.");
    return false;
}

// --------------------- Genetic Algorithm Functions ---------------------

/**
 * Resets fitness scores for all rules.
 */
function clearFitness() {
	for (let n = 0; n < PopulationSize; n++) {
		fitness[n] = 0;
	}
	savePopulation();
}

/**
 * Initializes the simulator by loading or creating a population.
 */
function init() {
	if (!resumePopulation()) {
		newPopulation();
	}
	loadBestAverageFitness();
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
function evolute() {
	const sizehalf = PopulationSize / 2;
	const sizequarter = sizehalf / 2;

    // Combine rules with fitness for sorting
	let arrayt = [];
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
		const removed1 = Math.floor(Math.random() * (arrayt.length));
		const parent1f = arrayt.splice(removed1, 1);
		const parent1 = parent1f[0][0];
		const removed2 = Math.floor(Math.random() * (arrayt.length));
		const parent2f = arrayt.splice(removed2, 1);
		const parent2 = parent2f[0][0];

		const child1 = [];
		const child2 = [];

        // Randomly swap genes between parents
		for (let j = 0; j < rulesize; j++) {
			const gen = Math.round(Math.random());
			if (gen == 1) {
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
		const rnd = Math.floor(Math.random() * (m)) + 1;
		if (rnd == 1) {
			const rnd2 = Math.floor(Math.random() * (m2)) + 1;
			for (let j = 0; j < rnd2; j++) {
				const gen = Math.floor(Math.random() * (rulesize));
				if (population[i][gen])
					population[i][gen] = 0;
				else
					population[i][gen] = 1;
			}
		}
	}
	
	savePopulation();
}

/**
 * Resets the population to a new random set.
 */
function recreate() {
	newPopulation();
}

/**
 * Runs the evolution process for a specified number of iterations.
 * @param {number} counter - Number of evolution cycles
 * "evil" is like "evol", but a kind of evol that can burn out your processor :)
 */
function evil(counter) {
	clearFitness();
	for (let i = 0; i < counter; i++) {
		//console.time('timer');
		console.log(i+" of "+counter);
		test();
		//console.timeEnd('timer');
	}
	savePopulation();
}

// --------------------- Cellular Automata Simulation ---------------------

/**
 * Evaluates each rule by simulating a CA and computing fitness.
 */
function test() {
	// Ensure population is initialized
	if (!population || population.length === 0) {
		console.error('Population is not initialized. Calling init...');
		init();
	}
	
	for (let n = 0; n < PopulationSize; n++) {
		fitness[n] = 0; // Reset fitness for the current individual

        // Initialize random grid
		let array = new Array(sizex);
		for (let x = 0; x < sizex; x++) {
			array[x] = new Int8Array(sizey);
			for (let y = 0; y < sizey; y++) {
				array[x][y] = Math.round(Math.random());
			}
		}

        // Simulate CA for maxIterations
		for (let i = 0; i < maxIterations; i++) {
			let temp = new Array(sizex);
			for (let x = 0; x < sizex; x++) {
				const xm = (x - 1 + sizex) % sizex; // Toroidal boundary (periodic boundary conditions)
				const xp = (x + 1) % sizex;
				temp[x] = new Int8Array(sizey);

				for (let y = 0; y < sizey; y++) {
					const ym = (y - 1 + sizey) % sizey;
					const yp = (y + 1) % sizey;

                    // Compute neighborhood bitmask
					const q = (
						(array[xm][ym] << 8) |
						(array[x][ym] << 7) |
						(array[xp][ym] << 6) |
						(array[xm][y] << 5) |
						(array[x][y] << 4) |
						(array[xp][y] << 3) |
						(array[xm][yp] << 2) |
						(array[x][yp] << 1) |
						array[xp][yp]
					);

					temp[x][y] = population[n][q];
				}
			}
			array = temp; // Update the array for the next iteration
			
			//if(i>=(maxIterations-10)) fitness[n] += countfitness(array);
			//If the pattern is hard to find, you can uncomment this section and search not in the last state, but in the last 10 states.
			
		}

		// Calculate fitness after maxIterations iterations
		fitness[n] = countfitness(array);
	}

	// Evolve the population
	testevolute();
	evolute();
}

// --------------------- Fitness Functions ---------------------

/** @constant {string} fitnessMode - Fitness evaluation mode ('bestMatch' or 'totalMatches') */
const fitnessMode = 'totalMatches';

// Pattern-based fitness configuration
/** @constant {number[][]} pattern - 5x5 target pattern for matching */
const pattern = [
	[1, 0, 1, 0, 1],
	[0, 0, 1, 0, 0],
	[0, 1, 0, 1, 0],
	[1, 0, 0, 0, 1],
	[1, 0, 1, 0, 1]
];

/**
 * Rotates a pattern 90° clockwise.
 * @param {number[][]} template - Input pattern
 * @returns {number[][]} Rotated pattern
 */
function rotate90(template) {
	const size = template.length;
	const rotated = Array(size).fill().map(() => Array(size).fill(0));
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			rotated[j][size - 1 - i] = template[i][j];
		}
	}
	return rotated;
}

/**
 * Mirrors a pattern horizontally.
 * @param {number[][]} template - Input pattern
 * @returns {number[][]} Mirrored pattern
 */
function mirrorHorizontal(template) {
	const size = template.length;
	const mirrored = Array(size).fill().map(() => Array(size).fill(0));
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			mirrored[i][size - 1 - j] = template[i][j];
		}
	}
	return mirrored;
}

/** @constant {number[][][]} patterns - Array of pattern orientations (original and rotations) */
const patterns = [
	pattern, // Original
	rotate90(pattern), // 90°
	rotate90(rotate90(pattern)), // 180°
	rotate90(rotate90(rotate90(pattern))), // 270°
	//mirrorHorizontal(pattern), // Horizontal mirror
	//rotate90(mirrorHorizontal(pattern)), // Mirror + 90°
	//rotate90(rotate90(mirrorHorizontal(pattern))), // Mirror + 180°
	//rotate90(rotate90(rotate90(mirrorHorizontal(pattern)))) // Mirror + 270°
];

/** @constant {number} patternHeight - Height of the target pattern */
const patternHeight = pattern.length; // 5
/** @constant {number} patternWidth - Width of the target pattern */
const patternWidth = pattern[0].length; // 5

/**
 * Evaluates fitness by counting pattern matches in the grid.
 * @param {Int8Array[]} a - CA grid
 * @returns {number} Fitness score (best match or total matches)
 */
function countfitness_pattern(a) {

	let maxScore = 0;
	let totalMatches = 0;

    // Scan grid for pattern matches
	for (let x = 0; x < sizex; x++) {
		for (let y = 0; y < sizey; y++) {
			for (let p = 0; p < patterns.length; p++) {
				const currentPattern = patterns[p];
				let mismatches = 0;
				let score = 0;

				// Count matching cells and mismatches
				for (let dx = 0; dx < patternWidth; dx++) {
					for (let dy = 0; dy < patternHeight; dy++) {
						const gridX = (x + dx) % sizex;
						const gridY = (y + dy) % sizey;
						if (a[gridX][gridY] === currentPattern[dx][dy]) {
							score++;
						} else {
							mismatches++;
						}
					}
				}

				if (fitnessMode === 'bestMatch') {
					if (score > maxScore) {
						maxScore = score;
					}
				} else if (fitnessMode === 'totalMatches' && mismatches <= 1) {
					totalMatches++;
				}
			}
		}
	}

	return fitnessMode === 'bestMatch' ? maxScore : totalMatches;
}

/**
 * Evaluates fitness by counting symmetric pairs in patches, with density constraints.
 * @param {Int8Array[]} a - CA grid
 * @returns {number} Fitness score (number of symmetric pairs)
 */
function countfitness(a) {
    // Check global density
    let liveCount = 0;
    for (let x = 0; x < sizex; x++) {
        for (let y = 0; y < sizey; y++) {
            liveCount += a[x][y];
        }
    }
    const density = liveCount / (sizex * sizey);
    if (density < minDensity || density > maxDensity) {
        return 0; // Reject trivial grids
    }

    // Count symmetric pairs in patchSize x patchSize patches
    let totalSymmetricPairs = 0;
    for (let x = 0; x < sizex; x++) {
        for (let y = 0; y < sizey; y++) {
            let symmetricPairs = 0;

            // Horizontal symmetry: row i matches row (patchSize-1-i)
            for (let i = 0; i < Math.floor(patchSize / 2); i++) {
                for (let j = 0; j < patchSize; j++) {
                    const gridX1 = (x + i) % sizex;
                    const gridY1 = (y + j) % sizey;
                    const gridX2 = (x + (patchSize - 1 - i)) % sizex;
                    const gridY2 = (y + j) % sizey;
                    if (a[gridX1][gridY1] === a[gridX2][gridY2]) {
                        symmetricPairs++;
                    }
                }
            }

            // Vertical symmetry: col j matches col (patchSize-1-j)
            for (let j = 0; j < Math.floor(patchSize / 2); j++) {
                for (let i = 0; i < patchSize; i++) {
                    const gridX1 = (x + i) % sizex;
                    const gridY1 = (y + j) % sizey;
                    const gridX2 = (x + i) % sizex;
                    const gridY2 = (y + (patchSize - 1 - j)) % sizey;
                    if (a[gridX1][gridY1] === a[gridX2][gridY2]) {
                        symmetricPairs++;
                    }
                }
            }
			
            // Diagonal symmetry: cell (i,j) matches cell (j,i)
            for (let i = 0; i < patchSize; i++) {
                for (let j = 0; j < i; j++) {
                    const gridX1 = (x + i) % sizex;
                    const gridY1 = (y + j) % sizey;
                    const gridX2 = (x + j) % sizex;
                    const gridY2 = (y + i) % sizey;
                    if (a[gridX1][gridY1] === a[gridX2][gridY2]) {
                        symmetricPairs++;
                    }
                }
            }
			
            totalSymmetricPairs += symmetricPairs;
        }
    }

    return totalSymmetricPairs;
}

// Note: Additional fitness functions (e.g., Lempel-Ziv complexity, other patterns) are archived in docs/legacy.md.

// --------------------- Evolution Tracking ---------------------

/** @constant {number} maxFitness - Maximum possible fitness score */
const maxFitness = fitnessMode === 'bestMatch' ? pattern.length * pattern[0].length : sizex * sizey * patterns.length;

/**
 * Tracks evolution progress and saves heatmaps.
 */
function testevolute() {
	let maxFit = 0;
	let bestIndex = 0;

    // Find best rule
	for (let i = 0; i < PopulationSize; i++) {
		if (fitness[i] > maxFit) {
			maxFit = fitness[i];
			bestIndex = i;
		}
	}

    // Save fitness heatmap
	ensureStorageDir();
	let heatmaps = [];
	let heatmapsAverage = [];
	if (fs.existsSync(heatmapFile)) {
		heatmaps = JSON.parse(fs.readFileSync(heatmapFile, 'utf8'));
	}
	if (fs.existsSync(heatmapAverageFile)) {
		heatmapsAverage = JSON.parse(fs.readFileSync(heatmapAverageFile, 'utf8'));
	}

	heatmaps.push(fitness.slice());
	const averageFitness = calculateAverageFitness();
	heatmapsAverage.push(averageFitness);

	fs.writeFileSync(heatmapFile, JSON.stringify(heatmaps));
	fs.writeFileSync(heatmapAverageFile, JSON.stringify(heatmapsAverage));
	fs.writeFileSync(path.join(storagePath, 'config.json'), JSON.stringify({ maxFitness, fitnessMode }));

    // Save best population if improved
	if (averageFitness > bestAverageFitness) {
		bestAverageFitness = averageFitness;
		saveBestPopulation(averageFitness);
	}

	console.log(`(total epochs: ${heatmaps.length}), Best fitness=${maxFit} (individual ${bestIndex}), Avg Fitness=${averageFitness.toFixed(2)}`);
}

// --------------------- Utility Functions ---------------------

/**
 * Prints all population rules to console (for debugging).
 */
function t(n) {
	if(!n){
		for (let n = 0; n < PopulationSize; n++) console.log("population[" + n + "]=[" + population[n].join(',') + "];");
	}else{
		console.log("population[" + n + "]=[" + population[n].join(',') + "];");
	}
}

/**
 * Resizes the CA grid.
 * @param {number} x - New width
 * @param {number} y - New height
 */
function resize(x,y){
	sizex=x;
	sizey=y;
}

/**
 * Sets or displays mutation parameters.
 * @param {number} [percent] - Mutation probability (percent)
 * @param {number} [genes] - Maximum genes to mutate
 */
function mutate(percent, genes) {
	if (!percent || !genes) {
		console.log("mutation=" + mutation + ", mutategen=" + mutategen);
	} else {
		mutation = percent;
		mutategen = genes;
	}
}

/**
 * Restores the best population from storage.
 */
function restoreBestPopulation() {
	if (loadBestPopulation()) {
		savePopulation(); // Update population.json
		clearFitness(); // Reset fitness for restored population
		console.log("Restored best population. Ready for further evolution.");
	} else {
		console.log("No best population found to restore.");
	}
}

/**
 * Prints the highest-fitness rule.
 */
function printBestIndividual() {
	let maxFit = 0;
	let bestIndex = 0;

	for (let i = 0; i < PopulationSize; i++) {
		if (fitness[i] > maxFit) {
			maxFit = fitness[i];
			bestIndex = i;
		}
	}

	console.log(`Best individual (index ${bestIndex}, fitness=${maxFit}):`);
	console.log(`Rule: [${population[bestIndex].join(',')}]`);
}

// Initialize simulator
init();

// Export functions for REPL
module.exports = { evil, recreate, resize, mutate, restoreBestPopulation, printBestIndividual, t };