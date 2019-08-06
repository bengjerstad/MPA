//Register Module
Modules.push('Users');

//Load Data

var ADUsers;
csv().fromFile(path.data+'ADUsers.csv').then((jsonObj)=>{ADUsers = jsonObj;});

//Search Function
function searchADUsers(row,rownumber,search,lastvar){
	if (row.Enabled == 'True' || AdvSDisabled == 1){
		if (row.SamAccountName.toLowerCase().includes(search) || row.displayName.toLowerCase().includes(search) || row.telephoneNumber.includes(search)){
		    ou = getoufromdn(row.distinguishedname);
			  onc = "viewADUser('"+rownumber+"')";
			  data = '<br/><a href="#" onclick="'+onc+'">'+row.SamAccountName+'</a>';
				$("#col0").append(data);
				$("#col1").append("<br/>"+row.displayName);
				$("#col2").append("<br/>"+row.telephoneNumber);
		}
   }
}

//Append Links to Nav
$("#nav1>ul").ready(function() {
	$("#nav1>ul").append('<hr/>');
	$("#nav1>ul").append('<li><a href="#" onclick="GetLockedOutUsers();">Locked Out Users</a></li>');
});

//user Functions
function viewADUser(id){
	//clear and show
	$('#viewLeft > span:not(.ADLabel)').each(function () { 
		$(this).text("");
	});
	$("#viewRight").html("");
	$("#viewUserspane").show("fast");
	ADUsers.forEach(function(row,rownumber){
	   if (rownumber == id){
		$("#ADUser_displayName").append(row.displayName);
 	    $("#ADUser_SamAccountName").append('<span id="viewADUserSAM">'+row.SamAccountName+'</span>');
		$("#ADUserOU").append(getoufromdn(row.distinguishedname));
	    $("#ADUser_telephoneNumber").append(row.telephoneNumber);
		$("#ADUser_mobile").append(row.mobile);
		$("#ADUser_mail").append(row.mail);
		$("#ADUser_employeeID").append(row.employeeID);
		$("#ADUser_title").append(row.title);
		$("#ADUser_employeeType").append(row.employeeType);
		$("#ADUser_carLicense").append(row.carLicense);
		$("#ADUser_Departmentnumber").append(row.Departmentnumber);
		$("#ADUser_department").append(row.department);
		$("#ADUser_userType").append(row.userType);
	   }
   	});
}

function EditModeADUser(EditField){
	//alert(EditField);
	if (EditField == 'ADUserDept'){
		sam = $('#ADUser_SamAccountName').text();
		
		cvADUser_Departmentnumber = $("#ADUser_Departmentnumber").text();
		$("#ADUser_Departmentnumber").html('<input id="ADUser_Departmentnumber_Edit" value="'+cvADUser_Departmentnumber+'"/>')
		//Departmentnumberval = $('#ADUser_Departmentnumber_Edit').val();
		$("#ADUser_Departmentnumber").append('<a href="#" onclick="SetADUserAdv(\''+sam+'\',\'Departmentnumber\',$(\'#ADUser_Departmentnumber_Edit\').val());">Save</a>')
		$("#ADUser_Departmentnumber").append(' <a href="#" onclick="ClearEditADUser(\''+EditField+'\');">X</a><br/>')
		
		cvADUser_department = $("#ADUser_department").text();
		$("#ADUser_department").html('<input id="ADUser_department_Edit" value="'+cvADUser_department+'"/>')
		//departmentval = $('#ADUser_department_Edit').val();
		$("#ADUser_department").append('<a href="#" onclick="SetADUserAdv(\''+sam+'\',\'department\',$(\'#ADUser_department_Edit\').val());">Save</a>')
		$("#ADUser_department").append(' <a href="#" onclick="ClearEditADUser(\''+EditField+'\');">X</a>')
	}
	else{
		currentval = $("#"+EditField).text();
		$("#"+EditField).html('<input id="ADUser_Edit" value="'+currentval+'"/>');
		sam = $('#ADUser_SamAccountName').text();
		what = EditField.split('_')[1];
		//val = $('#ADUser_Edit').val();
		$("#"+EditField).append('<a href="#" onclick="SetADUserAdv(\''+sam+'\',\''+what+'\',$(\'#ADUser_Edit\').val());">Save</a>')
		$("#"+EditField).append(' <a href="#" onclick="ClearEditADUser(\''+EditField+'\');">X</a>')
	}
}
function ClearEditADUser(EditField){
	if (EditField == 'ADUserDept'){
		Departmentnumberval = $("#ADUser_Departmentnumber_Edit").val();
		$("#ADUser_Departmentnumber").text(Departmentnumberval);
		departmentval = $("#ADUser_department_Edit").val();
		$("#ADUser_department").text(departmentval);
	}
	else{
		currentval = $("#ADUser_Edit").val();
		$("#"+EditField).text(currentval);
	}
}

