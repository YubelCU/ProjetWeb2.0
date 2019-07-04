var x; //positions de l'élément qu'on déplace
var y;
var a; //a ligne, b colonne, indice dans la matrice
var b;
//0 pour pacman, 1 pour fantome, ensuite le numéro du joueur
//ex: direction[0][3] pour le quatrième pacman, ou direction[1][1] pour le deuxième fantome
var t = [[], [], ""]; //amené à contenir un setInterval pour le déplacement de chaque joueur
var vitesse = [[], []];
var direction = [[], []];
var scores = [[], []];

var listUsers = [];//contiendra des tableaux [] pour chaque utilisateur
//la première case sera son id, puis 0 ou 1 selon le type, puis son numéro de joueur
// des paramètres supplémentaires peuvent être ajoutés
var n;  // 0 ou 1 selon l'utilisateur local

var inversion = false; //lorsque le mega fruit est mangé
var nbPacman = 0;
var nbFantome = 0;
var height = $(window).height();
var width = $(window).width();

var matriceFruit = Lab; //variable globale générée par creationLaby.js
var lenY = matriceFruit.length;
var lenX = matriceFruit[0].length; //matrice rectangulaire

var ws = io();  //crée la socket
ws.connect(); //la connecte au serveur
console.log("connecté");

ws.on("pacman_message", function(ob) {
  console.log(ob);
  switch (ob.type) {
    case "firstConnection":
    console.log("firstConnection",ob.id);
      connec(ob); //fonction appelée lors de la réception d'une nouvelle connexion

      ws.emit( //ceci permettra au client de créer le décor et placer les fruits
        "pacman_message", {"type":"genererMap","matriceFruit": matriceFruit}
      );

      for (i=0;i<listUsers.length;i++){ //pour chaque utilisateur, envoie l'instruction nécessaire pour créer
        type="pac";                     //le div au bon endroit (cas de connexion en cours de partie)
        if (listUsers[i][1]==1){
          type="fant";
        }
        el=$("#"+type+listUsers[i][2]);
        ws.emit("pacman_message",{'type':'addUserDiv','perso':listUsers[i][1],'id':el.attr("id"),
        'left':el.css("left"),'bottom':el.css("bottom")});
      }
      break;

    case "updateDirection":
      for (i = 0; i < listUsers.length; i++) {  //trouve l'utilisateur correspondant
        if (listUsers[i][0] == ob.id) {         //met à jour la bonne case direction
          direction[listUsers[i][1]][listUsers[i][2]] = ob.direction;
        }
      }
      break;

    case "start":{
      for (i = 0; i < listUsers.length; i++) {  //trouve l'utilisateur correspondant
        if (listUsers[i][0] == ob.id) {         //créée le répéteur à la bonne case
          type=listUsers[i][1];
          num=listUsers[i][1];
          console.log("START ", type, num);
          t[type][num] = setInterval(function() {
            avancer(type,num);
          }, vitesse[type][num]);;
        }
      }
    }

    case "stop":{                     //trouve l'utilisateur correspondant
      for (i = 0; i < listUsers.length; i++) {  //supprime le répéteur à la bonne case
        if (listUsers[i][0] == ob.id) {
          clearInterval(t[listUsers[i][1]][listUsers[i][2]]);
          t[listUsers[i][1]][listUsers[i][2]]="";
        }
      }
    }
  }
});

$(document).ready(function() {

  matriceFruit = Lab;
  generateMap(matriceFruit); //on crée les div

  var paramsString = window.location.search;
  var searchParams = new URLSearchParams(paramsString);
  var perso=searchParams.get("perso");
  var id=searchParams.get("id");
  var color=searchParams.get("color");
  ob={ "type":"firstConnection", "perso":""+perso, "id":""+id,"color":""+color }
  connec(ob);
  n=listUsers[0][1]; //on récupère toutes les infos de notre utilisateur
  //on crée l'utilisateur correspondant

  $(document).keydown(e => {
    // l'appui d'une touche pour modifier la direction
    //mouvement de pacman
    if (e.keyCode == 90) {
      //haut
      direction[n][0] = 3;
    }
    if (e.keyCode == 81) {
      //gauche
      direction[n][0] = 2;
    }
    if (e.keyCode == 83) {
      //bas
      direction[n][0] = 1;
    }
    if (e.keyCode == 68) {
      //droite
      direction[n][0] = 4;
    }
    // Avec la touche a, on crée un setInterval qui effectue avancer toutes les 100ms.
    if (e.keyCode == 65) {
      if (t[n][0] == "") {
        t[n][0] = setInterval(function() {
          avancer(n, 0);
        }, vitesse[n][0]); //0 pacman, 0 numéro du joueur;
      }
    }
    // Avec la touche e, on supprime tous le répéteur de déplacement
    if (e.keyCode == 69) {
      clearInterval(t[n][0]);
      t[n][0] = "";
    }
  });

  t[2] = setInterval(spawnFruit(), 3000);
});

