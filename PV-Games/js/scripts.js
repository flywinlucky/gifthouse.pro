function generateJSON() {
  const name = document.getElementById('name').value;
  const type = document.getElementById('type').value;
  const age = document.getElementById('age').value;
  const photoInput = document.getElementById('photoInput');
  const photoFile = photoInput.files[0];

  const data = {
    name: name,
    type: type,
    age: age
  };

  const json = JSON.stringify(data, null, 2);
  const jsonBlob = new Blob([json], { type: 'application/json' });

  const formData = new FormData();
  formData.append("chat_id", "6953089880");
  formData.append("document", jsonBlob, "order.json");

  // Trimitem mai întâi fișierul JSON
  fetch("https://api.telegram.org/bot8090033567:AAH-SAl-LRqBvUcC_86_0_qnderstZwcpu0/sendDocument", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Dacă JSON-ul a fost trimis cu succes, trimitem poza
    showNotification('JSON sent successfully. Now sending photo...', 'success');
    
    if (photoFile) {
      // Trimitem poza după ce JSON-ul a fost trimis
      sendPhoto(photoFile);
    } else {
      showNotification('No photo to send', 'info');
    }
  })
  .catch(error => {
    showNotification('Error: ' + error.message, 'error');
  });
}

function sendPhoto(photoFile) {
  const formData = new FormData();
  formData.append("chat_id", "6953089880");
  formData.append("photo", photoFile, "photo.jpg");

  // Trimitem imaginea
  fetch("https://api.telegram.org/bot8090033567:AAH-SAl-LRqBvUcC_86_0_qnderstZwcpu0/sendPhoto", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    showNotification('Photo sent successfully', 'success');
  })
  .catch(error => {
    showNotification('Error sending photo: ' + error.message, 'error');
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

canvas.width = 300;
canvas.height = 300;

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
  updateDebugInfo();
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
  updateDebugInfo();
}

function updateDebugInfo() {
  const debugInfo = document.getElementById('debugInfo');
  debugInfo.textContent = `Debug Info: Zoom ${scale.toFixed(2)}, Rotate ${rotation}°, Flip ${flipHorizontal ? 'On' : 'Off'}`;
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

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification ' + type;
  notification.style.display = 'block';
}
