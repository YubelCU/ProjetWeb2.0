var x;  //positions de l'élément qu'on déplace
var y;
var a;  //a ligne, b colonne, indice dans la matrice
var b;
//0 pour pacman, 1 pour fantome, ensuite le numéro du joueur
//ex: direction[0][3] pour le quatrième pacman, ou direction[1][1] pour le deuxième fantome
var t=[[""],["",""]]; //amené à contenir un setInterval pour le déplacement de chaque joueur
var vitesse=[[300],[200,200]];
var direction=[[4],[1,1]];
var inversion=false;  //lorsque le mega fruit est mangé
var scorePacman=[0];
var scoreFantome=[0,0];
var nbPacman=0; //sera incrémenté lorsque les joueurs seront créés et placés
var nbFantome=0;
height=$(window).height(); //taille disponible dans le navigateur
width=$(window).width();
var matriceFruit=Lab; //variable globale issu du script creationLaby.js chargé avant celui-ci dans le html
/*
[
[1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,1],    //1 pour le mur, 0 pour fruit, 4 megaFruit
[1,0,1,1,0,1,1,1,0,1],
[1,0,1,0,0,0,0,0,0,1],
[1,0,1,0,1,1,1,1,0,1],
[1,0,1,0,0,0,0,1,0,1],
[1,0,1,0,1,1,0,0,0,1],
[1,0,1,0,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1]];
*/

var len=matriceFruit.length;   //pour raccourcir
var matricePerso=matriceFruit;  //sert juste à définir les positions initiales des pacmans et fantomes
matricePerso[1][len-2]=3;       //2 pour pacman, 3 pour fantome, les div seront crées lors de
matricePerso[len-2][1]=2;       //generateMap puis bougeront de façon dynamique
matricePerso[1][len-3]=3;
                                             // matricePerso ne sert qu'au début

function generateMap(matriceFruit,matricePerso){
  for (i=0;i<matricePerso.length;i++){
    for (j=0;j<matricePerso.length;j++){
      el=$("<div>");  //on crée un élément, on lui ajoute les propriétés correspondantes à la case i,j de la matrice puis on l'ajoute au DOM
      if(matricePerso[i][j]==2){
          el.addClass("pacman");
          el.attr("id","pac"+nbPacman++);
          matriceFruit[i][j]=-1;
          el.css("position","absolute");  //la carte est codée en blocs de 20x20px, définis
          el.css("left",20*(j));          //par le coin en bas à gauche (css left et bottom)
          el.css("bottom",20*(len-i));
          $("body").append(el);
        } else if (matricePerso[i][j]==3) {
          el.addClass("fantome");
          el.attr("id","fant"+nbFantome++);
          el.css("position","absolute");  //la carte est codée en blocs de 20x20px, définis
          el.css("left",20*(j));          //par le coin en bas à gauche (css left et bottom)
          el.css("bottom",20*(len-i));
          $("body").append(el);
        }
      }
    }

  for (i=0;i<matriceFruit.length;i++){
    for (j=0;j<matriceFruit[0].length;j++){
      el=$("<div>");
      switch(matriceFruit[i][j]){
        case 1 :
          el.addClass("decor");  break;
        case 0 :
          el.addClass("fruit");  break;
        case 4 :
          el.addClass("megaFruit"); break;
      }
      el.css("position","absolute");  //la carte est codée en blocs de 20x20px, définis
      el.css("left",20*(j));          //par le coin en bas à gauche (css left et bottom)
      el.css("bottom",20*(len-i));
      el.attr("id",i+"_"+j);
      $("body").append(el);
    }
  }
  for (i=0;i<nbPacman;i++){

  }
}

$(document).on("load",generateMap(matriceFruit,matricePerso));

