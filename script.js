// Cache DOM elements
const loadingScreen = document.getElementById('loading-screen');
const navButtons = document.querySelectorAll('.nav-btn');
const sectionContents = document.querySelectorAll('.section-content');
const activityCards = document.querySelectorAll('.activity-card');

// Initialize app after loading
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        initializeApp();
    }, 800);
});

function initializeApp() {
    // Navigation handling
    navButtons.forEach(button => {
        button.addEventListener('click', handleNavigation);
    });
    
    activityCards.forEach(card => {
        card.addEventListener('click', handleActivityNavigation);
    });
    
    // Initialize sections
    initEnglishSection();
    initMathSection();
    initPoemsSection();
    initColoringSection();
}

function handleNavigation() {
    const section = this.getAttribute('data-section');
    
    // Update active button
    navButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    
    // Show selected section
    sectionContents.forEach(content => content.style.display = 'none');
    document.getElementById(section).style.display = 'block';
}

function handleActivityNavigation() {
    const section = this.getAttribute('data-section');
    
    // Update active button
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('data-section') === section) {
            btn.classList.add('active');
        }
    });
    
    // Show selected section
    sectionContents.forEach(content => content.style.display = 'none');
    document.getElementById(section).style.display = 'block';
}

// Initialize English Section
function initEnglishSection() {
    const englishContainer = document.getElementById('alphabet-container');
    const englishLetters = [
        {char: 'A', word: 'Apple', emoji: '🍎'},
        {char: 'B', word: 'Ball', emoji: '⚽'},
        {char: 'C', word: 'Cat', emoji: '🐱'},
        {char: 'D', word: 'Dog', emoji: '🐶'},
        {char: 'E', word: 'Elephant', emoji: '🐘'},
        {char: 'F', word: 'Flower', emoji: '🌸'},
        {char: 'G', word: 'Grapes', emoji: '🍇'},
        {char: 'H', word: 'House', emoji: '🏠'},
        {char: 'I', word: 'Ice Cream', emoji: '🍦'},
        {char: 'J', word: 'Jellyfish', emoji: '🎐'},
        {char: 'K', word: 'Kite', emoji: '🪁'},
        {char: 'L', word: 'Lion', emoji: '🦁'},
        {char: 'M', word: 'Moon', emoji: '🌙'},
        {char: 'N', word: 'Nest', emoji: '🐦'},
        {char: 'O', word: 'Orange', emoji: '🍊'},
        {char: 'P', word: 'Pizza', emoji: '🍕'},
        {char: 'Q', word: 'Queen', emoji: '👑'},
        {char: 'R', word: 'Rainbow', emoji: '🌈'},
        {char: 'S', word: 'Sun', emoji: '☀️'},
        {char: 'T', word: 'Tree', emoji: '🌳'},
        {char: 'U', word: 'Umbrella', emoji: '☔'},
        {char: 'V', word: 'Violin', emoji: '🎻'},
        {char: 'W', word: 'Watermelon', emoji: '🍉'},
        {char: 'X', word: 'Xylophone', emoji: '🎹'},
        {char: 'Y', word: 'Yacht', emoji: '⛵'},
        {char: 'Z', word: 'Zebra', emoji: '🦓'}
    ];
    
    // Clear container first
    englishContainer.innerHTML = '';
    
    englishLetters.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.innerHTML = `
            <div class="letter">${letter.char}</div>
            <div class="letter-example">${letter.emoji} ${letter.word}</div>
        `;
        card.addEventListener('click', () => speakLetter(letter.char));
        englishContainer.appendChild(card);
    });
}

// Initialize Math Section
function initMathSection() {
    const counterValue = document.getElementById('counter-value');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const speakBtn = document.getElementById('speak-btn');
    let counter = 1;
    
    prevBtn.addEventListener('click', function() {
        if(counter > 1) {
            counter--;
            updateCounter();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if(counter < 500) {
            counter++;
            updateCounter();
        }
    });
    
    speakBtn.addEventListener('click', function() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel(); // Cancel any ongoing speech
            const utterance = new SpeechSynthesisUtterance(counter.toString());
            utterance.pitch = 1.1;
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
    });
    
    function updateCounter() {
        counterValue.textContent = counter;
    }
    
    // Math problems functionality
    const mathProblem = document.getElementById('math-problem');
    const answerOptions = document.getElementById('answer-options');
    const nextProblemBtn = document.getElementById('next-problem-btn');
    const mathLevel = document.getElementById('math-level');
    let currentLevel = 1;
    
    // Math problems data
    const mathProblems = generateMathProblems(100);
    
    function generateMathProblems(count) {
        const problems = [];
        for (let i = 1; i <= count; i++) {
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
            
            problems.push({
                problem,
                answer,
                options: generateOptions(answer)
            });
        }
        return problems;
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
    
    function showProblem(level) {
        const problem = mathProblems[level - 1];
        mathProblem.textContent = problem.problem;
        mathLevel.textContent = level;
        
        answerOptions.innerHTML = '';
        problem.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = option;
            button.addEventListener('click', function() {
                if (option === problem.answer) {
                    this.style.background = '#2ecc71';
                    this.style.boxShadow = '0 3px 0 #27ae60';
                    this.classList.add('celebrate');
                    setTimeout(() => {
                        this.classList.remove('celebrate');
                    }, 1000);
                } else {
                    this.style.background = '#e74c3c';
                    this.style.boxShadow = '0 3px 0 #c0392b';
                }
            });
            answerOptions.appendChild(button);
        });
    }
    
    nextProblemBtn.addEventListener('click', function() {
        currentLevel = currentLevel < 100 ? currentLevel + 1 : 1;
        showProblem(currentLevel);
    });
    
    // Initialize with first problem
    showProblem(currentLevel);
}

