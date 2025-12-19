// 全局变量
const BOARD_SIZE = 3;
const TILE_COUNT = BOARD_SIZE * BOARD_SIZE; // 9
const FINAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 目标状态
const gameBoard = document.getElementById('game-board');
let currentState = []; 
let moveCount = 0;

function initGame() {
    currentState = generateSolvableState();  
    moveCount = 0;
    document.getElementById('move-count').textContent = moveCount;
    renderBoard();
    bindTileEvents();
}

function generateSolvableState(){
        function inversecheck(puzzle) {
            const nums = puzzle.filter(x => x !== 0);
            let inverseNum = 0;
            for (let i = 0; i < nums.length; i++) {
                for (let j = i + 1; j < nums.length; j++) {
                    if (nums[i] > nums[j]) {
                        inverseNum++;
                    }
                }
            }
            return inverseNum;
        }

    
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));//Math.random() 生成 [0,1) 之间的数 floor 向下取整
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        
        while (true) {
            const puzzle = Array.from({ length: TILE_COUNT }, (_, i) => i);
            shuffle(puzzle);
            if (inversecheck(puzzle) % 2 === 0) {
                return puzzle;
            }
        }

    }
//重置DOM
function renderBoard() {
    gameBoard.innerHTML = ''; // 清空现有内容

    currentState.forEach(number => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        
        if (number === 0) {
            tile.classList.add('empty');
            tile.setAttribute('data-number', '0');
            tile.textContent = ''; 
        } 
        else {
            tile.setAttribute('data-number', number);
            tile.textContent = number;
        }
        
        gameBoard.appendChild(tile);
    });
}


document.addEventListener('DOMContentLoaded', initGame);
document.getElementById('new-game-btn').addEventListener('click', initGame);


function bindTileEvents() {
    // 重新查询 DOM，因为 renderBoard() 重新创建了元素
    let tiles = document.querySelectorAll('.tile'); 
    tiles.forEach(tile => {
        if (!tile.classList.contains('empty')) { // 空格不需监听点击
            tile.addEventListener('click', handleTileClick);
        }
    });
}


function handleTileClick(event) {
    const clickedTile = event.currentTarget;
    const tileNumber = parseInt(clickedTile.getAttribute('data-number'));
    const emptyTile = document.querySelector('.empty');
    const allTiles = Array.from(gameBoard.children); 
    const tileIndex = allTiles.indexOf(clickedTile);
    const emptyIndex = allTiles.indexOf(emptyTile);

    if (isMoveValid(tileIndex, emptyIndex)) {
        [currentState[tileIndex], currentState[emptyIndex]] = [currentState[emptyIndex], currentState[tileIndex]];
        swapDOMElements(clickedTile, emptyTile);
        moveCount++;
        document.getElementById('move-count').textContent = moveCount;
        if (checkWin()) {
            setTimeout(() => {
                alert(`恭喜！你以 ${moveCount} 步完成了拼图！`);
            }, 300); 
        }
    }
}

function isMoveValid(tileIndex, emptyIndex) {
    const isHorizontal = Math.abs(tileIndex - emptyIndex) === 1 && 
                         Math.floor(tileIndex / BOARD_SIZE) === Math.floor(emptyIndex / BOARD_SIZE);
    const isVertical = Math.abs(tileIndex - emptyIndex) === BOARD_SIZE;
    return isHorizontal || isVertical;
}

function swapDOMElements(tileA, tileB) {
    const parent = gameBoard;
    const temp = document.createElement('div'); // 临时占位符
    parent.replaceChild(temp, tileA); 
    parent.replaceChild(tileA, tileB); 
    parent.replaceChild(tileB, temp); 
    temp.remove(); 
}

function checkWin() {
    return currentState.every((val, index) => val === FINAL_STATE[index]);}

function getManhattanDistance(state) {
    let totalDistance = 0;
    for (let i = 0; i < state.length; i++) {
        let value = state[i];
        if (value !== 0) {
            let currentX = i % 3;
            let currentY = Math.floor(i / 3);
            let targetX = (value - 1) % 3;
            let targetY = Math.floor((value - 1)/3);
            totalDistance += Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
        }
    }
    return totalDistance;
}

class Node {
    constructor(state, parent = null, g = 0, h = 0){
        this.state = state;
        this.parent = parent;
        this.g = g;
        this.h = h;
        this.f = h + g;
    }
}

