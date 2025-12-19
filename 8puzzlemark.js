// 全局变量
const BOARD_SIZE = 3;
const TILE_COUNT = BOARD_SIZE * BOARD_SIZE; // 9
const FINAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 目标状态
const gameBoard = document.getElementById('game-board');

let currentState = []; // 存储当前的 9 位数字数组状态
let moveCount = 0;

/**
 * 随机生成一个可解的初始状态并渲染到界面。
 */
function initGame() {
    // 1. 生成打乱的、可解的状态数组
    currentState = generateSolvableState();
    
    // 2. 重置移动计数
    moveCount = 0;
    document.getElementById('move-count').textContent = moveCount;

    // 3. 根据新状态重新渲染棋盘
    renderBoard();

    // 4. 重新绑定点击事件
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

// 页面加载完成后调用初始化函数
document.addEventListener('DOMContentLoaded', initGame);
document.getElementById('new-game-btn').addEventListener('click', initGame);


function bindTileEvents() {
    // 必须重新查询 DOM，因为 renderBoard() 重新创建了元素
    let tiles = document.querySelectorAll('.tile'); 
    tiles.forEach(tile => {
        if (!tile.classList.contains('empty')) { // 空格不需监听点击
            tile.addEventListener('click', handleTileClick);
        }
    });
}

/**
 * 处理方块点击事件，实现移动逻辑。
 */
function handleTileClick(event) {
    const clickedTile = event.currentTarget;
    
    // 获取当前点击方块和空格方块
    const tileNumber = parseInt(clickedTile.getAttribute('data-number'));
    const emptyTile = document.querySelector('.empty');

    // 1. 获取方块在当前 DOM 结构中的索引
    // Array.from(gameBoard.children) 将 NodeList 转换为数组，方便查找索引
    const allTiles = Array.from(gameBoard.children); 
    const tileIndex = allTiles.indexOf(clickedTile);
    const emptyIndex = allTiles.indexOf(emptyTile);

    // 2. 判断是否相邻（可移动）
    if (isMoveValid(tileIndex, emptyIndex)) {
        // 3. 执行数组状态交换
        [currentState[tileIndex], currentState[emptyIndex]] = [currentState[emptyIndex], currentState[tileIndex]];

        // 4. 执行 DOM 元素交换（利用 CSS transition 实现动画）
        swapDOMElements(clickedTile, emptyTile);

        // 5. 更新计数
        moveCount++;
        document.getElementById('move-count').textContent = moveCount;

        // 6. 检查胜利
        if (checkWin()) {
            setTimeout(() => {
                alert(`恭喜！你以 ${moveCount} 步完成了拼图！`);
            }, 300); // 留出时间播放动画
        }
    }
}

/**
 * 判断两个索引位置的方块是否为相邻可移动位置。
 */
function isMoveValid(tileIndex, emptyIndex) {
    // 相同行相邻 (索引差为 1) 且不跨行
    const isHorizontal = Math.abs(tileIndex - emptyIndex) === 1 && 
                         Math.floor(tileIndex / BOARD_SIZE) === Math.floor(emptyIndex / BOARD_SIZE);
    
    // 相同列相邻 (索引差为 3)
    const isVertical = Math.abs(tileIndex - emptyIndex) === BOARD_SIZE;

    return isHorizontal || isVertical;
}

/**
 * 交换两个 DOM 元素的位置 (使用简单可靠的替换法)。
 */
function swapDOMElements(tileA, tileB) {
    const parent = gameBoard;
    const temp = document.createElement('div'); // 临时占位符

    // 交换过程：A -> temp, B -> A 的位置, temp -> B 的位置
    parent.replaceChild(temp, tileA); 
    parent.replaceChild(tileA, tileB); 
    parent.replaceChild(tileB, temp); 
    temp.remove(); 
}

/**
 * 检查当前状态是否等于目标状态。
 */
function checkWin() {
    // 比较两个数组是否完全相同
    return currentState.every((val, index) => val === FINAL_STATE[index]);}

