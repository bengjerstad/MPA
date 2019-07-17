//Register Module
Modules.push('Markdown');

const marked = require('marked');

//Need to set this to the root location of the MarkDown Files
path.Markdowndata = "Markdowns\\";

//MarkDown Functions
function LoadMDList(loc){
	fs.readdir(path.Markdowndata+loc, (err, files) => {
		$("#nav1sub0").html("");
  		files.forEach(file => {
		   if (file.includes(".md")){
		      $("#nav1sub0").append("<br/><a href='#' onclick='ShowMD(\""+file+"\",\""+loc+"\");'> "+file.split(".")[0]+"</a>");
		   }
  		});
		$("#nav1sub0").append("<br/><a href='#' onclick='NewMD(\""+loc+"\");'>+</a>");
	});
}
function ShowMD(file,loc){
	fs.readFile(path.Markdowndata+loc+'\\'+file, 'utf8', function (err, data) {
  		if (err) {Stat('Error: '+err);}
		$("#viewMD").html(marked(data));
		$("#viewMDnav").html('<a href="#" onclick="EditMD(\''+file+'\',\''+loc+'\');">Edit</a>');
		$("#viewMarkdownpane").show("fast");
	});
	 
}
function NewMD(loc){
	$("#viewMD").html('<h1>New '+loc+'</h1>Name: <input id="MDName"/> <a href="#" onclick="NewMDCallBack(\''+loc+'\');">Add</a>');
}
function NewMDCallBack(loc){
	file = $("#MDName").val();
	SaveMD(file+".md",loc);
	LoadMDList(loc);
	//EditMD(file+".md",loc,loc);
	Stat('New '+loc+'\\'+file+".md");
}
function EditMD(file,loc){
	fs.readFile(path.Markdowndata+loc+'\\'+file, 'utf8', function (err, data) {
  		if (err) {Stat('Error: '+err);}
		$("#viewMD").html('<textarea id="MDData" cols="91" rows="50">'+data+'</textarea>');
		$("#viewMDlow").html('Edit '+loc+'\\'+file+' <a href="#" onclick="SaveMD(\''+file+'\',\''+loc+'\');">Save</a>');
		//$("#stat").html('Editing '+loc+'\\'+file);
	});
	 
}
function SaveMD(file,loc){
	data = $("#MDData").val();
	if (data == null){data = '';}
	fs.writeFile(path.Markdowndata+loc+'\\'+file, data, function (err) {
  		if (err) {Stat('Error: '+err);}
		else{
			Stat('Saved '+loc+'\\'+file);
			ShowMD(file,loc);
		}
	});	 
}
