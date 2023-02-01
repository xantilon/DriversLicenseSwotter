// ==UserScript==
// @name           ArenameisterEddy
// @author         Bouvere
// @version        1.2.8
// @license        GPL version 3 or any later version (http://www.gnu.org/copyleft/gpl.html)
// @include        http://*gondal*.de/*
// @include        http://*artyria.com/*
// @include        http://*artyria.de/*
// @include        http://*last-emperor.de/*
// @include        http://*lastemperor.de/*
// @description    Dieses Skript ist in der Lage die Arenakämpfe bei Gondal, Artyria und Last Emperor vollständig zu übernehmen, insofern gewünscht. Für eventuelle negative Folgen der Nutzung dieses Skripts übernehme ich keinerlei Verantwortung.
// @unwrap
// ==/UserScript==
unsafeWindow.Eddy = this;

////////////////////////////////////////////////
// Alle nötigen Einstellungen können über die //
// Benutzerskript-Befehle vorgenommen werden. //
// (Rechtsklick auf das Greasemonkey Symbol)  //
////////////////////////////////////////////////

//Voreinstellungen für die verschiedenen Seiten
//Die Array Elemente sind wie folgt belegt:
// 0: ID des Spiels
// 1: Anzahl der Gegner auf der Arenaseite
// 2: Gibt an der wievielte Link auf der Arenaseite der erste "Angreifen" Link ist
// 3: Gibt an in der wievielten Tabellenzelle der Arenaseite die Ehre des ersten Gegners steht
// 4: Anzahl Tabellenzellen zwischen je zwei Ehrewerten der Gegner
// 5: Gibt an im wievielten "span" Element der Ergebnisseite der Name des Gegners steht
// 6: Gibt an in welcher Tabellenzelle die Beschriftung der "Gilden Ehrenpunkte" Spalte stehen könnte
// 7-12: Unterschiede in den Bezeichnungen, abhängig von der jeweiligen Seite 
// 13: Name des Select Elements mit dem man das Level des gesuchten Gegners festlegt
	if (window.location.hostname.search(/w1.gondal/) >= 0) {
		var Diff = new Array(0,17,17,48,5,4,72,'Gilden Ehrenpunkte','Machtkristalle','Stärke','Intelligenz','Geschicklichkeit','Ausdauer','searchLevel');
	} else if (window.location.hostname.search(/artyria/) >= 0) {
		var Diff = new Array(1,12,6,11,4,9,45,'Legion&nbsp;Ehre','Aureus','Schlagkraft','Scharfsinn','Konzentration','Gesundheit','selectLevel');
	} else if ((window.location.hostname.search(/w2.last-emperor/) >= 0) || (window.location.hostname.search(/w2.lastemperor/) >= 0)) {
		var Diff = new Array(5,12,16,7,4,3,32,'Clan Ehrenpunkte','Edelsteine','Stärke','Fokus','Geschicklichkeit','Ausdauer','searchLevel');
	} else if (window.location.hostname.search(/w2.gondal/) >= 0) {
		var Diff = new Array(3,17,17,47,5,3,71,'Gilden Ehrenpunkte','Machtkristalle','Stärke','Intelligenz','Geschicklichkeit','Ausdauer','searchLevel');
	} else if (window.location.hostname.search(/gondal-de/) >= 0) {
		var Diff = new Array(4,17,17,47,5,3,71,'Gilden Ehrenpunkte','Machtkristalle','Stärke','Intelligenz','Geschicklichkeit','Ausdauer','searchLevel');
	} else if ((window.location.hostname.search(/last-emperor/) >= 0) || (window.location.hostname.search(/lastemperor/) >= 0)) {
		var Diff = new Array(2,12,16,7,4,3,32,'Clan Ehrenpunkte','Edelsteine','Stärke','Fokus','Geschicklichkeit','Ausdauer','searchLevel');
	}

//Laden der Einstellungen und anderer Informationen die zuvor gespeichert wurden
	var Ehre = GM_getValue("Ehre" + Diff[0], "Ehre / Name");
	var MK   = parseInt(GM_getValue("MK"   + Diff[0], "Anzahl an MK"));
	var Zeit = parseInt(GM_getValue("Zeit" + Diff[0], "Mindestwartezeit"));
	var Gold = parseInt(GM_getValue("Gold" + Diff[0], 0));
	var GegnerLvl = parseInt(GM_getValue("GegnerLvl" + Diff[0], 0));
	var Lvl  = parseInt(GM_getValue("Lvl"  + Diff[0], 1));
	var Eigenschaften = new Array(parseInt(GM_getValue("Str"  + Diff[0], 0)),parseInt(GM_getValue("Int"  + Diff[0], 0)),parseInt(GM_getValue("Ski"  + Diff[0], 0)),parseInt(GM_getValue("End"  + Diff[0], 0)));
	
