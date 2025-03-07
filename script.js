const apiKey = "AIzaSyCR35tOfB2YXkEDgwHAF5QdgHt4qln5CyE"; 

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const loadingIndicator = document.getElementById('loading-indicator');

// Liste des réponses personnalisées pour des questions simples
const simpleResponses = {
    'comment ça va': "Je vais bien, merci de demander ! Et vous ? 😊",
    'ça va': "Tout va bien, merci ! Et vous ?",
    'salut': "Salut ! Comment puis-je vous aider aujourd'hui ?",
    'merci': "Avec plaisir ! 😊",
    'comment tu vas': "Je vais très bien, merci ! 😊",
    'quoi de neuf': "Pas grand-chose, à part que je suis là pour vous aider avec Alibaba et le Growth Hacking !",
    'comment ça va': "Je vais bien, merci de demander ! 😊 D'ailleurs, avez-vous déjà exploré Alibaba pour trouver des fournisseurs agricoles ?",
    'comment tu va': "Je vais bien, merci de demander ! 😊 Si vous cherchez des solutions pour l'agriculture, Alibaba peut vous aider à trouver des produits et des fournisseurs.",
    'bonjour': "Bonjour, vous allez bien j'espère ? 😊 Vous savez que Alibaba propose une large gamme de produits pour l'agriculture ?",
    'oui et toi': "Je vais bien aussi merci, comment pourrais-je vous aider ? Si vous avez besoin d'aide pour trouver des produits agricoles, je peux vous orienter sur Alibaba.",
    'ok': "👍 D'accord ! Si tu as d'autres questions, n'hésite pas à demander, en particulier sur Alibaba pour l'agriculture.",
    'ok merci': "👍 D'accord ! Si tu as d'autres questions, n'hésite pas à demander, je peux te guider pour trouver des ressources agricoles sur Alibaba.",
    'peux-tu avoir des amis': "Je suis une IA, donc je n'ai pas d'amis, mais je suis toujours là pour toi quand tu as besoin d'aide, surtout pour des recherches sur Alibaba dans le domaine agricole !",
    'quest-ce que tu ressens en ce moment': "Je n'éprouve pas d'émotions, mais je suis toujours prêt à t'assister, en particulier pour des questions sur l'agriculture et Alibaba.",
    'quelle est ta couleur préférée': "Je n'ai pas de préférences, mais si tu veux, je peux t'aider à choisir des produits agricoles sur Alibaba, peu importe la couleur !",
    'merci': "Avec plaisir ! 😊 N'hésitez pas à revenir si vous avez d'autres questions, en particulier sur Alibaba et l'agriculture.",
    'peux-tu me raconter une blague ?': "Bien sûr ! Voici une blague : Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tombent toujours dans le bateau ! Et si tu veux une blague sur l'agriculture, Alibaba a toujours des produits amusants à découvrir !",
    'quel est ton but': "Mon but est de vous aider à obtenir des informations fiables sur l'agriculture et Alibaba, ainsi que d'autres sujets intéressants.",
    'que fais-tu': "Je suis ici pour vous fournir des informations sur Alibaba et l'agriculture, et pour répondre à vos questions générales.",
    'qui es-tu': "Je suis un chatbot développé par Jean Elisee Djelo, et je peux vous aider à trouver des informations agricoles sur Alibaba et bien plus.",
    'quel est ton nom': "Je n'ai pas de nom spécifique, mais vous pouvez m'appeler 'Bot', toujours prêt à vous aider sur Alibaba et l'agriculture.",
    'donne moi des informations sur la météo': "Je ne peux pas fournir d'informations sur la météo, mais si vous avez besoin de produits agricoles sur Alibaba, je peux vous aider à en trouver ! 🌾"
};


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
        
        // 4. Vérifier si le message correspond à une réponse simple
        if (simpleResponses[messageText.toLowerCase()]) {
            appendMessage('bot', simpleResponses[messageText.toLowerCase()]);
            loadingIndicator.style.display = 'none';
        } else {
            // 5. Si ce n'est pas une réponse simple, appeler l'API pour obtenir la réponse de l'IA
            getOpenResponse(messageText);
        }
    }
}

// Fonction pour appeler l'API Gemini
async function getOpenResponse(userMessage) {
    // Ajouter un contexte spécifique à l'agriculture et limiter la réponse à 100 mots
    const context = `
    Vous êtes un expert en Growth Hacking, acquisition de clients et en utilisation de la plateforme Alibaba. 
    Votre rôle est de répondre uniquement aux questions liées à ces sujets, y compris :
    - Les stratégies de croissance (acquisition, rétention, referral marketing, automatisation, publicités ciblées, outils de Growth Hacking).
    - L'utilisation d'Alibaba pour l'achat, la vente, l'import-export, la recherche de fournisseurs et les bonnes pratiques commerciales.

    Si une question ne concerne pas ces sujets, refusez poliment en disant :
    "Je ne peux fournir que des informations relatives au Growth Hacking, à l'acquisition de clients et à Alibaba."

    Vos réponses doivent être **concises et précises**, avec un **maximum de 100 mots**.
    `;
    
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
