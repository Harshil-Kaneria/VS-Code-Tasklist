const vscode = acquireVsCodeApi();

function change_list(data=[])
{
    vscode.postMessage({
        command: 'update',
        text: data
    });
}

function fill_input()
{
    vscode.postMessage({
        command: 'fill_input',
        text: 'Please Fill Input Box Properly'
    });
}


var addButton = document.getElementById('addButton');
var addInput = document.getElementById('itemInput');
var todoList = document.getElementById('todoList');
var main_data_list = document.getElementById('main_data_list');
var listArray = [];
//declare addToList function


function listItemObj(content, status) {
    this.content = '';
    this.status = 'incomplete';
}
var changeToComp = function(){
    var parent = this.parentElement;
    console.log('Changed to complete');
    parent.className = 'uncompleted alert alert-success row';
    this.innerText = 'Incomplete';
    this.className = 'btn btn-dark col';
    this.removeEventListener('click',changeToComp);
    this.addEventListener('click',changeToInComp);
    changeListArray(parent.firstChild.innerText,'complete');

}

var changeToInComp = function(){
    var parent = this.parentElement;
    console.log('Changed to incomplete');
    parent.className = 'completed alert alert-danger row';
    this.innerText = 'Complete';
    this.className = 'btn btn-success col';
    this.removeEventListener('click',changeToInComp);
    this.addEventListener('click',changeToComp);

    changeListArray(parent.firstChild.innerText,'incomplete');

}

var removeItem = function(){
    var parent = this.parentElement.parentElement;
    parent.removeChild(this.parentElement);

    var data = this.parentElement.firstChild.innerText;
    for(var i=0; i < listArray.length; i++){

        if(listArray[i].content == data){
            listArray.splice(i,1);
            refreshLocal();
            break;
        }
    }
}

//function to change the todo list array
var changeListArray = function(data,status){

    for(var i=0; i < listArray.length; i++){

        if(listArray[i].content == data){
            listArray[i].status = status;
            refreshLocal();
            break;
        }
    }
}

//function to chage the dom of the list of todo list
var createItemDom = function(text,status){
    var listItem = document.createElement('li');
    var itemLabel = document.createElement('label');
    var itemCompBtn = document.createElement('button');
    var itemIncompBtn = document.createElement('button');
    listItem.className = (status == 'incomplete')?'completed alert alert-danger row':'uncompleted alert alert-success row';
    itemLabel.innerText = text;
    itemLabel.className = 'col-8';
    itemCompBtn.className = (status == 'incomplete')?'btn btn-success col':'btn btn-dark col';
    itemCompBtn.innerText = (status == 'incomplete')?'Complete':'Incomplete';
    if(status == 'incomplete'){
        itemCompBtn.addEventListener('click',changeToComp);
    }else{
        itemCompBtn.addEventListener('click',changeToInComp);
    }
    itemIncompBtn.className = 'btn btn-danger col';
    itemIncompBtn.innerText = 'Delete';
    itemIncompBtn.addEventListener('click',removeItem);

    listItem.appendChild(itemLabel);
    listItem.appendChild(document.createElement('p'));
    listItem.appendChild(itemCompBtn);
    listItem.appendChild(itemIncompBtn);

    return listItem;
}

var refreshLocal = function(){
    var todos = listArray;
    // localStorage.removeItem('todoList');
    // localStorage.setItem('todoList', JSON.stringify(todos));
    change_list(JSON.stringify(todos));
}

var addToList = function(){

    if(addInput.value==""){
        fill_input();
        return;
    }

    var newItem = new listItemObj();
    newItem.content = addInput.value;
    listArray.push(newItem);
    //add to the local storage
    refreshLocal();
    //change the dom
    var item = createItemDom(addInput.value,'incomplete');
    todoList.appendChild(item);
    addInput.value = '';
}

//function to clear todo list array
var clearList = function(){
    listArray = [];
    // localStorage.removeItem('todoList');
    change_list(JSON.stringify(listArray));
    todoList.innerHTML = '';
}

window.onload = function(){

    // var list = localStorage.getItem('todoList');

    let list = main_data_list.innerHTML;

    if (list != null) {
        todos = JSON.parse(list);
        listArray = todos;
        for(var i=0; i<listArray.length;i++){
            var data = listArray[i].content;
            var item = createItemDom(data,listArray[i].status);
            todoList.appendChild(item);
        }
    }
};

//add an event binder to the button
addButton.addEventListener('click',addToList);
clearButton.addEventListener('click',clearList);


document.getElementById("itemInput").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        addButton.click();
    }
});
