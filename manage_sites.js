let selectedSites = [];

function loadSites() {
  chrome.storage.local.get('sites', (data) => {
    const siteList = document.getElementById('siteList');
    siteList.innerHTML = ''; // Clear the list first

    if (data.sites && data.sites.length > 0) {
      data.sites.forEach((site, index) => {
        const li = document.createElement('li');
        li.textContent = site;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `site-${index}`;
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            selectedSites.push(site);
          } else {
            selectedSites = selectedSites.filter((s) => s !== site);
          }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Supprimer";
        deleteButton.addEventListener('click', () => {
          deleteSite(index);
        });

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(' '));
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

document.getElementById('addMultipleSitesButton').addEventListener('click', () => {
  const siteInput = document.getElementById('siteInput');
  const sites = siteInput.value.trim().split(',');

  if (sites.length > 0) {
    chrome.storage.local.get('sites', (data) => {
      let existingSites = data.sites || [];
      const newSites = sites.filter((site) => !existingSites.includes(site));
      existingSites = existingSites.concat(newSites);
      chrome.storage.local.set({ sites: existingSites }, () => {
        siteInput.value = ''; // Clear input
        loadSites();
      });
    });
  }
});

document.getElementById('selectAllButton').addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
    selectedSites.push(checkbox.parentNode.textContent.trim());
  });
});

document.getElementById('deselectAllButton').addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
    selectedSites = selectedSites.filter((site) => site !== checkbox.parentNode.textContent.trim());
  });
});

document.getElementById('deleteSelectedButton').addEventListener('click', () => {
  chrome.storage.local.get('sites', (data) => {
    let sites = data.sites || [];
    sites = sites.filter((site) => !selectedSites.includes(site));
    chrome.storage.local.set({ sites }, () => {
      loadSites();
    });
  });
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
