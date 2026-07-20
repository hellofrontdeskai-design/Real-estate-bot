const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwFOtWaj40J09R3XQJ_HqM4Ockz3gL1sSMa-E4pZZ7F1K4crtJ5HrzSQQTBgMtGgoSA/exec'; // <--- PASTE YOUR URL HERE
let sessionId = null;

document.addEventListener('DOMContentLoaded', () => {
    startNewSession();
    
    // UI Toggles
    const toggle = document.getElementById('chatToggle');
    const close = document.getElementById('closeChat');
    const window = document.getElementById('chatWindow');
    const sendBtn = document.getElementById('sendButton');
    const input = document.getElementById('userInput');

    toggle.onclick = () => window.style.display = 'flex';
    close.onclick = () => window.style.display = 'none';

    sendBtn.onclick = handleSend;
    input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
});

async function startNewSession() {
    try {
        const response = await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'startSession' }) });
        const result = await response.json();
        if (result.success) sessionId = result.data.sessionId;
    } catch (e) { console.log('Init error:', e); }
}

async function handleSend() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    input.value = '';
    document.getElementById('typingIndicator').style.display = 'flex';
    scrollToBottom();

    try {
        const resp = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({ action: 'sendMessage', sessionId: sessionId, message: msg })
        });
        const res = await resp.json();
        document.getElementById('typingIndicator').style.display = 'none';
        if (res.success) addMessage(res.data.reply, 'ai');
    } catch (e) {
        document.getElementById('typingIndicator').style.display = 'none';
        addMessage("Connection error. Check your deployment.", "ai");
    }
}

function addMessage(text, sender) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    div.innerHTML = `<div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>`;
    chat.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    const chat = document.getElementById('chatMessages');
    chat.scrollTop = chat.scrollHeight;
}
