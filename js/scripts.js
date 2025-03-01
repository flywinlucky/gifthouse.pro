function generateJSON() {
  const name = document.getElementById('name').value;
  const type = document.getElementById('type').value;
  const age = document.getElementById('age').value;

  const data = {
    name: name,
    type: type,
    age: age
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  const formData = new FormData();
  formData.append("chat_id", "6953089880");
  formData.append("document", blob, "order.json");

  fetch("https://api.telegram.org/bot8090033567:AAH-SAl-LRqBvUcC_86_0_qnderstZwcpu0/sendDocument", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    showNotification('File sent successfully', 'success');
  })
  .catch(error => {
    showNotification('Error: ' + error.message, 'error');
  });
}

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification ' + type;
  notification.style.display = 'block';
}
