document.addEventListener('DOMContentLoaded', () => {
  const jsonArea = document.getElementById('clientJson');
  const btnSave = document.getElementById('btnSave');
  const btnFill = document.getElementById('btnFill');
  const statusMsg = document.getElementById('statusMsg');

  // Cargar último cliente guardado
  chrome.storage.local.get(['nextActiveClient'], (res) => {
    if (res.nextActiveClient) {
      jsonArea.value = typeof res.nextActiveClient === 'object' 
        ? JSON.stringify(res.nextActiveClient, null, 2) 
        : res.nextActiveClient;
    }
  });

  btnSave.addEventListener('click', () => {
    const txt = jsonArea.value.trim();
    if (!txt) return;
    chrome.storage.local.set({ nextActiveClient: txt }, () => {
      statusMsg.style.display = 'block';
      statusMsg.innerText = '✓ Cliente guardado';
      setTimeout(() => { statusMsg.style.display = 'none'; }, 2000);
    });
  });

  btnFill.addEventListener('click', () => {
    const txt = jsonArea.value.trim();
    if (!txt) {
      alert('Por favor pega la ficha o JSON del cliente primero');
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'AUTOFILL', clientData: txt }, (response) => {
          statusMsg.style.display = 'block';
          if (response && response.count !== undefined) {
            statusMsg.innerText = `✓ ¡${response.count} campos completados!`;
          } else {
            statusMsg.innerText = '✓ Ejecutado en la página';
          }
        });
      }
    });
  });
});
