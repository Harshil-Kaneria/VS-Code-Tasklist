var addButton = document.getElementById('addButton');
var addInput = document.getElementById('itemInput');
var addDetailsInput = document.getElementById('itemDetailsInput');
var todoList = document.getElementById('todoList');
var listArray = [];
var editItemId;
//declare addToList function

function random_number(){
    return (Math.floor(Math.random() * 1000) + 1).toString()+Date.now()+(Math.floor(Math.random() * 1000) + 1).toString();
}

function moveArrayItemToNewIndex(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; 
};

function listItemObj(content, status) {
    this.id = '';
    this.content = '';
    this.details = '';
    this.status = 'incomplete';
}
var changeToComp = function(item){

    item.innerText = "⌛ Incomplete";
    item.className = "btn btn-dark";
    item.parentNode.parentNode.className = "uncompleted alert alert-success row";
    item.setAttribute('onclick','changeToInComp(this)');
    changeListArray(item.parentNode.previousElementSibling.previousElementSibling.innerText,'complete');

}

var changeToInComp = function(item){
    
    item.innerText = "✔️ Complete";
    item.className = "btn btn-success";
    item.parentNode.parentNode.className = "completed alert alert-danger row";
    item.setAttribute('onclick','changeToComp(this)');
    changeListArray(item.parentNode.previousElementSibling.previousElementSibling.innerText,'incomplete');

}

var removeItem = function(item){
    
    var data = item.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.innerText;


    var parent = item.parentNode.parentNode;
    parent.remove(this);
    for(var i=0; i < listArray.length; i++){

        if(listArray[i].id == data.trim()){
            listArray.splice(i,1);
            refreshLocal();
            break;
        }
    }
}

var editItem = function(item){

    var data = item.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerText.trim();

    var title = item.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.innerText.trim();
    var content = item.parentNode.nextElementSibling.innerText.trim();

    var id = item.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerText.trim();

    editItemId = id;

    document.getElementById("itemInput").value = title;
    document.getElementById("itemDetailsInput").innerText = content;

    document.getElementById("itemInput").removeEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            addButton.click();
        }
    });

    addButton.removeEventListener("click", addToList)
    document.getElementById('addButton').id = 'editButton';
    document.getElementById('editButton').innerText = '📝 Update';

    clearButton.removeEventListener("click", clearList)
    document.getElementById('clearButton').id = 'clearEditButton';
    document.getElementById('clearEditButton').innerText = '⛔ Clear';

    document.getElementById("clearEditButton").addEventListener('click',clearEditButtonFunction);

    document.getElementById("editButton").addEventListener('click',updateEditButtonFunction);
}


var updateEditButtonFunction = function(){

    if(addInput.value==""){
        return;
    }

    data = editItemId;
    for(var i=0; i < listArray.length; i++){

        if(listArray[i].id == data.trim()){
            listArray[i].content = addInput.value;
            listArray[i].details = addDetailsInput.value;
            refreshLocal();
            break;
        }
    }
    editItemId = 0;
    clearEditButtonFunction();
}

var clearEditButtonFunction = function(){
    document.getElementById("itemInput").value = '';
    document.getElementById("itemDetailsInput").innerText = '';

    document.getElementById("clearEditButton").removeEventListener('click',clearEditButtonFunction);
    document.getElementById("editButton").removeEventListener('click',updateEditButtonFunction);


    document.getElementById("itemInput").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            addButton.click();
        }
    });

    document.getElementById('editButton').id = 'addButton';
    document.getElementById('addButton').innerText = '➕ Add To List';
    addButton.addEventListener("click", addToList)

    document.getElementById('clearEditButton').id = 'clearButton';
    document.getElementById('clearButton').innerText = '⛔ Clear Todo List';
    clearButton.addEventListener("click", clearList)

    javascript:window.top.location.reload();
}



//function to change the todo list array
var changeListArray = function(data,status){

    for(var i=0; i < listArray.length; i++){

        if(listArray[i].id == data.trim()){
            listArray[i].status = status;
            refreshLocal();
            break;
        }
    }
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

//function to chage the dom of the list of todo list
var createItemDom = function(text,status,details,id){

    let div =  `
        <li class="${status=='incomplete'?'completed alert alert-danger':'uncompleted alert alert-success'} row ">

            <div style="display:none" class="col-12">
                <label>${id}</label>
            </div>
            <div class="col-6">
                <label>${text}</label>
            </div>
            <div class="col-2 text-center">
                <button class="${status=='incomplete'?'btn btn-success':'btn btn-dark'}" onclick="${status=='incomplete'?'changeToComp(this)':'changeToInComp(this)'}">${status== 'incomplete'?'✔️ Complete':'⌛ Incomplete'}</button>
            </div>
            <div class="col-2 text-center">
                <button class="btn btn-danger" onclick="removeItem(this)">❌ Delete</button>
            </div>
            <div class="col-2 text-center">
                <button class="btn btn-primary" onclick="editItem(this)">📝 Edit</button>
            </div>
            <div class="col-12">
                <label>${details}</label>
            </div>
            
        </li>
    `; 

    listItem = htmlToElement(div);
    return listItem;
}

var refreshLocal = function(){
    var todos = listArray;
    localStorage.removeItem('todoList');
    localStorage.setItem('todoList', JSON.stringify(todos));
}

var addToList = function(){

    if(addInput.value==""){
        return;
    }

    var newItem = new listItemObj();
    newItem.id = random_number();
    newItem.content = addInput.value;
    newItem.details = addDetailsInput.value;
    listArray.push(newItem);
    //add to the local storage
    refreshLocal();
    //change the dom
    var item = createItemDom(addInput.value,'incomplete',addDetailsInput.value,newItem.id);
    todoList.appendChild(item);
    addInput.value = '';
    addDetailsInput.value = '';
}

//function to clear todo list array
var clearList = function(){
    listArray = [];
    localStorage.removeItem('todoList');
    todoList.innerHTML = '';

}

window.onload = function(){
    var list = localStorage.getItem('todoList');

    if (list != null) {
        todos = JSON.parse(list);
        listArray = todos;

        for(var i=0; i<listArray.length;i++){
            var data = listArray[i].content;
            var details = listArray[i].details;
            var item = createItemDom(data,listArray[i].status,details,listArray[i].id);
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