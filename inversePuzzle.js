/**
 * 计算逆序对个数
 * @param {number[]} puzzle - 1到8的排列数组
 * @returns {number} 逆序对个数
 */
function countInversions(puzzle) {
    let inverseNum = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = i; j < 9; j++) {
            if (puzzle[i] > puzzle[j]) {
                inverseNum = inverseNum + 1;
            }
        }
    }
    return inverseNum;
}

/**
 * 生成可解的 8-Puzzle（逆序对为偶数）
 * @returns {number[]} 可解的 8-Puzzle 状态
 */
function generateSolvable() {
    while (true) {
        // 创建 [0, 1, 2, 3, 4, 5, 6, 7, 8]
        const puzzle = Array.from({length: 9}, (_, i) => i);
        
        // 随机打乱
        shuffle(puzzle);
        
        // 检查是否可解（逆序对为偶数）
        if (countInversions(puzzle) % 2 === 0) {
            return puzzle;
        }
    }
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// ============ 使用示例 ============

// 生成可解的 8-Puzzle
const puzzle = generateSolvable();
console.log('生成的可解 8-Puzzle:', puzzle);
console.log('逆序对个数:', countInversions(puzzle));
console.log('是否可解:', countInversions(puzzle) % 2 === 0);

// 转换为 3x3 网格显示
function printGrid(puzzle) {
    for (let i = 0; i < 3; i++) {
        const row = puzzle.slice(i * 3, (i + 1) * 3);
        console.log(row);
    }
}

console.log('\n网格显示:');
printGrid(puzzle);
