    function getTopics()
    {
        
        var i;
        openXML("dlqt.xml");
        var topicsArrayXML;
        var lines;
        
        
            topicsArrayXML = xmlDoc.getElementsByTagName("t");
            //lines = new Array(topicsArrayXML.length);
            
            for(i=0; i<t.length; i++)
            { 
                t[i] = (i+1) + ". " + topicsArrayXML[i].attributes.getNamedItem("text").value;
            } 
		    
	    
	        topicsArrayXML = xmlDoc.getElementsByTagName("t2");
	        i=0;
	        var ID;
	        var ID2;
	        
            for(i=0; i<topicsArrayXML.length; i++)
            { 
                ID = topicsArrayXML[i].attributes.getNamedItem("ID").value[0];
                ID2 = parseInt(topicsArrayXML[i].attributes.getNamedItem("ID").value.substr(1,2),10);
                 
                switch (ID) {
                    case "1": t1[ID2-1] = ID+"."+ID2 + " " + topicsArrayXML[i].attributes.getNamedItem("text").value;
                    break;
                    case "2": t2[ID2-1] = ID+"."+ID2 + " " + topicsArrayXML[i].attributes.getNamedItem("text").value;
                    break;
                    case "3": t3[ID2-1] = ID+"."+ID2 + " " + topicsArrayXML[i].attributes.getNamedItem("text").value;
                    break;
                    case "4": t4[ID2-1] = ID+"."+ID2 + " " + topicsArrayXML[i].attributes.getNamedItem("text").value;
                    break;
                    case "5": t5[ID2-1] = ID+"."+ID2 + " " + topicsArrayXML[i].attributes.getNamedItem("text").value;
                    break;
                    case "6": t6[ID2-1] = ID+"."+ID2 + " " + topicsArrayXML[i].attributes.getNamedItem("text").value;
                    break;
                    case "7": t7[ID2-1] = ID+"."+ID2 + " " + topicsArrayXML[i].attributes.getNamedItem("text").value;
                    break;
                }  
            } 
            
    }


    function openXML(file)
    {
	    var xmlhttp = new window.XMLHttpRequest();
	    xmlhttp.open("GET",file,false);
	    xmlhttp.send(null);
	    xmlDoc = xmlhttp.responseXML.documentElement;
    }