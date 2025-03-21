class SudokuSolver {
 
  getPlacementFromPoint(puzzleString, type, row, column=""){
    let result = "";
    let numberRow;
    if (!row) return false;
    if (row.length == 2) {
      [row, column] = row.split('');
      column = Number(column)
    }
    if (typeof(row) == "string"){
      numberRow = "abcdefghi".indexOf(row.toLowerCase());
    } else {
      numberRow = row;
    }
    if (type == "row"){
      result = puzzleString.slice(numberRow * 9, (numberRow + 1) * 9);
    } else if (type == "column" ){
      for (let i=0; i < 9; i++) {
        result += puzzleString[9 * i + column - 1];
      }  
    } else if (type == "area") {
      let rowQuadrant = 3 * (Math.ceil((numberRow + 1) / 3) - 1);
      let colQuadrant = 3 * (Math.ceil(column / 3) - 1);
      for (let i = rowQuadrant; i < rowQuadrant + 3; i++) {
        result += puzzleString.slice(9 * i + colQuadrant, (9 * i) + colQuadrant + 3);
      }
    }
    return result;
  }

  validate(puzzleString) {
    let row, col;
    let valid = true;
    if (puzzleString == undefined){
      return { "error": "Required field missing" }
    }
    if (puzzleString.length != 81){
      return { "error": "Expected puzzle to be 81 characters long" }
    }
    if (puzzleString.match(/[^0-9\.]/)){
      return { "error": "Invalid characters in puzzle" }
    }
    puzzleString.split('').forEach((val, i) => {
      if (val != "."){
        [row, col] - this.getCordinate(i);
        valid &&= this.checkRowPlacement(puzzleString, row, col, val);
        valid &&= this.checkColPlacement(puzzleString, row, col, val);
        valid &&= this.checkAreaPlacement(puzzleString, row, col, val);
      }
    });
    if (valid) {
      return {valid}
    } else {
      return { "error": "Puzzle cannot be solved" }
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let puzzleRow = this.getPlacementFromPoint(puzzleString, "row", row, column);
    if (puzzleRow == false) return false;
    return puzzleRow[column - 1] == value || puzzleRow.indexOf(value) == -1;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let numberRow = "abcdefghi".indexOf(row.toLowerCase());
    let puzzleColumn = this.getPlacementFromPoint(puzzleString, "column", row, column);
    if (puzzleColumn == false) return false;
    return puzzleColumn[numberRow - 1] == value || puzzleColumn.indexOf(value) == -1;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let numberRow = "abcdefghi".indexOf(row.toLowerCase()) + 1;
    let puzzleArea = this.getPlacementFromPoint(puzzleString, "area", row, column);
    if (puzzleArea == false) return false;
    return puzzleString[(numberRow - 1) * 9 + column - 1] == value || puzzleArea.indexOf(value) == -1;
  }

  getCordinate(number, join=true){

    let rowNumber = Math.ceil((number + 1) / 9) - 1;
    let row = "abcdefghi"[rowNumber];
    let column = number - rowNumber * 9 + 1;
    if(join){
      return row + column
    } else {
      return [row, column]
    }
  }

  backtrackSolving(puzzleString){
    let posibilities, newIndex, val, result;
    let index = puzzleString.indexOf(".");
    let coordinate = this.getCordinate(index);
    let numbersUsed = "";
    let newPuzzleString = puzzleString;
    ['row', 'column', 'area'].forEach((type) => {
      numbersUsed += this.getPlacementFromPoint(puzzleString, type, coordinate);
    });
    numbersUsed = [...new Set(numbersUsed.split("").map(Number))];
    posibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(val => !numbersUsed.includes(val));
    for (let i = 0; i < posibilities.length; i++) {
      val = posibilities[i]
      newPuzzleString = newPuzzleString.split('');
      newPuzzleString[index] = val;
      newPuzzleString = newPuzzleString.join('');
      newIndex = newPuzzleString.indexOf(".");
      if (newIndex == -1) {
        return newPuzzleString
      } else {
        result = this.backtrackSolving(newPuzzleString);
        if (result != false){
          if (result.indexOf('.') == -1){
            return result;
          }
        }
      }
    };
    return false
  }

  solve(puzzleString) {
    let valid = this.validate(puzzleString);
    if (valid.error != undefined) return valid;
    return this.backtrackSolving(puzzleString);
  }
}

module.exports = SudokuSolver;
