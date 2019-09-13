# MPA
MPA - My Personal AdminConsole

## Installation
1. Install NodeJS
1. Install electron
1. npm csvtojson

## Configure
1. In mainAPP.js, set path.data to a location for storing csv data files.
1. In mainAPP.js, set path.[Program] to a location of external programs avaible to launch.
1. Install any additnal Modules.

## Install of Modules
1. Javascript Modules:
   1. Place the Module in the mainModules folder
   2. Open the .js file and configure any settings.
   3. Add the .js script to the top of index.html:
  ```
	<script src="mainAPP.js"></script>
	<script src="mainModules\Users.js"></script>
	<script src="mainModules\Markdown.js"></script>
	<link rel="stylesheet" type="text/css" href="main.css"/>
 ```
2. Non-Javascript Modules(ie Python or PowerShell), Place in the modules folder

## Included Modules
### Users
* Search for users from a data dump of AD. 
* Quickly review AD information and propteries about a single user. 
* A launching point for other functions and modules:
   * Unlock users accounts.
   * Change Properties and Attributes of users accounts. 
   * Can tie into a ticking module to find and create tickets.
   * Can tie into a computer module to find info about the users computer.
   * Can tie into an account creation module to get and set Properties and Attributes from AD 
   
The name of the dump file is ADUsers.csv, located in the data folder. This can be changed to meet your needs. 
Double check the names of the colloms in the Datadump with names used throughout the module. 

### Todo
Goal: 
Every day, I have a list of things to do in the day. 
Once complete, items drop off my list.
Some things repeat other things are one offs.

Tasks are located in MyCal.csv, located in the data folder. This can be changed to meet your needs. 

MyCal.csv Cols: ID,Date,Name,ActionType,ActionName,Done
MyCal.csv Done col: is Yes or No

Some actions use Functions from Other Modules: Markdown(Line 75), Tickets(Line 77)
Also need a JSON file named Todo.json

### Markdown
Goal: 
After converting all documentation to Markdown, view and edit the markdown as needed.

Need to set the path.Markdowndata to the root location of all markdown.
Can sub sort all files. 

In a markdown file, you can link to other markdowns like this:
  ```
<a href="#" onclick="ShowMD('Windows10.md','OS');">Windows10</a>
  ```
