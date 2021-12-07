var addButton = document.getElementById('addButton');
var addInput = document.getElementById('itemInput');
var todoList = document.getElementById('todoList');
var listArray = [];
//declare addToList function

function listItemObj(content, status) {
    this.content = '';
    this.status = 'incomplete';
}
var changeToComp = function(item){

    item.innerText = "⌛ Incomplete";
    item.className = "btn btn-dark";
    item.parentNode.parentNode.className = "uncompleted alert alert-success row";
    item.setAttribute('onclick','changeToInComp(this)');
    changeListArray(item.parentNode.previousElementSibling.innerText,'complete');

}

var changeToInComp = function(item){
    
    item.innerText = "✔️ Complete";
    item.className = "btn btn-success";
    item.parentNode.parentNode.className = "completed alert alert-danger row";
    item.setAttribute('onclick','changeToComp(this)');
    changeListArray(item.parentNode.previousElementSibling.innerText,'incomplete');

}

var removeItem = function(item){
    
    var data = item.parentNode.previousElementSibling.previousElementSibling.innerText;
    data = data.replaceAll(/\s/g,'');
    
    var parent = item.parentNode.parentNode;
    parent.remove(this);
    for(var i=0; i < listArray.length; i++){

        if(listArray[i].content.replaceAll(/\s/g,'') == data){
            listArray.splice(i,1);
            refreshLocal();
            break;
        }
    }
}

//function to change the todo list array
var changeListArray = function(data,status){

    data = data.replaceAll(/\s/g,'');
    for(var i=0; i < listArray.length; i++){

        if(listArray[i].content.replaceAll(/\s/g,'') == data){
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
var createItemDom = function(text,status){

    let div =  `
        <li class="${status=='incomplete'?'completed alert alert-danger':'uncompleted alert alert-success'} row ">
            <div class="col-8">
                <label>${text}</label>
            </div>
            <div class="col-2 text-center">
                <button class="${status=='incomplete'?'btn btn-success':'btn btn-dark'}" onclick="${status=='incomplete'?'changeToComp(this)':'changeToInComp(this)'}">${status== 'incomplete'?'✔️ Complete':'⌛ Incomplete'}</button>
            </div>
            <div class="col-2 text-center">
                <button class="btn btn-danger" onclick="removeItem(this)">❌ Delete</button>
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

            var item = createItemDom(data,listArray[i].status);
            todoList.appendChild(item);
        }

    }

};
//add an event binder to the button
addButton.addEventListener('click',addToList);
clearButton.addEventListener('click',clearList);