//Menü initialisieren
	var Minimum = parseInt(makeMenuInput('Minimum',750,'Bitte die Mindestwartezeit in Millisekunden angeben','Wartezeit'));
	var Maximum = parseInt(makeMenuInput('Maximum',2000,'Bitte die Höchstwartezeit in Millisekunden angeben','Wartezeit'));
	var MinGold = parseInt(makeMenuInput('MinGold',100,'Bitte den Goldbetrag eingeben, ab dem ein Gegner weiter angegriffen werden soll, bis er weniger als den angegebenen Betrag an Gold abwirft.','Automatisierung'));
	if (Diff[0] == 1) var Volk = parseInt(makeMenuInput('Volk',0,'Wähle das Volk aus, dass du angreifen möchtest. Hierzu bitte die entsprechende Zahl angeben.\nAuf Gondal und Last Emperor hat dieser Wert keine Auswirkungen.\n0: Alle Völker\n1: Ägypter\n2: Babylonier\n3: Germanen\n4: Griechen\n5: Karthager\n6: Perser\n7: Phönizier\n8: Römer\n9: Wikinger','Artyria'));
	var Arbeiten = false;
	//var Arbeiten = makeMenuToggle('Arbeiten',true,'In Wartezeit arbeiten gehen','In Wartezeit nicht arbeiten gehen','Arbeit');

//Funktion zum Erstellen eines Menüs, auf das über das Greasemonkey Icon zugegriffen werden kann
	function makeMenuInput(key, defaultValue, question, prefix) {
		var Value = GM_getValue(key + Diff[0], defaultValue);
		GM_registerMenuCommand((prefix ? prefix+": " : "") + key + ' ('+Value+')', function() {
			GM_setValue(key + Diff[0],prompt(question,defaultValue));
		});
		return Value;
	}

//Funktion zum Erstellen eines Umschaltmenüs
	function makeMenuToggle(key, defaultValue, toggleOn, toggleOff, prefix) {
		var Value = GM_getValue(key + Diff[0], defaultValue);
		GM_registerMenuCommand((prefix ? prefix+": " : "") + (Value ? toggleOn : toggleOff), function() {
			GM_setValue(key + Diff[0], !Value);
			location.reload();
		});
		return Value;
	}

//Funktion die die Zeit formatiert als Zeichenkette zurückgibt
	function GibZeit() {
		var Uhrzeit = new Date();
		var Tag = Uhrzeit.getDay();
		var WTag = new Array("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa");

		var Stunden = Uhrzeit.getHours();
		if (Stunden < 10) Stunden = "0" + Stunden;
		var Minuten = Uhrzeit.getMinutes();
		if (Minuten < 10) Minuten = "0" + Minuten;
		var Sekunden= Uhrzeit.getSeconds();
		if (Sekunden < 10) Sekunden = "0" + Sekunden;
		return WTag[Tag] + ' ' + Stunden + ':' + Minuten + ':' + Sekunden;
	}

//Funktion zum Laden einer neuen Seite
	function LadeSeite(Pfad) {
	  //alert("LadeSeite:"+Pfad);
		window.setTimeout('window.location.pathname = "' + Pfad + '"', GetRandom(Minimum,Maximum));
	}

//Zufallsgenerator. Gibt eine Zahl zwischen min und max zurück
	function GetRandom( min, max ) {
		if( min > max ) {
			return( -1 );
		}
		if( min == max ) {
			return( min );
		}
		return( min + parseInt( Math.random() * ( max-min+1 ) ) );
	}
  
  var Ehr2 = new Array();
  
