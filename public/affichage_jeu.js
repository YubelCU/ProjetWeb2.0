var direction;
var lenY = 0;
var lenX = 0;
var ws; //websocket
var data; //bonne pratique déclarer les variables en avance (comme en C)
var matriceFruit;

$(document).ready( function(){

  ws =  io(); //crée une nouvelle websocket
  ws.connect(); //connecte au serveur Node
  pas de paramètre indiqués comme le port, ceci sera attribué automatiquement
  //var ws=io.connect("http://localhost:3000");

  console.log("client connecté");

  var paramsString = window.location.search;
  var searchParams = new URLSearchParams(paramsString);
  var perso=searchParams.get("perso");
  var id=searchParams.get("id");
  var color=searchParams.get("color");
  var vitesse=searchParams.get("vitesse");
  //les paramètres choisis sur l'interface sont passés dans l'url lors de la dernière redirection en php
  //afin que le code js puisse l'utiliser

  ws.emit('pacman_message',{ "type":"firstConnection", "perso":perso, "id":id,"color":color});
  //ceci indique une nouvelle connection, ceci créera tout ce qui est nécessaire sur la page prinicpale hébergée
  //sur le serveur à distance, puis celui-ci enverra une réponse qui contiendra tout ce qu'il faut pour l'affichage_jeu

  //lorsque on reçoit un message
  ws.on("pacman_message", function(data){
    switch(data.type)
    {
      case 'genererMap':      //genère la map en utlisant la matrice présente dans le message
          matriceFruit=data.matriceFruit;
          lenY = matriceFruit.length;
          lenX = matriceFruit[0].length;
          generateMap(matriceFruit);
          break;
      case 'updatePosition' :   //modifie la poisiton (left,bottom) d'un des joueurs
          $("#"+data.id).css("left",data.left);
          $("#"+data.id).css("bottom",data.bottom);
          if (data.id[0]=="p"){
            a=lenY-parseInt(data.bottom)/20;
            b=parseInt(data.left)/20;
            if (matriceFruit[a][b]==0){
                matriceFruit[a][b]=-1; //-1 dans la matrice signifie fruit mangé
                $("#"+a+"_"+b).removeClass("fruit");
                //chaque div a un id a_b ou (a,b) correspond à la position correspondante
                //dans la matrice, il y a ainsi équivalence entre le DOM et la matriceFruit
            }
          }

          break;
      case 'addUserDiv' :  //crée un pacman ou un fantome sur l'affichage
          console.log("addUserDiv",data);
          console.log(data.id);
          el = $("<div>");
          if (data.perso == 0) { // 0 pacman, 1 fantome
            el.addClass("pacman");
            el.attr("id", data.id);
            matriceFruit[lenY-2][1] = -1;
            el.css("position", "absolute");
            el.css("left",20);
            el.css("bottom",40);
          } else if (data.perso == 1) {
            el.addClass("fantome");
            el.attr("id", data.id);
            el.css("position", "absolute");
            el.css("left", 20 * (lenX -2) );
            el.css("bottom", 20 * (lenY - 2));
          }
          if(!($("#"+el.attr("id")).length)){ //vérifie si l'élément n'existe pas déjà
            console.log(el);
            $("body").append(el);
          }
          break;
    }
  });

    $(document).keydown( e => {
      if (e.keyCode == 90) {  //haut
        direction=3;
        ws.emit("pacman_message",{'type':'updateDirection','id':id,'direction':direction});
        }
      if (e.keyCode == 81) {  //gauche
        direction=2;
        ws.emit("pacman_message",{'type':'updateDirection','id':id,'direction':direction});
        }
      if (e.keyCode == 83) {  //bas
        direction=1;
        ws.emit("pacman_message",{'type':'updateDirection','id':id,'direction':direction});
        }
      if (e.keyCode == 68) {  //droite
        direction=4;
        ws.emit("pacman_message",{'type':'updateDirection','id':id,'direction':direction});
        }
      // Avec la touche A, démarrer
      if (e.keyCode == 65) {
        ws.emit("pacman_message",{'type':'start','id':id+""});
      }
      // Avec la touche E, s'arrêter
      if (e.keyCode == 69) {  //envoie l'instruction
        ws.emit("pacman_message",{'type':'stop','id':""+id});
       }

     });
  });

function generateMap(matriceFruit){ //cd programme principal
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
