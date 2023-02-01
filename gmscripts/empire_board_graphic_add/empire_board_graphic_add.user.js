// coding: utf-8
// ==UserScript==
// @name		Empire Board Graphic AddOn
// @namespace	empire-board.ikariam
// @version	13
// @author		oliezekat
// @description	Graphic add-on for Ikariam v3 Empire Board script (require v150 or higher).
// @require	http://userscripts.org/scripts/source/60774.user.js
// @include	http://s*.ikariam.*/*
// @exclude	http://support.ikariam.*/*
// @exclude	http://*.ikariam.*/*?view=premium
// @exclude	http://*.ikariam.*/*?view=premiumPayment
// ==/UserScript==

/**************************************************************************************************
Require "Ikariam Empire Board" script version 150 (or higher)
with higher priority than this add-on (see GreaseMonkey options)
http://userscripts.org/scripts/show/41051
**************************************************************************************************/

/* Add-on designed as EmpireBoard child object registered with ARexx */

// Remember EmpireBoard and EmpireBoard.ARexx objects
// still exists. And you may not choose child name which
// already used into Ikariam Empire Board.

EmpireBoard.GraphicAddon =
	{
	/* Require for ARexx */
	_Parent:						 null,
	EmpireBoardRequiredVersion:		 172,
	AddOnName:						 'Empire Board Graphic AddOn',
	
	/* Addon optional metas for ARexx */
	Version:						 13,
	HomePage:						 '',
	ScriptURL:						 '',
	UserScriptsID:					 44424
	};

// Constructor method require for ARexx
// May return true  or false (if failed)
EmpireBoard.GraphicAddon.Init = function()
	{
	this.Apply_Styles();
	this.Clean_Headers();
	return true;
	};
	
EmpireBoard.GraphicAddon.Clean_Headers = function()
	{
	// Remove buildings header texts.
	var Headers = this._Parent.ARexx.DOM_Get_Nodes('//*[@id="EmpireBoardBuildings"]//th');
	if (Headers.snapshotLength > 1)
		{
		for (var i=2; i < Headers.snapshotLength; i++)
			{
			Headers.snapshotItem(i).innerHTML = '&nbsp;';
			}
		}

	// Remove resources header texts.
	var Headers = this._Parent.ARexx.DOM_Get_Nodes('//*[@id="EmpireBoardResources"]//th');
	if (Headers.snapshotLength > 1)
		{
		for (var i=2; i < Headers.snapshotLength; i++)
			{
			Headers.snapshotItem(i).title = Headers.snapshotItem(i).textContent;
			Headers.snapshotItem(i).innerHTML = '&nbsp;';
			}
		}

	// Remove units header texts.
	var Headers = this._Parent.ARexx.DOM_Get_Nodes('//*[@id="EmpireBoardArmy"]//th');
	if (Headers.snapshotLength > 1)
		{
		for (var i=2; i < Headers.snapshotLength; i++)
			{
			Headers.snapshotItem(i).innerHTML = '&nbsp;';
			}
		}
	};
	
