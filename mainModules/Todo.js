// Every day - I have a list of things to do in the day. 
// Once complete, items drop off my list.
// Some things repeat other things are one offs.
// Tasks are located in MyCal.csv, located in the data folder.
// MyCal.csv Cols: ID,Date,Name,ActionType,ActionName,Done
// MyCal.csv Done col: is Yes or No
// Some actions use Functions from Other Modules: Markdown(Line 75), Tickets(Line 77)
// Also need a JSON file named Todo.json

//Register Module
Modules.push('Todo');

//Load Data
var Mycal;
csv().fromFile(path.data+'MyCal.csv').then((jsonObj)=>{Mycal = jsonObj;})
.then(()=>{
	//Check to see if we have added daily todorepeats already today, if not AddRepeats()
	// Look for a row with todays date and the name of 'AssignTasks'
	dailydone = 0;
	
	Mycal.forEach(function(row,rownumber){
		if (row.Date == today.toLocaleDateString()){
			if (row.Name == 'AssignTasks'){
				dailydone = 1;
			}
		}
	});
	if (dailydone == 0){
		AddRepeats();
	}
	

	})
.then(()=>{
	//after data is loaded:
	$("#viewTodopane").ready(function() {
		//after view pain is loaded:
		viewTodos(1);
		//add additional top bar navigation
		$("#viewTodopane>.viewnav").prepend('<a href="#" onclick="NewToDo();"><img class="nav-icon rot45d" src="images/cancel.svg"/></a>');
	});
});

//Append Links to Nav
$("#nav1>ul").ready(function() {
	$("#nav1>ul").append('<hr/>');
	$("#nav1>ul").append('<li><a href="#" onclick="viewTodos(0);">Completed</a></li>');
});

//add links to Viewpane Nav
//$("#viewMarkdownpane>.viewnav").prepend('<a id="MarkdownEditButton" href="#" onclick="EditMD(\''+file+'\',\''+loc+'\');">Edit</a>');
$("#viewTodopane>.viewnav").ready(function() {
	$("#viewTodopane>.viewnav").prepend('<a href="#" onclick="NewToDo();"><img class="nav-icon rot45d" src="images/cancel.svg"/></a>');
});

//TodoList functions
function viewTodos(showdone){
	todaysdate = today.toLocaleDateString();
	//$("#viewTodopane").show("fast");
	//var datestring = today.getDate()  + "-" + (today.getMonth()+1) + "-" + today.getFullYear();
	
	var options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	var prnDt = today.toLocaleDateString('en-us', options);
	$("#viewTodopane H1").html(prnDt);
	$("#ViewTodoList").html('');
	cnt = 0;
	
	Mycal.forEach(function(row,rownumber){
		if (todaysdate >= row.Date){
			style = '';
			if (row.Done == 'Yes'){
				style = ' style="text-decoration: line-through;"';
			}
			
			Action = 'ShowMD(\''+row.ActionName+'.md\',\''+row.ActionType+'\');';
			if (row.ActionType == 'Ticket'){
				Action = 'OpenTicket(\''+row.ActionName+'\');';
			}
			if (row.ActionType == 'Website'){
				Action = 'shell.openExternal(\''+row.ActionName+'\');';
			}
			html = '<br/><input type="checkbox" onclick="MarkDone('+row.ID+');"/><span'+style+'><a href="#" onclick="'+Action+'"> '+row.Name+'</a></span>';
			if (showdone == 1 && row.Done != 'Yes'){
				$("#ViewTodoList").append(html);
				cnt += 1;
			}
			if (showdone == 0){
				$("#ViewTodoList").append(html);
				cnt += 1;
			}
	   }
	});
	if (cnt > 0){
		$("#viewTodopane").show("fast");
	}
	else{
		//append 'new todo' link if no todo in data.
		$("#nav1>ul").ready(function() {
			$("#nav1>ul").append('<a href="#" onclick="NewToDo();"><img class="nav-icon rot45d" src="images/cancel.svg"/>Tasks</a>');
		});
	}
}

function MarkDone(id){
	Mycal.forEach((row,rownumber) =>{
		if (id == row.ID){
			Mycal[rownumber].Done = 'Yes';
	   }
	});
	SaveData('Mycal','MyCal.csv')
	.then((t)=>{viewTodos(1);});
}



function NewToDo(){
	$("#RepeatOptions").html("");
	$("#viewTodopane").show("fast");
	$("#NewTodo").show("fast");
	clearallinputs("NewTodo");
}
function AddNewTodo(newName,newActionType,newActionName,Done){
	CurrentLength = Mycal.length
	newID = parseInt(Mycal[CurrentLength-1].ID)+1
	
	Mycal[CurrentLength] = {'ID':newID, 'Date':today.toLocaleDateString(),'Name':newName,'ActionType':newActionType,'ActionName':newActionName,'Done':Done}
	SaveData('Mycal','MyCal.csv')
	.then((t)=>{viewTodos(1);});
	$("#NewTodo").hide("fast");
}
function ShowRepeat(){
	//if ($("#TodoRepeat").attr('checked')){
		$("#RepeatOptions").append('<br/><select id="TodoFreq" onchange="ChangeFreq();">');
		$("#TodoFreq").append('<option value="Daily">Daily</option>');
		$("#TodoFreq").append('<option value="Weekly" selected>Weekly</option>');
		$("#TodoFreq").append('<option value="Monthly">Monthly</option>');
		$("#TodoFreq").append('<option value="Yearly">Yearly</option>');
		$("#TodoFreq").append('</select>');
		$("#RepeatOptions").append('<br/><select id="TodoWhen">');
		$("#RepeatOptions").append('</select>');
		ChangeFreq();
	//}
}
function ChangeFreq(){
	$("#TodoWhen").html("");
	if ($("#TodoFreq").val() == "Weekly"){
		$("#TodoWhen").append('<option value="Monday">Monday</option>');
		$("#TodoWhen").append('<option value="Tuesday">Tuesday</option>');
		$("#TodoWhen").append('<option value="Wednesday">Wednesday</option>');
		$("#TodoWhen").append('<option value="Thursday">Thursday</option>');
		$("#TodoWhen").append('<option value="Friday">Friday</option>');
	}
	if ($("#TodoFreq").val() == "Monthly"){
		for (i = 1; i < 31; i++) { 
			$("#TodoWhen").append('<option value="'+i+'">'+i+'</option>');
		}
	}
}

function AddRepeats(){
		fs.readFile('mainModules/Todo.json', function (err,output) {
		if (err) {console.log(err)}
		todorepeats = JSON.parse(output);
		
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		
		for (day in todorepeats.Weekly){
			//console.log(day)
			if (day == days[today.getDay()]){
				//console.log(todorepeats.Weekly[day]);
				dailytasks = todorepeats.Weekly[day];
				for (task in dailytasks){
					//console.log(task,dailytasks[task].Name);
					AddNewTodo(task,dailytasks[task].Type,dailytasks[task].Name,'No');
				}
				AddNewTodo('AssignTasks','Daily',day,'Yes');
			}
		}
	});	
}
