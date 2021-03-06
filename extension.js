const vscode = require('vscode');
const path = require('path');
const fs = require("fs");
/**
 * @param {vscode.ExtensionContext} context
 */

function createFile(mdp, frontmatter) {
	if (!fs.existsSync(mdp)) {
		fs.writeFileSync(mdp, frontmatter);
	}
}

function activate(context) {

	const commond_text = 'tasklist.tasklist';

	let disposable = vscode.commands.registerCommand(commond_text, () => {
	const panel = vscode.window.createWebviewPanel(
		'Task List',
		'Task List',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true
		}
	);	

	const onDiskPath = vscode.Uri.file(
		path.join(context.extensionPath, 'main')
	);
		const base_url = panel.webview.asWebviewUri(onDiskPath);
		let data_list = initial_list();
		panel.webview.html = getWebviewContent(base_url,data_list);
		panel.webview.onDidReceiveMessage(
			message => {
				if(message.command == "update"){
					manage_list(message.text)
				}else if(message.command == "fill_input"){
					vscode.window.showErrorMessage(message.text);
				}
			},
			undefined,
			context.subscriptions
		);
	});
	context.subscriptions.push(disposable);

	TaskListStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 200);
	TaskListStatusBarItem.command = commond_text;
	TaskListStatusBarItem.text = `Task List`;
	TaskListStatusBarItem.show();
	context.subscriptions.push(TaskListStatusBarItem);
}

function manage_list(data=[]){
	const file_generator = path.join(__dirname,`main/tasklist.txt`);
	createFile(file_generator,`[]`)

	fs.writeFileSync(path.join(__dirname,`main/tasklist.txt`), `${data}`)
}

function initial_list(){

	const file_generator = path.join(__dirname,`main/tasklist.txt`);
	createFile(file_generator,`[]`)

	let main_data = fs.readFileSync(path.join(__dirname,`main/tasklist.txt`))
	return `${main_data}`;
}


function deactivate() {}

function getWebviewContent(base_url,data_list) {
	return `
	<html>
		<head>
			<title>Task List</title>
			<link href="${base_url}/main.css" rel="stylesheet">
			<link href="${base_url}/bootstrap.min.css" rel="stylesheet">
	        <link href="${base_url}/jquery-confirm.css" rel="stylesheet">
		</head>
		<body class="bg-dark">
		<div id="main_data_list" style="display:none">
		</div>
		<div class="container">
	    	<h2 class="text-center text-white animation">Task List</h2>
	            <hr class="bg-light">
	        	<div class="form-group">
	                <div class="row">
	                    
	                    <div class="col-3">
	                        <input type="text" class="form-control w-100" id="title_text" placeholder="Enter Task Title Here ">
	                    </div>

						<div class="col-3 form-group">
							<input  class="btn bg-white form-control-sm w-100" id="tag_text" value="" placeholder="Tag (Optional)" />
						</div>
						<div class="col-3 form-group">
							<select id="priority_id" class="btn form-control-sm  bg-light w-100">
								<option value=""  selected>Select Priority</option>
								<option value="3" >High - ???</option>
								<option value="2" >Med - ???</option>
								<option value="1" >Low - ???</option>
							</select>
						</div>
						<div class="col-3 form-group">
							<select id="status_id" class="btn form-control-sm bg-light w-100">
								<option value="1">Complete - ??????</option>
								<option value="2">In Progress - ????</option>
								<option value="3" selected>In Complete - ???</option>
								<option value="4">Hold - ????</option>
							</select>
						</div>

	                    <hr>
	                    
	                    <div class="col-6">
	                        <textarea  class="form-control w-100" style="min-width: 100%" id="description_text" placeholder="Enter Task More Details Here (Optional) "></textarea>
	                    </div>
						<div class="col-3 form-group">
							<input id="start_date" class="btn btn-sm bg-light form-control-sm w-100" type="text" placeholder="Start Date (Optional)" onclick="(this.type='datetime-local');this.showPicker()"/>
						</div>
						<div class="col-3 form-group">
							<input id="end_date" class="btn btn-sm bg-light form-control-sm w-100" type="text" placeholder="End Date (Optional)" onclick="(this.type='datetime-local');this.showPicker()"/>
						</div>

	                </div>
	        	</div>
	            <hr class="bg-info">
	            <div class="form-group row">
					<div class="col-2">
						<button onclick="add_item_list()" id="add_item_list" class="btn btn-sm btn-primary form-control-sm w-100">??? Add To List</button>

						<button onclick="update_item_list()" data-id="" id="update_item_list" class="btn btn-sm btn-primary w-100 form-control-sm d-none">???? Update</button>
					</div>
					<div class="col-2">
						<button onclick="clear_full_list()" id="clear_full_list" class="btn btn-sm btn-danger form-control-sm w-100">??? Clear Todo List</button>

						<button onclick="clear_update_list()" id="clear_update_list" class="btn btn-sm btn-danger form-control-sm w-100 d-none">??? Clear</button>
					</div>
					<div class="col-2">
						<button onclick="reset_entry_form();list_html();" class="btn btn-sm btn-warning form-control-sm w-100">??? Reset Filter</button>
					</div>
					<div class="col-2">
						<input type="text" class="btn btn-sm form-control-sm w-100 bg-white" id="search_text" onkeyup="search_text()" placeholder="Search ..."/>
					</div>
					<div class="col-2">
						<select id="search_priority_id" onchange="search_text()" class="btn btn-sm form-control-sm w-100 bg-white">
							<option value=""  selected>Filter By Priority</option>
							<option value="3" >High - ???</option>
							<option value="2" >Med - ???</option>
							<option value="1" >Low - ???</option>
						</select>
					</div>
					<div class="col-2">
						<select id="search_status_id" onchange="search_text()" class="btn btn-sm form-control-sm w-100 bg-white">
							<option value=""  selected>Filter By Status</option>
							<option value="1">Complete - ??????</option>
							<option value="2">In Progress - ????</option>
							<option value="3">In Complete - ???</option>
							<option value="4">Hold - ????</option>
						</select>
					</div>
            </div>
	        <hr class="bg-warning">
	        <ul id="todoList" class="container">
	        </ul>
	    </div>
		<script src = "${base_url}/jquery-1.10.2.js"></script>
	    <script src = "${base_url}/jquery-ui.js"></script>
	    <script src = "${base_url}/jquery-confirm.js"></script>
	    <script type="text/javascript">
			$("#main_data_list").html(JSON.stringify(${data_list}))
		</script>
	    <script type="text/javascript" src="${base_url}/main.js"></script>
	</body>
	</html>`;
}

module.exports = {
	activate,
	deactivate
}
