// Main App Controller
class LearningAdventureApp {
    constructor() {
        // DOM Elements
        this.elements = {
            appContainer: document.getElementById('app-container'),
            loadingScreen: document.getElementById('loading-screen'),
            navContainer: document.getElementById('nav-container'),
            contentArea: document.getElementById('content-area'),
            activityGrid: document.getElementById('activity-grid')
        };

        // State
        this.initializedSections = new Set(['home']);
        this.currentSection = 'home';
        this.mathWorker = null;

        // Initialize
        this.init();
    }

    init() {
        // Set up event listeners
        this.setupEventListeners();

        // Simulate loading
        setTimeout(() => {
            this.elements.loadingScreen.style.display = 'none';
            this.elements.appContainer.classList.remove('loading');
        }, 800);
    }

    setupEventListeners() {
        // Navigation handling with event delegation
        this.elements.navContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.nav-btn');
            if (button) {
                this.handleNavigation(button);
            }
        });

        // Activity cards with event delegation
        this.elements.activityGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.activity-card');
            if (card) {
                this.handleActivityNavigation(card);
            }
        });

        // Initialize web worker for math
        this.initMathWorker();
    }

    initMathWorker() {
        if (window.Worker) {
            this.mathWorker = new Worker('math-worker.js');
            this.mathWorker.onmessage = (e) => {
                if (e.data.type === 'problemsGenerated') {
                    this.handleMathProblems(e.data.problems);
                }
            };
        }
    }

    handleNavigation(button) {
        const section = button.dataset.section;
        this.showSection(section, button);
    }

    handleActivityNavigation(card) {
        const section = card.dataset.section;
        const button = document.querySelector(`.nav-btn[data-section="${section}"]`);
        this.showSection(section, button);
    }

    showSection(section, button) {
        // Update current section
        this.currentSection = section;

        // Update active button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (button) button.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.section-content').forEach(content => {
            content.style.display = 'none';
        });

        // Show loading state
        const sectionElement = document.getElementById(section);
        sectionElement.innerHTML = '<div class="section-loading"><div class="loader small"></div></div>';
        sectionElement.style.display = 'block';

        // Initialize section with slight delay for smoother UX
        setTimeout(() => {
            this.initializeSection(section);
        }, 50);
    }

    initializeSection(section) {
        if (this.initializedSections.has(section)) return;

        switch(section) {
            case 'english':
                this.initEnglishSection();
                break;
            case 'math':
                this.initMathSection();
                break;
            case 'poems':
                this.initPoemsSection();
                break;
            case 'coloring':
                this.initColoringSection();
                break;
        }

        this.initializedSections.add(section);
    }

    initEnglishSection() {
        const container = document.getElementById('alphabet-container');
        const letters = this.generateEnglishLetters();
        
        container.innerHTML = letters.map(letter => `
            <div class="letter-card" data-letter="${letter.char}">
                <div class="letter">${letter.char}</div>
                <div class="letter-example">${letter.emoji} ${letter.word}</div>
            </div>
        `).join('');

        // Event delegation for letter cards
        container.addEventListener('click', (e) => {
            const card = e.target.closest('.letter-card');
            if (card) {
                this.speakLetter(card.dataset.letter);
            }
        });
    }

    generateEnglishLetters() {
        return [
            {char: 'A', word: 'Apple', emoji: '🍎'},
            // ... rest of the letters ...
            {char: 'Z', word: 'Zebra', emoji: '🦓'}
        ];
    }

    initMathSection() {
        const container = document.getElementById('math-container');
        
        // Initial UI
        container.innerHTML = `
            <div class="math-section">
                <h3 class="math-title">Counting Practice (1-500)</h3>
                <div class="counter">
                    <span id="counter-value">1</span>
                </div>
                <div class="counter-controls">
                    <button class="counter-btn" id="prev-btn">←</button>
                    <button class="counter-btn" id="next-btn">→</button>
                </div>
                <button class="control-btn" id="speak-btn">Speak Number</button>
            </div>
            <div class="math-section">
                <div class="level-info">Math Practice - Level <span id="math-level">1</span>/100</div>
                <div class="problem-container">
                    <span id="math-problem">Loading problems...</span>
                </div>
                <div class="answer-options" id="answer-options"></div>
                <button class="control-btn" id="next-problem-btn">Next Problem</button>
            </div>
        `;

        // Initialize counter
        this.initCounter();

        // Generate math problems in worker
        if (this.mathWorker) {
            this.mathWorker.postMessage({ 
                type: 'generateProblems', 
                data: { count: 100 } 
            });
        } else {
            // Fallback if workers not supported
            setTimeout(() => {
                this.handleMathProblems(this.generateMathProblems(100));
            }, 0);
        }
    }

    handleMathProblems(problems) {
        this.mathProblems = problems;
        this.currentMathLevel = 1;
        this.showMathProblem(this.currentMathLevel);
        
        // Set up problem navigation
        document.getElementById('next-problem-btn').addEventListener('click', () => {
            this.currentMathLevel = this.currentMathLevel < 100 ? this.currentMathLevel + 1 : 1;
            this.showMathProblem(this.currentMathLevel);
        });
    }

    showMathProblem(level) {
        const problem = this.mathProblems[level - 1];
        document.getElementById('math-problem').textContent = problem.problem;
        document.getElementById('math-level').textContent = level;

        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = problem.options.map(option => `
            <button class="answer-btn" data-answer="${option}">${option}</button>
        `).join('');

        // Event delegation for answer options
        optionsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.answer-btn');
            if (button) {
                this.handleAnswerSelection(button, problem.answer);
            }
        });
    }

    handleAnswerSelection(button, correctAnswer) {
        const userAnswer = parseInt(button.dataset.answer);
        if (userAnswer === correctAnswer) {
            button.style.background = '#2ecc71';
            button.style.boxShadow = '0 3px 0 #27ae60';
            button.classList.add('celebrate');
            setTimeout(() => {
                button.classList.remove('celebrate');
            }, 1000);
        } else {
            button.style.background = '#e74c3c';
            button.style.boxShadow = '0 3px 0 #c0392b';
        }
    }

    initCounter() {
        let counter = 1;
        const counterElement = document.getElementById('counter-value');
        const updateCounter = () => counterElement.textContent = counter;

        document.getElementById('prev-btn').addEventListener('click', () => {
            if (counter > 1) counter--;
            updateCounter();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            if (counter < 500) counter++;
            updateCounter();
        });

        document.getElementById('speak-btn').addEventListener('click', () => {
            this.speak(counter.toString());
        });
    }

    initPoemsSection() {
        const container = document.getElementById('poems-container');
        const poems = this.getPoemsData();
        
        container.innerHTML = poems.map(poem => `
            <div class="poem-card">
                <h3 class="poem-title">${poem.title}</h3>
                <pre class="poem-content">${poem.content}</pre>
                <button class="play-btn" data-poem="${encodeURIComponent(poem.content)}">▶</button>
            </div>
        `).join('');

        // Event delegation for play buttons
        container.addEventListener('click', (e) => {
            const button = e.target.closest('.play-btn');
            if (button) {
                this.speakPoem(decodeURIComponent(button.dataset.poem));
            }
        });
    }

    initColoringSection() {
        const container = document.getElementById('coloring-container');
        const animals = this.getAnimalData();
        
        // Initial view - animal selection
        container.innerHTML = `
            <div class="animal-grid" id="animal-grid">
                ${animals.map(animal => `
                    <div class="animal-card" data-animal="${animal.name}">
                        <div class="animal-img">${animal.image}</div>
                        <div class="animal-name">${animal.name}</div>
                    </div>
                `).join('')}
            </div>
            <div class="coloring-area" id="coloring-area" style="display: none;">
                <div class="coloring-header">
                    <div class="coloring-title" id="coloring-title">Coloring: </div>
                    <button class="control-btn" id="back-btn">Back to Animals</button>
                </div>
                <div class="coloring-image-container">
                    <div class="coloring-image" id="coloring-image"></div>
                </div>
                <div class="color-picker">
                    <div class="color-option active" style="background-color: #F47B7B;" data-color="#F47B7B"></div>
                    <div class="color-option" style="background-color: #6EC4DB;" data-color="#6EC4DB"></div>
                    <div class="color-option" style="background-color: #FFD166;" data-color="#FFD166"></div>
                    <div class="color-option" style="background-color: #A37AFC;" data-color="#A37AFC"></div>
                    <div class="color-option" style="background-color: #A5DD9B;" data-color="#A5DD9B"></div>
                    <div class="color-option" style="background-color: #ffffff; border: 1px solid #ccc;" data-color="#ffffff"></div>
                </div>
                <div class="coloring-controls">
                    <button class="control-btn" id="save-coloring-btn">Save Coloring</button>
                </div>
            </div>
        `;

        // Set up coloring section events
        this.setupColoringEvents();
    }

    setupColoringEvents() {
        const animalGrid = document.getElementById('animal-grid');
        const coloringArea = document.getElementById('coloring-area');
        const coloringImage = document.getElementById('coloring-image');
        const coloringTitle = document.getElementById('coloring-title');
        const animals = this.getAnimalData();

        // Animal selection
        animalGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.animal-card');
            if (card) {
                const animalName = card.dataset.animal;
                const animal = animals.find(a => a.name === animalName);
                
                animalGrid.style.display = 'none';
                coloringArea.style.display = 'flex';
                coloringTitle.textContent = `Coloring: ${animal.name}`;
                coloringImage.textContent = animal.image;
                coloringImage.style.color = '#F47B7B'; // Default color
            }
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            coloringArea.style.display = 'none';
            animalGrid.style.display = 'grid';
        });

        // Color selection
        document.querySelector('.color-picker').addEventListener('click', (e) => {
            const option = e.target.closest('.color-option');
            if (option) {
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
                coloringImage.style.color = option.dataset.color;
            }
        });

        // Save button
        document.getElementById('save-coloring-btn').addEventListener('click', () => {
            alert('Coloring saved! (This would save in a real app)');
        });
    }

    // Helper methods
    speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = 1.1;
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }

    speakLetter(letter) {
        this.speak(letter);
    }

    speakPoem(poem) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(poem);
            utterance.pitch = 1.2;
            utterance.rate = 0.9;
            
            // Try to find a female voice
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.name.includes('female') || 
                voice.name.includes('Female') ||
                voice.name.includes('woman') ||
                voice.name.includes('Woman')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            window.speechSynthesis.speak(utterance);
        }
    }

    getAnimalData() {
        return [
            {name: "Lion", image: "🦁", level: 1},
            {name: "Elephant", image: "🐘", level: 1},
            {name: "Giraffe", image: "🦒", level: 1},
            {name: "Tiger", image: "🐯", level: 1},
            {name: "Monkey", image: "🐵", level: 1},
            {name: "Zebra", image: "🦓", level: 1}
        ];
    }

    getPoemsData() {
        return [
            {
                title: "Twinkle, Twinkle, Little Star",
                content: `Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.`
            },
            // ... other poems ...
        ];
    }

    generateMathProblems(count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            problems.push(this.generateMathProblem());
        }
        return problems;
    }

    generateMathProblem() {
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
            options: this.generateOptions(answer)
        };
    }

    generateOptions(correct) {
        const options = [correct];
        while (options.length < 4) {
            const option = Math.max(0, correct + Math.floor(Math.random() * 10) - 5);
            if (!options.includes(option)) {
                options.push(option);
            }
        }
        return this.shuffleArray(options);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LearningAdventureApp();
});
