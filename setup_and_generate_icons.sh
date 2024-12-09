#!/bin/bash

# Nom du dossier pour les icônes générées
IMAGES_DIR="images"

# Nom du fichier SVG source
SVG_FILE="icon.svg"

# Vérifier si le fichier SVG existe
if [ ! -f "$SVG_FILE" ]; then
  echo "Erreur : Le fichier SVG ($SVG_FILE) est introuvable."
  exit 1
fi

# Créer un environnement virtuel Python
echo "Création de l'environnement virtuel..."
python3 -m venv venv

# Activer l'environnement virtuel
echo "Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances à partir de requirements.txt
echo "Installation des dépendances..."
pip install -r requirements.txt

# Créer un dossier images si il n'existe pas
if [ ! -d "$IMAGES_DIR" ]; then
  echo "Création du dossier images..."
  mkdir "$IMAGES_DIR"
fi

# Exécuter le script Python pour générer les icônes
echo "Exécution du script Python pour générer les icônes..."
python generate_icons.py

# Déplacer les images générées dans le dossier images
echo "Déplacement des icônes dans le dossier $IMAGES_DIR..."
mv icon16.png "$IMAGES_DIR"/
mv icon48.png "$IMAGES_DIR"/
mv icon128.png "$IMAGES_DIR"/

# Désactiver l'environnement virtuel
deactivate

echo "Processus terminé. Les icônes ont été générées dans le dossier '$IMAGES_DIR'."

