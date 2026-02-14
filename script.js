/* ============================================================
   💌 VALENTINE QUEST — LOGIC
   ============================================================ */

// ===== CONFIGURATION (CUSTOMISE HERE!) =====

const SECRET_PASSWORD = 'копенгаген'; // TODO: измени на ваш город в нижнем регистре!

const QUIZ_QUESTIONS = [
    {
        question: 'Когда мы впервые встретились?',
        options: ['Лето 2017', 'Зима 2016', 'Осень 2015', 'Весна 2018'],
        correct: 1,
        correctMsg: 'Точно! Зима 2016, ты пришла в мой класс ❄️',
        wrongMsgs: [
            'Эмм... ты точно моя жена? 🤨',
            'Неа! Подумай ещё разок 😅',
            'Ответ неправильный, но ты всё равно милая 💕'
        ]
    },
    {
        question: 'Как Паша признался тебе в чувствах?',
        options: [
            'Написал длинное сообщение в 3 ночи',
            'Прислал мем с намёком',
            'Просто подошёл и поцеловал',
            'Спел серенаду под балконом'
        ],
        correct: 2,
        correctMsg: 'Да! Никаких слов — просто подошёл и поцеловал 😏',
        wrongMsgs: [
            'Ха, не угадала! Попробуй ещё раз 😄',
            'Нет, всё было куда решительнее 💪',
            'Серенады? Серьёзно? 😂'
        ]
    },
    {
        question: 'Где Паша сделал тебе предложение?',
        options: [
            'В ресторане в Германии',
            'На крыше в Дании',
            'На пикнике у моря в Испании',
            'В IKEA между шкафами'
        ],
        correct: 2,
        correctMsg: 'Конечно! Пикник, море, Испания, закат 🌅💍',
        wrongMsgs: [
            'Нет! Хотя в IKEA тоже было бы забавно 😂',
            'Не угадала! Вспомни море...',
            'Попробуй ещё разок, ты справишься!'
        ]
    }
];

const LOVE_REASONS = [
    'Ты смеёшься над моими тупыми шутками (это бесценно) 😂',
    'С тобой я могу быть собой на все 100% 🫶',
    'Ты терпишь меня и всё равно меня любишь 🫠',
    'Ты самый красивый человек на планете (это факт, не мнение) ✨',
    'Потому что ты — это ты. И этого достаточно ❤️'
];

const RUNAWAY_TEXTS = [
    'Неа', 'Точно нет?', 'Может да?', 'Паша грустит 🥺',
    'Попробуй поймать 😏', 'Я быстрая!', 'Ну пожааалуйста',
    'Ладно стой... НЕТ', 'Окей сдаюсь... или нет', 'Ну ты чего 🥹'
];

const SECRET_MESSAGES = [
    '*включён режим: муж влюблён на 300%* 💘',
    'Error 404: причина не любить тебя — не найдена 🖥',
    'Факт: Паша думает об Ане примерно... *проверяет*... всегда 🧠',
    'Если бы любовь измерялась в гигабайтах, мне бы не хватило облака ☁️',
    'Скоро увидимся и я тебя не отпущу 🫂',
    '*режим хихи активирован* 🤭',
    'Ты сейчас улыбаешься, я знаю 😏'
];

// ===== STATE =====
let currentQuizIndex = 0;
let quizAnswered = false;
let gameScore = 0;
let gameHearts = [];
let gameMoveIntervals = [];
let secretIndex = 0;
let runawayTextIndex = 0;
let yesScale = 1;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderQuizQuestion();
    setupPassword();
    setupRunawayButton();
    setupQuizNext();
});

// ===== QUIZ NEXT BUTTON =====
function setupQuizNext() {
    document.getElementById('quiz-next').addEventListener('click', () => {
        document.getElementById('quiz-next').classList.add('hidden');
        currentQuizIndex++;
        if (currentQuizIndex < QUIZ_QUESTIONS.length) {
            renderQuizQuestion();
        } else {
            goToScreen('screen-password');
        }
    });
}

