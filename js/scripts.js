function generateJSON() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value; // Get email value
  const photoInput = document.getElementById('photoInput');
  const photoFile = photoInput.files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email); // Add email to form data
  if (photoFile) {
    formData.append("photo", photoFile);
  }

  // Send the data to the Telegram bot API
  const telegramApiUrl = "https://api.telegram.org/bot7707999818:AAEuH4i7-wOCgCZ6sK_a9zvMvjOiZ67bR1M/sendMessage";
  const message = `Name: ${name}\nEmail: ${email}`;

  fetch(telegramApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: "6953089880", // Provided chat ID
      text: message
    })
  })
  .then(response => response.json())
  .then(serverResponse => {
    if (serverResponse.ok) {
      showNotification('Order sent successfully!', 'success');
    } else {
      showNotification('Error: ' + serverResponse.description, 'error');
    }
  })
  .catch(error => {
    showNotification('Error: ' + error.message, 'error');
  });
}

let canvas = document.getElementById('photoCanvas');
let ctx = canvas.getContext('2d');
let img = new Image();
let scale = 1;
let rotation = 0;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let startX, startY;
let flipHorizontal = false;

canvas.width = 380;
canvas.height = 380;

// Adjust overlay image size and position to match canvas dimensions
const overlayImage = document.getElementById('overlayImage');
function updateOverlaySize() {
  overlayImage.style.width = `${canvas.width}px`;
  overlayImage.style.height = `${canvas.height}px`;
  overlayImage.style.top = `${canvas.offsetTop}px`;
  overlayImage.style.left = `${canvas.offsetLeft}px`;
}
updateOverlaySize();

// Call updateOverlaySize whenever the canvas size or position changes
window.addEventListener('resize', updateOverlaySize);

function resetOverlayImage() {
  const overlayImage = document.getElementById('overlayImage');
  overlayImage.src = './Resources/avatar-mask.png'; // Ensure the correct path
}

function previewPhoto() {
  const file = document.getElementById('photoInput').files[0];
  const reader = new FileReader();
  reader.onloadend = function () {
    img.src = reader.result;
    img.onload = () => drawImage();
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}

function drawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale * (flipHorizontal ? -1 : 1), scale);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();

  // Ensure the overlay image is visible above the canvas
  const overlayImage = document.getElementById('overlayImage');
  overlayImage.style.display = 'block';
}

function rotateImage(angle) {
  rotation += angle;
  drawImage();
}

function zoomImage(factor) {
  scale *= factor;
  drawImage();
}

function flipPhoto() {
  flipHorizontal = !flipHorizontal;
  drawImage();
}

function resetTransformations() {
  scale = 1;
  rotation = 0;
  offsetX = 0;
  offsetY = 0;
  flipHorizontal = false;
  drawImage();
}

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.offsetX - offsetX;
  startY = e.offsetY - offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    offsetX = e.offsetX - startX;
    offsetY = e.offsetY - startY;
    drawImage();
  }
});

canvas.addEventListener('mouseup', () => (isDragging = false));
canvas.addEventListener('mouseleave', () => (isDragging = false));

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.touches[0].clientX - rect.left - offsetX;
    startY = e.touches[0].clientY - rect.top - offsetY;
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (isDragging && e.touches.length === 1) {
    const rect = canvas.getBoundingClientRect();
    offsetX = e.touches[0].clientX - rect.left - startX;
    offsetY = e.touches[0].clientY - rect.top - startY;
    drawImage();
  }
});

canvas.addEventListener('touchend', () => (isDragging = false));
canvas.addEventListener('touchcancel', () => (isDragging = false));

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
  zoomImage(zoomFactor);
});

let lastTouchEnd = 0;
let initialPinchDistance = null;
let initialScale = scale;
let initialPinchAngle = null;
let initialRotation = rotation;

// Disable double-tap zoom on mobile
document.addEventListener('touchend', (e) => {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Handle pinch-to-zoom gestures
canvas.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const currentDistance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );

    const currentAngle = Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    );

    if (initialPinchDistance === null) {
      initialPinchDistance = currentDistance;
      initialScale = scale;
      initialPinchAngle = currentAngle;
      initialRotation = rotation;
    } else {
      const scaleFactor = currentDistance / initialPinchDistance;
      scale = initialScale * scaleFactor;

      const angleDifference = (currentAngle - initialPinchAngle) * (180 / Math.PI);
      rotation = initialRotation + angleDifference;

      drawImage();
    }
  }
});

canvas.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) {
    initialPinchDistance = null;
    initialScale = scale;
    initialPinchAngle = null;
    initialRotation = rotation;
  }
});

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification ' + type;
  notification.style.display = 'block';
}

document.getElementById('gameSelect').addEventListener('change', function () {
  const selectedGame = this.options[this.selectedIndex].text;
  document.getElementById('selectedGame').textContent = selectedGame || 'None';
});

