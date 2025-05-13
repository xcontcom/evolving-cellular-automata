# Legacy Code Documentation

This file archives commented-out code from `draw_node.js`, reflecting earlier experiments in the Cellular Automata Evolution Simulator. These snippets showcase alternative fitness functions and patterns explored during development, capturing the iterative process of evolving CA rules with genetic algorithms. They are preserved for historical context and potential future experimentation.

## Pattern-Matching Fitness (6x11)
This function searched for a 6x11 pattern, rewarding grids with the highest number of matching cells.

```javascript
const pattern = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function countfitness(a) {
    const patternHeight = pattern.length; // 6
    const patternWidth = pattern[0].length; // 11
    let maxScore = 0;

    for (let x = 0; x < sizex; x++) {
        for (let y = 0; y < sizey; y++) {
            let score = 0;
            for (let dx = 0; dx < patternWidth; dx++) {
                for (let dy = 0; dy < patternHeight; dy++) {
                    const gridX = (x + dx) % sizex;
                    const gridY = (y + dy) % sizey;
                    if (a[gridX][gridY] === pattern[dy][dx]) {
                        score++;
                    }
                }
            }
            if (score > maxScore) {
                maxScore = score;
            }
        }
    }

    return maxScore;
}
```

## Lempel-Ziv Complexity
This implementation measured the complexity of CA grids using Lempel-Ziv compression, aiming to reward “interesting” patterns.

```javascript
function lzComplexity2D(grid) {
    const binaryString = grid.flat().join(""); // Flatten 2D → string
    return lzComplexity1D(binaryString);
}

function lzComplexity1D(s) {
    const seen = new Set();
    let complexity = 1;
    let w = "";
    let i = 0;

    while (i < s.length) {
        w += s[i];
        if (!seen.has(w)) {
            seen.add(w);
            complexity++;
            w = ""; // reset pattern
        }
        i++;
    }

    return complexity;
}
```

## Alternative Patterns
Various patterns tested for pattern-matching fitness, including 8x8, 5x5, and 3x3 grids.

```javascript
const pattern_8x8 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

const pattern_5x5 = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 0, 1, 0],
    [1, 1, 0, 1, 1]
];

const pattern_3x3 = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];
```

## Symmetry-Based Fitness (55x55)
These functions explored symmetry in 11x11 patches on a 55x55 grid, rewarding either fully symmetric patches or the number of symmetric pairs.

```javascript
function countfitness______(a) {
    const sizex = 55; // Assuming 55x55 grid
    const sizey = 55;
    let symmetricPatches = 0;

    // Slide patchSize x patchSize window across grid
    for (let x = 0; x < sizex; x++) {
        for (let y = 0; y < sizey; y++) {
            let isHorizontallySymmetric = true;
            let isVerticallySymmetric = true;
            let isDiagonallySymmetric = true;

            // Check horizontal symmetry: row i matches row (patchSize-1-i)
            for (let i = 0; i < Math.floor(patchSize / 2); i++) {
                for (let j = 0; j < patchSize; j++) {
                    const gridX1 = (x + i) % sizex;
                    const gridY1 = (y + j) % sizey;
                    const gridX2 = (x + (patchSize - 1 - i)) % sizex;
                    const gridY2 = (y + j) % sizey;
                    if (a[gridX1][gridY1] !== a[gridX2][gridY2]) {
                        isHorizontallySymmetric = false;
                        break;
                    }
                }
                if (!isHorizontallySymmetric) break;
            }

            // Check vertical symmetry: col j matches col (patchSize-1-j)
            for (let j = 0; j < Math.floor(patchSize / 2); j++) {
                for (let i = 0; i < patchSize; i++) {
                    const gridX1 = (x + i) % sizex;
                    const gridY1 = (y + j) % sizey;
                    const gridX2 = (x + i) % sizex;
                    const gridY2 = (y + (patchSize - 1 - j)) % sizey;
                    if (a[gridX1][gridY1] !== a[gridX2][gridY2]) {
                        isVerticallySymmetric = false;
                        break;
                    }
                }
                if (!isVerticallySymmetric) break;
            }

            // Check diagonal symmetry: cell (i,j) matches cell (j,i)
            for (let i = 0; i < patchSize; i++) {
                for (let j = 0; j < i; j++) {
                    const gridX1 = (x + i) % sizex;
                    const gridY1 = (y + j) % sizey;
                    const gridX2 = (x + j) % sizex;
                    const gridY2 = (y + i) % sizey;
                    if (a[gridX1][gridY1] !== a[gridX2][gridY2]) {
                        isDiagonallySymmetric = false;
                        break;
                    }
                }
                if (!isDiagonallySymmetric) break;
            }

            // Count patch if any symmetry holds
            if (isHorizontallySymmetric || isVerticallySymmetric || isDiagonallySymmetric) {
                symmetricPatches++;
            }
        }
    }

    return symmetricPatches;
}
```

*Note*: The active `countfitness` function in `draw_node.js` uses a symmetry-based approach with density constraints. These legacy functions were part of earlier iterations, exploring diverse CA behaviors as described in [article.md](article.md).
