async function generateAndSendJSON() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const gameSelect = document.getElementById('gameSelect');
  const selectedGame = gameSelect.value;
  const canvas = document.getElementById('photoCanvas');
  const photoInput = document.getElementById('photoInput');
  const photoFile = photoInput.files[0];
  const startMessage = document.getElementById('startMessage').value.trim();
  const finishMessage = document.getElementById('finishMessage').value.trim();

  if (!name || !email || !selectedGame) {
    showNotification('Name, email, and game selection are required!', 'error');
    return;
  }

  // Generate a unique ID for the order
  const orderId = `GID_${Date.now()}`;

  // Create the JSON object
  const orderData = {
    name: name,
    email: email,
    "game-name": selectedGame,
    "player-face-image": photoFile ? photoFile.name : "N/A",
    "messages": {
      "start": startMessage,
      "finish": finishMessage
    }
  };

  // Convert the canvas image to a Blob
  canvas.toBlob(async (blob) => {
    if (!blob) {
      showNotification('Failed to generate image from canvas!', 'error');
      return;
    }

    try {
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

      const serverResponse = await response.json();

      if (serverResponse.ok) {
        // Removed success notification
      } else {
        showNotification('Error: ' + serverResponse.description, 'error');
      }
    } catch (error) {
      showNotification('Error: ' + error.message, 'error');
    }
  }, "image/png");
}