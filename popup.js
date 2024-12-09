
document.getElementById('deleteButton').addEventListener('click', () => {
  chrome.storage.local.get('sites', (data) => {
    if (data.sites) {
      chrome.runtime.sendMessage({
        action: "deleteData",
        sites: data.sites
      }, (response) => {
        alert("Données supprimées !");
      });
    }
  });
});

