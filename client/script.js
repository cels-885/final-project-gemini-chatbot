document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  // Configuration
  const API_URL = 'http://localhost:3000/api/chat';

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    // 1. Add user's message to the chat box
    addMessage(message, 'user');
    userInput.value = '';

    // 2. Show a temporary "Thinking..." bot message
    const botMessageElement = addMessage('Thinking...', 'bot');

    try {
      // 3. Send the user's message as a POST request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: [
            { role: 'user', text: message }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // 4. Replace "Thinking..." with the AI's reply
      if (data.result) {
        botMessageElement.textContent = `Bot: ${data.result}`;
      } else {
        botMessageElement.textContent = 'Bot: Sorry, no response received.';
      }

    } catch (error) {
      // 5. Handle errors
      console.error('Error fetching chat response:', error);
      botMessageElement.textContent = 'Bot: Failed to get response from server.';
    }
  });

  /**
   * Helper function to add a message to the chat box.
   * @param {string} text - The message text.
   * @param {string} sender - 'user' or 'bot'.
   * @returns {HTMLElement} - The created message element (useful for updating bot messages).
   */
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = sender === 'user' ? `You: ${text}` : `Bot: ${text}`;
    
    chatBox.appendChild(messageDiv);
    
    // Auto-scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;
  }
});
