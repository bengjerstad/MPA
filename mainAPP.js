//imports
window.$ = window.jQuery = require('./jquery-3.4.0.min.js');
const csv=require('csvtojson');
const exec = require('child_process').exec;
const fs = require('fs');
const {shell} = require('electron');
const electron = require('electron');

//Set external program and file paths
var path = {};
//SetPath to folder that conatains data
path.data = "Data\\";
//add other programs here.
path.OtherProgram = "C:\\Program Files\\...";

//globals
//  Modules Global
var Modules = [];
//  Other Globals
var AdvSDisabled = 0;

//Universal Functions
//  GUI and Nav
function Clear(id){
	$("#"+id).html("");
}
function ClearHide(id){
	$("#"+id).hide('fast');
}
function Max(id){
	$("#"+id).toggleClass('max', 'addOrRemove');
	//$("#"+id).addClass('max');
}
function Min(id){
	$("#"+id).removeClass('max');
}

// Search
//  Generic Search Function
function searchData(){
	$("#col0").html("");
	$("#col1").html("");
	$("#col2").html("");
	var search = $("#in0").val().toLowerCase();
	if (search != ''){
		CurrentData = $("#SearchData").val();
		var lastvar = '';
		window[CurrentData].forEach(function(row,rownumber){
			lastvar = window['search'+CurrentData](row,rownumber,search,lastvar);
		});
	}
}
//  Extra Search Features
function ViewMoreSearch(){
	if ($("#AdvS").html() == ''){
	   $("#AdvS").html('<span id="AdvSDisabledButton" class="off" onclick="ToggleAdvSDisabled();">Disabled</a>');
	   $("#ViewMoreSearchButton").css("transform","scale(-1, 1)");
	}
	else{
	   $("#AdvS").html("");
	   $("#ViewMoreSearchButton").css("transform","scale(1, 1)");
	   AdvSDisabled = 0;
	}
}
function ToggleAdvSDisabled(){
	if (AdvSDisabled == 0){
	   AdvSDisabled = 1;
	   $("#AdvSDisabledButton").attr('class','good');
	}
	else{
	   AdvSDisabled = 0;
	   $("#AdvSDisabledButton").attr('class','off');
	}
}
function ClickFirstOption(){
	$("#col0 a").first().trigger('click');
}
//  Stat Functions
function Stat(msg){
	logmsg = msg+' '+new Date().toLocaleTimeString()+"\r\n";
	fs.appendFile('statlog.log', logmsg, function (err) {if (err) {console.log(err)}});	 
	$("#stat").html(logmsg);
}
function MaxStat(){ 
	fs.readFile('statlog.log', function (err,statloglines) {
		if (err) {console.log(err)}
		$("#stat").html('<a href="#" onclick="MinStat();"><img class="nav-icon" src="images/cancel.svg" /></a>');
		lines = statloglines.toString().split("\r\n");
		
		lines.forEach(function(line) {
			$("#stat").append('<br/>'+line);
		});
		
		$("#stat").css({"height":"100%"});
		//$("#stat").attr( "onClick", "MinStat()" );
		$("#stat").attr( "onClick", "" );
	});	
}
function MinStat(){ 
	fs.readFile('statlog.log', function (err,data) {
		if (err) {console.log(err)}
		else{
			//$("#stat").html(data);
			$("#stat").html('<a href="#" onclick="MaxStat();"><img class="nav-icon" src="images/cancel.svg" /></a>');
			$("#stat").css({"height":"1em"});
			//$("#stat").attr( "onClick", "MaxStat()" );
			}
	});	
}
function KeepLogStat(line){
	fs.appendFile(path.data+'MPA.log', line+"\r\n", function (err) {if (err) {console.log(err)}});
} 
function ClearStat(){ 
	fs.readFile('statlog.log', function (err,statloglines) {
		if (err) {console.log(err)}
		lines = statloglines.toString().split("\r\n");
		lines.forEach(function(line) {
			if (line.includes('AD Change')){
				KeepLogStat(line);
			}
			if (line.includes('Unlocked account')){
				KeepLogStat(line);
			}
				if (line.includes('R:')){
				KeepLogStat(line);
			}
		});
		logmsg = 'R:'+new Date().toDateString()+' '+new Date().toLocaleTimeString()+"\r\n";
		fs.writeFile('statlog.log', logmsg, function (err) {if (err) {console.log(err)}});
	});	
	
}
//External Functions
// Anonymous Launch - Register programs to run at top of script in object path
function Launch(program){
	o = exec('"'+path[program]+'"',(error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			Stat('Error: '+error);
			return;
		}
	});	
}