//*****************************************************************************************//
//*****************************************************************************************//
//*****************************************************************************************//
//*****************************************************************************************//

function connec(ob){  //création et ajout d'un nouvel utilisateur dans les données locales
  if (ob.perso == "pacman") {
    listUsers.push(new Array(ob.id, 0, nbPacman)); //ajout dans la liste, pour permettre de récupérer les infos plus facilement
    direction[0].push(4);
    t[0].push("");
    vitesse[0].push(1000);
    scores[0].push(0);
  } else if (ob.perso == "fantome") {
    listUsers.push(new Array(ob.id, 1, nbFantome));
    direction[1].push(2);
    t[1].push("");
    vitesse[1].push(1000);
    scores[1].push(0);
  }
  addUser(listUsers.length-1,ob.color);

}

function addUser(k, color){ //crée la div pacman ou fantome sur l'écran et transmet l'infos aux clients connectés
  el = $("<div>");
  if (listUsers[k][1] == 0) {
    el.addClass("pacman");
    el.attr("id", "pac" + nbPacman++);
    matriceFruit[lenY-2][1] = -1;
    el.css("position", "absolute");
    el.css("left",20);  //les pacman apparaissent en bas à gauche
    el.css("bottom",40);
    $("body").append(el);
  } else if (listUsers[k][1] == 1) {
    el.addClass("fantome");
    el.attr("id", "fant" + nbFantome++);
    el.css("position", "absolute");
    el.css("left", 20 * (lenX -2) );
    el.css("bottom", 20 * (lenY - 2)); //les pacman apparaissent en haut à droite
    el.css("background-image",getImage(color));
    $("body").append(el);
  }
  ws.emit("pacman_message",{'type':'addUserDiv','perso':listUsers[k][1],'id':el.attr("id"),
  'left':el.css("left"),'bottom':el.css("bottom")});
  //envoie le message pour que les clients puissent aussi créer et afficher le nouveau pacman/fantome
}

function generateMap(matriceFruit) {

  for (i = 0; i < lenY; i++) {
    for (j = 0; j < lenX; j++) {
      el = $("<div>");
      switch (matriceFruit[i][j]) {
        case 1:
          el.addClass("decor");
          break;
        case 0:
          el.addClass("fruit");
          break;
        case 4:
          el.addClass("megaFruit");
          break;
      }
      el.css("position", "absolute"); //la carte est codée en blocs de 20x20px, définis
      el.css("left", 20 * j); //par le coin en bas à gauche (css left et bottom)
      el.css("bottom", 20 * (lenY - i));
      el.attr("id", i + "_" + j);
      $("body").append(el);
    }
  }
}

