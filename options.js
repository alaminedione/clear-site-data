
// Charger et afficher l'état de la checkbox
chrome.storage.local.get('deleteOnClose', (data) => {
  if (data.deleteOnClose) {
    document.getElementById('deleteOnClose').checked = true;
  }
});

// Mettre à jour l'état de la checkbox
document.getElementById('deleteOnClose').addEventListener('change', (event) => {
  chrome.storage.local.set({ deleteOnClose: event.target.checked });
});

