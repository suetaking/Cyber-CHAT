// --- RIPPLE EFFECT ---
function createRipple(e) {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    const existing = button.getElementsByClassName("ripple")[0];
    if (existing) existing.remove();

    button.appendChild(circle);
}

// Применяем ripple ко всем кнопкам
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll("button, .cyber-btn, .contact-item, .theme-btn, .avatar-option");
    buttons.forEach(btn => {
        btn.addEventListener("click", createRipple);
    });
});

// --- ОБНОВЛЕННАЯ ФУНКЦИЯ РЕНДЕРА СООБЩЕНИЙ ---
function renderMessages() {
    const container = document.getElementById('messages-container');
    const messages = userData.messages[activeContactId] || [];
    const contact = userData.contacts.find(c => c.id === activeContactId) || defaultContacts.find(c => c.id === activeContactId);
    
    container.innerHTML = messages.map((msg, index) => {
        const isMe = msg.sender === 'me';
        const avatar = isMe ? currentUser.avatar : contact.avatar;
        const name = isMe ? currentUser.name : contact.name;
        
        let content = '';
        
        if (msg.type === 'image') {
            content = `<img src="${msg.text}" class="max-w-[250px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onclick="openMediaModal('image', '${msg.text}')">`;
        } else if (msg.type === 'video') {
            content = `<video src="${msg.text}" class="max-w-[250px] rounded-lg cursor-pointer" onclick="openMediaModal('video', '${msg.text}')"></video>`;
        } else if (msg.type === 'file') {
            content = `<div class="flex items-center gap-2 p-2 bg-[var(--bg-dark)] rounded border border-[var(--border)]">
                <svg width="16" height="16" stroke="var(--primary)" fill="none" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                <span class="text-sm truncate max-w-[200px]">${msg.fileName || 'file'}</span>
            </div>`;
        } else {
            // ИСПРАВЛЕНИЕ: текст теперь нормально переносится
            content = `<p class="text-sm leading-relaxed whitespace-pre-wrap break-words">${escapeHtml(msg.text)}</p>`;
        }
        
        return `
            <div class="message-row ${isMe ? 'own' : ''} ${index === messages.length - 1 ? 'new' : ''}">
                <div class="message-avatar">
                    <img src="${avatar}" alt="${name}">
                </div>
                <div class="message-content">
                    <div class="message-author">${name}</div>
                    <div class="message-bubble ${isMe ? 'own' : ''}">
                        ${content}
                        <div class="text-[10px] text-[var(--text-muted)] mt-1 ${isMe ? 'text-right' : 'text-left'}">${msg.time}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Добавляем ripple на новые сообщения
    container.querySelectorAll('.message-bubble').forEach(bubble => {
        bubble.addEventListener('click', createRipple);
    });

    container.scrollTop = container.scrollHeight;
}

// Утилита для безопасного текста
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}