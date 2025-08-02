function generateJSON() {
  try {
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const photoInput = document.getElementById('photoInput');
    const photoFile = photoInput?.files?.[0];

    if (!name || !email) {
      showNotification('Name and email are required!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
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
        chat_id: "6953089880",
        text: message
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(serverResponse => {
      if (serverResponse.ok) {
        showNotification('Order sent successfully!', 'success');
      } else {
        throw new Error(serverResponse.description || 'Unknown server error');
      }
    })
    .catch(error => {
      console.error('Error sending order:', error);
      showNotification(`Error: ${error.message}`, 'error');
    });
  } catch (error) {
    console.error('Error in generateJSON:', error);
    showNotification('An unexpected error occurred. Please try again.', 'error');
  }
}

// Canvas and image manipulation variables
let canvas = null;
let ctx = null;
let img = new Image();
let scale = 1;
let rotation = 0;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let startX, startY;
let flipHorizontal = false;

// Initialize canvas when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    canvas = document.getElementById('photoCanvas');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    canvas.width = 380;
    canvas.height = 380;

    // Adjust overlay image size and position to match canvas dimensions
    const overlayImage = document.getElementById('overlayImage');
    if (overlayImage) {
      updateOverlaySize();
    }

    // Call updateOverlaySize whenever the canvas size or position changes
    window.addEventListener('resize', updateOverlaySize);
  } catch (error) {
    console.error('Error initializing canvas:', error);
  }
});

function updateOverlaySize() {
  try {
    const overlayImage = document.getElementById('overlayImage');
    if (!overlayImage || !canvas) return;
    
    overlayImage.style.width = `${canvas.width}px`;
    overlayImage.style.height = `${canvas.height}px`;
    overlayImage.style.top = `${canvas.offsetTop}px`;
    overlayImage.style.left = `${canvas.offsetLeft}px`;
  } catch (error) {
    console.error('Error updating overlay size:', error);
  }
}

function resetOverlayImage() {
  try {
    const overlayImage = document.getElementById('overlayImage');
    if (overlayImage) {
      overlayImage.src = './Resources/avatar-mask.png';
    }
  } catch (error) {
    console.error('Error resetting overlay image:', error);
  }
}

function previewPhoto() {
  try {
    const fileInput = document.getElementById('photoInput');
    if (!fileInput || !fileInput.files[0]) return;

    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onloadend = function () {
      try {
        img.src = reader.result;
        img.onload = () => drawImage();
        img.onerror = () => {
          console.error('Failed to load image');
          showNotification('Failed to load image. Please try another file.', 'error');
        };
      } catch (error) {
        console.error('Error loading image:', error);
        showNotification('Error loading image. Please try again.', 'error');
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      showNotification('Error reading file. Please try again.', 'error');
    };
    
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error previewing photo:', error);
    showNotification('Error previewing photo. Please try again.', 'error');
  }
}

function drawImage() {
  try {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale * (flipHorizontal ? -1 : 1), scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    // Ensure the overlay image is visible above the canvas
    const overlayImage = document.getElementById('overlayImage');
    if (overlayImage) {
      overlayImage.style.display = 'block';
    }
  } catch (error) {
    console.error('Error drawing image:', error);
  }
}

function rotateImage(angle) {
  try {
    rotation += angle;
    drawImage();
  } catch (error) {
    console.error('Error rotating image:', error);
  }
}

function zoomImage(factor) {
  try {
    scale *= factor;
    // Limit zoom to reasonable bounds
    scale = Math.max(0.1, Math.min(5, scale));
    drawImage();
  } catch (error) {
    console.error('Error zooming image:', error);
  }
}

function flipPhoto() {
  try {
    flipHorizontal = !flipHorizontal;
    drawImage();
  } catch (error) {
    console.error('Error flipping photo:', error);
  }
}

function resetTransformations() {
  try {
    scale = 1;
    rotation = 0;
    offsetX = 0;
    offsetY = 0;
    flipHorizontal = false;
    drawImage();
  } catch (error) {
    console.error('Error resetting transformations:', error);
  }
}

// Mouse event handlers
function setupMouseEvents() {
  try {
    if (!canvas) return;

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
  } catch (error) {
    console.error('Error setting up mouse events:', error);
  }
}

// Touch event handlers
function setupTouchEvents() {
  try {
    if (!canvas) return;

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
  } catch (error) {
    console.error('Error setting up touch events:', error);
  }
}

// Wheel event handler
function setupWheelEvent() {
  try {
    if (!canvas) return;

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      zoomImage(zoomFactor);
    });
  } catch (error) {
    console.error('Error setting up wheel event:', error);
  }
}

// Pinch-to-zoom variables
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
function setupPinchToZoom() {
  try {
    if (!canvas) return;

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
          scale = Math.max(0.1, Math.min(5, initialScale * scaleFactor));

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
  } catch (error) {
    console.error('Error setting up pinch to zoom:', error);
  }
}

// Initialize all event handlers
document.addEventListener('DOMContentLoaded', function() {
  try {
    setupMouseEvents();
    setupTouchEvents();
    setupWheelEvent();
    setupPinchToZoom();
  } catch (error) {
    console.error('Error setting up event handlers:', error);
  }
});

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

document.getElementById('gameSelect').addEventListener('change', function () {
  const selectedGame = this.options[this.selectedIndex].text;
  document.getElementById('selectedGame').textContent = selectedGame || 'None';
});

