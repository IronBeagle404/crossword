<p align="center">
  <a href="https://ibb.co/hxqVmmRm">
    <img src="https://i.ibb.co/FkPzDDbD/Setting-up-Git-4.png" alt="Setting-up-Git-4">
  </a>
</p>

---

> *****CROSSWORD*** est un résolveur automatique de mots croisés.
Il prend en entrée une grille de chiffres et de points.
Ensuite, le programme analyse et valide la grille,
il trouve tous les emplacements des mots,(horizontaux et verticaux)
et associe à chaque emplacement les mots possibles.
Il utilise un algorithme de backtracking pour essayer les combinaisons
et n’accepte que si et seulement si il trouve une solution unique.  
pour finir : il affiche la grille complétée, ou Error si la grille est impossible ou si la grille a plusieur possibilité.**
---


<p align="center">
  <a href="https://ibb.co/hxqVmmRm">
<a href="https://ibb.co/4gYBqpF2"><img src="https://i.ibb.co/VpQX1TLx/Votre-texte-de-paragraphe-49.png" alt="Votre-texte-de-paragraphe-49" border="0"></a>
  </a>
</p>

## 1. Analyse de la grille

***`parsePuzzle` vérifie :***

- **format et cohérence des lignes**
- **validité des caractères**
- **comptage des starts (0 / 1 / 2)**

## 2. Détection des slots

***`defineWordsData` identifie :***

- **les mots horizontaux valides**
- **les mots verticaux valides**
- **la longueur et les cellules de chaque slot**

## 3. Préparation des mots

***`normalizeWords` :***

- **valide chaque mot**
- **élimine les doublons**
- **garantit un format strict**

***4. Attribution des candidats***

***`defineCandidates` :*** 
- **associe à chaque slot les mots compatible**

## 5. Résolution

***`backtrackSolver` :***

- **remplit les slots récursivement**
- **respecte les contraintes d'intersection**
- **n’utilise chaque mot qu’une seule fois**
- **détecte s’il existe 0, 1 ou plusieurs solutions**

## 6. Sortie

***`printGrid` :***
- **affiche la grille complétée ligne par ligne.**

## Gestion des erreurs

***Le programme renvoie `Error` si :***

- **la grille est invalide**
- **le nombre de mots ne correspond pas au nombre de slots**
- **les mots sont dupliqués ou incorrects**
- **aucune solution n’est trouvée**
- **plusieurs solutions existent**
- **le backtracking dépasse une limite de sécurité**

