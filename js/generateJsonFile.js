async function generateAndSendJSON() {
  try {
    // Get form values
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const gameSelect = document.getElementById('gameSelect');
    const selectedGame = gameSelect?.value;
    const canvas = document.getElementById('photoCanvas');
    const photoInput = document.getElementById('photoInput');
    const photoFile = photoInput?.files?.[0];
    const startMessage = document.getElementById('startMessage')?.value?.trim();
    const secondaryMessages = Array.from(document.querySelectorAll('.secondaryMessage'))
      .map(input => input?.value?.trim())
      .filter(msg => msg && msg.length > 0);
    const finishMessage = document.getElementById('finishMessage')?.value?.trim();

    // Validate required fields
    if (!name || !email || !selectedGame) {
      showNotification('Name, email, and game selection are required!', 'error');
      return;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      showNotification('Please enter a valid email address!', 'error');
      return;
    }

    // Validate messages
    if (!startMessage || !finishMessage || secondaryMessages.length === 0) {
      showNotification('All message fields are required!', 'error');
      return;
    }

    // Check message length
    if (startMessage.length > 50 || finishMessage.length > 50) {
      showNotification('Start and finish messages must be 50 characters or less!', 'error');
      return;
    }

    for (const msg of secondaryMessages) {
      if (msg.length > 50) {
        showNotification('Secondary messages must be 50 characters or less!', 'error');
        return;
      }
    }

    // Generate a unique ID for the order
    const orderId = `GID_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the JSON object
    const orderData = {
      orderId: orderId,
      timestamp: new Date().toISOString(),
      name: name,
      email: email,
      "game-name": selectedGame,
      "player-face-image": photoFile ? photoFile.name : "N/A",
      "messages": {
        "start": startMessage,
        "secondary": secondaryMessages,
        "finish": finishMessage
      }
    };

    // Validate canvas
    if (!canvas) {
      showNotification('Canvas element not found!', 'error');
      return;
    }

    // Convert the canvas image to a Blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        showNotification('Failed to generate image from canvas!', 'error');
        return;
      }

      try {
        // Show loading state
        showNotification('Sending order...', 'success');

        // Prepare FormData to send the photo and JSON message
        const formData = new FormData();
        formData.append("chat_id", "6953089880"); // Provided chat ID
        formData.append("photo", blob, `${orderId}.png`); // Attach the image as a file
        formData.append("caption", JSON.stringify(orderData, null, 2)); // Send JSON as caption

        // Send the FormData to the Telegram bot API
        const telegramApiUrl = "https://api.telegram.org/bot7707999818:AAEuH4i7-wOCgCZ6sK_a9zvMvjOiZ67bR1M/sendPhoto";

        const response = await fetch(telegramApiUrl, {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const serverResponse = await response.json();

        if (serverResponse.ok) {
          showNotification('Order sent successfully! Check your email for confirmation.', 'success');
          
          // Clear form after successful submission
          setTimeout(() => {
            clearForm();
          }, 2000);
        } else {
          throw new Error(serverResponse.description || 'Unknown server error');
        }
      } catch (error) {
        console.error('Error sending order:', error);
        showNotification(`Error sending order: ${error.message}`, 'error');
      }
    }, "image/png", 0.9); // Use 90% quality for better file size

  } catch (error) {
    console.error('Error in generateAndSendJSON:', error);
    showNotification('An unexpected error occurred. Please try again.', 'error');
  }
}

function clearForm() {
  try {
    // Clear form fields
    const formFields = [
      'name', 'email', 'startMessage', 'finishMessage'
    ];
    
    formFields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) element.value = '';
    });

    // Clear game selection
    const gameSelect = document.getElementById('gameSelect');
    if (gameSelect) gameSelect.value = '';

    // Clear photo input
    const photoInput = document.getElementById('photoInput');
    if (photoInput) photoInput.value = '';

    // Clear secondary messages (keep only one)
    const secondaryMessagesContainer = document.getElementById('secondaryMessagesContainer');
    if (secondaryMessagesContainer) {
      const secondaryMessages = secondaryMessagesContainer.querySelectorAll('.secondary-message');
      secondaryMessages.forEach((messageDiv, index) => {
        if (index > 0) {
          messageDiv.remove();
        } else {
          const input = messageDiv.querySelector('.secondaryMessage');
          if (input) input.value = '';
        }
      });
    }

    // Reset canvas
    const canvas = document.getElementById('photoCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Reset overlay image
    const overlayImage = document.getElementById('overlayImage');
    if (overlayImage) {
      overlayImage.src = './Resources/no-selected-gm-default-img.png';
    }

    // Reset game selection UI
    document.querySelectorAll('.game-option').forEach(option => {
      option.classList.remove('selected');
    });

    // Update step statuses
    if (typeof updateStep1Status === 'function') updateStep1Status();
    if (typeof updateStep2Status === 'function') updateStep2Status();
    if (typeof updateStep3Status === 'function') updateStep3Status(false);
    if (typeof updateStep4Status === 'function') updateStep4Status();

  } catch (error) {
    console.error('Error clearing form:', error);
  }
}

function showNotification(message, type) {
  try {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Auto-hide success notifications after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        notification.style.display = 'none';
      }, 5000);
    }
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}