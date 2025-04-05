let currentImageIndex = 0;
let screenshots = [];

function openModal(index) {
  currentImageIndex = index;
  const modal = document.getElementById('screenshotModal');
  const modalImage = document.getElementById('modalImage');
  modalImage.src = screenshots[currentImageIndex];
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('screenshotModal');
  modal.style.display = 'none';
}

function changeImage(direction) {
  currentImageIndex = (currentImageIndex + direction + screenshots.length) % screenshots.length;
  const modalImage = document.getElementById('modalImage');
  modalImage.src = screenshots[currentImageIndex];
}

async function loadGameInfo() {
  // Get the game ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('game');

  if (!gameId) {
    document.getElementById('gameTitle').textContent = 'Game Not Found';
    document.getElementById('gameDescription').textContent = 'No game ID was provided.';
    return;
  }

  try {
    // Fetch the corresponding JSON file for the selected game
    const response = await fetch(`game-data/${gameId}.json`);
    if (!response.ok) {
      throw new Error('Game data not found');
    }

    const gameData = await response.json();

    // Update the page with the game data
    document.getElementById('gameTitle').textContent = gameData.gameName;
    document.getElementById('gameDescription').textContent = gameData.description;
    document.getElementById('gameBanner').src = gameData.bannerImage;

    const screenshotsContainer = document.getElementById('screenshotsContainer');
    screenshotsContainer.innerHTML = ''; // Clear existing content
    screenshots = gameData.screenshots || [];
    screenshots.forEach((screenshot, index) => {
      const img = document.createElement('img');
      img.src = screenshot;
      img.alt = 'Screenshot';
      img.onclick = () => openModal(index);
      screenshotsContainer.appendChild(img);
    });

    // Add game characteristics
    const characteristics = gameData.characteristics || [];
    const characteristicsList = document.getElementById('gameCharacteristics');
    characteristicsList.innerHTML = ''; // Clear existing content
    characteristics.forEach(characteristic => {
      const listItem = document.createElement('li');
      listItem.textContent = characteristic;
      characteristicsList.appendChild(listItem);
    });

    // Update the "Demo Game" button link
    const demoGameButton = document.getElementById('demoGameButton');
    if (gameData['demo-gameplay']) {
      demoGameButton.onclick = () => window.open(gameData['demo-gameplay'], '_blank');
    } else {
      demoGameButton.style.display = 'none'; // Hide button if no demo link is available
    }

  } catch (error) {
    document.getElementById('gameTitle').textContent = 'Error';
    document.getElementById('gameDescription').textContent = 'Failed to load game details.';
    console.error(error);
  }
}

// Load the game info when the page loads
loadGameInfo();

function goBack() {
  window.location.href = 'index.html';
}

function redirectToCustomization() {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('game');
  if (gameId) {
    // Redirect to index.html with the current-game query parameter
    window.location.href = `index.html?current-game=${encodeURIComponent(gameId)}`;
  } else {
    alert('Game ID is missing. Please select a game.');
  }
}