Pour le jeu_pacman.js, ce jeu est le premier prototype prévu pour fonctionner sur une seule machine,
mais avec la possibilité de contrôler plusieurs personnages (au moins 1 pacman et 1 fantôme),
ceci permet de tester le gameplay et les interactions.

Au chargement, la fonction generateMap est appelée.

Cette fonction prend en argument matriceFruit faite de 0 et de 1. Et crée des div sur le DOM.
Cette matrice provient d'un autre programme appelé creationLaby, la variable Lab étant globale.
chaque div est un carré de 20x20 px avec des coordonnées absolues.
chaque div a un id de type a_b ou a,b sont la position correspondante dans la matrice.
chaque div a une classe decor ou fruit qui modifie son affichage.

ensuite on crée des personnages à l'aide d'une fonction matricePerso qui est une version modifiée de matriceFruit.
chaque pacman ou fantome a un numéro qui sera stocké dans l'id (ex: "pac0", "fant1") et la classe correpsondante.

Il y a plusieurs variables qui suivent une structure similaire :
direction=[[1,2,3],[1,2]];
le premier indice 0 pacman, 1 fantome. Puis le deuxième indice pour le ième pacman ou fantome considéré.
ex: direction[0][2] indique que la direction dans laquelle est le troisième pacman (celui qui aura une div avec un id "pac2")

Pour chaque joueur, un emplacement est reservé dans une variable t (pour temps), qui est destiné à recevoir un
setInterval qui repète la fonction de déplacement tous les x ms, x étant défini d'après le tableau des vitesses.

La page guette en permanence les événements produits par certaines touches appuyées afin de changer la direction.

La fonction avancer fonctionne comme ceci :
k et numJ permettent d'identifier l'élément qu'on modifie
les coordonnées absolues left et bottom sont modifiées selon la valeur correspondante du tableau de direction
(A ce moment, les coordonnées ont variés mais visuellement pas mise à jour)
puis on lance une fonction de vérification verifDecor
cette fonction cherche parmi les div celle qui correspond à l'emplacement futur, on regarde ses propriétés,
si c'est un élément de décor, on fait marche arrière sur les coordonnées, ce qui revient à annuler le déplacement,
si c'est un fruit ou un ennemi, on applique les changements correspondants.
La fonction a une structure binaire d'abord et traite les cas selon si c'est un pacman ou un fantome qui fait l'action.

Ce système est fonctionnel, plusieurs joueurs peuvent jouer simultanément.
A présent, il faut rajouter un système de communication à distance via websocket.
Le seules instructions possibles pour les utilisateurs sont l'instruction de démarrer et d'arrêter  (a et e ou bien echap et space)
(ce qui a pour effet de créer ou d'enlever un répéteur de déplacement dans le tableau t à la case correspondante)
et les touches directionnelles (z,q,s,d ou les flèches) qui modifient le tableau de direction.
Pour le reste tout est calculé sur la page principale du jeu. Pour les clients distants ils n'ont besoin que d'actualiser l'affichage.

