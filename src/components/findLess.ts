
import * as vscode from 'vscode';

export async function findLess() {
	// The code you place here will be executed every time your command is executed
	// Display a message box to the user
	// vscode.window.showInformationMessage('Hello World from yn-helper!');

	let searchQueryString: string | undefined = await getInput();
	// demo
	// 输入 common-paginationTable-index__table_wrap--8makxoF4
	// 打开 common/paginationTable/index.less		搜索滚动至.table_wrap

	
	if(searchQueryString !== undefined) {
		let searchQueries: Array<string> = searchQueryString.split(' ');
		searchQueries.forEach(searchQuery => {
			findLessSingle(searchQuery);
		})
	}
}
function findLessSingle(searchQuery: string) {
	let [filePath, cssClassName] = searchQuery?.split("__");
	filePath = filePath.replace(/-/g, '\/');
	// const searchUrl = `https://www.codever.land/search?q=${searchQuery}&sd=my-snippets`;
	// vscode.env.openExternal(vscode.Uri.parse(searchUrl));

	// var setting: vscode.Uri = vscode.Uri.parse("untitled:" + "/src/bootstrap-amd.js");
	// var setting: vscode.Uri = vscode.Uri.file('/src/bootstrap-amd.js');

	var setting: vscode.Uri = vscode.Uri.file(`${vscode.workspace.rootPath}/src/${filePath}.less`);
	
	let className = cssClassName.split('--')[0];
	vscode.workspace.openTextDocument(setting).then((currentDoc: vscode.TextDocument) => {
		vscode.window.showTextDocument(currentDoc, {preview: false}).then(editor => {
			searchAndSelectAndReveal(editor, currentDoc, className);
		});
	}, (error: any) => {
			console.error("文件打开异常：", error);
			debugger;
	});
}
async function getInput() {
	let searchQuery: string | undefined = await vscode.window.showInputBox({
		placeHolder: "Search query",
		prompt: "Search my snippets on Codever",
		value: "common-paginationTable-index__table_wrap--8makxoF4"
	});
	if (!searchQuery) {
		vscode.window.showErrorMessage('A search query is mandatory to execute this action');
	}
	return searchQuery;
}

function searchAndSelectAndReveal(editor: vscode.TextEditor, currentDoc: vscode.TextDocument, className: string) {
	if (!editor) {
		console.log("no active Editor");
		return;
	}
	let fullText = currentDoc.getText();
	let classIndex = fullText.indexOf(className);
	const range = currentDoc.getWordRangeAtPosition(currentDoc.positionAt(classIndex));
	if (range) {
		// then you can get the word that's there:
		const word = currentDoc.getText(range); // get the word at the range
		// or modify the selection if that's really your goal:
		editor.selection = new vscode.Selection(range.start, range.end);
		
		editor.revealRange(range);
		vscode.commands.executeCommand('editor.action.addSelectionToNextFindMatch');
		// vscode.commands.executeCommand('actions.find');
	}
}

