/**
  Returns a random number between 0 and 5
*/
function getRandomNumber() {
  // Generate a random floating-point number between 0 (inclusive) and 1 (exclusive)
  const randomFloat = Math.random();

  // Scale and round to get a random integer between 0 and 5 (inclusive)
  const randomNumber = Math.floor(randomFloat * 6);

  return randomNumber;
}

let colorsMapping = {
  0: 'B',
  1: 'B',
  2: 'R',
  3: 'G',
  4: 'G',
  5: 'G'
}

let diceNumberComboMappings = {
  0: [0.0, 0.1, 1.0, 1.1], //BB
  1: [0.2, 1.2, 2.0, 2.1], //RB
  2: [0.3, 0.4, 0.5, 1.3, 1.4, 1.5, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1], //GB
  3: [2.3, 2.4, 2.5, 3.2, 4.2, 5.2], //GR
  4: [3.3, 3.4, 3.5, 4.4, 4.3, 4.5, 5.3, 5.4, 5.5], //GG
  5: [2.2] // RR
}

let diceNumberComboMappingsString = {
  0: 'BB',
  1: 'RB',
  2: 'GB',
  3: 'GR',
  4: 'GG',
  5: 'RR'
}


function getDiceRoll() {
  let diceRoll1 = getRandomNumber();
  let diceRoll2 = getRandomNumber();
  let indx = 0
  while (indx < 6) {
    let decimalForm = (diceRoll1 + (diceRoll2 / 10))
    // console.log("HERE IS DECIMAL FORM", decimalForm);
    if (diceNumberComboMappings[indx].includes(decimalForm)) {
      return indx
    }
    indx++
  }
  console.log("ERRORRRRRRR!!!!!!!!!!!")
  return

}


function generateGameRolls(numRolls=25) {
  let i = 0;
  let mapping = {}
  while (i < numRolls) {

    let diceRoll = getDiceRoll();
    // console.log("HERE IS DICE ROLL", diceRoll)
    if (diceRoll == null) {
      return
    }

    if (!mapping[diceRoll]) {
      mapping[diceRoll] = 1
    } else {
      mapping[diceRoll] = mapping[diceRoll] + 1
    }
    i++

  }
  return mapping
}

// Example usage

function getDiceProbabilitiesOverTrials(numberOfTrials, numRolls) {
  let trialsRolls = {}
  let iterTrials = numberOfTrials
  while (iterTrials > 1) {
    let gameMapping = generateGameRolls(numRolls);

    let keys = Object.keys(gameMapping)
    for (let i of keys) {
      if (!trialsRolls[i]) {
        trialsRolls[i] = gameMapping[i]
      } else {
        trialsRolls[i] += gameMapping[i]
      }

    }
    iterTrials--

  }
  return trialsRolls
}






/**
  For A given board input, calculates thenumber of rolls 
  to fill out the board
*/
function getNumberOfRollsPerBoard(board) {
  let numberOfRolls = 0
  // console.time('function1');




  while (board.length > 0) {
    let a = getDiceRoll();
    if (a == null) {
      return
    }
    // console.log("HERE IS ROLL", a, board.length)

    let firstOccurrenceFound = false;
    board = board.filter((b) => {
      if (!firstOccurrenceFound && b === a) {
        firstOccurrenceFound = true;
        return false; // Exclude the first occurrence of 'a'
      }
      return true; // Include all other elements'a'
    });

    numberOfRolls++;
  }

  // console.timeEnd('function1');
  return numberOfRolls
}

function averageNumberOfRollsPerBoard(board, numberOfTrialsForBoard) {
  let numberOfTrialsForBoardIter = numberOfTrialsForBoard
  let sum = 0

  while (numberOfTrialsForBoardIter > 0) {
    let a = getNumberOfRollsPerBoard([...board])
    sum += a
    numberOfTrialsForBoardIter--
  }

  return (sum / numberOfTrialsForBoard)
}






const fs = require('fs');
const util = require('util');







