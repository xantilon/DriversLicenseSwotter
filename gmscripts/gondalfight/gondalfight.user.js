// ==UserScript==
// @name           gondal.fight
// @author         PP2000
// @version        0.3b
// @license        GPL version 3 or any later version (http://www.gnu.org/copyleft/gpl.html)
// @include        http://w1.gondal.de/*
// @include        http://w2.gondal.de/*
// @include        http://www.gondal-de.de/*
// @description    Dieses Skript ist in der Lage die Arenakämpfe bei Gondal vollständig zu übernehmen, insofern gewünscht.
// @description    Für eventuelle negative Folgen der Nutzung dieses Skripts übernehme ich keinerlei Verantwortung. 
// ==/UserScript==

// Für diese Script benötigen Sie Firefox 3.x und Greasemonkey https://addons.mozilla.org/de/firefox/addon/748

// Anzugreifender Gegner
var GegnerFerono = ""; 
var GegnerThur   = "";
var GegnerVenja  = "";


//////////////////////////////////////
// Ab hier bitte nichts mehr ändern //
//////////////////////////////////////

// Zeitrandomisierungsfunktion
function Randomize( from, to) {
  // Zeitrückgabe .. in Millisekunden
  return( from + parseInt( Math.random() * (to - from + 1)));
}

// Weiterleitung auf die nächste Seite
function SeitenRedirect(redir_to) {
  window.setTimeout('window.location.pathname = "' + redir_to + '"', Randomize(1000,5000));
}

// Weiterleiten auf die Gegenersuche, wenn Gondalsweiterleitung nicht funktioniert oder stecken bleibt
function KampfRedirect(time) {
  window.setTimeout('window.location.pathname = "/fights/start"',time);
}

// Differenzieren bei result
if(window.location.pathname.split("/")[2] == "results") {
  var pathname = "/fights/results";
} else {
  var pathname = window.location.pathname;
}

// Unterschiedliche Handlungen bei unterschiedlichen Seiten 
switch(pathname) {
  case "/fights/start":
    //alert ("Hier Suche ich den Gegner");
    var Gegner = document.getElementsByName("data[Character][name]")[0].value;
    if(Gegner!="") {
        // Ziel gegner auslesen
        var gegnerZiel = document.getElementsByName("data[Character][name]")[0].value;
        // Schleife ueber ergebnisliste
        for(var x = 0;x<35;x++) {
          var gegnerName = document.getElementById("search").getElementsByTagName("a")[x].innerHTML;
          if(gegnerZiel==gegnerName) {
            // nur wenn der Zielgegen dem Eintrag entspricht angreifen!
            x++;      
            var Gegnerlink = document.getElementById("search").getElementsByTagName("a")[x].pathname;
            SeitenRedirect(Gegnerlink);
          }         
          x++;
        } 
    } else {   
      switch(document.location.hostname) {
        case "www.gondal-de.de":
          document.getElementsByName("data[Character][name]")[0].value = GegnerThur ;
          break;
        case "w1.gondal.de":
          document.getElementsByName("data[Character][name]")[0].value = GegnerFerono;
          break;
        case "w2.gondal.de":
          document.getElementsByName("data[Character][name]")[0].value = GegnerVenja ;
          break;
      } 
      if(document.getElementsByName("data[Character][name]")[0].value!="") {
        window.setTimeout('document.getElementsByTagName("form")[1].submit()',Randomize(3000,5000));
      } 
    }
    break;
  // Seite: Character Gefunden
  case "/fights/searchCharacter":
    SeitenRedirect(document.getElementsByTagName("a")[1].pathname);
    break;
  // Seite des Kampfes
  case "/fights/fight":
    SeitenRedirect(document.getElementById("fighttostats").innerHTML.split('"')[1]);
    break;
  // Seite des Ergebnisses
  case "/fights/results":  
    SeitenRedirect("/fights/start");
    break;
  // Seite auf nächsten Kampf warten
  case "/fights/waitFight":
    //start_timer('remaining', 200, 'location.href = "/fights/start";', 0, 1);
    // Quelltext einlesen in dem 'Wartezeit zum Kampf steht ..'
    var dsrc = document.getElementById("wrapper").innerHTML;
    // String 'remaining' suchen, position bestimmen, "," nach der Wartezeit (in sek) suchen,
    // auslesen, und auf die Seite /fights/start weiterleiten, + 2 sek, sobald die Wartezeit vorbei ist
    // Diese Routine dient lediglich dazu, sollte mal das weiterleiten seitens Gondal stecken, was vorkommen kann.
    var posStart = dsrc.indexOf("'remaining'") + 13;
    var posEnd = dsrc.indexOf(",",posStart)
    var tmleft = dsrc.substr(posStart, posEnd - posStart);
    tmleft = parseInt(tmleft) * 1000 + 2000;
    KampfRedirect(tmleft);
    break;
}