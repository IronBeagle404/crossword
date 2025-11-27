<p align="center">
  <a href="https://ibb.co/hxqVmmRm">
    <img src="https://i.ibb.co/FkPzDDbD/Setting-up-Git-4.png" alt="Setting-up-Git-4">
  </a>
</p>

---
<div align="center" style="
  border: 2px solid hsla(210, 49%, 50%, 0.57);
  border-radius: 12px;
  padding: 12px 18px;
  width: fit-content;
  margin: auto;
">
  
<p align="center">
<strong>CROSSWORD</strong> est un résolveur automatique de mots croisés.
Il prend en entrée une grille de chiffres et de points.
Ensuite, le programme analyse et valide la grille,
il trouve tous les emplacements des mots,(horizontaux et verticaux)
et associe à chaque emplacement les mots possibles.
Il utilise un algorithme de backtracking pour essayer les combinaisons
et n’accepte que si et seulement si il trouve une solution unique.  
pour finir : il affiche la grille complétée, ou Error si la grille est impossible ou si la grille a plusieur possibilité.
</p>
</div>

---



<p align="center">
  <a href="https://ibb.co/hxqVmmRm">
<a href="https://ibb.co/202Mz45T"><img src="https://i.ibb.co/hx5dGzCS/Votre-texte-de-paragraphe-59.png" alt="Votre-texte-de-paragraphe-59" border="0"></a>
  </a>
</p>

<div align="center" style="
  border: 2px solid hsla(210, 49%, 50%, 0.57);
  border-radius: 12px;
  padding: 12px 18px;
  width: fit-content;
  margin: auto;
">

<pre style="
  margin: 0;
  font-family: Consolas, monospace;
  text-align: left;
">
/crossword
  │─ solver.js
  │─ README.md
</pre>

</div>


---
<p align="center">
  <a href="https://ibb.co/hxqVmmRm">
<a href="https://ibb.co/qLr00CSD"><img src="https://i.ibb.co/8n7zzbCm/Votre-texte-de-paragraphe-60.png" alt="Votre-texte-de-paragraphe-60" border="0"></a>
  </a>
</p>

<p align="center">
<strong>Parsing strict de la grille (format ., 0, 1, 2)
</p>
<p align="center">
Détection automatique des mots horizontaux et verticaux
<p align="center">
Vérification de cohérence entre slots et mots fournis
<p align="center">
Backtracking optimisé avec détection de solutions multiples
<p align="center">
Normalisation et validation des mots
<p align="center">
Affichage propre de la grille résolue
</p>
<p align="center">
Gestion explicite des erreurs (input invalide, multi-solutions, etc.)
</p>

---

<p align="center">
<a href="https://ibb.co/b5q1fxqR"><img src="https://i.ibb.co/60VYd2VJ/Votre-texte-de-paragraphe-62.png" alt="Votre-texte-de-paragraphe-62" border="0"></a>
  </a>
</p>

<div align="center" style="
  border: 2px solid hsla(210, 59%, 54%, 0.00);
  border-radius: 12px;
  padding: 12px 18px;
  width: fit-content;
  margin: auto;
">

## Définir le puzzle

***Le puzzle est une chaîne multilignes où :***

***``.`` représente une case bloquée***

***``0`` une case remplissable****

***``1`` une case qui doit être le début d’un mot***

***``2`` une case qui doit être le début de deux mots (horizontal + vertical)***

```
const puzzle = `2001
0..0
1000
0..0`;
```
## Fournir la liste de mots

***Chaque mot doit être unique et correspondre à la longueur d’un slot détecté dans la grille.***

```
const words = ['casa', 'alan', 'ciao', 'anta'];
```

## Run crossword

```
crosswordSolver(puzzle, words);
```

## Résultat attendu
***Si une seule solution existe, elle est affichée dans la console :***

```
casa
a..l
ciao
a..n
```

***Si le puzzle est invalide, ou s'il existe 0 ou plusieurs solutions,***
***le programme affiche :***
``Error``
</div>

---
<p align="center">
  <a href="https://ibb.co/hxqVmmRm">
<a href="https://ibb.co/4gYBqpF2"><img src="https://i.ibb.co/VpQX1TLx/Votre-texte-de-paragraphe-49.png" alt="Votre-texte-de-paragraphe-49" border="0"></a>
  </a>
</p>

<div align="center" style="
  border: 2px solid hsla(210, 59%, 54%, 0.00);
  border-radius: 12px;
  padding: 12px 18px;
  width: fit-content;
  margin: auto;
">

## 1. Analyse de la grille

***`parsePuzzle` vérifie :***

**format et cohérence des lignes**
**validité des caractères**
**comptage des starts (0 / 1 / 2)**

## 2. Détection des slots

***`defineWordsData` identifie :***

**les mots horizontaux valides**
**les mots verticaux valides**
**la longueur et les cellules de chaque slot**

## 3. Préparation des mots

***`normalizeWords` :***

**valide chaque mot**
**élimine les doublons**
**garantit un format strict**

***4. Attribution des candidats***

***`defineCandidates` :*** 
**associe à chaque slot les mots compatible**

## 5. Résolution

***`backtrackSolver` :***

**remplit les slots récursivement**
**respecte les contraintes d'intersection**
**n’utilise chaque mot qu’une seule fois**
**détecte s’il existe 0, 1 ou plusieurs solutions**

## 6. Sortie

***`printGrid` :***
**affiche la grille complétée ligne par ligne.**

## Gestion des erreurs

***Le programme renvoie `Error` si :***

**la grille est invalide**
**le nombre de mots ne correspond pas au nombre de slots**
**les mots sont dupliqués ou incorrects**
**aucune solution n’est trouvée**
**plusieurs solutions existent**
**le backtracking dépasse une limite de sécurité**
</div>