// ===== PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    const hearts = ['♥', '♡', '✦', '·', '💕'];
    const count = 30;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        p.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.fontSize = (0.5 + Math.random() * 1.2) + 'rem';
        p.style.color = `hsl(${330 + Math.random() * 40}, 80%, ${60 + Math.random() * 20}%)`;
        p.style.animationDuration = (8 + Math.random() * 15) + 's';
        p.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(p);
    }
}

// ===== SCREEN NAVIGATION =====
function goToScreen(id) {
    const current = document.querySelector('.screen.active');
    const next = document.getElementById(id);

    if (current) {
        current.classList.remove('active');
    }

    setTimeout(() => {
        next.classList.add('active');

        // Trigger screen-specific actions
        if (id === 'screen-game') startGame();
        if (id === 'screen-finale') launchConfetti();
        if (id === 'screen-timeline') animateTimeline();
    }, 100);
}

// ===== QUIZ =====
function renderQuizQuestion() {
    const q = QUIZ_QUESTIONS[currentQuizIndex];
    const container = document.getElementById('quiz-container');
    const feedback = document.getElementById('quiz-feedback');
    const progressBar = document.getElementById('quiz-progress-bar');
    const counter = document.getElementById('quiz-counter');

    quizAnswered = false;
    feedback.className = 'quiz-feedback hidden';

    counter.textContent = `Вопрос ${currentQuizIndex + 1} из ${QUIZ_QUESTIONS.length}`;
    progressBar.style.width = ((currentQuizIndex) / QUIZ_QUESTIONS.length * 100) + '%';

    let html = `<p class="quiz-question">${q.question}</p><div class="quiz-options">`;
    q.options.forEach((opt, i) => {
        html += `<button class="quiz-option" data-index="${i}" onclick="checkAnswer(${i})">${opt}</button>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

function checkAnswer(index) {
    if (quizAnswered) return;
    quizAnswered = true;

    const q = QUIZ_QUESTIONS[currentQuizIndex];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback');
    const progressBar = document.getElementById('quiz-progress-bar');

    if (index === q.correct) {
        // Correct!
        options[index].classList.add('correct');
        feedback.textContent = q.correctMsg;
        feedback.className = 'quiz-feedback feedback-correct';

        progressBar.style.width = ((currentQuizIndex + 1) / QUIZ_QUESTIONS.length * 100) + '%';

        // Show next button
        document.getElementById('quiz-next').classList.remove('hidden');
    } else {
        // Wrong!
        options[index].classList.add('wrong');
        const wrongMsg = q.wrongMsgs[Math.floor(Math.random() * q.wrongMsgs.length)];
        feedback.textContent = wrongMsg;
        feedback.className = 'quiz-feedback feedback-wrong';

        // Let them try again after a moment
        setTimeout(() => {
            quizAnswered = false;
            options[index].classList.remove('wrong');
            feedback.className = 'quiz-feedback hidden';
        }, 1500);
    }
}

// ===== PASSWORD =====
function setupPassword() {
    const input = document.getElementById('password-input');
    const submit = document.getElementById('password-submit');
    const idkBtn = document.getElementById('btn-idk');
    const idkMsg = document.getElementById('password-idk');

    // "А ты сам-то знаешь?" button
    idkBtn.addEventListener('click', () => {
        idkMsg.classList.remove('hidden');
        idkBtn.classList.add('hidden');
    });

    const check = () => {
        const value = input.value.trim();
        const successEl = document.getElementById('password-success');

        if (value.length > 0) {
            // Any non-empty answer is correct lol
            idkMsg.classList.add('hidden');
            idkBtn.classList.add('hidden');
            successEl.classList.remove('hidden');
            input.disabled = true;
            submit.disabled = true;
            document.querySelector('.password-input-wrap').style.opacity = '0.3';
        }
    };

    submit.addEventListener('click', check);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') check();
    });
}

// ===== RUNAWAY BUTTON =====
function setupRunawayButton() {
    const noBtn = document.getElementById('btn-no');
    const yesBtn = document.getElementById('btn-yes');

    // No button runs away on hover
    noBtn.addEventListener('mouseenter', () => {
        const screenEl = document.getElementById('screen-runaway');
        const rect = screenEl.getBoundingClientRect();
        const btnW = noBtn.offsetWidth;
        const btnH = noBtn.offsetHeight;

        const margin = 50;
        const x = margin + Math.random() * (rect.width - btnW - margin * 2);
        const y = margin + Math.random() * (rect.height - btnH - margin * 2);

        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';

        // Change text
        noBtn.textContent = RUNAWAY_TEXTS[runawayTextIndex % RUNAWAY_TEXTS.length];
        runawayTextIndex++;

        // Grow "yes" button slightly
        yesScale = Math.min(yesScale + 0.03, 1.4);
        yesBtn.style.transform = `scale(${yesScale})`;
    });

    // Yes button clicked
    yesBtn.addEventListener('click', () => {
        heartExplosion();
        setTimeout(() => {
            goToScreen('screen-game');
        }, 1500);
    });
}

// ===== HEART EXPLOSION =====
function heartExplosion() {
    const container = document.createElement('div');
    container.className = 'heart-explosion';
    document.body.appendChild(container);

    const emojis = ['❤️', '💖', '💕', '💗', '💘', '🥰', '✨'];
    for (let i = 0; i < 40; i++) {
        const heart = document.createElement('span');
        heart.className = 'explosion-heart';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.setProperty('--tx', (Math.random() - 0.5) * 800 + 'px');
        heart.style.setProperty('--ty', (Math.random() - 0.5) * 800 + 'px');
        heart.style.setProperty('--rot', Math.random() * 720 - 360 + 'deg');
        heart.style.animationDelay = Math.random() * 0.3 + 's';
        heart.style.fontSize = (1 + Math.random() * 2) + 'rem';
        container.appendChild(heart);
    }

    setTimeout(() => container.remove(), 2500);
}

// ===== HEART CATCHING GAME =====
function startGame() {
    const area = document.getElementById('game-area');
    area.innerHTML = '';
    gameScore = 0;
    gameHearts = [];
    gameMoveIntervals.forEach(clearInterval);
    gameMoveIntervals = [];

    document.getElementById('game-score').textContent = '0';
    document.getElementById('game-reason').classList.add('hidden');
    document.getElementById('game-next').classList.add('hidden');

    const totalHearts = 15;
    const goldCount = 5;
    let goldIndices = new Set();

    while (goldIndices.size < goldCount) {
        goldIndices.add(Math.floor(Math.random() * totalHearts));
    }

    for (let i = 0; i < totalHearts; i++) {
        const isGold = goldIndices.has(i);
        const heart = document.createElement('span');
        heart.className = 'game-heart' + (isGold ? ' gold' : '');
        heart.textContent = isGold ? '💛' : '💗';
        heart.dataset.gold = isGold ? 'true' : 'false';
        heart.dataset.index = i;

        // Random starting position
        const areaW = 750;
        const areaH = 300;
        const x = Math.random() * areaW;
        const y = Math.random() * areaH;
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';

        // Click handler
        heart.addEventListener('click', () => onHeartClick(heart));

        area.appendChild(heart);
        gameHearts.push(heart);

        // Start movement
        moveGameHeart(heart);
    }
}

function moveGameHeart(heart) {
    const area = document.getElementById('game-area');

    const move = () => {
        if (!area.contains(heart)) return;
        const maxX = area.clientWidth - 40;
        const maxY = area.clientHeight - 40;
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        heart.style.left = newX + 'px';
        heart.style.top = newY + 'px';
    };

    const interval = setInterval(move, 2000 + Math.random() * 2000);
    gameMoveIntervals.push(interval);

    // Initial delay
    setTimeout(move, Math.random() * 1000);
}

function onHeartClick(heart) {
    if (heart.classList.contains('caught')) return;

    if (heart.dataset.gold === 'true') {
        // Caught a gold heart!
        heart.classList.add('caught');
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;

        // Show reason
        const reasonEl = document.getElementById('game-reason');
        reasonEl.textContent = '💛 ' + LOVE_REASONS[gameScore - 1];
        reasonEl.classList.remove('hidden');
        reasonEl.style.animation = 'none';
        reasonEl.offsetHeight;
        reasonEl.style.animation = 'fadeIn 0.4s ease';

        if (gameScore >= 5) {
            // Game complete!
            setTimeout(() => {
                document.getElementById('game-next').classList.remove('hidden');
                // Stop all hearts
                gameMoveIntervals.forEach(clearInterval);
            }, 800);
        }
    } else {
        // Wrong heart - shake it
        heart.classList.add('wrong-click');
        setTimeout(() => heart.classList.remove('wrong-click'), 300);
    }
}

// ===== GALLERY =====
const GALLERY_COUNT = 14;

function buildGallery() {
    const container = document.getElementById('gallery');
    if (!container || container.children.length > 0) return;

    for (let i = 1; i <= GALLERY_COUNT; i++) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = (i * 0.1) + 's';

        const img = document.createElement('img');
        img.src = `assets/gallery/${i}.jpg`;
        img.alt = `Фото ${i}`;
        img.loading = 'lazy';

        item.appendChild(img);
        container.appendChild(item);
    }

    // Show button when scrolled near the bottom
    const scrollEl = container.closest('.gallery-scroll');
    const nextBtn = document.getElementById('gallery-next');

    scrollEl.addEventListener('scroll', () => {
        const nearBottom = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight < 150;
        if (nearBottom) {
            nextBtn.classList.add('visible');
        }
    });
}

function animateTimeline() {
    buildGallery();
}

// ===== ENVELOPE =====
document.addEventListener('click', (e) => {
    const envelope = document.getElementById('envelope');
    const wrapper = document.getElementById('envelope-wrapper');

    if (!envelope || !wrapper) return;

    if (wrapper.contains(e.target)) {
        envelope.classList.add('opened');
        setTimeout(() => {
            wrapper.classList.add('hidden');
            document.getElementById('letter').classList.remove('hidden');
        }, 700);
    }
});

// ===== CARD FLIP =====
function flipCard(el) {
    el.classList.toggle('flipped');
}

// ===== SECRET BUTTON =====
function toggleSecret() {
    const content = document.getElementById('secret-content');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        showSecret();
    } else {
        content.classList.add('hidden');
    }
}

function nextSecret() {
    secretIndex++;
    showSecret();
}

function showSecret() {
    const text = document.getElementById('secret-text');
    text.style.opacity = 0;
    setTimeout(() => {
        text.textContent = SECRET_MESSAGES[secretIndex % SECRET_MESSAGES.length];
        text.style.opacity = 1;
        text.style.transition = 'opacity 0.3s ease';
    }, 150);
}

// ===== CONFETTI =====
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';

    const colors = ['#ff2d75', '#a855f7', '#fbbf24', '#22c55e', '#3b82f6', '#ec4899', '#f97316'];
    const shapes = ['square', 'rect'];

    for (let i = 0; i < 120; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = color;
        piece.style.width = (shape === 'rect' ? 6 : 10) + 'px';
        piece.style.height = (shape === 'rect' ? 16 : 10) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (2 + Math.random() * 3) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(piece);
    }

    // Clean up after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 6000);
}

// ===== FLASH EFFECT =====
function flashScreen(color) {
    const flash = document.createElement('div');
    flash.className = `screen-flash ${color}`;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
}
