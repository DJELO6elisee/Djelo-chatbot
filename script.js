
    // Clé API nécessaire pour accéder à l'API Gemini (remplace la valeur par ta clé API personnelle)
    const apiKey = "AIzaSyCR35tOfB2YXkEDgwHAF5QdgHt4qln5CyE"; 

    // URL de l'API Gemini avec le modèle utilisé et l'ajout de la clé API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Ajout d'un gestionnaire d'événement sur le bouton "Envoyer"
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', function (event) {  // Ajout d'un écouteur d'événement pour la touche "Entrée"
        if (event.key === 'Enter') {
            sendMessage();  // Envoie le message si "Entrée" est pressé
        }
    });

    // Fonction pour envoyer un message
    function sendMessage() {
        const messageText = messageInput.value.trim();

        if (messageText !== '') {
            // 1. Ajouter le message de l'utilisateur
            appendMessage('user', messageText);

            // 2. Effacer le champ de saisie
            messageInput.value = '';

            // 3. Afficher l'indicateur de chargement
            loadingIndicator.style.display = 'block';

            // 4. Appeler l'API pour obtenir la réponse de l'IA
            getOpenResponse(messageText);
        }
    }

    // Fonction pour appeler l'API Gemini
    async function getOpenResponse(userMessage) {
        // Ajouter un contexte spécifique à l'agriculture et limiter la réponse à 100 mots
        const context = "Vous êtes un expert en agriculture. Répondez uniquement aux questions concernant l'agriculture, l'élevage, les cultures, l'irrigation, etc. Si une question ne concerne pas ces sujets, refusez poliment et indiquez : 'Je ne peux fournir que des informations relatives à l'agriculture.' Répondez brièvement, en **maximum 100 mots**.";

        const requestData = {
            contents: [{
                parts: [{ text: `${context}\n\nQuestion: ${userMessage}` }]
            }]
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                let botResponse = data.candidates[0].content.parts[0].text;

                // Limiter la réponse à 100 mots
                botResponse = limitWords(botResponse, 100);

                // 5. Afficher la réponse de l'IA
                appendMessage('bot', botResponse);
            } else {
                appendMessage('bot', "Désolé, je n'ai pas compris. Essayez encore.");
            }
        } catch (error) {
            console.error("Erreur lors de la communication avec l'API :", error);
            appendMessage('bot', "Désolé, une erreur est survenue.");
        } finally {
            // Cacher l'indicateur de chargement après la réponse
            loadingIndicator.style.display = 'none';
        }
    }

    // Fonction pour limiter la réponse à 100 mots
    function limitWords(text, wordLimit) {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    }

    // Fonction pour ajouter un message à la page
    function appendMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Fonction pour faire défiler la page vers le bas (afin de voir les derniers messages)
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

