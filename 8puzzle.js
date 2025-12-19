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

function getNeighbors(state){
    let neighbors = [];
    let zeroIndex = state.index0f(0);
    let r = Math.floor(zeroIndex / 3);
    let c = zeroIndex % 3;

    const direcition = [     //定义了一个对象数组，这种做法叫**“数据驱动控制”**。它的核心思想是：把经常变化的数据（方向坐标）从逻辑（移动代码）中抽离出来。
        { dr: -1, dc: 0 },//up
        { dr: 1, dc: 0 },//down
        { dr: 0, dc: -1 },//left
        { dr: 0, dc: 1 },//right
    ];

    directions.forEach(dir => {
        let newR = r + dir.dr;
        let newC = c + dir.dc;

        if(newR >= 0 && newR < 3 && newC >= 0 && newC < 3){
            let newIndex = newR * 3 + newC;
            let newState = [...state]; //克隆数组(...is spread operator)
            [newState[zeroIndex], newState[newIndex]] = [newState[newIndex], newState[zeroIndex]]
            neighbors.push(newState);
        }
    })
    return neighbors;
}


function solveAstar(){
    let openList = [];
    let closedList = new Set();//Set（）为集合数据结构。不重复：同一个东西，无论你存多少次，它只会保留一份。快速查找：它专门优化了“查找”速度。判断一个东西在不在 Set 里，比在 Array 里快得多。
    let h = getManhattanDistance(currentState); 
    let startNode = new Node(currentState, null, 0, h);
    openList.push(startNode);
    
    while (openList.length > 0){
        openList.sort((a, b) => a.f - b.f);
        let currentNode = openList.shift();
        let currentStateString = currentNode.state.join(',');
        closedList.add(currentStateString);

        
        if (currentNode.state.join(',') === FINAL_STATE.join(',')){
            return reconstructPath(currentNode);
        }
        
        
        let neighbors = getNeighbors(currentNode.state);
        neighbors.forEach(nextState => {
            if (closedList.has(nextState.join(','))){
                return;
            }
            let h = getManhattanDistance(nextState);
            let newNode = new Node(nextState, currentNode, currentNode.g + 1, h);
            openList.push(newNode);
        });
    }
}

function reconstructPath(node){
    let path = [];
    let tempNode = node;
    while (tempNode !== null){
        path.push(tempNode.state);
        tempNode = tempNode.parent;
    }
    return path.reverse();
}


document.getElementById('solve-btn').addEventListener('click', async () => {
    let path = solveAstar();
    for (let i = 0; i < path.length; i++){
        await new Promise(resolve => setTimeout(resolve,300));//await 与 async搭配使用
        currentState = path[i];
        moveCount = i;
        document.getElementById('move-count').textContent = moveCount;
        renderBoard();
        bindTileEvents();
    }
   alert("求解完成！最小步数为：" + (path.length - 1));
})