//Funktion die eine Zahl zurück gibt, die angibt der wievielte Link auf der Arenaseite der Link zum Gegner mit maximal MaxEhre ist
	function Suche(MaxEhre) {
		var Ehrarray = new Array(Diff[1]);
		Ehr2 = new Array();
		
		for (var i = 0; i < Diff[1]; i++) {
			Ehrarray[i] = new Array(2);
			Ehrarray[i][0] = Diff[2] + 2*i;
			Ehrarray[i][1] = document.getElementsByTagName("td")[Diff[3] + Diff[4]*i ].innerHTML;
			var gpath =document.getElementsByTagName("a")[Ehrarray[i][0]].pathname;
      //CheckGildenmitglied(Ehrarray[i][0],gpath);
      
		}
		//var msg = "Ehrarray contents before sort\n";
    //for(i=0;i<Ehrarray.length;i++) { msg += Ehrarray[i][0] + ", " + Ehrarray[i][1] +"\n"; }
    //alert(msg);
		
    Ehrarray.sort(arrsort);
    //alert(dump(Ehrarray));
    
    //while(!Ehr2komplett){
      //setTimeout("checkEhr2()",1000);
      //alert(Ehr2.length);
    //}
    //alert("Ehr2komplett");
    //msg = "Ehrarray contents after sort\n";
    //for(i=0;i<Ehrarray.length;i++) { msg += Ehrarray[i][0] + ", " + Ehrarray[i][1] +"\n"; }
    //alert(msg);
		
    if(Ehrarray[0][1] <= MaxEhre) {
			i = 0;
			while (i < Ehrarray.length - 1 && Ehrarray[i+1][1] <= MaxEhre) 
        i++;
			//while (i>=0)
			//{
			 var gpath =document.getElementsByTagName("a")[Ehrarray[i][0]].pathname;
       
       //if(IstGildenmitglied(gpath))
			 //{
			 //  alert(gpath + " ist Gildenmitglied ");
			 //alert(Ehrarray[i][1]+"\n"+gpath+"\n");//+CheckGildenmitglied(Ehrarray[i][0],gpath));        
          return Ehrarray[i][0];
       // }else{
       //  alert(gpath + " ist KEIN Gildenmitglied " );
       //   i--;
       //}			   
      //}
      //return false;
		} 
    else 
    {  //return false;
      //alert("Nullelement:"+Ehrarray[0][1]);
      return Ehrarray[0][0];
    }  
	}
	
 /* var Ehr2komplett = false;
  
  function checkEhr2(){
    Ehr2komplett = Ehr2.length=Diff[1];
  }

  function CheckGildenmitglied(aint,Urlg) { 
    var callback = function(response){
        var GName = "";
        var GLink = ""; 
        if(response.responseText==null)
        {
          alert(path +" response: null");
        }
        else
        {
          var m = response.responseText.match(/guilds/);
          //alert("IstGResponseMatch: "+m);
          if(m) {
            var Ergebnis = response.responseText.match(/<a href="(\/guilds\/profile\/\w+)".?>(.+)<\/a>/);
            if (Ergebnis){
              //for (var i = 0; i < Ergebnis.length; ++i)
              GName = Ergebnis[2];
              GLink = Ergebnis[1];
            }
            var myL = document.createElement("a");
            var myHref = document.createAttribute("href");
            myHref.nodeValue = GLink;
            var Rest = document.createTextNode(" ["+GName+"]"); //
            //myL.appendChild(Rest);
            Rest.style.color = "#FF0000";

            document.getElementsByTagName("a")[aint].firstChild.appendData(Rest.nodeValue);
            //document.getElementsByTagName("a")[aint].firstChild.appendData(myL.nodeValue);
          }
          
        }
        AddEhr2(Urlg,GName);
        
        //return ret; 
      }
      
      

    GM_xmlhttpRequest({
      method:"GET",
      url: 'http://' + location.host + Urlg,
      onload: callback
    });
    //ret = RequestGilde(Urlg);
    //alert("IstG: " + ret);
    
    //while(ret==null)
    //{;}
    //setTimeout("alert('nix')",2000); 
    //return ret;   
  }
  
  function AddEhr2(urlg,rett)
  {
    Ehr2.push(new Object());
    Ehr2[Ehr2.length-1]["Urlg"] = urlg;
    Ehr2[Ehr2.length-1]["ret"] = rett;
  }
  
  function RequestGilde(path){
    var ret2 = true;
     
    return ret2;     
  }
    */
//Einfache Funktion zum Vergleich zweier Arrays. Wird zum sortieren benötigt
	function arrsort(a, b) {
	  return a[1] - b[1];
	}
	
//Funktion die den Goldbetrag des letzten Gegners zurückgibt
	function GibLetztenGegner() {
		if (Statistik == '') return new Array(0,'');
		else {
			var i = 0;
			while (Statistik[1 + 6*i].split(" ")[0] == "Skillung" || Statistik[1 + 6*i] == "Bankeinzahlung") i++;
			return new Array(Statistik[5 + 6*i],Statistik[1 + 6*i]);
		}
	}

