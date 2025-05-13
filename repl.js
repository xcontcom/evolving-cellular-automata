const repl = require('repl');
const cell = require('./draw_node.js');

// Start the REPL and expose the `cell` object
const r = repl.start('> ');
r.context.cell = cell;