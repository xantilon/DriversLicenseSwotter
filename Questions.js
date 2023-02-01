    function clearSolution()
    {
        $("*").removeClass('btRight');
        $("*").removeClass('btWrong');
    }
    
    function showSolution(clicked,L)
    {
        if(currentQuestion.L==clicked)
        {
            switch(clicked)
            {
            case "A": $("#qA").addClass("btRight"); break; 
            case "B": $("#qB").addClass("btRight"); break;  
            case "C": $("#qC").addClass("btRight"); break;
            case "D": $("#qD").addClass("btRight"); break;
            }
        }
        else
        {
            switch(clicked)
            {
            case "A": $("#qA").addClass("btWrong"); break;  
            case "B": $("#qB").addClass("btWrong"); break;  
            case "C": $("#qC").addClass("btWrong"); break;  
            case "D": $("#qD").addClass("btWrong"); break;  
            }
            switch(currentQuestion.L)
            {
            case "A": $("#qA").addClass("btRight"); break;  
            case "B": $("#qB").addClass("btRight"); break;  
            case "C": $("#qC").addClass("btRight"); break;  
            case "D": $("#qD").addClass("btRight"); break;  
            }
        }
    }


    function openXMLQ(file)
    {
	    var xmlhttp = new window.XMLHttpRequest();
	    xmlhttp.open("GET",file,false);
	    xmlhttp.send(null);
	    xmlDocQ = xmlhttp.responseXML.documentElement;
    }

    function getQnext(ID)
    {
        ID = parseInt(ID)+1;
        getQ(ID);
        return ID;
    }
    
    function getQprev(ID)
    {
        ID = parseInt(ID)-1;
        getQ(ID);
        return ID;
    }
    
    function getQ(ID)
    {
        var id;
		var type;
		var question;
		var A;
		var B;
		var C;
		var D;
		var L;
		var pic;
		var cQ = new cQuestion;
		
        $(xmlDocQ).find('mchoice').each(function(){
						cQ.ID = $(this).attr('ID');
						if(cQ.ID==ID)
						{
						    cQ.type = $(this).attr('type');
						    //$('<div class="items" id="link_'+id+'"></div>').html('<a href="'+url+'">'+title+'</a>').appendTo('#page-wrap');
						    cQ.question = $(this).find('question').text();
						    cQ.A = $(this).find('A').text();
						    cQ.B = $(this).find('B').text();
						    cQ.C = $(this).find('C').text();
						    cQ.D = $(this).find('D').text();
						    cQ.L = $(this).find('L').text();
						    cQ.pic = $(this).find('picture').text();
						    
						    if($(this).attr('type')=="ABCD")
						    {
//						        if($("qUl").has("li").length == 2)
//						            $('<li id="qC"></li><li id="qD"></li>').appendTo('#qUl');
						    }
						    else
						    {
						        $('#qC').remove();
						        $('#qD').remove();    
						    }
						    
						    $('#qH1').text($(this).attr('ID'));
						    $('#qInfo').text($(this).find('question').text());
						    $('#qA').text($(this).find('A').text());
						    $('#qB').text($(this).find('B').text());
						    $('#qC').text($(this).find('C').text());
						    $('#qD').text($(this).find('D').text());
						    //$('#qL').text($(this).find('L').text());
						    //$('#qID').text(id);
						    if(cQ.pic && cQ.pic!="")
						    {
						        $("<img id='qPic' src='images/" + cQ.pic + ".jpg' alt='' />").appendTo('#qInfo');
						    }
						    
						    currentQuestion = cQ;
						    
						    return false;
						}
						else
						    id = 0;
					});
					var hash = 'question1234';
					//hijackLinks(hash + ' a:not(.back, .cancel, .goback)');
                    //fixBackLinks(hash + ' > .back, .cancel, .goback');
					clearSolution();
					
	    return cQ;
           
      
    }
    
    function hijackLinks(hash) {
$(hash).click(function(e) {
e.preventDefault();
jQT.goTo(e.target.hash, 'slide');
});
};

 

function fixBackLinks(hash) {
$(hash).click(function(e) {
e.preventDefault();
jQT.goBack(e.target.hash);
});
};