function addGame(id, name, icon) {
  games.push({ id, name, icon });
  renderGameMenu(); // Re-render the game menu
}

function removeGame(id) {
  const index = games.findIndex(game => game.id === id);
  if (index !== -1) {
    games.splice(index, 1);
    renderGameMenu(); // Re-render the game menu
  }
}

// Example usage:
// addGame('G4', 'Game 4 (G4)', 'Resources/G4.png');
// removeGame('G2');

function addSecondaryMessage() {
  const container = document.getElementById('secondaryMessagesContainer');
  const currentMessages = container.querySelectorAll('.secondary-message').length;

  if (currentMessages < 5) {
    const newMessageDiv = document.createElement('div');
    newMessageDiv.className = 'secondary-message';
    newMessageDiv.innerHTML = `
      <input type="text" class="secondaryMessage" placeholder="Secondary Message (max 50 chars)" maxlength="50" oninput="updateStep4Status()">
      <button type="button" class="removeSecondaryMessage" onclick="confirmRemoveSecondaryMessage(this)">❌</button>
    `;
    container.appendChild(newMessageDiv);
  }

  updateRemoveButtonsState();
}

function confirmRemoveSecondaryMessage(button) {
  const confirmation = confirm("Are you sure you want to delete this secondary message?");
  if (confirmation) {
    removeSecondaryMessage(button);
  }
}

function removeSecondaryMessage(button) {
  const container = document.getElementById('secondaryMessagesContainer');
  button.parentElement.remove();
  updateRemoveButtonsState();
  updateStep4Status();
}

function updateRemoveButtonsState() {
  const removeButtons = document.querySelectorAll('.removeSecondaryMessage');
  const secondaryMessages = document.querySelectorAll('.secondary-message');

  removeButtons.forEach(button => {
    button.disabled = secondaryMessages.length <= 1; // Disable if only one message exists
  });
}

// Initialize the remove button state on page load
document.addEventListener('DOMContentLoaded', updateRemoveButtonsState);

function updateAddButtonState() {
  const container = document.getElementById('secondaryMessagesContainer');
  const currentMessages = container.querySelectorAll('.secondary-message').length;
  const addButton = document.getElementById('addSecondaryMessageButton');

  addButton.disabled = currentMessages >= 5;

  // Ensure at least one secondary message always exists
  const removeButtons = container.querySelectorAll('.removeSecondaryMessage');
  removeButtons.forEach(button => {
    button.disabled = currentMessages <= 1;
  });
}

function updateStep4Status() {
  const startMessage = document.getElementById('startMessage').value.trim();
  const secondaryMessages = Array.from(document.querySelectorAll('.secondaryMessage')).map(input => input.value.trim());
  const finishMessage = document.getElementById('finishMessage').value.trim();
  const step4Title = document.getElementById('step4Title');

  const allSecondaryMessagesFilled = secondaryMessages.every(msg => msg !== '');

  if (startMessage && allSecondaryMessagesFilled && finishMessage) {
    step4Title.textContent = '4. ✅ Player Messages';
  } else {
    step4Title.textContent = '4. Player Messages';
  }
  checkAllStepsCompleted();
}

function checkAllStepsCompleted() {
  const gameSelect = document.getElementById('gameSelect').value;
  const photoInput = document.getElementById('photoInput').files.length > 0;
  const emailInput = document.getElementById('email');
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  const isEmailValid = emailPattern.test(emailInput.value);

  const startMessage = document.getElementById('startMessage').value.trim();
  const secondaryMessages = Array.from(document.querySelectorAll('.secondaryMessage')).map(input => input.value.trim());
  const finishMessage = document.getElementById('finishMessage').value.trim();

  const allSecondaryMessagesFilled = secondaryMessages.every(msg => msg !== '');

  const placeOrderButton = document.getElementById('placeOrderButton');
  if (gameSelect && photoInput && isEmailValid && startMessage && allSecondaryMessagesFilled && finishMessage) {
    placeOrderButton.disabled = false;
  } else {
    placeOrderButton.disabled = true;
  }
}

// Initialize the add button state on page load
document.addEventListener('DOMContentLoaded', updateAddButtonState);

function updateStep4Status() {
  const startMessage = document.getElementById('startMessage').value.trim();
  const secondaryMessage = document.getElementById('secondaryMessage').value.trim();
  const finishMessage = document.getElementById('finishMessage').value.trim();
  const step4Title = document.getElementById('step4Title');

  if (startMessage && secondaryMessage && finishMessage) {
    step4Title.textContent = '4. ✅ Player Messages';
  } else {
    step4Title.textContent = '4. Player Messages';
  }
  checkAllStepsCompleted();
}

function placeOrder() {
  // Show popup
  const popup = document.getElementById('popup');
  popup.style.display = 'block';

  // Update step 5 title
  const step5Title = document.getElementById('step5Title');
  step5Title.textContent = '5. ✅ Payment Details';

  generateAndSendJSON();
}