// Die folgenden zwei Funktionen müssen leider so umständlich gemacht werden, da sonst kein Zugriff der Seite auf Skripteinstellungen möglich sind.
// Informationen hierzu: http://wiki.greasespot.net/0.7.20080121.0_compatibility

//Funktion zum speichern der Einstellungen
	unsafeWindow.EinstellungenSpeichern = function(zEhre,zMK,zZeit,zGold,zGegnerLvl) {
		window.setTimeout(GM_setValue, 0, 'Aktiv' + Diff[0], true);
		window.setTimeout(GM_setValue, 0, 'Ehre'  + Diff[0], zEhre);
		window.setTimeout(GM_setValue, 0, 'MK'    + Diff[0], zMK);
		window.setTimeout(GM_setValue, 0, 'Zeit'  + Diff[0], zZeit);
		window.setTimeout(GM_setValue, 0, 'Gold'  + Diff[0], zGold);
		window.setTimeout(GM_setValue, 0, 'GegnerLvl'  + Diff[0], zGegnerLvl);
	}

// Sollte es einmal zu Problemen kommen ruft einfach die Funktion Deaktivieren() auf und das Skript sollte nicht mehr weiter arbeiten
unsafeWindow.Deaktivieren = function() {
	window.setTimeout(GM_setValue, 0, 'Aktiv' + Diff[0], false);
}

var Statistik = GM_getValue('Statistik' + Diff[0], '').split("\\");
unsafeWindow.Statistik = Statistik;

// StatistikBereinigen(Art,Grenze,Anzahl)
// gelöscht werden
// Art: 
//	0  (alle Einträge)
//	1  (nur Ereignisse)
//	2  (nur Gegner)
// mit 
// Grenze: 
//	0  (beliebigem Goldbetrag)
// 	>0 (weniger als dem angegebenen Goldbetrag)
// und dies in
// Anzahl:
//	0  (unbegrenzter Anzahl)
//	>0 (durch angegebenen Wert begrenzter Anzahl)
//
// So löscht StatistikBereinigen(2,200,5) die 5 letzten Gegner mit weniger als 200 Gold
// und StatistikBereinigen(1,0,10) die letzten 10 Ereignisse
// und StatistikBereinigen(0,0,0) die gesamte Statistik
// Die Funktion gibt die tatsächlich gelöschte Anzahl zurück, durch Aufruf von z.B.
// alert(StatistikBereinigen(1,0,10)) erfahrt ihr ob wirklich 10 Einträge gelöscht wurden.

unsafeWindow.StatistikBereinigen = function(Art,Grenze,Anzahl) {
	if (Art == 0 && Grenze == 0 && Anzahl == 0) {
		var ErgAnz = parseInt(Statistik.length/6);
		window.setTimeout(GM_setValue, 0, 'Statistik' + Diff[0], '');
	} else {
		var ZuLoeschen = new Array();
		for (var i = parseInt(Statistik.length/6) - 1; i >= 0; i--) {
			if ((Anzahl == 0) || (ZuLoeschen.length < Anzahl)) {
				if ((Art == 0) || ((Statistik[i*6+1] == 'Bankeinzahlung' || Statistik[i*6+1].split(' ')[0] == 'Skillung') ? (Art == 1) : (Art == 2)))
					//if ((Grenze == 0) || (Statistik[i*6+5] < Grenze))
					if ((Grenze == 0) || (Statistik[i*6+4] < Grenze) || (Statistik[i*6+4] == ''))
						ZuLoeschen.push(i);
			} else break;
		}
		var Bereinigt = new Array();
		var ErgAnz = ZuLoeschen.length;
		if (ZuLoeschen.length > 0) {
			for (var i = parseInt(Statistik.length/6) - 1; i >= 0; i--) {
				if (i == ZuLoeschen[0])	ZuLoeschen.shift()
				else for (var j = 5; j >= 0; j--) Bereinigt.unshift(Statistik[i*6+j]);
			}
			Statistik = Bereinigt;
		}
		window.setTimeout(GM_setValue, 0, 'Statistik' + Diff[0], Statistik.join("\\"));
	}
	return ErgAnz + ' Element(e) wurde(n) gelöscht';
}

function ErweitereStatistik(Zeit, Name, HP, Ehre, Gilde, Gold) {
	Statistik.unshift(Zeit, Name, parseInt(HP*10000)/10000, Ehre, Gilde, Gold);
	GM_setValue('Statistik' + Diff[0], Statistik.join("\\"));
}

