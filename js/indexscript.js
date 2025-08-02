const games = [
  { id: 'G1', name: 'Game 1 (G1)', icon: 'Resources/G1.png', overlayImage: 'Resources/avatar-mask-G1.png' },
  { id: 'G2', name: 'Game 2 (G2)', icon: 'Resources/G2.png', overlayImage: 'Resources/avatar-mask-G2.png' }
];

function renderGameMenu() {
  try {
    const gameMenu = document.getElementById('gameMenu');
    if (!gameMenu) {
      console.error('Game menu element not found');
      return;
    }

    gameMenu.innerHTML = ''; // Clear existing content

    games.forEach(game => {
      const gameOption = document.createElement('div');
      gameOption.className = 'game-option';
      gameOption.id = `game${game.id}`;
      gameOption.onclick = () => selectGame(game.id, gameOption.id);

      const moreInfo = document.createElement('div');
      moreInfo.className = 'more-info';
      moreInfo.textContent = 'ℹ️';
      moreInfo.onclick = (event) => {
        event.stopPropagation();
        try {
          window.location.href = `game-info.html?game=${game.id}`;
        } catch (error) {
          console.error('Error navigating to game info:', error);
        }
      };

      const gameIcon = document.createElement('img');
      gameIcon.src = game.icon;
      gameIcon.alt = `${game.name} Icon`;
      gameIcon.onerror = () => {
        console.warn(`Failed to load game icon: ${game.icon}`);
        gameIcon.style.display = 'none';
      };

      const gameName = document.createElement('span');
      gameName.textContent = game.name;

      gameOption.appendChild(moreInfo);
      gameOption.appendChild(gameIcon);
      gameOption.appendChild(gameName);
      gameMenu.appendChild(gameOption);
    });
  } catch (error) {
    console.error('Error rendering game menu:', error);
  }
}

function validateEmail() {
  try {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    
    if (!emailInput || !emailError) {
      console.error('Email validation elements not found');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailInput.value && !emailPattern.test(emailInput.value)) {
      emailError.style.display = 'block';
      updateStep3Status(false);
    } else {
      emailError.style.display = 'none';
      updateStep3Status(true);
    }
    checkAllStepsCompleted();
  } catch (error) {
    console.error('Error validating email:', error);
  }
}

function updateStep1Status() {
  try {
    const gameSelect = document.getElementById('gameSelect');
    const step1Title = document.getElementById('step1Title');
    
    if (!gameSelect || !step1Title) {
      console.error('Step 1 elements not found');
      return;
    }

    if (gameSelect.value) {
      step1Title.textContent = '1. ✅ Selected Game';
    } else {
      step1Title.textContent = '1. Selected Game';
    }
    checkAllStepsCompleted();
  } catch (error) {
    console.error('Error updating step 1 status:', error);
  }
}

function updateStep2Status() {
  try {
    const photoInput = document.getElementById('photoInput');
    const step2Title = document.getElementById('step2Title');
    
    if (!photoInput || !step2Title) {
      console.error('Step 2 elements not found');
      return;
    }

    if (photoInput.files.length > 0) {
      step2Title.textContent = '2. ✅ Player Photo';
    } else {
      step2Title.textContent = '2. Player Photo';
    }
    checkAllStepsCompleted();
  } catch (error) {
    console.error('Error updating step 2 status:', error);
  }
}

function updateStep3Status(isEmailValid) {
  try {
    const step3Title = document.getElementById('step3Title');
    if (!step3Title) {
      console.error('Step 3 title element not found');
      return;
    }

    if (isEmailValid) {
      step3Title.textContent = '3. ✅ Player Details';
    } else {
      step3Title.textContent = '3. Player Details';
    }
    checkAllStepsCompleted();
  } catch (error) {
    console.error('Error updating step 3 status:', error);
  }
}

function updateStep4Status() {
  try {
    const startMessage = document.getElementById('startMessage')?.value?.trim();
    const secondaryMessages = document.querySelectorAll('.secondaryMessage');
    const finishMessage = document.getElementById('finishMessage')?.value?.trim();
    const step4Title = document.getElementById('step4Title');
    
    if (!step4Title) {
      console.error('Step 4 title element not found');
      return;
    }

    let allSecondaryMessagesFilled = true;
    secondaryMessages.forEach(message => {
      if (!message?.value?.trim()) {
        allSecondaryMessagesFilled = false;
      }
    });

    if (startMessage && allSecondaryMessagesFilled && finishMessage) {
      step4Title.textContent = '4. ✅ Player Messages';
    } else {
      step4Title.textContent = '4. Player Messages';
    }
    checkAllStepsCompleted();
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
    const secondaryMessages = document.querySelectorAll('.secondaryMessage');
    const finishMessage = document.getElementById('finishMessage')?.value?.trim();

    let allSecondaryMessagesFilled = true;
    secondaryMessages.forEach(message => {
      if (!message?.value?.trim()) {
        allSecondaryMessagesFilled = false;
      }
    });

    const placeOrderButton = document.getElementById('placeOrderButton');
    if (!placeOrderButton) {
      console.error('Place order button not found');
      return;
    }

    if (gameSelect && photoInput && isEmailValid && startMessage && allSecondaryMessagesFilled && finishMessage) {
      placeOrderButton.disabled = false;
    } else {
      placeOrderButton.disabled = true;
    }
  } catch (error) {
    console.error('Error checking steps completion:', error);
  }
}

