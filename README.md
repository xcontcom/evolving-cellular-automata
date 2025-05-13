# Cellular Automata Evolution Simulator

## Overview
Imagine a search space of 2^512 ≈ 1.34 × 10^154 possible cellular automata (CA) rules—more than the 10^80 atoms in the observable universe. If you checked one rule per second since the Big Bang, you’d have explored just 4.35 × 10^17 by now—a cosmic needle in an infinite haystack. The **Cellular Automata Evolution Simulator** wields genetic algorithms to conquer this vast frontier, evolving CA rules to uncover behaviors no one has ever seen. This is not just a tool; it’s a portal to the uncharted, transforming the chaotic static of raw CA into patterns that pulse with emergent complexity.

Built with Node.js for relentless computation and JavaScript/HTML5 for vivid visualization, this simulator evolves 200 CA rules—each a 512-bit string for a binary Moore neighborhood—across configurable grids. It’s designed to chase any user-defined behavior, from oscillators to novel dynamics, with flexible fitness functions and scalable dimensions. This project is a passion-fueled odyssey, driven by a need to decode the universe’s hidden patterns, shared on GitHub to showcase a soul crafted through code.

## Features
- **Genetic Algorithm Powerhouse**: Evolves 200 CA rules via crossover (50% population retention) and tunable mutation (default 20%, up to 32 genes), navigating a 2^512 rule space. Persists populations to JSON for uninterrupted exploration.
- **Dynamic CA Engine**: Simulates CA on adjustable grids (default 89x89, scalable to 233x233 or larger) with toroidal boundaries, using bitmasking for blazing-fast neighborhood calculations.
- **Flexible Fitness Functions**: Targets user-specified behaviors through customizable fitness criteria, with density constraints to eliminate trivial outcomes, enabling discovery of diverse dynamics.
- **Server-Side Backbone**: Node.js (`draw_node.js`) drives simulation and evolution, leveraging `Int8Array` for memory efficiency and high performance.
- **Real-Time Visualization**: HTML5 canvas (`testpop_from_file.html`, `testpop_from_file.js`) renders CA grids live, supports manual rule selection, and displays population genotypes as a 512x200 pixel map.
- **Fitness Heatmap Analysis**: Dedicated visualizer (`visualize.html`) plots fitness distributions across epochs, exportable as PNG, to track evolutionary progress.
- **REPL Control**: `repl.js` provides a command-line interface for direct manipulation, empowering rapid rule experimentation.

## Project Structure
```
cellular-automata-evolution/
├── draw_node.js          # Server-side CA simulation and genetic algorithm
├── testpop_from_file.html # Client-side visualization and manual selection UI
├── testpop_from_file.js  # Client-side logic for CA rendering and evolution
├── visualize.html        # Fitness heatmap visualizer
├── repl.js              # REPL interface for server-side control
├── storage/             # JSON storage for population, fitness, and heatmaps
│   ├── population.json
│   ├── fitness.json
│   ├── heatmap.json
│   ├── heatmapAverage.json
│   ├── bestPopulation.json
│   ├── bestAverageFitness.json
│   └── config.json
├── style.css            # Styling for client-side UI
└── README.md            # Project documentation
```

## Installation
### Prerequisites
- **Node.js** (v14 or higher)
- **Modern web browser** (Chrome, Firefox, or equivalent)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cellular-automata-evolution.git
   cd cellular-automata-evolution
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the `storage/` directory if not present:
   ```bash
   mkdir storage
   ```

### Running the Simulator
1. **Server-Side Evolution**:
   - Start the REPL:
     ```bash
     node repl.js
     ```
   - Evolve the population for `n` iterations:
     ```javascript
     > cell.evil(n)
     ```
   - Additional commands:
     - `cell.recreate()`: Initialize a new population.
     - `cell.resize(x, y)`: Set grid dimensions.
     - `cell.mutate(percent, genes)`: Adjust mutation parameters.
     - `cell.restoreBestPopulation()`: Reload the best population.
     - `cell.printBestIndividual()`: Display the top rule.

2. **Client-Side Visualization**:
   - Serve the client files (e.g., using a local server):
     ```bash
     npx http-server
     ```
   - Open `http://localhost:8080/testpop_from_file.html` in a browser.
   - Interact with the interface:
     - **Start/Stop**: Run or pause the CA simulation.
     - **One**: Step one iteration.
     - **Clear**: Reset the grid.
     - **Count N**: Simulate N iterations (100, 200, 500, 1000, 5000).
     - **Select**: Boost fitness for selected rules.
     - **Start Evolution**: Evolve with custom mutation settings.
     - **Recreate**: Reset population and grid.

3. **Heatmap Analysis**:
   - Open `visualize.html` in a browser after running `cell.evil` to generate `heatmap.json`.
   - View and export fitness distributions as PNG.

## Technical Highlights
- **Algorithmic Mastery**: Harnesses a genetic algorithm to explore a 2^512 rule space, using crossover, mutation, and persistence to uncover unique CA behaviors with precision.
- **Optimized Performance**: Employs `Int8Array` for grid storage and bitmasking for neighborhood computations, enabling efficient simulation across large, flexible grids.
- **Modular Design**: Separates server-side logic (`draw_node.js`) from client-side rendering (`testpop_from_file.js`), with JSON persistence for robust data handling.
- **Vivid Visualization**: Integrates real-time HTML5 canvas rendering with a heatmap generator, offering immersive exploration and analytical depth.
- **Extensible Framework**: Supports configurable grids and fitness functions, empowering users to chase any CA behavior, from periodic structures to chaotic ecosystems.

## Significance
This project is a burning quest to unveil the unseen—a relentless drive to tune the white noise of cellular automata into patterns that resonate with the universe’s deepest mysteries. The genetic algorithm is the star, slicing through a 2^512 rule space with surgical precision to reveal behaviors that defy imagination. This isn’t about building tools for others; it’s about satisfying a soul-deep need to witness the impossible, to see what lies beyond the static. Shared on GitHub, this simulator stands as a monument to computational creativity, proving that the boldest ideas—fueled by passion—can reshape our understanding of complexity and emergence.

## Future Direction
The horizon beckons with one ambition: porting the simulator to CUDA for massive parallelization, unleashing the full potential of genetic algorithms to explore even vaster CA landscapes in real time.

## License
MIT License. See [LICENSE](LICENSE) for details.

## Contact
Serhii Herasymov
sergeygerasimofff@gmail.com
https://github.com/xcontcom