function Statistikausgabe() {
	var Code = "<table><tr><td>Zeit</td><td>Name</td><td>RestHP</td><td>Ehre</td><td>Gildenehre</td><td>Gold</td></tr>";
	for (var i = 0; i < parseInt(Statistik.length/6); i++) {
		
    Code = Code + '<tr>' +
    '<td>' + Statistik[6*i] + '&nbsp;&nbsp;</td>' +
    '<td><span onclick="javascript:document.getElementById(\'MaxEhre\').value = \'' + (Statistik[6*i+1]) 
    + '\'" style="color: ' + ((Statistik[6*i+3] >= 0) ? 'green' : 'red') + ';">' + (Statistik[6*i+1]) + '</span>&nbsp;&nbsp;</td>' +
    '<td>' + parseInt(Statistik[6*i+2]*10000)/100 + '%&nbsp;&nbsp;</td>' +
    '<td>' + Statistik[6*i+3] + '&nbsp;&nbsp;</td>' +
    '<td>' + Statistik[6*i+4] + '&nbsp;&nbsp;</td>' +
    '<td><span style="color: rgb(255,' + parseInt(255 - Math.min(255,Math.sqrt(Statistik[6*i+5]*50))) + ',' 
                                       + parseInt(255 - Math.min(255,Math.sqrt(Statistik[6*i+5]*50))) + ');">' + Statistik[6*i+5] + '</span></td></tr>';
	}
	Code.concat("</table>");
	return Code;
}

