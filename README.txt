Pour le jeu_pacman.js, ce jeu est le premier prototype pr�vu pour fonctionner sur une seule machine,
mais avec la possibilit� de contr�ler plusieurs personnages (au moins 1 pacman et 1 fant�me),
ceci permet de tester le gameplay et les interactions.

Au chargement, la fonction generateMap est appel�e.

Cette fonction prend en argument matriceFruit faite de 0 et de 1. Et cr�e des div sur le DOM.
Cette matrice provient d'un autre programme appel� creationLaby, la variable Lab �tant globale.
chaque div est un carr� de 20x20 px avec des coordonn�es absolues.
chaque div a un id de type a_b ou a,b sont la position correspondante dans la matrice.
chaque div a une classe decor ou fruit qui modifie son affichage.

ensuite on cr�e des personnages � l'aide d'une fonction matricePerso qui est une version modifi�e de matriceFruit.
chaque pacman ou fantome a un num�ro qui sera stock� dans l'id (ex: "pac0", "fant1") et la classe correpsondante.

Il y a plusieurs variables qui suivent une structure similaire :
direction=[[1,2,3],[1,2]];
le premier indice 0 pacman, 1 fantome. Puis le deuxi�me indice pour le i�me pacman ou fantome consid�r�.
ex: direction[0][2] indique que la direction dans laquelle est le troisi�me pacman (celui qui aura une div avec un id "pac2")

Pour chaque joueur, un emplacement est reserv� dans une variable t (pour temps), qui est destin� � recevoir un
setInterval qui rep�te la fonction de d�placement tous les x ms, x �tant d�fini d'apr�s le tableau des vitesses.

La page guette en permanence les �v�nements produits par certaines touches appuy�es afin de changer la direction.

La fonction avancer fonctionne comme ceci :
k et numJ permettent d'identifier l'�l�ment qu'on modifie
les coordonn�es absolues left et bottom sont modifi�es selon la valeur correspondante du tableau de direction
(A ce moment, les coordonn�es ont vari�s mais visuellement pas mise � jour)
puis on lance une fonction de v�rification verifDecor
cette fonction cherche parmi les div celle qui correspond � l'emplacement futur, on regarde ses propri�t�s,
si c'est un �l�ment de d�cor, on fait marche arri�re sur les coordonn�es, ce qui revient � annuler le d�placement,
si c'est un fruit ou un ennemi, on applique les changements correspondants.
La fonction a une structure binaire d'abord et traite les cas selon si c'est un pacman ou un fantome qui fait l'action.

Ce syst�me est fonctionnel, plusieurs joueurs peuvent jouer simultan�ment.
A pr�sent, il faut rajouter un syst�me de communication � distance via websocket.
Le seules instructions possibles pour les utilisateurs sont l'instruction de d�marrer et d'arr�ter  (a et e ou bien echap et space)
(ce qui a pour effet de cr�er ou d'enlever un r�p�teur de d�placement dans le tableau t � la case correspondante)
et les touches directionnelles (z,q,s,d ou les fl�ches) qui modifient le tableau de direction.
Pour le reste tout est calcul� sur la page principale du jeu. Pour les clients distants ils n'ont besoin que d'actualiser l'affichage.

