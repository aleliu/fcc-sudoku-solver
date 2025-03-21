'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let row, col, rowChecker, colChecker, areaChecker, result, valid;
      const solver = new SudokuSolver();
      let value = req.body.value;
      let puzzle = req.body.puzzle;
      [row, col] = req.body.coordinate.split('');
      row = "abcdefghi".indexOf(row.toLowerCase());
      col = Number(col);
      if (row == -1){
        return res.json({ "error": "Invalid coordinate" });
      } else {
        row += 1;
      }
      if ( col < 1 || col > 9) return res.json({ "error": "Invalid coordinate" });
      valid = solver.validate(puzzle);
      if ( valid.error !== undefined ){
        return valid
      }
      rowChecker = solver.checkRowPlacement(puzzle, row, col, value);
      colChecker = solver.checkColPlacement(puzzle, row, col, value);
      areaChecker = solver.checkRegionPlacement(puzzle, row, col, value);
      if (rowChecker && colChecker && areaChecker){
        return res.json({valid: true})
      } else {
        result = {valid: false, conflict: []};
        if (!rowChecker) {
          result.conflict.push('row')
        }
        if (!colChecker) {
          result.conflict.push('column')
        }
        if (!areaChecker) {
          result.conflict.push('region')
        }
        return res.json(result);
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const solver = new SudokuSolver();
      let puzzle = req.body.puzzle;
      let valid = solver.validate(puzzle);
      if (valid.error !== undefined){
        return valid
      } else {
        return solver.solve(puzzle);
      } 
    });
};
