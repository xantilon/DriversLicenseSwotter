var xmlDoc = '';
var q = '';


// PUBLIC FUNCTIONS



    function IniDB()
    {
        var shortName = 'DLQq';
        var version = '1.0';
        var displayName = 'DLQq';
        var maxSize = 65536;
        db = openDatabase(shortName, version, displayName, maxSize);
        db.transaction
        (
            function(transaction)
            {
                transaction.executeSql
                (
                    'CREATE TABLE IF NOT EXISTS questions ' +
                    ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '+
                    '  type TEXT NOT NULL, '+
                    '  question TEXT NOT NULL, '+
                    '  A  TEXT NOT NULL, '+
                    '  B  TEXT NOT NULL, '+
                    '  C  TEXT NOT NULL, '+
                    '  D  TEXT NOT NULL, '+
                    '  L  TEXT NOT NULL, '+
                    '  picture  TEXT NOT NULL); '                     
                );
            }
        );
    }
    
    function FillDB()
    {
        
        //openXML("dlq.xml", xmlDocQ);
        var xmlhttp = new window.XMLHttpRequest();
	    xmlhttp.open("GET","dlq.xml",false);
	    xmlhttp.send(null);
	    xmlDocQ = xmlhttp.responseXML.documentElement;
	    
        var qArrayXML = xmlDocQ.getElementsByTagName("mchoice");
        
        var ID, question, type, A, B, C, D, L, pic;
        var i=0;           
            while(qArrayXML[i])
            {
               ID = qArrayXML[i].attributes.getNamedItem("ID").value;
               type = qArrayXML[i].attributes.getNamedItem("type").value;
               //question = qArrayXML[i].getElementByTagName("question").value;
               //question = qArrayXML[i].attributes.getNamedItem("question").value;
               question = qArrayXML[i].getNextSibling.value;
                i++;
            } 
    }
// PRIVATE FUNCTIONS

function openXML(file)
{
	/*xmlDoc=document.implementation.createDocument("", "doc", null)
	xmlDoc.load(file);
	xmlDoc.onload = readXML;*/
	var xmlhttp = new window.XMLHttpRequest();
	xmlhttp.open("GET",file,false);
	xmlhttp.send(null);
	xmlDoc = xmlhttp.responseXML.documentElement;

}