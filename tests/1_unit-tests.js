const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const { stat } = require('@babel/core/lib/gensync-utils/fs.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
        let solution = solver.validate(puzzlesAndSolutions[0][0]);
        assert.deepEqual(solution, {valid: true});
        done();
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
        let solution = solver.validate("..9..5.1.85.J....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..");
        assert.deepEqual(solution, { "error": "Invalid characters in puzzle" });
        done();
    });
    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
        let solution = solver.validate(puzzlesAndSolutions[0][0]+"2");
        assert.deepEqual(solution, { "error": "Expected puzzle to be 81 characters long" });
        done();
    });
    test('Logic handles a valid row placement', (done) => {
        let solution = solver.checkRowPlacement(puzzlesAndSolutions[0][0], "B", 2, 4);
        assert.isTrue(solution);
        done();
    }); 
    test('Logic handles an invalid row placement', (done) => {
        let solution = solver.checkRowPlacement(puzzlesAndSolutions[0][0], "B", 2, 3);
        assert.isFalse(solution);
        done();
    });
    test('Logic handles a valid column placement', (done) => {
        let solution = solver.checkColPlacement(puzzlesAndSolutions[0][0], "B", 2, 4);
        assert.isTrue(solution);
        done();
    });
    test('Logic handles an invalid column placement', (done) => {
        let solution = solver.checkColPlacement(puzzlesAndSolutions[0][0], "B", 2, 9);
        assert.isFalse(solution);
        done();
    });
    test('Logic handles a valid region (3x3 grid) placement', (done) => {
        let solution = solver.checkRegionPlacement(puzzlesAndSolutions[0][0], "B", 2, 4);
        assert.isTrue(solution);
        done();
    });
    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
        let solution = solver.checkRegionPlacement(puzzlesAndSolutions[0][0], "B", 2, 5);
        assert.isFalse(solution);
        done();
    });
    test('Valid puzzle strings pass the solver', (done) => {
        let solution = solver.solve(puzzlesAndSolutions[0][0]);
        assert.deepEqual(solution, puzzlesAndSolutions[0][1]);
        done();
    });
    test('Invalid puzzle strings fail the solver', (done) => {
        let solution = solver.solve(puzzlesAndSolutions[0][0]+"2");
        assert.deepEqual(solution, { "error": "Expected puzzle to be 81 characters long" });
        done();
    });
    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
        let solution = solver.solve(puzzlesAndSolutions[1][0]);
        assert.equal(solution, puzzlesAndSolutions[1][1]);
        done();
    });
});