// Initialize Poems Section
function initPoemsSection() {
    const poemsContainer = document.getElementById('poems-container');
    const poems = [
        {
            title: "Twinkle, Twinkle, Little Star",
            content: `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.`
        },
        {
            title: "Humpty Dumpty",
            content: `Humpty Dumpty sat on a wall,
Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.`
        },
        {
            title: "Jack and Jill",
            content: `Jack and Jill went up the hill
To fetch a pail of water.
Jack fell down and broke his crown,
And Jill came tumbling after.`
        },
        {
            title: "Baa, Baa, Black Sheep",
            content: `Baa, baa, black sheep,
Have you any wool?
Yes sir, yes sir,
Three bags full.`
        },
        {
            title: "Little Miss Muffet",
            content: `Little Miss Muffet
Sat on a tuffet,
Eating her curds and whey;
Along came a spider,
Who sat down beside her,
And frightened Miss Muffet away.`
        },
        {
            title: "Hey Diddle Diddle",
            content: `Hey diddle diddle,
The cat and the fiddle,
The cow jumped over the moon;
The little dog laughed
To see such sport,
And the dish ran away with the spoon.`
        },
        {
            title: "Mary Had a Little Lamb",
            content: `Mary had a little lamb,
Its fleece was white as snow;
And everywhere that Mary went,
The lamb was sure to go.`
        },
        {
            title: "Itsy Bitsy Spider",
            content: `The itsy bitsy spider climbed up the water spout.
Down came the rain, and washed the spider out.
Out came the sun, and dried up all the rain,
And the itsy bitsy spider climbed up the spout again.`
        },
        {
            title: "Row, Row, Row Your Boat",
            content: `Row, row, row your boat,
Gently down the stream.
Merrily, merrily, merrily, merrily,
Life is but a dream.`
        },
        {
            title: "Hickory Dickory Dock",
            content: `Hickory dickory dock,
The mouse ran up the clock.
The clock struck one,
The mouse ran down,
Hickory dickory dock.`
        }
    ];
    
    // Clear container first
    poemsContainer.innerHTML = '';
    
    poems.forEach(poem => {
        const poemCard = document.createElement('div');
        poemCard.className = 'poem-card';
        poemCard.innerHTML = `
            <h3 class="poem-title">${poem.title}</h3>
            <pre class="poem-content">${poem.content}</pre>
            <button class="play-btn">▶</button>
        `;
        
        const playBtn = poemCard.querySelector('.play-btn');
        playBtn.addEventListener('click', function() {
            speakPoem(poem.content);
        });
        
        poemsContainer.appendChild(poemCard);
    });
    
    function speakPoem(poem) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel(); // Cancel any ongoing speech
            const utterance = new SpeechSynthesisUtterance(poem);
            utterance.pitch = 1.2;
            utterance.rate = 0.9;
            
            // Try to find a female voice
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.name.includes('female') || 
                voice.name.includes('Female') ||
                voice.name.includes('woman') ||
                voice.name.includes('Woman')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            speechSynthesis.speak(utterance);
        }
    }
}

// Initialize Coloring Section
function initColoringSection() {
    const animalGrid = document.getElementById('animal-grid');
    const coloringArea = document.getElementById('coloring-area');
    const backBtn = document.getElementById('back-btn');
    const coloringImage = document.getElementById('coloring-image');
    const coloringTitle = document.getElementById('coloring-title');
    const colorOptions = document.querySelectorAll('#coloring-area .color-option');
    const animalImages = [
        {name: "Lion", image: "🦁", level: 1},
        {name: "Elephant", image: "🐘", level: 1},
        {name: "Giraffe", image: "🦒", level: 1},
        {name: "Tiger", image: "🐯", level: 1},
        {name: "Monkey", image: "🐵", level: 1},
        {name: "Zebra", image: "🦓", level: 1}
    ];
    
    // Clear container first
    animalGrid.innerHTML = '';
    
    // Generate animal grid
    animalImages.forEach(animal => {
        const animalCard = document.createElement('div');
        animalCard.className = 'animal-card';
        animalCard.innerHTML = `
            <div class="animal-img">${animal.image}</div>
            <div class="animal-name">${animal.name}</div>
        `;
        
        animalCard.addEventListener('click', function() {
            animalGrid.style.display = 'none';
            coloringArea.style.display = 'flex';
            coloringTitle.textContent = `Coloring: ${animal.name}`;
            coloringImage.textContent = animal.image;
            coloringImage.style.color = '#F47B7B'; // Reset to default color
        });
        
        animalGrid.appendChild(animalCard);
    });
    
    // Back button functionality
    backBtn.addEventListener('click', function() {
        coloringArea.style.display = 'none';
        animalGrid.style.display = 'grid';
    });
    
    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            coloringImage.style.color = this.getAttribute('data-color');
        });
    });
    
    // Save coloring button
    document.getElementById('save-coloring-btn').addEventListener('click', function() {
        alert('Coloring saved! (This would save in a real app)');
    });
}

// Speech functions
function speakLetter(letter) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.pitch = 1.2;
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}
