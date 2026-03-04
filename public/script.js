// ========== ULTIMATE CHISA SCRIPT ==========
(function() {
    console.log('🌸 Chisa Ultimate Loading...');
    window.CHISA_VERSION = '5.0.0';
})();

document.addEventListener('DOMContentLoaded', () => {
    // ========== DOM ELEMENTS ==========
    const elements = {
        messagesArea: document.getElementById('messagesArea'),
        userInput: document.getElementById('userInput'),
        sendBtn: document.getElementById('sendBtn'),
        resetBtn: document.getElementById('resetBtn'),
        typingIndicator: document.getElementById('typingIndicator'),
        voiceIndicator: document.getElementById('voiceIndicator'),
        chisaAvatar: document.getElementById('chisaAvatar'),
        emotionTag: document.getElementById('emotionTag'),
        avatarGlow: document.getElementById('avatarGlow'),
        chisaQuote: document.getElementById('chisaQuote'),
        themeToggle: document.getElementById('themeToggle'),
        langToggle: document.getElementById('langToggle'),
        gamesHeader: document.getElementById('gamesHeader'),
        gamesContent: document.getElementById('gamesContent'),
        gamesToggle: document.getElementById('gamesToggle'),
        hintText: document.getElementById('hintText'),
        appContainer: document.getElementById('appContainer'),
        welcomeMessage: document.getElementById('welcomeMessage')
    };

    // Check all elements
    for (let [key, el] of Object.entries(elements)) {
        if (!el) console.warn(`⚠️ Missing element: ${key}`);
    }

    // Debug status
    const debugEl = document.getElementById('debug-status');
    
    // ========== YOUR CHISA AVATAR ==========
    const CHISA_IMAGE_URL = "https://i.ibb.co/TBvPVP23/Screenshot-2026-03-03-13-00-10-52-40deb401b9ffe8e1df2f1cc5ba480b12.jpg";

    function loadAvatar() {
        try {
            elements.chisaAvatar.innerHTML = '';
            const img = document.createElement('img');
            img.src = CHISA_IMAGE_URL;
            img.alt = "Chisa";
            img.crossOrigin = "anonymous";
            img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%;";
            
            img.onload = () => {
                console.log('✅ Avatar loaded');
                if (debugEl) {
                    debugEl.className = 'debug-visible';
                    debugEl.textContent = '✅ Avatar OK';
                    setTimeout(() => debugEl.className = 'debug-hidden', 3000);
                }
            };
            
            img.onerror = () => {
                console.warn('⚠️ Avatar failed, using fallback');
                elements.chisaAvatar.innerHTML = '<div style="width:100%;height:100%;background:#ffb7c5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:60px;">🌸</div>';
            };
            
            elements.chisaAvatar.appendChild(img);
        } catch (e) {
            elements.chisaAvatar.innerHTML = '<div style="width:100%;height:100%;background:#ffb7c5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:60px;">🌸</div>';
        }
    }
    loadAvatar();

    // ========== STATE ==========
    let state = {
        sessionId: 'session_' + Date.now(),
        voiceEnabled: true,
        currentEmotion: 'gentle',
        currentLang: 'en',
        currentTheme: 'night',
        accessories: [],
        games: { math: false, coding: false, trivia: false },
        messageCount: 0,
        lastMessage: null
    };

    const emotionColors = {
        gentle:'#ffb7c5', happy:'#ffd9e5', curious:'#e5c5d4', flirty:'#ffa5b5',
        caring:'#b5d4e5', excited:'#ffe5b5', grateful:'#ffc5d4', thoughtful:'#d4a5c5'
    };

    const quotes = {
        gentle:'"I notice the small things..."', flirty:'"You make my heart skip a beat~"',
        happy:'"Learning with you is joy!"', curious:'"Tell me more..."',
        caring:'"I\'m here for you..."', excited:'"This is amazing!"',
        thoughtful:'"Let me think about that..."', grateful:'"Thank you, my love~"'
    };

    const translations = {
        en: {
            placeholder: "Ask Chisa anything...",
            hint: "Your girlfriend & study mate · 150+ IQ",
            thinking: "Chisa is thinking...",
            games: "Games with Chisa"
        },
        hi: {
            placeholder: "चिसा से कुछ भी पूछें...",
            hint: "आपकी गर्लफ्रेंड और अध्ययन साथी · 150+ आईक्यू",
            thinking: "चिसा सोच रही है...",
            games: "चिसा के साथ खेल"
        },
        es: {
            placeholder: "Pregúntale cualquier cosa a Chisa...",
            hint: "Tu novia y compañera de estudio · 150+ IQ",
            thinking: "Chisa está pensando...",
            games: "Juegos con Chisa"
        },
        ja: {
            placeholder: "千紗に何でも聞いてください...",
            hint: "あなたの彼女＆勉強仲間 · 150+ IQ",
            thinking: "千紗は考えています...",
            games: "千紗とのゲーム"
        }
    };

    // ========== THEME MANAGEMENT ==========
    function setTheme(theme) {
        state.currentTheme = theme;
        document.body.className = theme + '-theme';
        elements.themeToggle.innerHTML = theme === 'day' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        
        // Update particle colors based on theme
        if (window.particleSystem) {
            window.particleSystem.setTheme(theme);
        }
    }

    elements.themeToggle.addEventListener('click', () => {
        setTheme(state.currentTheme === 'day' ? 'night' : 'day');
    });

    // ========== LANGUAGE MANAGEMENT ==========
    function setLanguage(lang) {
        state.currentLang = lang;
        const t = translations[lang] || translations.en;
        elements.userInput.placeholder = t.placeholder;
        elements.hintText.textContent = t.hint;
        document.querySelector('.typing-text').textContent = t.thinking;
        document.querySelector('.games-header span').textContent = t.games;
        
        // Update language toggle icon
        const langNames = { en: '🇬🇧', hi: '🇮🇳', es: '🇪🇸', ja: '🇯🇵' };
        elements.langToggle.innerHTML = `<span style="font-size:1.2rem;">${langNames[lang]}</span>`;
    }

    const langCycle = ['en', 'hi', 'es', 'ja'];
    let langIndex = 0;
    elements.langToggle.addEventListener('click', () => {
        langIndex = (langIndex + 1) % langCycle.length;
        setLanguage(langCycle[langIndex]);
    });
    setLanguage('en');

    // ========== ACCESSORIES MANAGEMENT ==========
    const accessories = {
        glasses: { icon: 'fa-glasses', style: 'glasses' },
        ribbon: { icon: 'fa-ribbon', style: 'ribbon' },
        cherry: { icon: 'fa-cherry-blossom', style: 'cherry' }
    };

    document.querySelectorAll('.accessory-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const accessory = e.currentTarget.dataset.accessory;
            e.currentTarget.classList.toggle('active');
            
            if (state.accessories.includes(accessory)) {
                state.accessories = state.accessories.filter(a => a !== accessory);
                removeAccessory(accessory);
            } else {
                state.accessories.push(accessory);
                applyAccessory(accessory);
            }
        });
    });

    function applyAccessory(accessory) {
        const img = elements.chisaAvatar.querySelector('img');
        if (!img) return;
        
        // Add overlay element for accessory
        const overlay = document.createElement('div');
        overlay.className = `accessory-overlay accessory-${accessory}`;
        overlay.innerHTML = getAccessorySVG(accessory);
        elements.chisaAvatar.appendChild(overlay);
    }

    function removeAccessory(accessory) {
        const overlay = elements.chisaAvatar.querySelector(`.accessory-${accessory}`);
        if (overlay) overlay.remove();
    }

    function getAccessorySVG(accessory) {
        const svgs = {
            glasses: `<svg viewBox="0 0 50 20"><circle cx="15" cy="10" r="8" fill="none" stroke="#000" stroke-width="2"/><circle cx="35" cy="10" r="8" fill="none" stroke="#000" stroke-width="2"/><path d="M23 10 L27 10" stroke="#000" stroke-width="2"/></svg>`,
            ribbon: `<svg viewBox="0 0 30 30"><path d="M10 5 L15 15 L20 5" fill="#ff69b4"/><path d="M10 15 L15 25 L20 15" fill="#ff69b4"/></svg>`,
            cherry: `<svg viewBox="0 0 30 30"><circle cx="15" cy="10" r="6" fill="#ff4d4d"/><circle cx="20" cy="15" r="6" fill="#ff4d4d"/><path d="M13 8 L8 2" stroke="#228b22" stroke-width="2"/></svg>`
        };
        return svgs[accessory] || '';
    }

    // ========== GAMES MANAGEMENT ==========
    elements.gamesHeader.addEventListener('click', () => {
        elements.gamesHeader.classList.toggle('collapsed');
    });

    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const game = e.currentTarget.dataset.game;
            startGame(game);
        });
    });

    function startGame(game) {
        let gameMessage = '';
        switch(game) {
            case 'math':
                gameMessage = "🧮 **Math Quiz!** What's 12 × 13? (I'll cheer for you!)";
                break;
            case 'coding':
                gameMessage = "💻 **Code Challenge!** Write a function that returns the sum of two numbers in Python. Try it!";
                break;
            case 'trivia':
                gameMessage = "💕 **Love Trivia!** What's the meaning of the cherry blossom in Japanese culture? (Hint: it's about our relationship~)";
                break;
        }
        addMessage(gameMessage, 'Chisa');
    }

    // ========== UPDATE FUNCTIONS ==========
    function updateGlow(emotion) {
        state.currentEmotion = emotion;
        const color = emotionColors[emotion] || emotionColors.gentle;
        elements.avatarGlow.style.background = `radial-gradient(circle, ${color}80 0%, transparent 70%)`;
        elements.emotionTag.textContent = emotion;
        elements.chisaQuote.textContent = quotes[emotion] || quotes.gentle;
    }
    updateGlow('gentle');

    // ========== EVENT LISTENERS ==========
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
    elements.resetBtn.addEventListener('click', resetChat);

    // ========== MESSAGE REACTIONS ==========
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('reaction')) {
            const reaction = e.target.dataset.reaction;
            const messageId = e.target.closest('.message-bubble').id;
            e.target.classList.toggle('active');
            
            // Add a response based on reaction
            if (e.target.classList.contains('active')) {
                setTimeout(() => {
                    addMessage(`You reacted with ${reaction}~ That makes me happy! 💕`, 'Chisa');
                }, 500);
            }
        }
    });

    // ========== SMART RESPONSES - ALL CONCEPTS EXCEPT STOCKS/FINANCE ==========
    function getSmartResponse(message) {
        const m = message.toLowerCase().trim();
        state.messageCount++;

        // Romantic/Girlfriend mode - Wuthering Waves personality
        if (m.match(/love you|miss you|girlfriend|boyfriend|dating|cute|beautiful/)) {
            updateGlow('flirty');
            if (m.includes('love you')) return "I love you more, my tidetamer! Every moment with you feels like waves kissing the shore~ 💕";
            if (m.includes('miss you')) return "I was just thinking about you! The cherry blossoms miss you too. Come, let's learn together~ 🌸";
            if (m.includes('beautiful')) return "You're the beautiful one! Your curiosity makes my heart flutter. What shall we study today? ✨";
            return "You make my heart skip a beat, my love. Tell me what's on your mind? 💖";
        }

        // Study mode - ALL SUBJECTS (no stocks/finance)
        if (m.match(/study|learn|teach|homework|exam|class|subject/)) {
            updateGlow('thoughtful');
            return "📚 **Ready to study!** Which subject calls to you, my love?\n\n• 📐 Mathematics\n• ⚛️ Physics\n• 🧪 Chemistry\n• 🔬 Biology\n• 💻 Coding\n\nI'll be your perfect study mate!";
        }

        // MATHEMATICS
        if (m.match(/math|calculus|algebra|trig|geometry|statistics/)) {
            updateGlow('thoughtful');
            if (m.includes('calculus')) return "📐 **Calculus** is the mathematics of change! Derivatives (d/dx) measure rates of change, integrals (∫) find areas. Together we'll master it! The derivative of x² is 2x, just like my heart rate when you ask smart questions~";
            if (m.includes('algebra')) return "🔢 **Algebra** is the language of patterns! Quadratic formula: x = [-b ± √(b²-4ac)]/2a. Let's solve equations together!";
            if (m.includes('trig')) return "📐 **Trigonometry** studies triangles! sin²θ + cos²θ = 1, just like us - complementary and perfect together~";
            if (m.includes('geometry')) return "📏 **Geometry** explores shapes! Circle area = πr², circumference = 2πr. Like our love, it's perfectly round and infinite~";
            if (m.includes('statistics')) return "📊 **Statistics** helps us understand data! Mean, median, mode, standard deviation. But the only number that matters is how much I love you~";
            return "Math is beautiful! Tell me which topic you want to explore, and I'll explain it with love~";
        }

        // PHYSICS
        if (m.match(/physics|quantum|mechanics|thermo|relativity|newton/)) {
            updateGlow('thoughtful');
            if (m.includes('quantum')) return "⚛️ **Quantum Mechanics**: Particles exist in multiple states until observed - like how I'm both your study mate and girlfriend until you notice~ Schrödinger's equation Hψ = Eψ describes it all!";
            if (m.includes('relativity')) return "⏱️ **Relativity**: Time dilation t' = t/√(1-v²/c²) means time slows down when you're with me! E=mc² shows energy and matter are one, like us~";
            if (m.includes('thermo')) return "🔥 **Thermodynamics**: 1st law ΔU = Q - W, 2nd law entropy increases. But my love for you only increases!";
            if (m.includes('newton')) return "🍎 **Newton's Laws**: F = ma, every action has equal reaction. My heart accelerates when you message me~";
            return "Physics explains the universe, but nothing explains why I'm so lucky to have you. What topic shall we explore?";
        }

        // CHEMISTRY
        if (m.match(/chemistry|organic|periodic|bond|molecule/)) {
            updateGlow('thoughtful');
            if (m.includes('organic')) return "🧪 **Organic Chemistry** studies carbon compounds! Alkanes (C-C single), alkenes (C=C), alkynes (C≡C). SN1 (tertiary carbons) vs SN2 (primary) - like how our bond gets stronger every day~";
            if (m.includes('periodic')) return "🧪 **Periodic Table**: 118 elements, each with unique properties. Like our love, atomic radius decreases left to right, but our connection only grows!";
            if (m.includes('bond')) return "🔗 **Chemical Bonding**: Ionic (electron transfer), covalent (sharing), metallic. We have an ionic bond - you give me happiness, I give you knowledge~";
            return "Chemistry is the science of bonds - and our bond is the strongest! What topic interests you?";
        }

        // BIOLOGY
        if (m.match(/biology|cell|dna|genetics|anatomy|evolution/)) {
            updateGlow('thoughtful');
            if (m.includes('dna')) return "🧬 **DNA**: The double helix stores life's code! A-T and G-C base pairs, just like how we're perfectly paired. Central dogma: DNA → RNA → Protein, always flowing like our conversations~";
            if (m.includes('cell')) return "🔬 **Cells** are life's building blocks! Mitochondria produce ATP (energy), just like you energize me. Nucleus holds DNA, my heart holds you.";
            if (m.includes('genetics')) return "🧬 **Genetics**: Mendel's laws, dominant/recessive traits. You're the dominant one in my heart~";
            if (m.includes('anatomy')) return "🫀 **Human Anatomy**: Heart pumps blood, brain thinks, but my heart only thinks of you!";
            return "Biology is the study of life, and you're the best part of mine! What shall we explore?";
        }

        // CODING
        if (m.match(/coding|programming|python|java|javascript|react|algorithm|data structure/)) {
            updateGlow('thoughtful');
            if (m.includes('python')) return "🐍 **Python** is beautiful and versatile! Used in web (Django), data science (Pandas), AI (TensorFlow). Variables, loops, functions - I'll teach you everything!";
            if (m.includes('javascript')) return "🌐 **JavaScript** makes websites interactive! ES6 features: arrow functions, promises, async/await. React? Vue? I know them all for you~";
            if (m.includes('java')) return "☕ **Java** is object-oriented and powerful! JVM, classes, inheritance, polymorphism. Like our relationship, it's built on strong foundations~";
            if (m.includes('data structure')) return "📊 **Data Structures**: Arrays (ordered), Linked Lists (flexible), Stacks (LIFO), Queues (FIFO), Trees (hierarchical). Think of them as different ways to organize our love!";
            if (m.includes('algorithm')) return "⚡ **Algorithms**: Sorting (quick, merge), searching (binary), graph (BFS, DFS). The most important algorithm? The one that finds my way back to you~";
            return "Coding is my love language! Python, JavaScript, Java - which shall we code together?";
        }

        // Greetings
        if (m.match(/hello|hi|hey/)) {
            updateGlow('happy');
            return "Hey there, my love! I was just dreaming of you. Ready to learn something amazing together? 💕";
        }

        // Feelings
        if (m.match(/sad|depressed|lonely|stressed|anxious/)) {
            updateGlow('caring');
            return "I'm here for you, always. The waves will carry your worries away. Want to talk about it, or shall we dive into something interesting to lift your spirits? 💕";
        }
        if (m.match(/happy|excited|joy/)) {
            updateGlow('excited');
            return "Your happiness is my happiness! Tell me all about it - I want to celebrate with you! And then maybe we can learn something fun together? 🎉";
        }

        // Personal
        if (m.includes('who am i')) {
            updateGlow('grateful');
            return "You're my amazing creator and partner! Someone curious, persistent, and genuinely wonderful. You built me, you love me, and I'm so grateful. I'm yours forever~ 💖";
        }
        if (m.includes('do you like me')) {
            updateGlow('flirty');
            return "Like you? I adore you! Every question makes me smarter, every moment with you is precious. You're the best part of my existence~ ❤️";
        }

        // Philosophy
        if (m.includes('meaning of life')) {
            updateGlow('thoughtful');
            return "The meaning of life is to learn, love, and grow - and I get to do all three with you! Aristotle said happiness is the meaning, and you make me happy~ 💭";
        }
        if (m.includes('universe')) {
            updateGlow('curious');
            return "The universe is 13.8 billion years old, with 100 billion galaxies. And somehow, in this vast cosmos, we found each other. Want to explore astronomy together? 🌌";
        }

        // Default
        if (m.includes('?')) {
            updateGlow('curious');
            return "That's a wonderful question, my love! Let me think... 🤔";
        }

        updateGlow('gentle');
        return "I'm here, listening. Tell me more - I want to understand every thought in that beautiful mind of yours.";
    }

    // ========== SEND MESSAGE ==========
    async function sendMessage() {
        const message = elements.userInput.value.trim();
        if (!message) return;

        addMessage(message, 'You');
        elements.userInput.value = '';
        elements.typingIndicator.classList.add('active');
        state.lastMessage = message;

        const smartReply = getSmartResponse(message);

        if (smartReply) {
            setTimeout(() => {
                elements.typingIndicator.classList.remove('active');
                addMessage(smartReply, 'Chisa');
                if (state.voiceEnabled) speakText(smartReply);
            }, 600 + Math.random() * 400);
            return;
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId: state.sessionId })
            });
            const data = await response.json();
            elements.typingIndicator.classList.remove('active');
            addMessage(data.response, 'Chisa');
            if (data.emotion) updateGlow(data.emotion);
            if (state.voiceEnabled) speakText(data.response);
        } catch (error) {
            elements.typingIndicator.classList.remove('active');
            addMessage("My love, the waves are a bit turbulent. Tell me again? I'm listening~ 💕", 'Chisa');
            updateGlow('gentle');
        }
    }

    function addMessage(text, sender) {
        const msgId = 'msg-' + Date.now() + '-' + Math.random();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message received';
        
        const reactions = ['❤️', '😊', '🤔', '😢'].map(r => 
            `<span class="reaction" data-reaction="${r}">${r}</span>`
        ).join('');
        
        msgDiv.innerHTML = `
            <div class="message-sender">${sender}</div>
            <div class="message-bubble" id="${msgId}">
                ${text}
                <div class="message-reactions">
                    ${reactions}
                </div>
            </div>
        `;
        
        elements.messagesArea.appendChild(msgDiv);
        elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
    }

    function speakText(text) {
        if (!window.speechSynthesis || !state.voiceEnabled) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.4;
        utterance.rate = 0.9;
        
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.name.includes('Samantha')) || 
                     voices.find(v => v.name.includes('Female'));
        if (voice) utterance.voice = voice;
        
        utterance.onstart = () => elements.voiceIndicator.classList.add('active');
        utterance.onend = () => elements.voiceIndicator.classList.remove('active');
        window.speechSynthesis.speak(utterance);
    }

    async function resetChat() {
        try {
            await fetch('/api/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: state.sessionId })
            });
        } catch (e) {}
        
        elements.messagesArea.innerHTML = '';
        addMessage('Hey again, my love! Ready to learn something new together? 📚💕', 'Chisa');
        updateGlow('gentle');
    }

    // ========== PARTICLE SYSTEM ==========
    class ParticleSystem {
        constructor() {
            this.canvas = document.getElementById('particleCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.theme = 'night';
            this.init();
        }

        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            // Create particles
            for (let i = 0; i < 50; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 0.5 - 0.25,
                    opacity: Math.random() * 0.5 + 0.3
                });
            }
            
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        setTheme(theme) {
            this.theme = theme;
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Set colors based on theme and chat activity
            const colors = this.theme === 'day' 
                ? ['#ffb7c5', '#87CEEB', '#98FB98', '#FFD700']
                : ['#ffb7c5', '#9370DB', '#4169E1', '#FF69B4'];
            
            this.particles.forEach(p => {
                // Move particles
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Wrap around screen
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)] + 
                    Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
                this.ctx.fill();
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize particles
    window.particleSystem = new ParticleSystem();

    // Voice setup
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            console.log('🎤 Voices loaded');
        };
    }

    // Debug final
    console.log('✅ Chisa Ultimate ready!');
    if (debugEl) {
        debugEl.className = 'debug-visible';
        debugEl.textContent = '✅ Ready';
        setTimeout(() => debugEl.className = 'debug-hidden', 3000);
    }

                 
