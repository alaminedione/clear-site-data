async function deleteDataOnClose() {
  try {
    const { deleteOnClose } = await chrome.storage.local.get('deleteOnClose');
    if (!deleteOnClose) return;

    const sites = await chrome.storage.local.get('sites');
    if (!sites.sites) {
      console.log('Aucun site enregistré.');
    } else {
      deleteDataForSites(sites.sites);
    }
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}
chrome.runtime.onStartup.addListener(deleteDataOnClose);

function deleteDataForSites(sites) {
  sites.forEach(site => {
    chrome.browsingData.remove({
      "since": 0
    }, {
      "cookies": true,
      "cache": true,
      "localStorage": true,
      "indexedDB": true
    }, () => {
      console.log(`Données supprimées pour : ${site}`);
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "deleteData") {
    deleteDataForSites(request.sites);
    sendResponse({ status: "success" });
  }
});
