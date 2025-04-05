const games = [
  { id: 'G1', name: 'Game 1 (G1)', icon: 'Resources/G1.png', overlayImage: 'Resources/avatar-mask-G1.png' },
  { id: 'G2', name: 'Game 2 (G2)', icon: 'Resources/G2.png', overlayImage: 'Resources/avatar-mask-G2.png' }
];

function renderGameMenu() {
  const gameMenu = document.getElementById('gameMenu');
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
      window.location.href = `game-info.html?game=${game.id}`;
    };

    const gameIcon = document.createElement('img');
    gameIcon.src = game.icon;
    gameIcon.alt = `${game.name} Icon`;

    const gameName = document.createElement('span');
    gameName.textContent = game.name;

    gameOption.appendChild(moreInfo);
    gameOption.appendChild(gameIcon);
    gameOption.appendChild(gameName);
    gameMenu.appendChild(gameOption);
  });
}

function validateEmail() {
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  if (emailInput.value && !emailPattern.test(emailInput.value)) {
    emailError.style.display = 'block';
    updateStep3Status(false); // Mark step 3 as incomplete
  } else {
    emailError.style.display = 'none';
    updateStep3Status(true); // Mark step 3 as complete
  }
  checkAllStepsCompleted();
}

function updateStep1Status() {
  const gameSelect = document.getElementById('gameSelect');
  const step1Title = document.getElementById('step1Title');
  if (gameSelect.value) {
    step1Title.textContent = '1. ✅ Selected Game';
  } else {
    step1Title.textContent = '1. Selected Game';
  }
  checkAllStepsCompleted();
}

function updateStep2Status() {
  const photoInput = document.getElementById('photoInput');
  const step2Title = document.getElementById('step2Title');
  if (photoInput.files.length > 0) {
    step2Title.textContent = '2. ✅ Player Photo';
  } else {
    step2Title.textContent = '2. Player Photo';
  }
  checkAllStepsCompleted();
}

function updateStep3Status(isEmailValid) {
  const step3Title = document.getElementById('step3Title');
  if (isEmailValid) {
    step3Title.textContent = '3. ✅ Player Details';
  } else {
    step3Title.textContent = '3. Player Details';
  }
  checkAllStepsCompleted();
}

function updateStep4Status() {
  const startMessage = document.getElementById('startMessage').value;
  const secondaryMessages = document.querySelectorAll('.secondaryMessage');
  const finishMessage = document.getElementById('finishMessage').value;
  const step4Title = document.getElementById('step4Title');

  let allSecondaryMessagesFilled = true;
  secondaryMessages.forEach(message => {
    if (!message.value) {
      allSecondaryMessagesFilled = false;
    }
  });

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
  const startMessage = document.getElementById('startMessage').value;
  const secondaryMessages = document.querySelectorAll('.secondaryMessage');
  const finishMessage = document.getElementById('finishMessage').value;

  let allSecondaryMessagesFilled = true;
  secondaryMessages.forEach(message => {
    if (!message.value) {
      allSecondaryMessagesFilled = false;
    }
  });

  const placeOrderButton = document.getElementById('placeOrderButton');
  if (gameSelect && photoInput && isEmailValid && startMessage && allSecondaryMessagesFilled && finishMessage) {
    placeOrderButton.disabled = false;
  } else {
    placeOrderButton.disabled = true;
  }
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

function closePopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

function selectGame(gameId, elementId) {
  const gameSelect = document.getElementById('gameSelect');
  gameSelect.value = gameId;

  const step1Title = document.getElementById('step1Title');
  step1Title.textContent = `1. ✅ Selected Game (${gameId})`;

  // Remove the "selected" class from all game options
  document.querySelectorAll('.game-option').forEach(option => {
    option.classList.remove('selected');
  });

  // Add the "selected" class to the clicked game option
  const selectedOption = document.getElementById(elementId);
  selectedOption.classList.add('selected');

  // Update the overlay image based on the selected game
  const selectedGame = games.find(game => game.id === gameId);
  const overlayImage = document.getElementById('overlayImage');
  overlayImage.src = selectedGame.overlayImage;

  // Update the URL with the selected game
  const newUrl = `${window.location.origin}${window.location.pathname}?current-game=${gameId}`;
  window.history.pushState({ path: newUrl }, '', newUrl);

  const controlsPanel = document.getElementById('controlsPanel');
  const editToolsMessage = document.getElementById('editToolsMessage');
  controlsPanel.classList.remove('hidden'); // Show the controls panel
  editToolsMessage.classList.remove('hidden'); // Show the edit tools message

  checkAllStepsCompleted();
}

function autoSelectGameFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentGame = urlParams.get('current-game');
  const overlayImage = document.getElementById('overlayImage');

  if (currentGame) {
    const game = games.find(g => g.id === currentGame);
    if (game) {
      selectGame(game.id, `game${game.id}`);
    }
  } else {
    // Set default overlay image if no game is selected
    overlayImage.src = './Resources/no-selected-gm-default-img.png';
  }
}

document.addEventListener('DOMContentLoaded', autoSelectGameFromURL);

function addSecondaryMessage() {
  const secondaryMessagesContainer = document.getElementById('secondaryMessagesContainer');
  const secondaryMessages = document.querySelectorAll('.secondaryMessage');

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
}

function removeSecondaryMessage(button) {
  const secondaryMessagesContainer = document.getElementById('secondaryMessagesContainer');
  secondaryMessagesContainer.removeChild(button.parentElement);
  updateStep4Status();
  updateRemoveButtonsState();
}

function updateRemoveButtonsState() {
  const removeButtons = document.querySelectorAll('.removeSecondaryMessage');
  const secondaryMessages = document.querySelectorAll('.secondaryMessage');

  removeButtons.forEach(button => {
    button.disabled = secondaryMessages.length <= 1;
  });
}

renderGameMenu(); // Render the game menu
autoSelectGameFromURL(); // Automatically select the game based on the URL or set default