function addGame(id, name, icon) {
  try {
    games.push({ id, name, icon });
    if (typeof renderGameMenu === 'function') {
      renderGameMenu();
    }
  } catch (error) {
    console.error('Error adding game:', error);
  }
}

function removeGame(id) {
  try {
    const index = games.findIndex(game => game.id === id);
    if (index !== -1) {
      games.splice(index, 1);
      if (typeof renderGameMenu === 'function') {
        renderGameMenu();
      }
    }
  } catch (error) {
    console.error('Error removing game:', error);
  }
}

// Example usage:
// addGame('G4', 'Game 4 (G4)', 'Resources/G4.png');
// removeGame('G2');

function addSecondaryMessage() {
  try {
    const container = document.getElementById('secondaryMessagesContainer');
    const currentMessages = container?.querySelectorAll('.secondary-message')?.length || 0;

    if (currentMessages < 5) {
      const newMessageDiv = document.createElement('div');
      newMessageDiv.className = 'secondary-message';
      newMessageDiv.innerHTML = `
        <input type="text" class="secondaryMessage" placeholder="Secondary Message (max 50 chars)" maxlength="50" oninput="updateStep4Status()">
        <button type="button" class="removeSecondaryMessage" onclick="confirmRemoveSecondaryMessage(this)">❌</button>
      `;
      container?.appendChild(newMessageDiv);
    }

    updateRemoveButtonsState();
  } catch (error) {
    console.error('Error adding secondary message:', error);
  }
}

function confirmRemoveSecondaryMessage(button) {
  try {
    const confirmation = confirm("Are you sure you want to delete this secondary message?");
    if (confirmation) {
      removeSecondaryMessage(button);
    }
  } catch (error) {
    console.error('Error confirming remove secondary message:', error);
  }
}

function removeSecondaryMessage(button) {
  try {
    const container = document.getElementById('secondaryMessagesContainer');
    if (container && button?.parentElement) {
      button.parentElement.remove();
      updateRemoveButtonsState();
      if (typeof updateStep4Status === 'function') {
        updateStep4Status();
      }
    }
  } catch (error) {
    console.error('Error removing secondary message:', error);
  }
}

function updateRemoveButtonsState() {
  try {
    const removeButtons = document.querySelectorAll('.removeSecondaryMessage');
    const secondaryMessages = document.querySelectorAll('.secondary-message');

    removeButtons.forEach(button => {
      if (button) {
        button.disabled = secondaryMessages.length <= 1;
      }
    });
  } catch (error) {
    console.error('Error updating remove buttons state:', error);
  }
}

// Initialize the remove button state on page load
document.addEventListener('DOMContentLoaded', function() {
  try {
    updateRemoveButtonsState();
    updateAddButtonState();
  } catch (error) {
    console.error('Error initializing button states:', error);
  }
});

function updateAddButtonState() {
  try {
    const container = document.getElementById('secondaryMessagesContainer');
    const currentMessages = container?.querySelectorAll('.secondary-message')?.length || 0;
    const addButton = document.getElementById('addSecondaryMessageButton');

    if (addButton) {
      addButton.disabled = currentMessages >= 5;
    }

    // Ensure at least one secondary message always exists
    const removeButtons = container?.querySelectorAll('.removeSecondaryMessage');
    removeButtons?.forEach(button => {
      if (button) {
        button.disabled = currentMessages <= 1;
      }
    });
  } catch (error) {
    console.error('Error updating add button state:', error);
  }
}

function updateStep4Status() {
  try {
    const startMessage = document.getElementById('startMessage')?.value?.trim();
    const secondaryMessages = Array.from(document.querySelectorAll('.secondaryMessage'))
      .map(input => input?.value?.trim())
      .filter(msg => msg && msg.length > 0);
    const finishMessage = document.getElementById('finishMessage')?.value?.trim();
    const step4Title = document.getElementById('step4Title');

    if (!step4Title) return;

    const allSecondaryMessagesFilled = secondaryMessages.length > 0 && 
      secondaryMessages.every(msg => msg !== '');

    if (startMessage && allSecondaryMessagesFilled && finishMessage) {
      step4Title.textContent = '4. ✅ Player Messages';
    } else {
      step4Title.textContent = '4. Player Messages';
    }
    
    if (typeof checkAllStepsCompleted === 'function') {
      checkAllStepsCompleted();
    }
  } catch (error) {
    console.error('Error updating step 4 status:', error);
  }
}

function checkAllStepsCompleted() {
  try {
    const gameSelect = document.getElementById('gameSelect')?.value;
    const photoInput = document.getElementById('photoInput')?.files?.length > 0;
    const emailInput = document.getElementById('email');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailPattern.test(emailInput?.value || '');

    const startMessage = document.getElementById('startMessage')?.value?.trim();
    const secondaryMessages = Array.from(document.querySelectorAll('.secondaryMessage'))
      .map(input => input?.value?.trim())
      .filter(msg => msg && msg.length > 0);
    const finishMessage = document.getElementById('finishMessage')?.value?.trim();

    const allSecondaryMessagesFilled = secondaryMessages.length > 0 && 
      secondaryMessages.every(msg => msg !== '');

    const placeOrderButton = document.getElementById('placeOrderButton');
    if (placeOrderButton) {
      if (gameSelect && photoInput && isEmailValid && startMessage && allSecondaryMessagesFilled && finishMessage) {
        placeOrderButton.disabled = false;
      } else {
        placeOrderButton.disabled = true;
      }
    }
  } catch (error) {
    console.error('Error checking all steps completed:', error);
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