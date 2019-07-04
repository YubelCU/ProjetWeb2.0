//------------INITALISATION DES VARIABLES GLOBALES-----------
var cL_pile = []; 		//cL_pile utilisée pour la création du labyrinthe parfait
var cL_impasse = [];	//cL_impasses liste de toutes les cL_impasses crées avec la création du labyrinthe parfait
var Lab;				//Matrice représentant le labyrinthe en cours de création
var iscL_impasse; 		//variable interédiaire utilisé pour voir si on est sur une cL_impasse ou non
var cL_tpsBoucle = 5; 	//Influe sur la vitesse d'éxécution du programme.
						// Attention, si c'est trop petit et que l'ordi n'est pas assez performant,
						// je pense qu'il y a possibilité de crash

/*Fonctionnement de la matrice (pas d'importance si on ne veut pas modifier le code)
0: espace
1: mur
(0,0) : case en haut à gauche
  (0,0)
	V
	11111111 |
	10000001 |
	10101011 | Y croissant
	10101001 |
	10101011 |
	11111111 V
	------->
	X croissant

*/



//------------------FONCTION PRINCIPALE------------------
function createLab(largeur, hauteur){
	/*
	Fonction créant un labyrinthe adapté au jeu PacMan

	Entrée :
	- hauteur : int
		hauteur du labyrinthe final
	-largeur : int
		largeur du labyrinthe final

	Sortie :
	- Lab : Matrice d'int
		Matrice représentant le labyrinthe : 0 représente un espace et 1, un mur
	*/

	//------------INITALISATION DES VARIABLES-----------
	//Initialisation du labyrinthe
	Lab = new Array();

	for(var i=0; i<largeur; i++)
		Lab[i] = new Array();

	for(var i=0; i<largeur; i++)
		for(var j=0; j<hauteur; j++)
			Lab[i][j] = 1;



	//----------CREATION DU LABYRINTHE EN TACHE DE FOND----------

	//On définit notre point de départ en haut à gauche de notre labyrinthe
	var depart = [1,1];
	Lab[depart[0]][depart[1]] = 0;
	cL_pile.push(depart);

	//Création du labytrinthe vià une "boucle"
	iscL_impasse = 1;
	while (pacLab,cL_pile.length || cL_impasse.length) {
		pacLab(largeur, hauteur);
	}



}



//-------------------FONCTIONS ANNEXES-------------------------

function getRandomInt(max) {
	//Retourne un entier entre 0 et max(exclus)
    return Math.floor(Math.random() * Math.floor(max));
}

function boucle(iPeriode,fnCbTraitement,condition,largeur,hauteur) {
	// Objectif : déclencher un appel à la fonction fnCbTraitement toutes les iPeriode secondes, tant que condition	est VRAIE
	if (condition){
		fnCbTraitement(largeur,hauteur);
		setTimeout(function(){ boucle(iPeriode,fnCbTraitement,cL_pile.length || cL_impasse.length,largeur,hauteur) },iPeriode);
	}
}


function pacLab(largeur,hauteur){


	//-----PREMIERE ETAPE : On construit le labyrithe parfait----
	if(cL_pile.length){

		//On enregistre la position actuellemnt traité
		var posX = cL_pile[cL_pile.length-1][0];
		var posY = cL_pile[cL_pile.length-1][1];


		//On regarde quelles sont les directions possibles pour la prochaine avancée du labyrinthe
        var possibleDirections = "";
        if(posX + 2 > 0 && posX + 2 < largeur - 1 && Lab[posX + 2][posY] == 1){
            possibleDirections += "E";
        }
        if(posX - 2 > 0 && posX - 2 < largeur - 1 && Lab[posX - 2][posY] == 1){
            possibleDirections += "O";
        }
        if(posY - 2 > 0 && posY - 2 < hauteur - 1 && Lab[posX][posY - 2] == 1){
            possibleDirections += "N";
        }
        if(posY + 2 > 0 && posY + 2 < hauteur - 1 && Lab[posX][posY + 2] == 1){
            possibleDirections += "S";
        }

		//Si il y des directions possibles on poursuit le labytinthe en choisissant une direction au hazard
        if(possibleDirections){
            switch (possibleDirections[getRandomInt(possibleDirections.length)]){
                case "O":
                    Lab[posX - 2][posY] = 0;
                    Lab[posX - 1][posY] = 0;
                    cL_pile.push([posX - 2, posY]);
                    break;
                case "E":
                    Lab[posX + 2][posY] = 0;
                    Lab[posX + 1][posY] = 0;
                    cL_pile.push([posX + 2, posY]);
					break;
                case "N":
                    Lab[posX][posY - 2] = 0;
                    Lab[posX][posY - 1] = 0;
                    cL_pile.push([posX, posY - 2]);
                    break;
                case "S":
                    Lab[posX][posY + 2]=0;
                    Lab[posX][posY + 1]=0;
                    cL_pile.push([posX, posY + 2]);
                    break;
            }
			iscL_impasse=1;
		}

		//Sinon on remonte le chemin pour le continuer autre part
		//et on enregistre les cL_impasses (dans le but de les enlever)
		//C'est une cL_impasse si il n'y a plus de chemin possible et qu'une seule "case" qui y mène
		else {
			if (iscL_impasse){
				cL_impasse.push(cL_pile.pop());
				iscL_impasse=0;
			}
			else
				cL_pile.pop();
		}

		//Cas particulier : le point de départ est une cL_impasse
		if(!cL_pile.length && Lab[1][2]+Lab[2][1] == 1){
			cL_impasse.push([1,1]);
		}

	}


	//--------DEUXIEME ETAPE : Sypprimer les cL_impasses--------
	else if (cL_impasse.length){
		//On récupère la position de la dernière cL_impasse à traiter
		//Et on l'enlève de la liste des imppasses
		var positionImp = cL_impasse.pop();
		var posX = positionImp[0];
		var posY = positionImp[1];

		//On regarde quelles sont les directions possibles pour "couper" les cL_impasses (où il y a un mur)
		var possibleDirection = "";
		if(posX + 2 > 0 && posX + 2 < largeur - 1 && Lab[posX + 1][posY] == 1){
			possibleDirection += "E";
		}
		if(posX - 2> 0 && posX - 2 < largeur - 1 && Lab[posX - 1][posY] == 1){
			possibleDirection += "O";
		}
		if(posY - 2 > 0 && posY - 2 < hauteur - 1 && Lab[posX][posY - 1] == 1){
			possibleDirection += "N";
		}
		if(posY + 2 > 0 && posY + 2 < hauteur - 1 && Lab[posX][posY + 1] == 1){
			possibleDirection += "S";
		}
		//On chosit aléatoirement une direction parmis celles disponibles
		switch (possibleDirection[getRandomInt(possibleDirection.length)]){
			case "O":
				Lab[posX - 1][posY] = 0;
				break;
			case "E":
				Lab[posX + 1][posY] = 0;
				break;
			case "N":
				Lab[posX][posY - 1] = 0;
				break;
			case "S":
				Lab[posX][posY + 1]=0;
				break;
		}

	}

}

console.log("créationLaby a bien été importé");


var hauteur=Math.trunc($(window).height()/20)-1;
var largeur=Math.trunc($(window).width()/20);
console.log(hauteur,largeur);
createLab(hauteur, largeur);
