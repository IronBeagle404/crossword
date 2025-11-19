'use strict';

/**
 * @param {string} puzzleStr
 * @param {string[]} words
 */
function crosswordSolver(puzzleStr, words) {  
  try {
    parsePuzzle(puzzleStr)
  } catch (error) {
    // for debug
    //console.log(error);
    // for release
    console.log("Error");
    return;
  }

  // Create 2D array to represent the grid
  const rows = puzzleStr.split('\n');
  const puzzleMap = rows.map(row => row.split(''));
  
  let wordsData = [];
  let normalWords = [];
  try {
    wordsData = defineWordsData(puzzleMap);
    normalWords = normalizeWords(words);
  } catch (error) {
    // for debug
    //console.log(error);
    // for release
    console.log("Error");
    return;
  }
  defineCandidates(wordsData, normalWords);
  let solutions = [];
  backtrackSolver(solutions, puzzleMap, wordsData);
  if (solutions.length != 1) {
    console.log("Error");
    return;
  }
  printGrid(solutions[0]);
}

function parsePuzzle(puzzle) {
  if (typeof puzzle !== 'string' || puzzle.length === 0) {
    throw new Error('Puzzle must be a non-empty string');
  }

  const rows = puzzle.split('\n');
  const width = rows[0].length;

  if (width === 0) {
    throw new Error('Puzzle rows must have at least one cell');
  }

  const grid = rows.map((row, rIdx) => {
    if (row.length !== width) {
      throw new Error('All puzzle rows must have the same length');
    }

    return row.split('').map((cell, cIdx) => {
      if (cell === '.') {
        return { type: 'block', row: rIdx, col: cIdx };
      }

      if (!/[0-9]/.test(cell)) {
        throw new Error(`Invalid cell "${cell}" at (${rIdx}, ${cIdx})`);
      }

      return {
        type: 'fillable',
        row: rIdx,
        col: cIdx,
        expectedStarts: Number(cell),
      };
    });
  });

  return {
    height: rows.length,
    width,
    grid,
  };
}

/**
 * 
 * @param {String[][]} puzzle 
 * @returns {Array}
 */
function defineWordsData(puzzleMap) {

  let wordsCount = 0;
  for (let x = 0 ; x < puzzleMap.length ; x++) {
    for (let y = 0 ; y < puzzleMap[x].length ; y++) {
      let char = puzzleMap[x][y];
      if (char == '1' || char == '2') {
        wordsCount += Number(char);
      }
    }
  }
  if (wordsCount != words.length) {
    throw new Error('wrong number of input words or word slot');
  }


  let wordsData = [];

  // row scan
  for (let x  = 0 ; x < puzzleMap.length ; x++) {      
    for (let y = 0 ; y < puzzleMap[x].length ; y++) {              
      if ((puzzleMap[x][y] == '1' || puzzleMap[x][y] == '2') && (y == 0 || puzzleMap[x][y-1] == '.')) {   
        let cells = [];
        for (let i = y; i < puzzleMap[x].length ; i++) {            
          if (puzzleMap[x][i] != '0' && puzzleMap[x][i] != '1' && puzzleMap[x][i] != '2') {              
            break;
          }
          cells.push([x, i]);
        }
        if (cells.length > 1) {    
          wordsData.push({              
            start: [x, y],
            length: cells.length,
            cells: cells,
            horizontal: true,
            candidates: [],
            filled: null,
          });
        }
      }
    }
  }

  // column scan
  for (let x  = 0 ; x < puzzleMap.length ; x++) {      
    for (let y = 0 ; y < puzzleMap[x].length ; y++) {        
      if ((puzzleMap[x][y] == '1' || puzzleMap[x][y] == '2') && (x == 0 || puzzleMap[x-1][y] == '.')) {                                                 
        let cells = [];
        for (let i = x; i < puzzleMap.length ; i++) {            
          if (puzzleMap[i][y] != '0' && puzzleMap[i][y] != '1' && puzzleMap[i][y] != '2') {
            break;
          }
          cells.push([i, y]);
        }
        if (cells.length > 1) {  
          wordsData.push({              
            start: [x, y],
            length: cells.length,
            cells: cells,
            horizontal: false,
            candidates: [],
            filled: null,
          });
        }
      }
    }
  }
  
  return wordsData;
}

function normalizeWords(words) {
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error('Words must be a non-empty array');
  }

  const normalized = [];
  const seen = new Set();

  for (const entry of words) {
    if (typeof entry !== 'string' || entry.trim() === '') {
      throw new Error('Every word must be a non-empty string');
    }

    const word = entry.trim();

    if (seen.has(word)) {
      throw new Error('Duplicate words are not allowed');
    }

    seen.add(word);
    normalized.push(word);
  }

  return normalized;
}

