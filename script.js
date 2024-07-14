document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Parallax scrolling effect
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        let scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            element.style.backgroundPositionY = (scrollPosition * 0.5) + "px";
        });
    });

    // Scroll-based animation trigger
    const boxes = document.querySelectorAll('.box');
    const options = {
        threshold: 0.5
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'boxFadeIn 1.5s ease-in-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, options);

    boxes.forEach(box => {
        animateOnScroll.observe(box);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById('chat-box');
    const user1Input = document.getElementById('user1-input');
    const user2Input = document.getElementById('user2-input');
    const user1Send = document.getElementById('user1-send');
    const user2Send = document.getElementById('user2-send');

    let chatLog = [];

    user1Send.addEventListener('click', () => {
        sendMessage('user1', user1Input.value);
        user1Input.value = '';
    });

    user2Send.addEventListener('click', () => {
        sendMessage('user2', user2Input.value);
        user2Input.value = '';
    });

    // Allow sending messages with Enter key
    user1Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage('user1', user1Input.value);
            user1Input.value = '';
        }
    });

    user2Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage('user2', user2Input.value);
            user2Input.value = '';
        }
    });

    function sendMessage(user, message) {
        if (message.trim() === '') return;

        const messageElement = document.createElement('div');
        messageElement.classList.add('message', user.replace(' ', '').toLowerCase());
        messageElement.textContent = message;

        chatLog.push({ user, message });
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Check for misinformation
        checkForMisinformation(user, message);
    }

     function checkForMisinformation(user, message) {
        fetch('/fact_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_log: chatLog, user, message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.response && data.response.trim() !== "") {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', 'neutral');
                messageElement.textContent = data.response;

                chatBox.appendChild(messageElement);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        })
        .catch(error => console.error('Error:', error));
    }
});