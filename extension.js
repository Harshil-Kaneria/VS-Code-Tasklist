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
		<body>
		<div id="main_data_list" style="display:none">
		</div>
		<div class="container">
			<h2 class="text-center">Task List App</h2>
				<div class="form-group">
					<label for="itemInput">Add Item</label>
					<input type="text" class="form-control" name="" id="itemInput">
				</div>
				<button id="addButton" class="btn btn-primary">Add To List</button>
				<button id="clearButton" class="btn btn-danger">Clear Todo List</button>
			<h3>Todo List</h3>
			<ul id="todoList"></ul>
		</div>
		<script type="text/javascript">
			document.getElementById('main_data_list').innerHTML = JSON.stringify(${data_list});
		</script>
		<script type="text/javascript" src="${base_url}/main.js"></script>
	</body>
	</html>`;
}

module.exports = {
	activate,
	deactivate
}