//Powershell Features
function GetLockedOutUsers(){
	   cmd = 'powershell "Search-ADAccount -Locked | select SamAccountName"';
	   o = exec(cmd,(error, stdout, stderr) => {
  		if (error) {
    		   console.error(`exec error: ${error}`);
		   Stat('Error: '+error);
    		   return;
  		}
		else{
		   lines = stdout.split("\r\n")
		   amt = lines.length-6;
		   if (amt >= 1){
			   //$("#viewpane").show("fast");
			   $("#LockedOutUsers").html('');
			   lines.forEach(function(line){
				  if (line != "" && !(line.includes('-----')) && !(line.includes('SamAccountName'))){
				$("#LockedOutUsers").append('</br/> <a href="#" onclick="viewADUser(\''+SamToID(line.trim())+'\')">'+line.trim()+'</a> ');
				unlockcode = ' <a href="#" onclick="UnlockAccount(\''+line.trim()+'\')">Unlock</a>';
				$("#LockedOutUsers").append(unlockcode);
				  }
			   });
		   }
		   if (amt < 1){
			Stat('<span class="good">No Users are Locked Out</span> ');
			$("#LockedOutUsers").html('');
		   }
		   if (amt == 1){
			Stat('<span class="bad">1 user is Locked Out</span>');
		   }
		   if (amt > 1){
			Stat('<span class="bad">'+amt+' users are Locked Out</span>');
		   }

		   return;
		}
	});
}
function GetGroups(username){
	cmd = 'powershell "Get-ADPrincipalGroupMembership '+username+' | select distinguishedName"';
	o = exec(cmd,(error, stdout, stderr) => {
  	if (error) {
    		console.error(`exec error: ${error}`);
		Stat('Error: '+error);
    		return;
  	}
	else{
		if ($("#viewGroups0").html() == ''){
		   GroupNum = 0;
		}
		else{
		   GroupNum = 1;
		}
		
		$("#viewGroups"+GroupNum).html('<span style="text-align: center;">'+username+':</span>');
		$("#viewGroups"+GroupNum).show("fast");
		$("#viewGroups"+GroupNum).append('<a href="#" onclick="Clear(\'viewGroups'+GroupNum+'\');" style="float:right;"><img class="nav-icon" src="images/cancel.svg"/></a>');
		   lines = stdout.split("\r\n")
		   lines.forEach(function(line){
		      if (line != "" && !(line.includes('---')) && !(line.includes('distinguishedName'))){
			   $("#viewGroups"+GroupNum).append('</br/>'+line.trim());
		      }
		   });
		   return;
	}
	});
}
function UnlockAccount(sam){
	o = exec('powershell "Unlock-ADAccount -Identity '+sam+'"',(error, stdout, stderr) => {
  		if (error) {
			//Insufficient access rights to perform the operation
			if(error.message.includes("Insufficient access rights")){
				Stat('Error: Insufficient access rights to unlock this account.');
			}
			else{
				console.error(`exec error: ${error}`);
				Stat('Error: '+error);
			}
    		return;
  		}
		else{
		   Stat('Unlocked account: '+sam);
		   viewADUser(SamToID(sam));
		   GetLockedOutUsers();
		}
	});
}
function GetADUserlive(sam,callback){
	pscmd = "get-aduser -Identity "+sam+" ";
	pscmd += "-Properties SamAccountName,displayName,Enabled,givenName,sn,distinguishedname,mail,mailnickname,department,Departmentnumber,employeeID,employeeType,mobile,telephoneNumber,facsimileTelephoneNumber,title,AccountExpires,pwdlastset,lastLogon,carLicense,whenCreated,userType"
	pscmd += "| select SamAccountName,displayName,Enabled,givenName,sn,distinguishedname,mail,mailnickname,department,@{N='Departmentnumber';E={$_.Departmentnumber[0]}},employeeID,employeeType,mobile,telephoneNumber,FAX,title,";
	pscmd += "@{N = 'pwdlastset'; E = {[DateTime]::FromFileTime($_.pwdlastset)}}, ";
	pscmd += "@{N = 'AccountExpires'; E = {[DateTime]::FromFileTime($_.AccountExpires)}}, @{N = 'LastLogon'; E = {[DateTime]::FromFileTime($_.LastLogon)}},@{N='carLicense';E={$_.carLicense[0]}},";
	pscmd += "whenCreated,userType";
	o = exec('powershell -command "'+pscmd+'"',(error, stdout, stderr) => {
  		if (error) {
			//console.log(error);
			//Cannot find an object with identity
			if (error.message.includes('Cannot find an object with identity')){
				Stat('AD Account not found');
				window[callback]('AD Account not found');
			}
			else{
				console.log(error);
			}
			
		}
		else{
			console.log(stdout);
			window[callback](stdout);
		}
	});
}
function SetADUserAdv(sam,what,val){
	//alert("VAL: "+val);
	o = exec('powershell -command "Set-ADUser -Identity '+sam+' -Add @{\''+what+'\'=\''+val+'\'}"',(error, stdout, stderr) => {
  		if (error) {
			console.log(error);
			Stat('Error: '+error);
		}
		else{
			console.log(stdout);
			if (stdout = 0){
				Stat("AD Change: "+what+" set to "+val+" on user "+sam);
			}
		}
	});
}
//  Converters
function SamToID(sam){
	//Requires ADUsers
	out = ''
	ADUsers.forEach(function(row,rownumber){
	   if (row.SamAccountName == sam.trim()){
		out = rownumber;
	   }
	});
	return out;
}
function FullNameToID(fname){
	//Requires ADUsers
	out = ''
	ADUsers.forEach(function(row,rownumber){
	   if (row.displayName == fname.trim()){
		out = rownumber;
	   }
	});
	return out;
}
function getoufromdn(dn){
	dn = dn.split(',');
	ou = '';
	dn.forEach(function(dnx){
		dnx0 = dnx.split('=')[0]
		dnx1 = dnx.split('=')[1]
		if (dnx0 == 'OU' && dnx1 != "LWC"){
		      ou += dnx1;
		      //$("#view").append("<br/>"+dnx);
		}
	});
	return ou
}
