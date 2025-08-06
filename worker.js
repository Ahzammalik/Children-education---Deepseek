// Web Worker for math problem generation
self.onmessage = function(e) {
    const { type, data } = e.data;
    
    if (type === 'generateProblems') {
        const problems = [];
        for (let i = 0; i < data.count; i++) {
            problems.push(generateMathProblem());
            
            // Yield occasionally to prevent freezing
            if (i % 10 === 0) {
                setTimeout(() => {}, 0);
            }
        }
        self.postMessage({ type: 'problemsGenerated', problems });
    }
};

function generateMathProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let problem, answer;
    switch(operation) {
        case '+':
            problem = `${num1} + ${num2} = ?`;
            answer = num1 + num2;
            break;
        case '-':
            problem = `${num1} - ${num2} = ?`;
            answer = num1 - num2;
            break;
        case '×':
            problem = `${num1} × ${num2} = ?`;
            answer = num1 * num2;
            break;
        case '÷':
            problem = `${num1 * num2} ÷ ${num2} = ?`;
            answer = num1;
            break;
    }
    
    return {
        problem,
        answer,
        options: generateOptions(answer)
    };
}

function generateOptions(correct) {
    const options = [correct];
    while (options.length < 4) {
        const option = Math.max(0, correct + Math.floor(Math.random() * 10) - 5);
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    return shuffleArray(options);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