EmpireBoard.GraphicAddon.Apply_Styles = function()
	{
	// define CSS 
	var default_style = <><![CDATA[
	/** Resources table **/
	#EmpireBoardResources th { height: 26px !important;  min-width: 30px;}
	#EmpireBoardResources th.population,
	#EmpireBoardResources th.wood,
	#EmpireBoardResources th.wine,
	#EmpireBoardResources th.marble,
	#EmpireBoardResources th.crystal,
	#EmpireBoardResources th.sulfur,
	#EmpireBoardResources th.incomes,
	#EmpireBoardResources th.research { color: transparent !important;}

	#EmpireBoardResources th.population {background: url(skin/resources/icon_population.gif) no-repeat center center;}
	#EmpireBoardResources th.wood {background: url(skin/resources/icon_wood.gif) no-repeat center center;}
	#EmpireBoardResources th.wine {background: url(skin/resources/icon_wine.gif) no-repeat center center;}
	#EmpireBoardResources th.marble {background: url(skin/resources/icon_marble.gif) no-repeat center center;}
	#EmpireBoardResources th.crystal {background: url(skin/resources/icon_glass.gif) no-repeat center center;}
	#EmpireBoardResources th.sulfur {background: url(skin/resources/icon_sulfur.gif) no-repeat center center;}
	#EmpireBoardResources th.incomes {background: url(skin/resources/icon_upkeep.gif) no-repeat center center;}
	#EmpireBoardResources th.research {background: url(skin/resources/icon_research_time.gif) no-repeat center 1px;}

	/** Buildings table **/
	#EmpireBoardBuildings th { height: 36px !important; min-width: 20px; }
	#EmpireBoardBuildings th.build_name0,
	#EmpireBoardBuildings th.build_name1,
	#EmpireBoardBuildings th.build_name2,
	#EmpireBoardBuildings th.build_name3,
	#EmpireBoardBuildings th.build_name4,
	#EmpireBoardBuildings th.build_name5,
	#EmpireBoardBuildings th.build_name6,
	#EmpireBoardBuildings th.build_name7 { color: transparent !important; }

	#EmpireBoardBuildings th.townHall {background: url(skin/img/city/building_townhall.gif) no-repeat -20px -52px;}
	#EmpireBoardBuildings th.temple {background: url(skin/img/city/building_temple.gif) no-repeat 2px -16px;}
	#EmpireBoardBuildings th.academy {background: url(skin/img/city/building_academy.gif) no-repeat -59px -1px;}
	#EmpireBoardBuildings th.port {background: url(skin/img/city/building_port.gif) no-repeat -21px -52px;}
	#EmpireBoardBuildings th.shipyard {background: url(skin/img/city/building_shipyard.gif) no-repeat -58px -32px;}
	#EmpireBoardBuildings th.warehouse {background: url(skin/img/city/building_warehouse.gif) no-repeat -10px -23px;}
	#EmpireBoardBuildings th.wall {background: url(skin/img/city/building_wall.gif) no-repeat -99px -39px;}
	#EmpireBoardBuildings th.tavern {background: url(skin/img/city/building_tavern.gif) no-repeat -25px -6px;}
	#EmpireBoardBuildings th.museum {background: url(skin/img/city/building_museum.gif) no-repeat -44px -21px;}
	#EmpireBoardBuildings th.palace {background: url(skin/img/city/building_palace.gif) no-repeat -25px -40px;}
	#EmpireBoardBuildings th.palaceColony {background: url(skin/img/city/building_palaceColony.gif) no-repeat -45px -35px;}
	#EmpireBoardBuildings th.embassy {background: url(skin/img/city/building_embassy.gif) no-repeat -14px -33px;}
	#EmpireBoardBuildings th.branchOffice {background: url(skin/img/city/building_branchOffice.gif) no-repeat -15px -35px;}
	#EmpireBoardBuildings th.safehouse {background: url(skin/img/city/building_safehouse.gif) no-repeat 1px -11px;}
	#EmpireBoardBuildings th.barracks {background: url(skin/img/city/building_barracks.gif) no-repeat -45px -22px;}
	#EmpireBoardBuildings th.workshop {background: url(skin/img/city/building_workshop.gif) no-repeat -9px -24px;}
	#EmpireBoardBuildings th.carpentering {background: url(skin/img/city/building_carpentering.gif) no-repeat -13px -25px;}
	#EmpireBoardBuildings th.forester {background: url(skin/img/city/building_forester.gif) no-repeat -19px -25px;}
	#EmpireBoardBuildings th.stonemason {background: url(skin/img/city/building_stonemason.gif) no-repeat -77px -31px;}
	#EmpireBoardBuildings th.glassblowing {background: url(skin/img/city/building_glassblowing.gif) no-repeat -36px -25px;}
	#EmpireBoardBuildings th.winegrower {background: url(skin/img/city/building_winegrower.gif) no-repeat -37px -33px;}
	#EmpireBoardBuildings th.alchemist {background: url(skin/img/city/building_alchemist.gif) no-repeat -26px -30px;}
	#EmpireBoardBuildings th.architect {background: url(skin/img/city/building_architect.gif) no-repeat -20px -12px;}
	#EmpireBoardBuildings th.optician {background: url(skin/img/city/building_optician.gif) no-repeat -28px -17px;}
	#EmpireBoardBuildings th.vineyard {background: url(skin/img/city/building_vineyard.gif) no-repeat -50px -25px;}
	#EmpireBoardBuildings th.fireworker {background: url(skin/img/city/building_fireworker.gif) no-repeat -58px -11px;}

	/** Army table **/
	#EmpireBoardArmy th { height: 32px !important; }
	#EmpireBoardArmy th.unit_name {color: transparent !important;}

	#EmpireBoardArmy th.ship_ram {background: url(skin/characters/fleet/40x40/ship_ram_r_40x40.gif) no-repeat center -3px;}
	#EmpireBoardArmy th.ship_ballista {background: url(skin/characters/fleet/40x40/ship_ballista_r_40x40.gif) no-repeat center -3px;}
	#EmpireBoardArmy th.ship_flamethrower {background: url(skin/characters/fleet/40x40/ship_flamethrower_r_40x40.gif) no-repeat center -3px;}
	#EmpireBoardArmy th.ship_catapult {background: url(skin/characters/fleet/40x40/ship_catapult_r_40x40.gif) no-repeat center -2px;}
	#EmpireBoardArmy th.ship_steamboat {background: url(skin/characters/fleet/40x40/ship_steamboat_r_40x40.gif) no-repeat center -2px;}
	#EmpireBoardArmy th.ship_mortar {background: url(skin/characters/fleet/40x40/ship_mortar_r_40x40.gif) no-repeat center -3px;}
	#EmpireBoardArmy th.ship_submarine {background: url(skin/characters/fleet/40x40/ship_submarine_r_40x40.gif) no-repeat center -3px;}

	#EmpireBoardArmy th.slinger {background: url(skin/characters/military/x40_y40/y40_slinger_faceright.gif) no-repeat center 2px;}
	#EmpireBoardArmy th.spearman {background: url(skin/characters/military/x40_y40/y40_spearman_faceright.gif) no-repeat center 2px;}
	#EmpireBoardArmy th.swordsman {background: url(skin/characters/military/x40_y40/y40_swordsman_faceright.gif) no-repeat center 0px;}
	#EmpireBoardArmy th.phalanx {background: url(skin/characters/military/x40_y40/y40_phalanx_faceright.gif) no-repeat center -3px;}
	#EmpireBoardArmy th.archer {background: url(skin/characters/military/x40_y40/y40_archer_faceright.gif) no-repeat center 2px;}
	#EmpireBoardArmy th.marksman {background: url(skin/characters/military/x40_y40/y40_marksman_faceright.gif) no-repeat center 3px;}
	
	#EmpireBoardArmy th.medic {background: url(skin/characters/military/x40_y40/y40_medic_faceright.gif) no-repeat center 4px;}
	#EmpireBoardArmy th.cook {background: url(skin/characters/military/x40_y40/y40_cook_faceright.gif) no-repeat center 1px;}

	#EmpireBoardArmy th.gyrocopter {background: url(skin/characters/military/x40_y40/y40_gyrocopter_faceright.gif) no-repeat center -9px;}
	#EmpireBoardArmy th.steamgiant {background: url(skin/characters/military/x40_y40/y40_steamgiant_faceright.gif) no-repeat center -3px;}
	#EmpireBoardArmy th.bombardier {background: url(skin/characters/military/x40_y40/y40_bombardier_faceright.gif) no-repeat center -14px;}
	#EmpireBoardArmy th.ram {background: url(skin/characters/military/x40_y40/y40_ram_faceright.gif) no-repeat center 2px;}
	#EmpireBoardArmy th.catapult {background: url(skin/characters/military/x40_y40/y40_catapult_faceright.gif) no-repeat center -1px;}
	#EmpireBoardArmy th.mortar {background: url(skin/characters/military/x40_y40/y40_mortar_faceright.gif) no-repeat center 0px;}
	]]></>.toXMLString();

	GM_addStyle(default_style);
	};

EmpireBoard.ARexx.RegisterAddOn(EmpireBoard.GraphicAddon);