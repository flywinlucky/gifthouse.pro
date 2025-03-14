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

function previewPhoto() {
  const file = document.getElementById('photoInput').files[0];
  const reader = new FileReader();
  reader.onloadend = function() {
    document.getElementById('photoPreview').style.backgroundImage = `url(${reader.result})`;
  }
  if (file) {
    reader.readAsDataURL(file);
  }
}

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification ' + type;
  notification.style.display = 'block';
}