/**
Provided a list of the board possibilities (where is index represents the number of each tile that we can find from the indexMapping), will return the string list version
*/
function boardConverter(convertList) {
  let index = 0
  let convertedBoards = [];
  for (let i of convertList) {
    // console.log("HERE IS i", i)
    let convertedBoard = [];
    let inner_index = 0
    for (let j of i) {
      let count = j
      while (count > 0) {
        convertedBoard.push(inner_index);
        count--

      }
      inner_index++
    }
    convertedBoards.push(convertedBoard)
    // console.log("HERE IS CONVERTED BOARD", convertedBoard, index)

    index++
  }
  return convertedBoards
}


// console.log("HERE IS TESTING BOARD", testBoard);
// console.log("HERE ARE THE TOTAL NUMBER OF BOARDS", FiveByFiveBoards.length)

function findMinIndexOfList(lst) {
  let min = 9999999999999999999999;
  let minIndex = 0
  let index = 0
  for (let i of lst) {
    if (i < min) {
      minIndex = index
      min = i
    }
    index++
  }
  return { minIndex: minIndex, minVal: min }
}


function findMaxIndexOfList(lst) {
  let max = 0;
  let maxIndex = 0;
  let index = 0
  for (let i of lst) {
    if (i > max) {
      maxIndex = index
      max = i
    }
    index++
  }
  return { maxIndex: maxIndex, maxVal: max }
}

function histogramMaker(min, max, numBuckets, averageTimeList) {
  let range = max - min;
  let bucketSize = range / numBuckets;
  let out = {}
  let indx = 0;
  while (indx <= numBuckets) {
    out[Math.floor((indx) * bucketSize + min)] = 0
    indx++
  }
  // console.log(out);
  for (let i of averageTimeList) {
    //Placing each of the times in the list into a bucket
    for (let j of Object.keys(out)) {
      //Iterating through the buckets
      if (Math.floor(i) <= Number(j)) {
        // If our time is less than the bucket value, then we place it into the bucket
        out[j]++
        break;
      }
    }
  }
  let sum = 0
  for (let i of Object.values(out)) {
    sum += i
  }

  let outRanges = {}
  for (let i of Object.keys(out)) {
    outRanges['[' + Math.floor(i) + ':' + (Math.floor(Number(i) + Number(bucketSize))) + ']'] = out[i]
  }


  return outRanges

}

/**
 * Actually brute forces all the possible board combos and returns 
 * {maxData, minData, optimalBoard, minAverageNumberOfRollsTillWin, totalProcessingTime, histogram}
 * @param {*} boardPath 
 * @param {*} numSamples 
 * @returns 
 */
function bruteForceOptimalBoardFinder(boardPath, numSamples=1000, progressLogging){
      let testBoard = []
   // Specify the path to the file
   const filePath = boardPath
      try {
        // Read the contents of the file synchronously
        const data = fs.readFileSync(filePath, 'utf8');

        // Process the contents of the file
        // console.log('File contents:', data);

        testBoard = JSON.parse(data)

        // console.log('Parsed data:', FiveByFiveBoards);

        // Continue with the rest of your code after reading and processing the file
      } catch (error) {
        console.error('Error reading the file:', error);
      }

        

      let convertedBoards = boardConverter(testBoard);
      // console.log("HERE ARE THE CONVERTED BOARDS", convertedBoards);
        
   


      let averageTimeList = []
      let boardNumber = 0
      let currentProg = 0
      let totalStartTime = Date.now()
      for (let i of convertedBoards) {
        let startTime = Date.now()


        // console.time("AverageNumRollsPerBoard")
        let averageNumber = averageNumberOfRollsPerBoard(i, numSamples);
        // console.timeEnd("AverageNumRollsPerBoard")
        let endTime = Date.now();
        let timeTaken = endTime - startTime;
        if ((boardNumber / testBoard.length * 100) - 1 > currentProg && timeTaken > 0) {
          if(progressLogging){
            console.log("Progress: ", (boardNumber / testBoard.length * 100).toFixed(2) + '%', ' | Time Left: ' + (timeTaken * (testBoard.length - boardNumber) / 1000).toFixed(2) + 's')

          }
          currentProg = (boardNumber / testBoard.length * 100)
        }
        if (!averageNumber) {
          console.log("ERROR ENCOUNTERED");
          return
        }
        averageTimeList.push(averageNumber);
        boardNumber++
      }




        let maxData = findMaxIndexOfList(averageTimeList)
        let minData = findMinIndexOfList(averageTimeList);
        let histogram = histogramMaker(minData.minVal, maxData.maxVal, 20, averageTimeList);
          let out = [];
          let numberPerRoll = {}
          for (let i of convertedBoards[minData.minIndex]) {
            out.push(diceNumberComboMappingsString[i]);
            if (numberPerRoll[diceNumberComboMappingsString[i]] == null) {
              numberPerRoll[diceNumberComboMappingsString[i]] = 1
            } else {
              numberPerRoll[diceNumberComboMappingsString[i]]++
            }
          }

  return {maxData, minData, optimalBoard:out, minAverageNumberOfRollsTillWin:numberPerRoll, totalProcessingTime: ((Date.now() - totalStartTime) / 1000).toFixed(2) + 's', histogram: histogram}
}

