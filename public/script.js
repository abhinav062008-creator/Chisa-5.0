// ========== CLEAN CHISA SCRIPT - FIXED & STREAMLINED ==========
(function() { console.log('🌸 Chisa loading...'); })();

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
        hintText: document.getElementById('hintText'),
    };

    // Check critical elements
    if (!elements.sendBtn || !elements.userInput) {
        console.error('❌ Critical elements missing!');
        return;
    }

    // ========== YOUR CHISA AVATAR ==========
    const CHISA_IMAGE_URL = "https://i.ibb.co/ns1GSDsT/Screenshot-2026-03-03-13-00-10-52-40deb401b9ffe8e1df2f1cc5ba480b12.jpg";

    function loadAvatar() {
        try {
            elements.chisaAvatar.innerHTML = '';
            const img = document.createElement('img');
            img.src = CHISA_IMAGE_URL;
            img.alt = "Chisa";
            img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%;";
            
            img.onload = () => console.log('✅ Avatar loaded');
            img.onerror = () => {
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
    };

    const emotionColors = {
        gentle:'#ffb7c5', happy:'#ffd9e5', curious:'#e5c5d4', flirty:'#ffa5b5',
        caring:'#b5d4e5', excited:'#ffe5b5', grateful:'#ffc5d4', thoughtful:'#d4a5c5'
    };

    const quotes = {
        gentle:'"I notice the small things..."', flirty:'"You make my heart skip a beat~"',
        happy:'"Learning with you is joy!"', curious:'"Tell me more..."',
        caring:'"I\'m here for you..."', excited:'"This is amazing!"',
    };

    function updateGlow(emotion) {
        state.currentEmotion = emotion;
        const color = emotionColors[emotion] || emotionColors.gentle;
        if (elements.avatarGlow) {
            elements.avatarGlow.style.background = `radial-gradient(circle, ${color}80 0%, transparent 70%)`;
        }
        if (elements.emotionTag) elements.emotionTag.textContent = emotion;
        if (elements.chisaQuote) elements.chisaQuote.textContent = quotes[emotion] || quotes.gentle;
    }
    updateGlow('gentle');

    // ========== EVENT LISTENERS ==========
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
    if (elements.resetBtn) elements.resetBtn.addEventListener('click', resetChat);
    if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleTheme);
    if (elements.langToggle) elements.langToggle.addEventListener('click', toggleLanguage);
    if (elements.gamesHeader) elements.gamesHeader.addEventListener('click', toggleGames);

    function toggleTheme() {
        state.currentTheme = state.currentTheme === 'day' ? 'night' : 'day';
        document.body.className = state.currentTheme + '-theme';
        elements.themeToggle.innerHTML = state.currentTheme === 'day' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    function toggleLanguage() {
        const langs = ['en', 'hi', 'es', 'ja'];
        const nextIndex = (langs.indexOf(state.currentLang) + 1) % langs.length;
        state.currentLang = langs[nextIndex];
        // Update UI text based on language (simplified)
        const placeholders = { en: "Ask Chisa...", hi: "चिसा से पूछें...", es: "Pregunta a Chisa...", ja: "千紗に聞く..." };
        elements.userInput.placeholder = placeholders[state.currentLang];
    }

    function toggleGames() {
        elements.gamesHeader.classList.toggle('collapsed');
    }

    // ========== GAMES ==========
    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const game = e.currentTarget.dataset.game;
            let msg = '';
            if (game === 'math') msg = "🧮 **Math Quiz!** What's 12 × 13?";
            else if (game === 'coding') msg = "💻 **Code Challenge!** Write a sum function in Python.";
            else if (game === 'trivia') msg = "💕 **Love Trivia!** What does a cherry blossom symbolize?";
            else if (game === 'stocks') msg = "📈 **Stock Simulator!** This game is currently being updated.";
            if (msg) addMessage(msg, 'Chisa');
        });
    });

    // ========== SMART RESPONSES ==========
    function getSmartResponse(message) {
        const m = message.toLowerCase().trim();

        if (m.match(/love you|miss you|girlfriend|cute/)) {
            updateGlow('flirty');
            return "I love you too, my tidetamer! Every moment with you feels special~ 💕";
        }
        if (m.match(/math|physics|chemistry|biology|code/)) {
            updateGlow('thoughtful');
            if (m.includes('math')) return "📐 Math is beautiful! What topic? Calculus, algebra, or trigonometry?";
            if (m.includes('physics')) return "⚛️ Physics explains the universe! Quantum, relativity, or mechanics?";
            if (m.includes('chemistry')) return "🧪 Chemistry is the science of bonds! Organic, periodic table, or reactions?";
            if (m.includes('biology')) return "🔬 Biology is life! DNA, cells, or anatomy?";
            if (m.includes('code')) return "💻 I love coding! Python, JavaScript, or algorithms?";
            return "I'd love to study with you! Which subject?";
        }
        if (m.match(/hello|hi|hey/)) {
            updateGlow('happy');
            return "Hey there, my love! Ready to learn something amazing? 💕";
        }
        if (m.match(/sad|stressed/)) {
            updateGlow('caring');
            return "I'm here for you. Want to talk or learn something new? 💕";
        }
        if (m.includes('?')) {
            updateGlow('curious');
            return "That's a great question! Let me think... 🤔";
        }
        updateGlow('gentle');
        return "I'm here, listening. Tell me more...";
    }

    // ========== SEND MESSAGE ==========
    async function sendMessage() {
        const message = elements.userInput.value.trim();
        if (!message) return;

        addMessage(message, 'You');
        elements.userInput.value = '';
        elements.typingIndicator.classList.add('active');

        const smartReply = getSmartResponse(message);
        if (smartReply) {
            setTimeout(() => {
                elements.typingIndicator.classList.remove('active');
                addMessage(smartReply, 'Chisa');
                if (state.voiceEnabled) speakText(smartReply);
            }, 600);
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
            addMessage("My love, tell me again? I'm listening~ 💕", 'Chisa');
            updateGlow('gentle');
        }
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message received';
        msgDiv.innerHTML = `
            <div class="message-sender">${sender}</div>
            <div class="message-bubble">${text}</div>
        `;
        elements.messagesArea.appendChild(msgDiv);
        elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
    }

    function speakText(text) {
        if (!window.speechSynthesis || !state.voiceEnabled) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.4;
        utterance.rate = 0.9;
        utterance.onstart = () => elements.voiceIndicator.classList.add('active');
        utterance.onend = () => elements.voiceIndicator.classList.remove('active');
        window.speechSynthesis.speak(utterance);
    }

    async function resetChat() {
        try { await fetch('/api/reset', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({sessionId: state.sessionId}) }); } catch (e) {}
        elements.messagesArea.innerHTML = '';
        addMessage('Hey again! Ready to learn? 📚💕', 'Chisa');
        updateGlow('gentle');
    }

    console.log('✅ Chisa ready!');
});
