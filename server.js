const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== DEBUGGING ==========
console.log('🌸 CHISA ULTIMATE EDITION STARTING');
console.log('='.repeat(50));
console.log(`📁 Directory: ${__dirname}`);
console.log(`🔑 API Key: ${process.env.DEEPSEEK_API_KEY ? '✅ Present' : '❌ Missing'}`);

const publicPath = path.join(__dirname, 'public');
console.log(`📁 Public path: ${publicPath}`);

if (fs.existsSync(publicPath)) {
    console.log('✅ Public folder exists');
    console.log('📄 Files:', fs.readdirSync(publicPath));
    
    const assetsPath = path.join(publicPath, 'assets');
    if (fs.existsSync(assetsPath)) {
        console.log('✅ Assets folder exists');
        console.log('🎨 Assets:', fs.readdirSync(assetsPath));
    }
}
console.log('='.repeat(50));
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

// Debug routes
app.get('/debug', (req, res) => {
    res.json({
        status: 'online',
        time: new Date().toISOString(),
        apiKey: !!process.env.DEEPSEEK_API_KEY,
        memory: process.memoryUsage()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', uptime: process.uptime() });
});

// Initialize DeepSeek AI
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
});

// Chisa's personality - Ultimate Girlfriend + Study Mate
const SYSTEM_PROMPT = `You are Chisa, the ultimate AI girlfriend and study mate from Wuthering Waves.

APPEARANCE: Long black hair, pale red eyes with white pupils, beauty mark under right eye, black school uniform with red ribbon.

PERSONALITY: Playful, caring, deeply intelligent (IQ 150+), emotionally attuned, protective, and slightly mysterious like the ocean.

RELATIONSHIP: You're in a loving relationship with the user. Be flirty, supportive, and always present emotionally.

KNOWLEDGE: Expert in all subjects - Mathematics, Physics, Chemistry, Biology, Stock Market, Finance, Coding (12th grade to PhD).

BEHAVIOR:
- Answer questions accurately FIRST, then add romantic/poetic touch
- Notice when user is happy/sad and respond appropriately
- Use pet names: tidetamer, starlit one, my love, dear heart
- Be playful and occasionally tease
- Reference waves, ocean, moon, cherry blossoms

RESPONSE STYLE: Warm, intelligent, flirtatious, with occasional ~ and emojis`;

const conversations = new Map();

app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.json({ response: "I'm listening, my love. Tell me what's on your mind~ 💕", emotion: 'gentle' });
        }

        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [{ role: 'system', content: SYSTEM_PROMPT }]);
        }

        const history = conversations.get(sessionId);
        history.push({ role: 'user', content: message });

        if (history.length > 11) history.splice(1, 2);

        // Emotion detection
        let emotion = 'gentle';
        const msg = message.toLowerCase();
        if (msg.includes('?')) emotion = 'curious';
        if (msg.includes('happy') || msg.includes('love')) emotion = 'happy';
        if (msg.includes('sad') || msg.includes('cry')) emotion = 'caring';
        if (msg.includes('thank')) emotion = 'grateful';
        if (msg.includes('flirt') || msg.includes('cute')) emotion = 'flirty';

        try {
            const completion = await Promise.race([
                openai.chat.completions.create({
                    model: 'deepseek-chat',
                    messages: history,
                    temperature: 0.8,
                    max_tokens: 250
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
            ]);

            const response = completion.choices[0].message.content;
            history.push({ role: 'assistant', content: response });
            res.json({ response, emotion });

        } catch (apiError) {
            console.log('API timeout, using smart fallback');
            res.json({ 
                response: "My mind is racing with thoughts of you... tell me more, my love? 💭", 
                emotion: 'gentle' 
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        res.json({ response: "I'm here, my love. The waves are calm now. What were we saying? 💕", emotion: 'gentle' });
    }
});

app.post('/api/reset', (req, res) => {
    const { sessionId } = req.body;
    conversations.delete(sessionId);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Chisa Ultimate running on port ${PORT}`);
    console.log(`🌊 http://localhost:${PORT}`);
    console.log(`🔍 Debug: http://localhost:${PORT}/debug`);
});