function verifDecor(k, numJ) {
  //k=0 si pacman, k=1 si fantome
  dir = direction[k][numJ];
  a = lenY - y / 20; //position dans la matrice de la future case
  b = x / 20; //correspondance entre x,y en pixels sur l'écran et a,b dans la matrice
  nextCase = $("#" + a + "_" + b); //on regarde la prochaine case que pacman ou le fantome va voir
  if (nextCase.attr("class") == "decor") {
    //si c'est un mur on annule le déplacement
    switch (dir) {
      case 1:
        y += 20;
        break;
      case 2:
        x += 20;
        break; //on revient en arrière, la variable x ou y a déjà été modifiée
      case 3:
        y -= 20;
        break; // avant l'appel de la fonction, ainsi c'est comme si immobile
      case 4:
        x -= 20;
        break;
    }
  }
  switch (k) {
    case 0: //pacman
      rencontre = false;
      $(".fantome").each(function() {
        if (
          parseInt($(this).css("left")) == x &&
          parseInt($(this).css("bottom")) == y
        ) {
          id = $(this)
            .attr("id")
            .slice(4, $(this).length); //l'id est du genre "fant3", on veut le 3, mais ça peut être "fant12"
          alert("pacman" + numJ + " vient de rencontrer le fantome" + id);
          scores[1][id]++;
          rencontre = true;
        }
      });
      if (!rencontre) {
        // il n'y a pas de fantome sur la case d'après
        switch (nextCase.attr("class")) {
          case "fruit":
            matriceFruit[a][b] = -1; //le fruit a été mangé
            scores[0][numJ]++; //on augmente le score du pacman qui a mangé le fruit;
            nextCase.removeClass("fruit");
            break;
          case "megaFruit":
            matriceFruit[a][b] = -1; //le fruit a été mangé et
            scores[0][numJ]++;
            // les pacmans chassent maintenant les fantômes
            inversion = true;
            window.setTimeOut(function() {
              inversion = false;
            }, 10000);
            break;
        }
      }
      break;

    case 1: //fantome
      rencontre = false;
      $(".pacman").each(function() {
        if (
          parseInt($(this).css("left")) == x &&
          parseInt($(this).css("bottom")) == y
        ) {
          id = $(this)
            .attr("id")
            .slice(3, $(this).length); //l'id est du genre "pac3", on veut le 3, mais ça peut être "pac12"
          alert("fantome" + numJ + " vient de rencontrer le pacman" + id);
          scores[1][numJ]++; //on augmente le score du joueur qui vient de manger un pacman
          rencontre = true;
        }
      });
      break;
  }
}
//même fonction appelée pour chaque déplacment
function avancer(k, numJ) {
  //k=0 pacman en cours de déplacement, k=1 fantome
  //on pourra par la suite rajouter un autre paramètre, le numéro du joueur
  dir = direction[k][numJ];
  switch (k) {
    case 0:
      pac = $("#pac" + numJ); //l'objet div qui va se déplacer

      x = parseInt(pac.css("left"));
      y = parseInt(pac.css("bottom"));

      switch (
        dir // fait avancer de 20px selon direction
      ) {
        case 1:
          y -= 20; //bas
          verifDecor(k, numJ);
          if (y < 0) {
            y = height - (height % 20) - 20;
          } //ressort en haut
          pac.css("bottom", y + "px");
          pac.attr("class", "pacman" + " bas");
          break;
        case 2:
          x -= 20; //gauche
          verifDecor(k, numJ);
          if (x < 0) {
            x = width - (width % 20) - 20;
          } //ressort à droite, coordonnées multiples de 20
          pac.css("left", x + "px");
          pac.attr("class", "pacman" + " gauche");
          break;
        case 3:
          y += 20; //haut
          verifDecor(k, numJ);
          if (y > height) {
            y = 20;
          } //ressort en bas
          pac.css("bottom", y + "px");
          pac.attr("class", "pacman" + " haut");
          break;
        case 4:
          x += 20; //droite
          verifDecor(k, numJ);
          if (x > width) {
            x = 20;
          } //ressort à gauche
          pac.css("left", x + "px");
          pac.attr("class", "pacman" + " droite");
          break;
      }
      ws.emit(
        "pacman_message",
        {'type':'updatePosition','id':'pac'+ numJ,
        'left':pac.css("left"),
        'bottom':pac.css("bottom")}
      );
      break;

    case 1:
      fant = $("#fant" + numJ); //l'objet div qui va se déplacer

      x = parseInt(fant.css("left"));
      y = parseInt(fant.css("bottom"));

      switch (
        dir // fait avancer de 20px selon direction
      ) {
        case 1:
          y -= 20; //bas
          verifDecor(k, numJ);
          if (y < 0) {
            y = height - (height % 20) - 20;
          } //ressort en haut
          fant.css("bottom", y + "px");
          fant.attr("class", "fantome" + " bas");
          break;
        case 2:
          x -= 20; //gauche
          verifDecor(k, numJ);
          if (x < 0) {
            x = width - (width % 20) - 20;
          } //ressort à droite, coordonnées multiples de 20
          fant.css("left", x + "px");
          fant.attr("class", "fantome" + " gauche");
          break;
        case 3:
          y += 20; //haut
          verifDecor(k, numJ);
          if (y > height) {
            y = 20;
          } //ressort en bas
          fant.css("bottom", y + "px");
          fant.attr("class", "fantome" + " haut");
          break;
        case 4:
          x += 20; //droite
          verifDecor(k, numJ);
          if (x > width) {
            x = 20;
          } //ressort à gauche
          fant.css("left", x + "px");
          fant.attr("class", "fantome" + " droite");
          break;
      }


      ws.emit(  //à chaque déplacement, on transmet aux clients conenctés l'information finale que tel div s'est déplacée
        "pacman_message",
        {'type':'updatePosition','id':'fant'+ numJ,
        'left':fant.css("left"),
        'bottom':fant.css("bottom")}
      );
      break;
  }
}

//réapparition
function spawnFruit() {
  rand1 = getRandomInt(lenX);
  rand2 = getRandomInt(lenY);
  if (matriceFruit[rand2][rand1] == -1) {
    matriceFruit[rand2][rand1] = 0;
    $("#" + rand1 + "_" + rand2).addClass("fruit");
  }
}

//permet d'associer le choix de couleur à une image différente
function getImage(color){
  /*switch(color){
    case "":
      return("url('')");
      break;
  }*/
  return("url('fantome.png')");
}
