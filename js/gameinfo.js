let currentImageIndex = 0;
let screenshots = [];

function openModal(index) {
  try {
    currentImageIndex = index;
    const modal = document.getElementById('screenshotModal');
    const modalImage = document.getElementById('modalImage');
    
    if (!modal || !modalImage) {
      console.error('Modal elements not found');
      return;
    }
    
    if (screenshots[currentImageIndex]) {
      modalImage.src = screenshots[currentImageIndex];
      modal.style.display = 'flex';
    }
  } catch (error) {
    console.error('Error opening modal:', error);
  }
}

function closeModal() {
  try {
    const modal = document.getElementById('screenshotModal');
    if (modal) {
      modal.style.display = 'none';
    }
  } catch (error) {
    console.error('Error closing modal:', error);
  }
}

function changeImage(direction) {
  try {
    if (screenshots.length === 0) return;
    
    currentImageIndex = (currentImageIndex + direction + screenshots.length) % screenshots.length;
    const modalImage = document.getElementById('modalImage');
    
    if (modalImage && screenshots[currentImageIndex]) {
      modalImage.src = screenshots[currentImageIndex];
    }
  } catch (error) {
    console.error('Error changing image:', error);
  }
}

async function loadGameInfo() {
  try {
    // Get the game ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');

    if (!gameId) {
      showError('No game ID was provided.');
      return;
    }

    // Show loading state
    showLoading();

    // Fetch the corresponding JSON file for the selected game
    const response = await fetch(`game-data/${gameId}.json`);
    
    if (!response.ok) {
      throw new Error(`Game data not found (${response.status}: ${response.statusText})`);
    }

    const gameData = await response.json();

    // Update the page with the game data
    updateGameInfo(gameData);
    
    // Hide loading state
    hideLoading();

  } catch (error) {
    console.error('Error loading game info:', error);
    showError('Failed to load game details. Please try again later.');
    hideLoading();
  }
}

function updateGameInfo(gameData) {
  try {
    // Update title and description
    const titleElement = document.getElementById('gameTitle');
    const descriptionElement = document.getElementById('gameDescription');
    const bannerElement = document.getElementById('gameBanner');
    
    if (titleElement) titleElement.textContent = gameData.gameName || 'Unknown Game';
    if (descriptionElement) descriptionElement.textContent = gameData.description || 'No description available.';
    if (bannerElement && gameData.bannerImage) bannerElement.src = gameData.bannerImage;

    // Update screenshots
    updateScreenshots(gameData.screenshots || []);

    // Update characteristics
    updateCharacteristics(gameData.characteristics || []);

    // Update demo button
    updateDemoButton(gameData['demo-gameplay']);

  } catch (error) {
    console.error('Error updating game info:', error);
  }
}

function updateScreenshots(screenshotsArray) {
  try {
    const screenshotsContainer = document.getElementById('screenshotsContainer');
    if (!screenshotsContainer) return;

    screenshotsContainer.innerHTML = '';
    screenshots = screenshotsArray;
    
    screenshots.forEach((screenshot, index) => {
      const img = document.createElement('img');
      img.src = screenshot;
      img.alt = 'Screenshot';
      img.onclick = () => openModal(index);
      img.onerror = () => {
        img.style.display = 'none';
        console.warn(`Failed to load screenshot: ${screenshot}`);
      };
      screenshotsContainer.appendChild(img);
    });
  } catch (error) {
    console.error('Error updating screenshots:', error);
  }
}

function updateCharacteristics(characteristics) {
  try {
    const characteristicsList = document.getElementById('gameCharacteristics');
    if (!characteristicsList) return;

    characteristicsList.innerHTML = '';
    
    if (characteristics.length === 0) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No characteristics available.';
      characteristicsList.appendChild(listItem);
      return;
    }

    characteristics.forEach(characteristic => {
      const listItem = document.createElement('li');
      listItem.textContent = characteristic;
      characteristicsList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error updating characteristics:', error);
  }
}

function updateDemoButton(demoUrl) {
  try {
    const demoGameButton = document.getElementById('demoGameButton');
    if (!demoGameButton) return;

    if (demoUrl) {
      demoGameButton.onclick = () => {
        try {
          window.open(demoUrl, '_blank');
        } catch (error) {
          console.error('Error opening demo:', error);
          alert('Failed to open demo. Please try again.');
        }
      };
      demoGameButton.style.display = 'inline-block';
    } else {
      demoGameButton.style.display = 'none';
    }
  } catch (error) {
    console.error('Error updating demo button:', error);
  }
}

function showLoading() {
  try {
    const titleElement = document.getElementById('gameTitle');
    const descriptionElement = document.getElementById('gameDescription');
    
    if (titleElement) titleElement.textContent = 'Loading...';
    if (descriptionElement) descriptionElement.textContent = 'Please wait while we load the game details.';
  } catch (error) {
    console.error('Error showing loading state:', error);
  }
}

function hideLoading() {
  // Loading state is handled by updateGameInfo
}

function showError(message) {
  try {
    const titleElement = document.getElementById('gameTitle');
    const descriptionElement = document.getElementById('gameDescription');
    
    if (titleElement) titleElement.textContent = 'Error';
    if (descriptionElement) descriptionElement.textContent = message;
  } catch (error) {
    console.error('Error showing error state:', error);
  }
}

function goBack() {
  try {
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error going back:', error);
    // Fallback
    window.history.back();
  }
}

function redirectToCustomization() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    
    if (gameId) {
      // Redirect to index.html with the current-game query parameter
      window.location.href = `index.html?current-game=${encodeURIComponent(gameId)}`;
    } else {
      showError('Game ID is missing. Please select a game.');
    }
  } catch (error) {
    console.error('Error redirecting to customization:', error);
    showError('Failed to redirect. Please try again.');
  }
}

// Add keyboard navigation for modal
document.addEventListener('keydown', function(event) {
  try {
    const modal = document.getElementById('screenshotModal');
    if (!modal || modal.style.display === 'none') return;

    switch(event.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        changeImage(-1);
        break;
      case 'ArrowRight':
        changeImage(1);
        break;
    }
  } catch (error) {
    console.error('Error handling keyboard navigation:', error);
  }
});

// Load the game info when the page loads
document.addEventListener('DOMContentLoaded', function() {
  try {
    loadGameInfo();
  } catch (error) {
    console.error('Error initializing game info:', error);
    showError('Failed to initialize the page. Please refresh and try again.');
  }
});