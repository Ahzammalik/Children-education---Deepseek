// Handle heavy math calculations in background
self.onmessage = function(e) {
    const { type, data } = e.data;
    
    if (type === 'generateProblems') {
        const problems = [];
        for (let i = 0; i < data.count; i++) {
            problems.push(generateMathProblem());
        }
        self.postMessage({ type: 'problemsGenerated', problems });
    }
};

function generateMathProblem() {
    // Problem generation logic
    return problem;
}
