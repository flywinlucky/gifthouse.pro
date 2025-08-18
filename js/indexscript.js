const games = [
  { id: 'G1', name: 'Game 1 (G1)', icon: 'Resources/G1.png', overlayImage: 'Resources/avatar-mask-G1.png' },
  { id: 'G2', name: 'Game 2 (G2)', icon: 'Resources/G2.png', overlayImage: 'Resources/avatar-mask-G2.png' }
];

let currentStep = 1;

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

// Step Navigation Functions
function nextStep(currentStepNumber) {
  if (currentStepNumber === 1 && !document.getElementById('gameSelect').value) {
    return; // Don't proceed if no game is selected
  }
  
  if (currentStepNumber === 2 && !document.getElementById('photoInput').files.length) {
    return; // Don't proceed if no photo is uploaded
  }
  
  showStep(currentStepNumber + 1);
}

function previousStep(currentStepNumber) {
  showStep(currentStepNumber - 1);
}

function showStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Show the target step
  document.getElementById(`step${stepNumber}`).classList.add('active');
  
  // Update progress indicators
  updateProgressIndicators(stepNumber);
  
  currentStep = stepNumber;
}

function updateProgressIndicators(activeStep) {
  // Reset all indicators
  document.querySelectorAll('.progress-step').forEach((step, index) => {
    step.classList.remove('active', 'completed');
  });
  
  // Set active and completed states
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`step${i}Indicator`);
    if (i < activeStep) {
      indicator.classList.add('completed');
    } else if (i === activeStep) {
      indicator.classList.add('active');
    }
  }
}

function validateEmail() {
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  if (emailInput.value && !emailPattern.test(emailInput.value)) {
    emailError.style.display = 'block';
    updateStep5Status(); // Mark step 5 as incomplete
  } else {
    emailError.style.display = 'none';
    updateStep5Status(); // Mark step 5 as complete
  }
  checkAllStepsCompleted();
}

function updateStep1Status() {
  const gameSelect = document.getElementById('gameSelect');
  const nextButton = document.getElementById('nextStep1');
  if (gameSelect.value) {
    nextButton.disabled = false;
  } else {
    nextButton.disabled = true;
  }
}

function updateStep2Status() {
  const photoInput = document.getElementById('photoInput');
  const nextButton = document.getElementById('nextStep2');
  if (photoInput && nextButton) {
    if (photoInput.files.length > 0) {
      nextButton.disabled = false;
    } else {
      nextButton.disabled = true;
    }
  }
  // Sync upload/change/remove buttons
  if (typeof updateUploadButtons === 'function') updateUploadButtons();
}

function updateStep3Status() {
  const nameInput = document.getElementById('name');
  if (nameInput.value.trim()) {
    // Name is filled, continue validation
  }
  checkAllStepsCompleted();
}

function updateStep4Status() {
  const startMessage = document.getElementById('startMessage');
  const finishMessage = document.getElementById('finishMessage');
  
  // Update character count
  const startCharCount = startMessage.parentElement.querySelector('.char-count');
  const finishCharCount = finishMessage.parentElement.querySelector('.char-count');
  
  if (startCharCount) startCharCount.textContent = `${startMessage.value.length}/50`;
  if (finishCharCount) finishCharCount.textContent = `${finishMessage.value.length}/50`;
  
  checkAllStepsCompleted();
}

function updateStep5Status() {
  const termsCheckbox = document.getElementById('termsCheckbox');
  const emailInput = document.getElementById('email');
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  const isEmailValid = emailPattern.test(emailInput.value);
  
  if (termsCheckbox.checked && isEmailValid) {
    // Step 5 is complete
  } else {
    // Step 5 is incomplete
  }
  checkAllStepsCompleted();
}

function checkAllStepsCompleted() {
  const gameSelect = document.getElementById('gameSelect').value;
  const photoInput = document.getElementById('photoInput').files.length > 0;
  const nameInput = document.getElementById('name').value;
  const emailInput = document.getElementById('email');
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  const isEmailValid = emailPattern.test(emailInput.value);
  const startMessage = document.getElementById('startMessage').value;
  const finishMessage = document.getElementById('finishMessage').value;
  const termsCheckbox = document.getElementById('termsCheckbox').checked;

  const placeOrderButton = document.getElementById('placeOrderButton');
  if (gameSelect && photoInput && nameInput && isEmailValid && startMessage && finishMessage && termsCheckbox) {
    placeOrderButton.disabled = false;
  } else {
    placeOrderButton.disabled = true;
  }
}

function placeOrder() {
  // Show popup
  const popup = document.getElementById('popup');
  popup.style.display = 'block';

  // Update progress to show completion
  updateProgressIndicators(3);
  document.getElementById('step3Indicator').classList.add('completed');

  generateAndSendJSON();
}

function closePopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

function selectGame(gameId, elementId) {
  const gameSelect = document.getElementById('gameSelect');
  gameSelect.value = gameId;

  // Update selected game name in summary
  const selectedGameName = document.getElementById('selectedGameName');
  const selectedGame = games.find(game => game.id === gameId);
  if (selectedGameName && selectedGame) {
    selectedGameName.textContent = selectedGame.name;
  }

  // Remove the "selected" class from all game options
  document.querySelectorAll('.game-option').forEach(option => {
    option.classList.remove('selected');
  });

  // Add the "selected" class to the clicked game option
  const selectedOption = document.getElementById(elementId);
  selectedOption.classList.add('selected');

  // Update the overlay image based on the selected game
  const selectedGameData = games.find(game => game.id === gameId);
  const overlayImage = document.getElementById('overlayImage');
  if (overlayImage && selectedGameData) {
    overlayImage.src = selectedGameData.overlayImage;
  }

  // Update the URL with the selected game
  const newUrl = `${window.location.origin}${window.location.pathname}?game=${gameId}`;
  window.history.pushState({ path: newUrl }, '', newUrl);

  updateStep1Status();
}

function autoSelectGameFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentGame = urlParams.get('game');
  const overlayImage = document.getElementById('overlayImage');

  if (currentGame) {
    const game = games.find(g => g.id === currentGame);
    if (game) {
      selectGame(game.id, `game${game.id}`);
    }
  } else {
    // Set default overlay image if no game is selected
    if (overlayImage) {
      overlayImage.src = './Resources/no-selected-gm-default-img.png';
    }
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  autoSelectGameFromURL();
  renderGameMenu();
  updateProgressIndicators(1);
  
  // Add event listeners for form inputs
  document.getElementById('name').addEventListener('input', updateStep3Status);
  document.getElementById('startMessage').addEventListener('input', updateStep4Status);
  document.getElementById('finishMessage').addEventListener('input', updateStep4Status);
});