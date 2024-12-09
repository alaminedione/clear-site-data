
let selectedSites = [];

// Fonction pour charger les sites à partir du stockage
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
        checkbox.checked = selectedSites.includes(site); // Check if site is selected
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

loadSites();


// Fonction pour ajouter plusieurs sites
document.getElementById('addMultipleSitesButton').addEventListener('click', () => {
  const siteInput = document.getElementById('siteInput');
  const rawSites = siteInput.value.trim();

  if (rawSites) {
    const sites = rawSites.split(',').map(site => site.trim()); // Split and trim each site

    // Filter out any invalid or empty sites
    const validSites = sites.filter(site => site && isValidSite(site));

    if (validSites.length > 0) {
      chrome.storage.local.get('sites', (data) => {
        let existingSites = data.sites || [];

        // Filter out sites that already exist in storage
        const newSites = validSites.filter((site) => !existingSites.includes(site));

        if (newSites.length > 0) {
          existingSites = existingSites.concat(newSites);
          chrome.storage.local.set({ sites: existingSites }, () => {
            siteInput.value = ''; // Clear input
            loadSites(); // Refresh the site list
            showMessage(`${newSites.length} site(s) ajouté(s) avec succès.`, 'success');
          });
        } else {
          showMessage('Tous les sites sont déjà dans la liste.', 'info');
        }
      });
    } else {
      showMessage('Veuillez entrer des URLs valides.', 'error');
    }
  } else {
    showMessage('Veuillez entrer au moins un site.', 'error');
  }
});

// Helper function to validate the site format (basic check)

// Ajouter un site
document.getElementById('addSiteButton').addEventListener('click', () => {
  const siteInput = document.getElementById('siteInput');
  const site = siteInput.value.trim();

  // Vérifier si l'URL est valide
  if (!site || !isValidSite(site)) {
    showMessage('Veuillez entrer une URL valide.', 'error');
    return; // On arrête le traitement si l'URL est invalide
  }

  // Récupérer la liste des sites enregistrés
  chrome.storage.local.get('sites', (data) => {
    let sites = data.sites || [];

    // Vérifier si le site est déjà dans la liste
    if (sites.includes(site)) {
      showMessage('Ce site est déjà dans la liste.', 'error');
    } else {
      // Ajouter le site à la liste
      sites.push(site);

      // Sauvegarder la liste mise à jour
      chrome.storage.local.set({ sites }, () => {
        siteInput.value = ''; // Vider le champ de saisie
        loadSites(); // Recharger la liste des sites
        showMessage('Site ajouté avec succès.', 'success');
      });
    }
  });
});

// Fonction pour valider le format de l'URL
function isValidSite(site) {
  // Expression régulière pour valider le format d'une URL
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
  return urlPattern.test(site);
}

// Fonction pour afficher des messages
function showMessage(message, type) {
  let messageBox = document.getElementById('messageBox');

  // Créer un messageBox si nécessaire
  if (!messageBox) {
    messageBox = document.createElement('div');
    messageBox.id = 'messageBox';
    messageBox.style.padding = '10px';
    messageBox.style.marginBottom = '10px';
    messageBox.style.borderRadius = '5px';
    messageBox.style.fontSize = '1rem';
    messageBox.style.fontWeight = 'bold';
    messageBox.style.transition = 'opacity 0.5s ease-in-out';

    const siteList = document.getElementById('siteList');
    if (siteList) {
      siteList.parentNode.insertBefore(messageBox, siteList);
    } else {
      document.body.appendChild(messageBox);
    }
  }

  // Couleur en fonction du type de message
  const colorMap = {
    success: 'green',
    error: 'red',
    info: 'blue'
  };

  messageBox.style.backgroundColor = colorMap[type] || 'blue';
  messageBox.textContent = message;

  // Masquer après 3 secondes
  setTimeout(() => {
    messageBox.style.opacity = 0;
    setTimeout(() => {
      messageBox.remove();
    }, 500);
  }, 3000);
}
// Fonction de sélection de tous les sites
document.getElementById('selectAllButton').addEventListener('click', () => {
  chrome.storage.local.get('sites', (data) => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = true;
      if (!selectedSites.includes(data.sites[index])) {
        selectedSites.push(data.sites[index]);
      }
    });
  });
});

// Fonction de désélection de tous les sites
document.getElementById('deselectAllButton').addEventListener('click', () => {
  chrome.storage.local.get('sites', (data) => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = false;
      selectedSites = selectedSites.filter(site => site !== data.sites[index]);
    });
  });
});

// Fonction pour supprimer les sites sélectionnés
document.getElementById('deleteSelectedButton').addEventListener('click', () => {
  chrome.storage.local.get('sites', (data) => {
    let sites = data.sites || [];
    sites = sites.filter(site => !selectedSites.includes(site)); // Exclude selected sites
    chrome.storage.local.set({ sites }, () => {
      selectedSites = []; // Clear the selectedSites array
      loadSites();
      showMessage('Sites sélectionnés supprimés.', 'success');
    });
  });
});

// Fonction pour supprimer un site spécifique
function deleteSite(index) {
  chrome.storage.local.get('sites', (data) => {
    let sites = data.sites || [];
    sites.splice(index, 1);
    chrome.storage.local.set({ sites }, () => {
      loadSites(); // Refresh the site list
      showMessage('Site supprimé.', 'success');
    });
  });
}