function validateGridWithSlots({ grid, height, width }, slots) {
  if (!Array.isArray(slots)) {
    throw new Error('Slots must be an array');
  }

  const counters = Array.from({ length: height }, () => Array(width).fill(0));

  for (const slot of slots) {
    if (!slot || !Array.isArray(slot.positions) || slot.positions.length === 0) {
      throw new Error('Each slot must provide a non-empty positions array');
    }

    const { positions } = slot;

    for (let i = 0; i < positions.length; i += 1) {
      const [row, col] = positions[i];

      if (
        typeof row !== 'number' ||
        typeof col !== 'number' ||
        row < 0 ||
        row >= height ||
        col < 0 ||
        col >= width
      ) {
        throw new Error(`Slot position out of bounds: (${row}, ${col})`);
      }

      const cell = grid[row][col];

      if (!cell || cell.type !== 'fillable') {
        throw new Error(`Slot overlaps a non-fillable cell at (${row}, ${col})`);
      }

      if (i === 0) {
        counters[row][col] += 1;
      }
    }
  }

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const cell = grid[row][col];

      if (cell.type !== 'fillable') {
        continue;
      }

      if (cell.expectedStarts !== counters[row][col]) {
        throw new Error(
          `Start count mismatch at (${row}, ${col}): expected ${cell.expectedStarts}, got ${counters[row][col]}`,
        );
      }
    }
  }
}

function createCandidateMap(slots, words, boardLetters) {
  if (!Array.isArray(slots) || !Array.isArray(words)) {
    throw new Error('Slots and words must be arrays');
  }

  const candidates = new Map();

  const lettersLookup = boardLetters || null;

  for (const slot of slots) {
    if (!slot || typeof slot.id === 'undefined' || !Array.isArray(slot.positions)) {
      throw new Error('Invalid slot descriptor');
    }

    const length = slot.positions.length;
    const list = [];

    outer: for (const word of words) {
      if (word.length !== length) {
        continue;
      }

      if (lettersLookup) {
        for (let i = 0; i < length; i += 1) {
          const [row, col] = slot.positions[i];
          const expected = lettersLookup[row] && lettersLookup[row][col];

          if (expected && expected !== word[i]) {
            continue outer;
          }
        }
      }

      list.push(word);
    }

    candidates.set(slot.id ?? list.length, list);
  }

  return candidates;
}

/**
 * 
 * @param {Array} wordsData 
 * @param {String[]} words 
 */
function defineCandidates(wordsData, words) {
  for (let x = 0 ; x < wordsData.length ; x++) {    
    for (let y = 0 ; y < words.length ; y++) {
      if (words[y].length == wordsData[x].length) {
        wordsData[x].candidates.push(words[y]);
      }
    }
  }
}

let __recursionCounter = 0;

/**
 * @param {[]Array} solutions
 * @param {String[][]} puzzleMap
 * @param {Array} wordsData
 * @returns {Boolean}
 */
function backtrackSolver(solutions, puzzleMap, wordsData, depth = 0, used = new Set() ) {
  __recursionCounter++;
  if (__recursionCounter > 5_000_000) {
    throw new Error('Recursion exploded — counter exceeded 5,000,000');
  }

  // store all possible solutions and return once there is more than one
  if (wordsData.every(w => w.filled)) {
    const snapshot = puzzleMap.map(row => [...row]);
    solutions.push(snapshot);
    if (solutions.length > 1) {
      return true
    }
  }


  // loop through all unfilled slots
  for (let x = 0 ; x < wordsData.length ; x++) {
    if (!wordsData[x].filled) {
      // loop through all candidates      
      for (let y = 0 ; y < wordsData[x].candidates.length ; y++) {

        // define candidate var
        let candidate = wordsData[x].candidates[y];

        if (used.has(candidate)) {          
          continue;
        }
        
        // verify placement
        let skip = false;
        for (let i = 0 ; i < candidate.length ; i++) {                                        
          let char = puzzleMap[wordsData[x].cells[i][0]][wordsData[x].cells[i][1]];
          if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {                                                
            if (char != candidate[i]) {              
              skip = true;
              break;
            }
          }
        }

        if (skip) {          
          continue;
        }

        // create snapshot                
        const snapshot = puzzleMap.map(row => [...row]);

        // place candidate ---
        for (let z = 0; z < wordsData[x].length; z++) {              
          const [r, c] = wordsData[x].cells[z];
          puzzleMap[r][c] = candidate[z];
        }
        wordsData[x].filled = true;
        used.add(candidate);

        // recursive call
        if (backtrackSolver(solutions, puzzleMap, wordsData, depth + 1, used)) {
          return true; // success, keep the placement
        }

        // undo changes if it failed
        used.delete(candidate);
        wordsData[x].filled = false;
        for (let i = 0; i < puzzleMap.length; i++) {
          puzzleMap[i] = [...snapshot[i]];
        }
      }
      // if no candidate can be placed
      return false;
    }
  }
  // if no slot can be filled
  return false;
}

/**
 * @param {String[][]} puzzleMap 
 */
function printGrid(puzzleMap) {
  let res = "";
  for (let x = 0 ; x < puzzleMap.length ; x++) {
    if (x != 0) {
      res = res.concat('\n');
    }
    for (let y = 0 ; y < puzzleMap[x].length ; y++) {
      res = res.concat(puzzleMap[x][y]);
    }    
  }
  console.log(res);
}



// INPUT SECTION

const puzzle = '2001\n0..0\n1000\n0..0'
const words = ['casa', 'alan', 'ciao', 'anta']

crosswordSolver(puzzle, words)