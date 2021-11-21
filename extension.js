const vscode = require('vscode');
const path = require('path');
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
			enableScripts: true
		}
	);	

	const onDiskPath = vscode.Uri.file(
		path.join(context.extensionPath, 'main')
		);
		const base_url = panel.webview.asWebviewUri(onDiskPath);
		panel.webview.html = getWebviewContent(base_url);
	});
	context.subscriptions.push(disposable);

	TaskListStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 200);
	TaskListStatusBarItem.command = commond_text;
	TaskListStatusBarItem.text = `Task List`;
	TaskListStatusBarItem.show();
	context.subscriptions.push(TaskListStatusBarItem);


	// context.subscriptions.push(vscode.window.registerWebviewViewProvider('tasklist-sidebar',));
}

function deactivate() {}

function getWebviewContent(base_url) {
	return `<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title>Task List</title>
			<link href="${base_url}/main.css" rel="stylesheet">
				<link href="${base_url}/bootstrap.min.css" rel="stylesheet">
		</head>
		<body>
		<div class="container">
			<h2 class="text-center">Task List App</h2>
				<div class="form-group">
					<label for="itemInput">Add Item</label>
					<input type="text" class="form-control" name="" id="itemInput" >
				</div>
					<button id="addButton" class="btn btn-primary">Add To List</button>
					<button id="clearButton" class="btn btn-danger">Clear Todo List</button>
			<h3>Todo List</h3>
			<ul id="todoList"></ul>
		</div>
		<script type="text/javascript" src="${base_url}/main.js"></script>
	</body>
	</html>`;
}

module.exports = {
	activate,
	deactivate
}