$(document).ready(function(){

$(document).keydown( e => {   // l'appui d'une touche pour modifier la direction
  //mouvement de pacman
    if (e.keyCode == 90) {  //haut
      direction[0][0]=3;
      }
    if (e.keyCode == 81) {  //gauche
      direction[0][0]=2;
      }
    if (e.keyCode == 83) {  //bas
      direction[0][0]=1;
      }
    if (e.keyCode == 68) {  //droite
      direction[0][0]=4;
      }
    // Avec la touche a, on crée un setInterval qui effectue avancer toutes les x ms, selon la vitesse.
    if (e.keyCode == 65) {
      if (t[0][0]==""){
        t[0][0]=setInterval(function(){avancer(0,0)},vitesse[0][0]); //0 pacman, 0 numéro du joueur;
       }
     }
  // Avec la touche e, on supprime tous le répéteur de déplacement
   if (e.keyCode == 69) {
     clearInterval(t[0][0]);
     t[0][0]="";
    }




    //mouvements du fantôme :
    if (e.keyCode == 38) {  //haut
      direction[1][0]=3;
      }
    if (e.keyCode == 37) {  //gauche
      direction[1][0]=2;
      }
    if (e.keyCode == 40) {  //bas
      direction[1][0]=1;
      }
    if (e.keyCode == 39) {  //droite
      direction[1][0]=4;
      }
    // Avec la touche right shift, on crée un setInterval qui effectue avancer toutes les 100ms.
    if (e.keyCode == 16) {
      if (t[1][0]==""){
        t[1][0]=setInterval(function(){avancer(1,0)},vitesse[1][0]); //1 fantome, 0 numéro du joueur;
       }
     }
    // Avec la touche 1 du numpad droit, on supprime tous le répéteur de déplacement
    if (e.keyCode == 97) {
     clearInterval(t[1][0]);
     t[1][0]="";
    }


  });



                                //même fonction appelée pour chaque déplacment
  function avancer(k,numJ){     //k=0 pacman en cours de déplacement, k=1 fantome
                                // numJ, le numéro du joueur
    dir=direction[k][numJ];
    switch(k){

      case 0 :
        pac=$("#pac"+numJ); //l'objet div qui va se déplacer

        x=parseInt(pac.css("left")); //coordonnées
        y=parseInt(pac.css("bottom"));

        switch (dir) {   // fait avancer de 20px selon direction
          case 1: y-=20;    //bas
            verifDecor(k,numJ);
            if (y<0) {y=height-(height%20)-20;} //ressort en haut
            pac.css("bottom",y+"px");
            pac.attr('class',"pacman"+' bas');
            break;
          case 2:
            x-=20;   //gauche
            verifDecor(k,numJ);
            if (x<0) {x=width-(width%20)-20;}  //ressort à droite, coordonnées multiples de 20
            pac.css("left",x+"px");
            pac.attr('class',"pacman"+' gauche');
            break;
          case 3:
            y+=20;    //haut
            verifDecor(k,numJ);
            if (y>height) {y=20;}  //ressort en bas
            pac.css("bottom",y+"px");
            pac.attr('class',"pacman"+' haut');
            break;
          case 4:
            x+=20;    //droite
            verifDecor(k,numJ);
            if (x>width) {x=20;} //ressort à gauche
            pac.css("left",x+"px");
            pac.attr('class',"pacman"+' droite');
            break;

        } break;

      case 1 :
        fant=$("#fant"+numJ); //l'objet div qui va se déplacer
        console.log(fant);

        x=parseInt(fant.css("left"));
        y=parseInt(fant.css("bottom"));

        switch (dir) {   // fait avancer de 20px selon direction
          case 1: y-=20;    //bas
            verifDecor(k,numJ);
            if (y<0) {y=height-(height%20)-20;} //ressort en haut
            fant.css("bottom",y+"px");
            fant.attr('class',"fantome"+' bas');
            break;
          case 2:
            x-=20;   //gauche
            verifDecor(k,numJ);
            if (x<0) {x=width-(width%20)-20;}  //ressort à droite, coordonnées multiples de 20
            fant.css("left",x+"px");
            fant.attr('class',"fantome"+' gauche');
            break;
          case 3:
            y+=20;    //haut
            verifDecor(k,numJ);
            if (y>height) {y=20;}  //ressort en bas
            fant.css("bottom",y+"px");
            fant.attr('class',"fantome"+' haut');
            break;
          case 4:
            x+=20;    //droite
            verifDecor(k,numJ);
            if (x>width) {x=20;} //ressort à gauche
            fant.css("left",x+"px");
            fant.attr('class',"fantome"+' droite');
            break;
        }
        break;
    }
  }

  //on effectue les vérifications avant de se déplacer au cas où c'est un décor
  // mais on traite aussi ici les autres cas (fruits, joueur ennemi)...
  function verifDecor(k,numJ){   //k=0 si pacman, k=1 si fantome
    dir=direction[k][numJ];
    a=(len-y/20); //position dans la matrice de la future case
    b=(x/20);     //correspondance entre x,y en pixels sur l'écran et a,b dans la matrice
    nextCase=$("#"+a+"_"+b); //on regarde la prochaine case que pacman ou le fantome va voir
    if (nextCase.attr("class")=="decor"){  //si c'est un mur on annule le déplacement
      switch(dir){
        case 1:y+=20;break;
        case 2:x+=20;break; //on revient en arrière, la variable x ou y a déjà été modifiée
        case 3:y-=20;break; // avant l'appel de la fonction, ainsi c'est comme si immobile
        case 4:x-=20;break;
      }
    }
    switch (k) {
      case 0: //pacman
        rencontre=false;
        $(".fantome").each(function(){
          if((parseInt($(this).css("left"))==x)&&(parseInt($(this).css("bottom"))==y)){
            id=$(this).attr("id").slice(4,$(this).length); //l'id est du genre "fant3", on veut le 3, mais ça peut être "fant12"
            alert("pacman"+numJ+" vient de rencontrer le fantome"+id);
            scoreFantome[id]++;
            rencontre=true;
            }
          });
          if(!rencontre){     // il n'y a pas de fantome sur la case d'après
            switch(nextCase.attr("class")){
              case "fruit" :
                matriceFruit[a][b]=-1; //le fruit a été mangé
                scorePacman[numJ]++;   //on augmente le score du pacman qui a mangé le fruit;
                nextCase.removeClass("fruit"); break;
              case "megaFruit" :
                matriceFruit[a][b]=-1; //le fruit a été mangé et
                scorePacman[numJ]++;
                // les pacmans chassent maintenant les fantômes
                inversion=true; window.setTimeOut(function(){inversion=false;},10000)
               break;
            }
        } break;

      case 1:  //fantome
        rencontre=false;
        $(".pacman").each(function(){
          if((parseInt($(this).css("left"))==x)&&(parseInt($(this).css("bottom"))==y)){
            id=$(this).attr("id").slice(3,$(this).length);   //l'id est du genre "pac3", on veut le 3, mais ça peut être "pac12"
            alert("fantome"+numJ+" vient de rencontrer le pacman"+id);
            scoreFantome[numJ]++; //on augmente le score du joueur qui vient de manger un pacman
            rencontre=true;
          }
        });
        break;
      }
  }


});