function placeOrder() {
  try {
    // Show popup
    const popup = document.getElementById('popup');
    if (popup) {
      popup.style.display = 'block';
    }

    // Update step 5 title
    const step5Title = document.getElementById('step5Title');
    if (step5Title) {
      step5Title.textContent = '5. ✅ Payment Details';
    }

    if (typeof generateAndSendJSON === 'function') {
      generateAndSendJSON();
    } else {
      console.error('generateAndSendJSON function not found');
    }
  } catch (error) {
    console.error('Error placing order:', error);
  }
}

function closePopup() {
  try {
    const popup = document.getElementById('popup');
    if (popup) {
      popup.style.display = 'none';
    }
  } catch (error) {
    console.error('Error closing popup:', error);
  }
}

function selectGame(gameId, elementId) {
  try {
    const gameSelect = document.getElementById('gameSelect');
    const step1Title = document.getElementById('step1Title');
    
    if (!gameSelect || !step1Title) {
      console.error('Game selection elements not found');
      return;
    }

    gameSelect.value = gameId;
    step1Title.textContent = `1. ✅ Selected Game (${gameId})`;

    // Remove the "selected" class from all game options
    document.querySelectorAll('.game-option').forEach(option => {
      option.classList.remove('selected');
    });

    // Add the "selected" class to the clicked game option
    const selectedOption = document.getElementById(elementId);
    if (selectedOption) {
      selectedOption.classList.add('selected');
    }

    // Update the overlay image based on the selected game
    const selectedGame = games.find(game => game.id === gameId);
    const overlayImage = document.getElementById('overlayImage');
    if (selectedGame && overlayImage) {
      overlayImage.src = selectedGame.overlayImage;
    }

    // Update the URL with the selected game
    try {
      const newUrl = `${window.location.origin}${window.location.pathname}?current-game=${gameId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (error) {
      console.error('Error updating URL:', error);
    }

    const controlsPanel = document.getElementById('controlsPanel');
    const editToolsMessage = document.getElementById('editToolsMessage');
    
    if (controlsPanel) controlsPanel.classList.remove('hidden');
    if (editToolsMessage) editToolsMessage.classList.remove('hidden');

    checkAllStepsCompleted();
  } catch (error) {
    console.error('Error selecting game:', error);
  }
}

function autoSelectGameFromURL() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const currentGame = urlParams.get('current-game');
    const overlayImage = document.getElementById('overlayImage');

    if (currentGame) {
      const game = games.find(g => g.id === currentGame);
      if (game) {
        selectGame(game.id, `game${game.id}`);
      }
    } else if (overlayImage) {
      // Set default overlay image if no game is selected
      overlayImage.src = './Resources/no-selected-gm-default-img.png';
    }
  } catch (error) {
    console.error('Error auto-selecting game from URL:', error);
  }
}

function addSecondaryMessage() {
  try {
    const secondaryMessagesContainer = document.getElementById('secondaryMessagesContainer');
    const secondaryMessages = document.querySelectorAll('.secondaryMessage');

    if (!secondaryMessagesContainer) {
      console.error('Secondary messages container not found');
      return;
    }

    if (secondaryMessages.length < 5) {
      const newMessageDiv = document.createElement('div');
      newMessageDiv.className = 'secondary-message';

      const newMessageInput = document.createElement('input');
      newMessageInput.type = 'text';
      newMessageInput.className = 'secondaryMessage';
      newMessageInput.placeholder = 'Secondary Message (max 50 chars)';
      newMessageInput.maxLength = 50;
      newMessageInput.oninput = updateStep4Status;

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'removeSecondaryMessage';
      removeButton.textContent = '❌';
      removeButton.onclick = () => removeSecondaryMessage(removeButton);

      newMessageDiv.appendChild(newMessageInput);
      newMessageDiv.appendChild(removeButton);
      secondaryMessagesContainer.appendChild(newMessageDiv);
    }

    updateRemoveButtonsState();
  } catch (error) {
    console.error('Error adding secondary message:', error);
  }
}

function removeSecondaryMessage(button) {
  try {
    const secondaryMessagesContainer = document.getElementById('secondaryMessagesContainer');
    if (secondaryMessagesContainer && button.parentElement) {
      secondaryMessagesContainer.removeChild(button.parentElement);
      updateStep4Status();
      updateRemoveButtonsState();
    }
  } catch (error) {
    console.error('Error removing secondary message:', error);
  }
}

function updateRemoveButtonsState() {
  try {
    const removeButtons = document.querySelectorAll('.removeSecondaryMessage');
    const secondaryMessages = document.querySelectorAll('.secondaryMessage');

    removeButtons.forEach(button => {
      if (button) {
        button.disabled = secondaryMessages.length <= 1;
      }
    });
  } catch (error) {
    console.error('Error updating remove buttons state:', error);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    renderGameMenu();
    autoSelectGameFromURL();
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});