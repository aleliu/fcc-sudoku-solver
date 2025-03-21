const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: puzzlesAndSolutions[0][0]})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body, puzzlesAndSolutions[0][1]);
                done();
            });
    });
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Required field missing" });
                done();
            });
    });
    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: "..9..5.1.85.4....2432......1...J9.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });
                done();
            });
    });
    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: puzzlesAndSolutions[0][0]+"2"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });
                done();
            });
    });
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: "..9..9.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Puzzle cannot be solved" });
                done();
            });
    });
    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "a2", value: 3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "valid": true });
                done();
            });
    });
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "z2", value: 3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Invalid coordinate" });
                done();
            });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: "1.5..2.84..63.12.7.2..5.....z..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "Z2", value: 3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });
                done();
            });
    });
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: "1.5..2.84..63.12.7.2..5........1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..", coordinate: "N2", value: '3z'})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });
                done();
            });
    });
    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], value: 3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Required field(s) missing" });
                done();
            });
    });
    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: "..9..5.1.85.4....2z32......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate: "a2", value: 3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });
                done();
            });
    });
    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...", coordinate: "a2", value: 3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });
                done();
            });
    });
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: puzzle[2][0], coordinate: "a0", value: 3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Invalid coordinate" });
                done();
            });
    });
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "a2", value: "Z"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "error": "Invalid value" });
                done();
            });
    });
});

