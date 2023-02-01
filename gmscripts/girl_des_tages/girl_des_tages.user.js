// ==UserScript==
// @name           Girl des Tages
// @namespace      bilder.zehn.de
// @include        http://bilder.zehn.de/*/images
// ==/UserScript==

//var urls = new Array;

var Div = document.createElement('div');
Div.id = "Bilder";
with(Div.style){
  background = 'pink';
  //position = 'fixed';
  top = '0px';
  left = '0px';
  diplay = 'block';
}  
document.body.appendChild(Div);

//makePic("http://bilder.zehn.de/girl-des-tages/images/image1.jpg");


for(var i=0; i<document.getElementsByTagName("a").length;i++)
{
  if(document.getElementsByTagName("a")[i].href.match(/image\d+\.jpg/))
  {
    //urls.push(document.getElementsByTagName("a")[i].href); 
    makePic(document.getElementsByTagName("a")[i].href); 
  }
}

//var HtmlPage = document.body.parentNode;
//HtmlPage.removeChild(document.body);
//HtmlPage.appendChild(document.createElement)

function makePic (path){
    var pic = document.createElement('img');
    pic.id = 'i' + i;
    //pic.width = '400';
    pic.height = '800';
    pic.src = path;
    Div.appendChild(pic);
}