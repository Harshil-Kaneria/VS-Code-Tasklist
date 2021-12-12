const vscode = require('vscode');
const path = require('path');
const fs = require("fs");
/**
 * @param {vscode.ExtensionContext} context
 */

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
	fs.writeFileSync(path.join(__dirname,`main/tasklist.txt`), `${data}`)
}

function initial_list(){
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
		</head>
		<body class="bg-dark">
		<div id="main_data_list" style="display:none">
		</div>
		<div class="container">
			<h2 class="text-center text-white">Todo List App</h2>
				<hr class="bg-light">
				<div class="form-group">
					<div class="row">
						<div class="col-12">
							<input type="text" class="form-control" id="itemInput" placeholder="Enter Task Title Here ">
						</div>
						<hr>
						<div class="col-12">
							<textarea  class="form-control" style="min-width: 100%" id="itemDetailsInput" placeholder="Enter Task More Details Here (Optional) "></textarea>
						</div>
					</div>
				</div>
				<hr class="bg-info">
				<div class="row mt-2">
                <div class="col-3">
                    <button id="addButton" class="btn btn-primary mt-1">➕ Add To List</button>
                </div>
                <div class="col-3">
                    <button id="clearButton" class="btn btn-danger mt-1">⛔ Clear Todo List</button>
                </div>
            </div>
			<hr class="bg-danger">
			<h3 class="text-warning mt-2">Todo List</h3>
			<hr class="bg-warning">
			<ul id="todoList" class="container"></ul>
		</div>
		<script type="text/javascript">
			document.getElementById('main_data_list').innerHTML = JSON.stringify(${data_list});
		</script>
		<script type="text/javascript" src="${base_url}/main.js"></script>
		<script src = "${base_url}/jquery-1.10.2.js"></script>
		<script src = "${base_url}/jquery-ui.js"></script>
		<script>
			$(function() {
				$("#todoList").sortable({
					start: function(event, ui) {
						var start_pos = ui.item.index();
						ui.item.data('start_pos', start_pos);
					},
					update: function(event, ui) {
						var arr_pos_start = ui.item.data('start_pos');
						var arr_pos_end = ui.item.index();
						
						listArray = moveArrayItemToNewIndex(listArray,arr_pos_start,arr_pos_end);
						refreshLocal();
					}
				});
			});
		</script>
	</body>
	</html>`;
}

module.exports = {
	activate,
	deactivate
}
