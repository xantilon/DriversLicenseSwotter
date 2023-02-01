<?php
    class Questions {

        var xmlDoc = '';

		function importXML(file) {
		 xmlDoc=document.implementation.createDocument("", "doc", null)
		 xmlDoc.load(file);
		 xmlDoc.onload = readXML;
		}

		function getOne() {
        	var xmlFile = xmlDoc.getElementsByTagName("quiz");
			print_r(xmlFile);

		}

    }
?>