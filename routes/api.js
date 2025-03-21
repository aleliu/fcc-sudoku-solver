'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let row, col, rowChecker, colChecker, areaChecker, result, valid, numberRow, coordinate;
      const solver = new SudokuSolver();
      let value = req.body.value;
      let puzzle = req.body.puzzle;
      
      if (!("puzzle" in req.body) || !("coordinate" in req.body) || !("value" in req.body)) return res.json({ error: 'Required field(s) missing' })
      let validatePuzzle = solver.validate(puzzle);
      if (validatePuzzle.error != undefined){
        return res.json(validatePuzzle)
      }
      value = Number(value);
      coordinate = req.body.coordinate;
      if(!/^[a-iA-I][1-9]$/.test(coordinate)){
        return res.json({ "error": "Invalid coordinate" });
      }
      [row, col] = coordinate.split('');
      numberRow = "abcdefghi".indexOf(row.toLowerCase());
      col = Number(col);
      if(!value || value > 9 || value < 1) return res.json({error: "Invalid value"})
      numberRow += 1;
      if ( col < 1 || col > 9) return res.json({ "error": "Invalid coordinate" });
      valid = solver.validate(puzzle);
      if ( valid.error !== undefined ){
        return res.json({valid: valid})
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
      return res.json(solver.solve(puzzle));
    });
};
