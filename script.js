const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwFOtWaj40J09R3XQJ_HqM4Ockz3gL1sSMa-E4pZZ7F1K4crtJ5HrzSQQTBgMtGgoSA/exec';
let sessionId = null;

document.addEventListener('DOMContentLoaded', () => {
    startNewSession();
    const sendBtn = document.getElementById('sendButton');
    const input = document.getElementById('userInput');
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
});

async function startNewSession() {
    try {
        const response = await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'startSession' }) });
        const result = await response.json();
        if (result.success) sessionId = result.data.sessionId;
    } catch (error) { console.error('Session Error:', error); }
}

async function handleSend() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    input.value = '';
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'flex';
    scrollToBottom();
    try {
        const response = await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'sendMessage', sessionId: sessionId, message: message }) });
        const result = await response.json();
        indicator.style.display = 'none';
        if (result.success) { addMessage(result.data.reply, 'ai'); } 
        else { addMessage("Error connecting. Try again later.", 'ai'); }
    } catch (error) {
        indicator.style.display = 'none';
        addMessage("Connection error.", 'ai');
    }
}

function addMessage(text, sender) {
    const chat = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerHTML = `<div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div><span class="msg-time">${time}</span>`;
    chat.appendChild(msgDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const chat = document.getElementById('chatMessages');
    chat.scrollTop = chat.scrollHeight;
}