function printBruteForceResult(rslt){
  console.log("HERE IS THE HISTOGRAM", rslt.histogram)
  console.log("maxData", rslt.maxData)
  console.log("minData", rslt.minData);
  console.log("MIN Rolls Board Result", rslt.optimalBoard, rslt.minAverageNumberOfRollsTillWin);
  console.log("TOTAL PROCESSING TIME: ", rslt.totalProcessingTime)
}

/**
 * Runs the dice Probabilities approach, over the number of trials calculates the average dice probabilities across the numRolls provided
 * Returns an object of the average number of dice rolls for each tile type
 * @param {*} numberOfTrials 
 */
function diceProbabilitiesApproach(numberOfTrials=100000, numRolls=25){
  let trialsRolls = getDiceProbabilitiesOverTrials(numberOfTrials, numRolls)
  let out = {}
  for(let i of (Object.keys(trialsRolls)).sort()){
    out[diceNumberComboMappingsString[i]]=(trialsRolls[i]/numberOfTrials)
  }

  return out
}

/**
 * Returns an updated object where each of the dice rolls is rounded to a whole number 
 * until we total the numTiles. It does this by rounding up the numbers closests to the next nearest whole number
 */
function greedyDiceProbsRoundingCalculator(diceProbs, numTiles){
  let closestIndx = ''
  let roundingDifference = 1.1
  let currNumTiles=0
  for(let j of Object.keys(diceProbs)){
    currNumTiles+=Math.floor(diceProbs[j])
  }
  if(currNumTiles==numTiles){
    for(let j of Object.keys(diceProbs)){
      diceProbs[j]=Math.floor(diceProbs[j])
    }
    return diceProbs
  }

  for(let i of Object.keys(diceProbs)){
    let roundingDif= (Math.ceil(diceProbs[i]) - diceProbs[i])
    if(roundingDif<roundingDifference && roundingDif!=0){
      roundingDifference=roundingDif;
      closestIndx = i
    }
  }
  diceProbs[closestIndx]=(Math.ceil(diceProbs[closestIndx]));
  return greedyDiceProbsRoundingCalculator(diceProbs, numTiles);


}

const FiveByFiveFilePath = 'BoardArrays/5x5.txt';
const FourByFourFilePath = 'BoardArrays/4x4.txt';
const ThreeByThreeFilePath = 'BoardArrays/3x3.txt';
const TwoByTwoFilePath = 'BoardArrays/2x2.txt';
const OneByOneFilePath = 'BoardArrays/1x1.txt'

let boardSize=25
let diceProbs = diceProbabilitiesApproach(100000, boardSize);
console.log("HERE ARE RAW DICE PROBS", diceProbs)
let greedyRoundedProbability = greedyDiceProbsRoundingCalculator(diceProbs, boardSize)
console.log("HERE IS THE GREEDY ROUNDED PROBABILITY", greedyRoundedProbability)

let bruteForceResult = bruteForceOptimalBoardFinder(OneByOneFilePath, 1000, false)
// printBruteForceResult(bruteForceResult)


//Optimal Board for the 2x2 seems to be ["GB", "GB", "GG", "GR"]


