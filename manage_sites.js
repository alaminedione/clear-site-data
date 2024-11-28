function loadSites() {
  chrome.storage.local.get('sites', (data) => {
    const siteList = document.getElementById('siteList');
    siteList.innerHTML = ''; // Clear the list first

    if (data.sites && data.sites.length > 0) {
      data.sites.forEach((site, index) => {
        const li = document.createElement('li');
        li.textContent = site;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Supprimer";
        deleteButton.addEventListener('click', () => {
          deleteSite(index);
        });

        li.appendChild(deleteButton);
        siteList.appendChild(li);
      });
    } else {
      siteList.innerHTML = "<li>Aucun site enregistré.</li>";
    }
  });
}

document.getElementById('addSiteButton').addEventListener('click', () => {
  const siteInput = document.getElementById('siteInput');
  const site = siteInput.value.trim();

  if (site) {
    chrome.storage.local.get('sites', (data) => {
      let sites = data.sites || [];
      if (!sites.includes(site)) {
        sites.push(site);
        chrome.storage.local.set({ sites }, () => {
          siteInput.value = ''; // Clear input
          loadSites();
        });
      }
    });
  }
});

function deleteSite(index) {
  chrome.storage.local.get('sites', (data) => {
    let sites = data.sites || [];
    sites.splice(index, 1);
    chrome.storage.local.set({ sites }, () => {
      loadSites(); // Refresh the site list
    });
  });
}

loadSites();