if (GM_getValue('Aktiv' + Diff[0], false) || window.location.pathname == "/fights/waitFight" || window.location.pathname == "/characters/index") {
	if (window.location.pathname == "/characters/index") {
		GM_setValue('Lvl' + Diff[0],unsafeWindow.charLevel);
		GM_setValue('Str' + Diff[0],unsafeWindow.baseStr);
		GM_setValue('Int' + Diff[0],unsafeWindow.baseInt);
		GM_setValue('Ski' + Diff[0],unsafeWindow.baseSkill);
		GM_setValue('End' + Diff[0],unsafeWindow.baseSta);
		var Einstellungen = document.createElement("div");
		Einstellungen.innerHTML = 'Zum aktivieren des Autokampfsystems bitte die Ehre oder den Spielernamen des gewünschten Gegners angeben. Es wird automatisch der Gegner angegriffen der weniger oder gleich viel Ehre wie angegeben besitzt oder bei Angabe des Namens der entsprechende Spieler. Wenn bei einer langen Wartezeit automatisch ' + Diff[8] + ' benutzt werden sollen um schneller angreifen zu können geben sie sowohl Anzahl als auch Wartezeit (in Sekunden) an, ab der die ' + Diff[8] + ' eingesetzt werden sollen. Möchten sie keine ' + Diff[8] + ' nutzen füllen sie bitte beide Felder mit einer "0". <br><img src="http://static.gondal.de/img_gondal/img/icons/ehre.gif" alt="MaxEhre"></img><input id="MaxEhre" value="' + Ehre + '"></input><img src="http://static.gondal.de/img_gondal/img/icons/machtkristall2.gif" alt="MaxMK"></img><input id="MaxMK" value="' + MK + '" size="3"></input><img src="http://static.gondal.de/img_gondal/img/icons/time.gif" alt="MinTime"></img><input id="MinTime" value="' + Zeit + '" size="3"></input><select id="Gold"><option>Gold behalten</option><option>Zur Bank bringen</option><option>'+Diff[9]+' skillen</option><option>'+Diff[10]+' skillen</option><option>'+Diff[11]+' skillen</option><option>'+Diff[12]+' skillen</option></select> Gegnerlevel (0 für alle Level): <input id="GegnerLvl" value="' + GegnerLvl + '"></input><br><input type="button" value="Automatisierung aktivieren" onclick=\'javascript:EinstellungenSpeichern(document.getElementById("MaxEhre").value,document.getElementById("MaxMK").value,document.getElementById("MinTime").value,document.getElementById("Gold").selectedIndex,document.getElementById("GegnerLvl").value);alert("Werte wurden gespeichert und die Automatisierung aktiviert");\'></input><input type="button" value="Automatisierung deaktivieren" onclick=\'javascript:Deaktivieren();alert("Automatisierung deaktiviert");\'></input><br>Lösche die ältesten <input id="Anzahl" value="0"/> <select id="Art"><option>Einträge</option><option>Ereignisse</option><option>Gegner</option></select> mit weniger als <input id="Grenze" value="0" size="3"/> Gildenehre <input type="button" onclick=\'javascript:alert(StatistikBereinigen(document.getElementById("Art").selectedIndex,parseInt(document.getElementById("Grenze").value),parseInt(document.getElementById("Anzahl").value)))\' value="Löschen"/>';
		Einstellungen.innerHTML = Einstellungen.innerHTML + Statistikausgabe();
		document.getElementsByClassName("content-bg")[0].appendChild(Einstellungen);
		document.getElementById("Gold").selectedIndex = Gold;
	}
	if (window.location.pathname == "/fights/start") {
		if (!isNaN(Ehre) 
        && GibLetztenGegner()[0] < MinGold 
        && (
          GegnerLvl > 0 
          && !(Diff[0] == 1 
          || (document.getElementsByTagName("td")[Diff[3] - ((Diff[0] == 0 || Diff[0] == 3 || Diff[0] == 4)?3:2)].innerHTML == GegnerLvl 
        && document.getElementsByTagName("td")[Diff[3] + Diff[4]*(Diff[1]-1) - ((Diff[0] == 0 || Diff[0] == 3 || Diff[0] == 4)?3:2)].innerHTML == GegnerLvl)) 
        //|| (Diff[0] == 1 && ((GegnerLvl > 0 && document.getElementsByName("selectLevel")[0].selectedIndex != GegnerLvl) 
        //|| document.getElementsByName("selectRace")[0].selectedIndex != Volk))
        )) 
    {
			/*if (Diff[0] == 1) {
				document.getElementsByName("selectRace")[0].selectedIndex = Volk;
				if (GegnerLvl != 0) {
					document.getElementsByName("selectLevel")[0].selectedIndex = GegnerLvl;
				}
				window.setTimeout('document.getElementsByTagName("form")[1].submit()',GetRandom(750,2000));
			} else*/ {
				document.getElementsByName("searchLevel")[0].selectedIndex = GegnerLvl - 1;
				//alert(dump(document.getElementsByTagName("form")[0]));
        window.setTimeout('document.getElementsByTagName("form")[0].submit()',GetRandom(750,2000));
			}
		} else {
			if (isNaN(Ehre) || GibLetztenGegner()[0] >= MinGold) {
				if (!isNaN(Ehre)) 
          Ehre = GibLetztenGegner()[1];
				/*if (Diff[0] == 1) {
					if (document.getElementById("flashMessage") == null) {
						alert("flashMessage");
            document.getElementsByName("data[Character][name]")[0].value = Ehre;
						window.setTimeout('document.getElementsByTagName("form")[0].submit()',GetRandom(750,1250));
					} else {
						Deaktivieren();
						document.getElementById("flashMessage").innerHTML = document.getElementById("flashMessage").innerHTML + " Deshalb wurde die Automatisierung der Arenakämpfe beendet. Um sie erneut zu starten einfach einen anderen Namen oder Ehre auf der Warteseite zwischen Arenakämpfen angeben.";
					}
				} else */{
					if (document.getElementsByTagName("td")[Diff[3] - 1].innerHTML.split(">")[1].split("<")[0] == Ehre)
					{	
					  //alert("se  " + document.getElementsByTagName("a")[Diff[2] + 1].innerHTML);
            LadeSeite(document.getElementsByTagName("a")[Diff[2]+1].pathname);
					} else { 
						//alert("dataChar");
            document.getElementsByName("data[Character][name]")[0].value = Ehre;
						window.setTimeout('document.getElementsByTagName("form")[1].submit()',GetRandom(750,1250));
					}
				}
			} else {
				var Pos = 0;
        Pos = Suche(parseInt(Ehre));
				//alert("Pos: "+Pos+"\n"+document.getElementsByTagName("a")[Pos].firstChild.nodeValue);
        if (Pos==false) {
          //alert("Pos=false "+Pos); 
				  LadeSeite("/fights/start");
				}
				else {
				  //alert(document.getElementsByTagName("a")[Pos+1].pathname);
				  LadeSeite(document.getElementsByTagName("a")[Pos+1].pathname);
				}
			}
		}
	}
	if (window.location.pathname.split("/")[1] == "fights" && window.location.pathname.split("/")[2] == "start" && window.location.pathname.split("/").length > 3){
		//alert("1");
    LadeSeite("/fights/start");
  }  
	if (window.location.pathname == "/fights/fight")
		if (Diff[0] != 1)
			LadeSeite(document.getElementById("fighttostats").innerHTML.split('"')[1])
		else window.setTimeout('window.location.pathname = "/fights/fight"',GetRandom(120000,180000));

	//Speichern der Kampfergebnisse
	if (window.location.pathname.split("/")[2] == "results") {
		var StatName = document.getElementsByTagName("span")[Diff[5]].innerHTML;
		var StatAtt  = parseFloat(document.getElementsByTagName("strong")[(Diff[0] == 1) ? 12 : 14].innerHTML.split(" / ")[0] / document.getElementsByTagName("strong")[(Diff[0] == 1) ? 12 : 14].innerHTML.split(" / ")[1]);
		var StatDef  = parseFloat(document.getElementsByTagName("strong")[(Diff[0] == 1) ? 13 : 15].innerHTML.split(" / ")[0] / document.getElementsByTagName("strong")[(Diff[0] == 1) ? 13 : 15].innerHTML.split(" / ")[1]);
		var StatEhre = document.getElementsByTagName("strong")[(Diff[0] == 1) ? 14 : 16].innerHTML.split(">")[(Diff[0] != 1) ? 0 : 1].split(" ")[0];
		var StatGilde= (document.getElementsByTagName("td")[Diff[6]].innerHTML != Diff[7]) ? '' : document.getElementsByTagName("strong")[(Diff[0] == 1) ? 16 : 18].innerHTML.split(">")[(Diff[0] != 1) ? 0 : 1].split(" ")[0];
		var StatGold = document.getElementsByTagName("strong")[(document.getElementsByTagName("td")[Diff[6]].innerHTML == Diff[7]) ? (Diff[0] == 1) ? 18 : 20 : (Diff[0] == 1) ? 16 : 18].innerHTML.split(">")[(Diff[0] != 1) ? 0 : 1].split("<")[0].split(" ")[0];
		ErweitereStatistik(GibZeit(),StatName,Math.max(StatAtt,StatDef),StatEhre,StatGilde,StatGold);
		//alert("2");
    LadeSeite("/fights/start");
	}
	if (window.location.pathname == "/fights/searchCharacter"){
		alert("3 " + document.getElementsByTagName("a")[18].pathname);
    LadeSeite(document.getElementsByTagName("a")[18].pathname);
  }  
	if (window.location.pathname == "/fights/waitFight") {
		if (typeof( unsafeWindow.timers ) != "undefined" && typeof( unsafeWindow.timers["remaining"] ) != "undefined") {
			var currentGold = document.getElementById("currentGold").innerHTML;
			if (Gold == 1 && (currentGold - (100 + 20*Lvl)) > 100) {
				GM_xmlhttpRequest({
					method: "POST",
					url:'http://' + location.host + '/bank/einzahlen',
					headers:{'Content-type':'application/x-www-form-urlencoded'},
					data:"data[Bank][in]=" + (currentGold - (100 + 20*Lvl))
				});
				ErweitereStatistik(GibZeit(),'Bankeinzahlung',0,'Gebühr:',parseInt((currentGold - (100 + 20*Lvl))*0.1),parseInt((currentGold - (100 + 20*Lvl))*0.9));
				document.getElementById("currentGold").innerHTML = 100 + 20*Lvl;
			} else if (Gold > 1) {
				while (currentGold >= (Eigenschaften[Gold - 2]*5 - 40)) {
					var Link = "";
					Eigenschaften[Gold - 2]++;
					switch (Gold) {
						case 2: Link = 'http://' + location.host + '/characters/charLeft/strength'; 
						GM_setValue('Str' + Diff[0], Eigenschaften[0]); break;
						case 3: Link = 'http://' + location.host + '/characters/charLeft/intelligence'; 
						GM_setValue('Int' + Diff[0], Eigenschaften[1]); break;
						case 4: Link = 'http://' + location.host + '/characters/charLeft/skill'; 
						GM_setValue('Ski' + Diff[0], Eigenschaften[2]); break;
						case 5: Link = 'http://' + location.host + '/characters/charLeft/endurance'; 
						GM_setValue('End' + Diff[0], Eigenschaften[3]); break;
					}
					GM_xmlhttpRequest({
						method: "GET",
						url:Link,
						headers:{'Content-type':'application/x-www-form-urlencoded'},
						data:""
					});
					ErweitereStatistik(GibZeit(),'Skillung ' + Diff[7 + Gold],0,'auf',Eigenschaften[Gold - 2],(Eigenschaften[Gold - 2]*5 - 45));
					currentGold -= Eigenschaften[Gold - 2]*5 - 45;
					document.getElementById("currentGold").innerHTML = currentGold;
				}				
			}
			var RemTime = unsafeWindow.timers["remaining"]["time"]
			if (MK > 0 && RemTime > Zeit) {
				MK--;
				unsafeWindow.EinstellungenSpeichern(Ehre,MK,Zeit,Gold);
				LadeSeite("/fights/waitFight/buy");
			} else {
				var Einstellungen = document.createElement("div");
				Einstellungen.innerHTML = 'Zum aktivieren des Autokampfsystems bitte die Ehre oder den Spielernamen des gewünschten Gegners angeben. Es wird automatisch der Gegner angegriffen der weniger oder gleich viel Ehre wie angegeben besitzt oder bei Angabe des Namens der entsprechende Spieler. Wenn bei einer langen Wartezeit automatisch ' + Diff[8] + ' benutzt werden sollen um schneller angreifen zu können geben sie sowohl Anzahl als auch Wartezeit (in Sekunden) an, ab der die ' + Diff[8] + ' eingesetzt werden sollen. Möchten sie keine ' + Diff[8] + ' nutzen füllen sie bitte beide Felder mit einer "0". <br><img src="http://frontend1.gondal.de/img/img/icons/ehre.gif" alt="MaxEhre"></img><input id="MaxEhre" value="' + Ehre + '"></input><img src="http://frontend1.gondal.de/img/img/icons/machtkristall.gif" alt="MaxMK"></img><input id="MaxMK" value="' + MK + '" size="3"></input><img src="http://frontend1.gondal.de/img/img/icons/time.gif" alt="MinTime"></img><input id="MinTime" value="' + Zeit + '" size="3"></input><select id="Gold"><option>Gold behalten</option><option>Zur Bank bringen</option><option>'+Diff[9]+' skillen</option><option>'+Diff[10]+' skillen</option><option>'+Diff[11]+' skillen</option><option>'+Diff[12]+' skillen</option></select><br /> Gegnerlevel (0 für alle Level): <input id="GegnerLvl" value="' + GegnerLvl + '" size="3"></input><br><input type="button" value="Automatisierung aktivieren" onclick=\'javascript:EinstellungenSpeichern(document.getElementById("MaxEhre").value,document.getElementById("MaxMK").value,document.getElementById("MinTime").value,document.getElementById("Gold").selectedIndex,document.getElementById("GegnerLvl").value);alert("Werte wurden gespeichert und die Automatisierung aktiviert");\'></input><input type="button" value="Automatisierung deaktivieren" onclick=\'javascript:Deaktivieren();alert("Automatisierung deaktiviert");\'></input><br>Lösche die ältesten <input id="Anzahl" value="0" size="3"/> <select id="Art"><option>Einträge</option><option>Ereignisse</option><option>Gegner</option></select> mit weniger als <input id="Grenze" value="0" size="3"/> Gildenehre <input type="button" onclick=\'javascript:alert(StatistikBereinigen(document.getElementById("Art").selectedIndex,parseInt(document.getElementById("Grenze").value),parseInt(document.getElementById("Anzahl").value)))\' value="Löschen"/>';
				Einstellungen.innerHTML = Einstellungen.innerHTML + Statistikausgabe();
				document.getElementById("wrapper").appendChild(Einstellungen);
				document.getElementById("Gold").selectedIndex = Gold;
				if (RemTime > Math.max(Zeit,60) && GM_getValue('Aktiv' + Diff[0], false) && Arbeiten) {
					GM_xmlhttpRequest({
						method: "POST",
						url:'http://' + location.host + "/services/index/gold",
						headers:{'Content-type':'application/x-www-form-urlencoded'},
						data:"data[Service][duration]=" + Math.floor(RemTime/36)/100
					});
				}				
			}
		} else {
			//alert("4");
      LadeSeite("/fights/start");
		}
	}
	//Schreiben in den Stundenanzahl Feldern beim Arbeiten erlauben
	if (window.location.pathname.split("/")[2] == "index" && window.location.pathname.split("/").length > 3) {
		if (Diff[0] != 1) document.getElementById("valueInput").removeAttribute("readonly") 
		else {
			document.getElementsByName("data[Service][duration]")[1].removeAttribute("readonly");
			document.getElementsByName("data[Service][duration]")[1].removeAttribute("typelock");
		}
	}
	if (window.location.pathname == "/services/finish"){
		//alert("5");
    LadeSeite("/fights/start");
  }
	if (window.location.pathname == "/services/serve/")
		window.setTimeout('window.location.pathname = "/services/serve/"', GetRandom(120000,180000));
	if (window.location.pathname == "/services/index")
		window.setTimeout('window.location.pathname = "/fights/start"', GetRandom(20000,40000));
}



function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}