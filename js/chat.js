document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');

    const conversation = [
        { type: 'ai', text: "思慧你好，我看到你准备开始一项新使命。这是很棒的第一步！" },
        { type: 'ai', text: "有时候，开始��'竞品分析'这样的大任务会让人觉得有点不知所措。你现在是这种感觉吗？" },
        { type: 'user', text: "是的，有点。我不知道从哪里开始。" },
        { type: 'ai', text: "这完全正常。面对一张白纸总是最难的。秘诀在于，我们不需要一次性解决所有问题。" },
        { type: 'ai', text: "不如我们把它分解成几个微小、可执行的步骤？先让事情滚动起来。" },
        { type: 'action', text: "我们来创建一份行动计划吧！", link: "action_list.html" }
    ];

    let messageIndex = 0;
    let delay = 500;

    function createBubble(message) {
        const bubbleWrapper = document.createElement('div');
        bubbleWrapper.className = `chat-bubble ${message.type}`;
        
        let bubbleContent;

        if (message.type === 'action') {
            bubbleContent = `
                <div class="action-link-container w-full">
                    <a href="${message.link}" class="action-link">${message.text}</a>
                </div>
            `;
        } else {
            const avatar = message.type === 'ai' ? '<div class="avatar"></div>' : '';
            bubbleContent = `
                ${avatar}
                <div class="message-content ${message.type}">
                    <p>${message.text}</p>
                </div>
            `;
        }

        bubbleWrapper.innerHTML = bubbleContent;
        return bubbleWrapper;
    }

    function showNextMessage() {
        if (messageIndex < conversation.length) {
            const message = conversation[messageIndex];
            const bubble = createBubble(message);
            chatContainer.appendChild(bubble);

            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            lucide.createIcons();
            messageIndex++;
            
            delay = message.type === 'ai' ? 1200 : 800;
            if (message.type === 'action') {
                 delay = 500;
            }

            setTimeout(showNextMessage, delay);
        }
    }
    if (chatContainer) {
        setTimeout(showNextMessage, delay);
    }
});
