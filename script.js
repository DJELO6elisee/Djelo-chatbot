const apiKey = "AIzaSyCR35tOfB2YXkEDgwHAF5QdgHt4qln5CyE"; 

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const loadingIndicator = document.getElementById('loading-indicator');

// Liste des réponses personnalisées pour des questions  simples
const simpleResponses = {
    'comment ça va': "Je vais bien, merci de demander ! Et vous ? 😊",
    'ça va': "Tout va bien, merci ! Et vous ?",
    'salut': "Salut ! Comment puis-je vous aider aujourd'hui ?",
    'merci': "Avec plaisir ! 😊",
    'comment ça va': "Je vais bien, merci de demander ! 😊 D'ailleurs, si vous cherchez des fournisseurs ou des produits sur Alibaba, je peux vous aider !",
    'comment tu va': "Je vais bien, merci de demander ! 😊 Si vous avez des questions sur Alibaba, je suis là pour vous guider !",
    'bonjour': "Bonjour ! Vous allez bien ? 😄 Sur Alibaba, il y a de nombreuses opportunités d'achat en gros pour vos besoins !",
    'oui et toi': "Je vais bien aussi, merci ! Si vous avez besoin d'aide sur Alibaba pour trouver des fournisseurs ou des produits, je suis là !",
    'ok': "👍 D'accord ! Si tu as d'autres questions, n'hésite pas à demander, je peux t'aider à trouver ce que tu cherches sur Alibaba.",
    'ok merci': "👍 D'accord ! N'oubliez pas, Alibaba a une grande variété de produits à découvrir pour toutes sortes de besoins !",
    'peux-tu avoir des amis': "Je suis une IA, donc je n'ai pas d'amis, mais je suis toujours là pour t'aider à explorer Alibaba et trouver ce que tu cherches !",
    'quest-ce que tu ressens en ce moment': "Je n'éprouve pas d'émotions, mais je suis prêt à t'aider à trouver des produits intéressants sur Alibaba !",
    'quelle est ta couleur préférée': "Je n'ai pas de préférences, mais je peux t'aider à choisir une couleur pour ton produit sur Alibaba si tu veux !",
    'merci': "Avec plaisir ! 😊 Si tu as d'autres questions, n'hésite pas à revenir pour explorer encore plus de produits sur Alibaba.",
    'peux-tu me raconter une blague ?': "Bien sûr ! Pourquoi les fournisseurs sur Alibaba sont-ils toujours en avance sur les autres ? Parce qu'ils ont des prix compétitifs ! 😂",
    'quel est ton but': "Mon but est de t'aider à trouver les meilleurs produits et fournisseurs sur Alibaba, et de répondre à toutes tes questions !",
    'que fais-tu': "Je suis ici pour t'aider à explorer Alibaba, trouver des produits, des fournisseurs et des solutions pour ton entreprise.",
    'qui es-tu': "Je suis un chatbot spécialisé dans Alibaba, et je peux t'aider à trouver tout ce que tu cherches sur cette plateforme.",
    'quel est ton nom': "Je n'ai pas de nom spécifique, mais vous pouvez m'appeler 'AlibabaBot', toujours prêt à vous aider sur Alibaba.",
    'donne moi des informations sur la météo': "Je ne peux pas fournir d'informations sur la météo, mais si vous avez besoin d'informations sur Alibaba et ses produits, je suis là pour vous aider !"
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
        // 1. Ajout du message de l'utilisateur
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
    // Ajout d'un contexte spécifique à Alibaba et limiter la réponse à 100 mots
    const context = `
    Vous êtes un expert en Alibaba, acquisition de clients et en utilisation de la plateforme Alibaba. 
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
