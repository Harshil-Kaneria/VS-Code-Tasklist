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
        text: 'Please Fill Task Title Box Properly'
    });
}

var MainDataArray = [];

$( document ).ready(function() {
    list_html()

    $(function() {
        $("#todoList").sortable({
            start: function(event, ui) {
                var start_pos = ui.item.index();
                ui.item.data('start_pos', start_pos);
            },
            update: function(event, ui) {
                var arr_pos_start = ui.item.data('start_pos');
                var arr_pos_end = ui.item.index();
                
                MainDataArray = moveArrayItemToNewIndex(MainDataArray,arr_pos_start,arr_pos_end);
                Update_Main_Data_File();
            }
        });
    });

});

$(document).keypress(function(e){
    
    if(e.which == 13)
    {
        if($("#add_item_list").hasClass("d-none")){
            $("#update_item_list").click();
        }else if($("#update_item_list").hasClass("d-none")){
            $("#add_item_list").click();
        }
    }

});

function random_number(){
    return (Math.floor(Math.random() * 1000) + 1).toString()+Date.now()+(Math.floor(Math.random() * 1000) + 1).toString();
}

function add_item_list(){

    if($("#title_text").val()==""){
        fill_input();
        return
    }

    var id = random_number();
    var title = $("#title_text").val();
    var description = $("#description_text").val();
    var tag = $("#tag_text").val();
    var priority = $("#priority_id").val();
    var status = $("#status_id").val();
    var start_date = $("#start_date").val();
    var end_date = $("#end_date").val();

    var list_data = {
        id,
        title,
        description,
        tag,
        priority,
        status,
        start_date,
        end_date
    };

    MainDataArray.push(list_data);
    Update_Main_Data_File();
    reset_entry_form();

}


function update_item_list(){

    if($("#title_text").val()==""){
        fill_input();
        return
    }

    var update_id = $("#update_item_list").attr("data-id")
    MainDataArray.forEach(function(item, index){
        if(item.id==update_id){
            item.title = $("#title_text").val();
            item.description = $("#description_text").val();
            item.tag = $("#tag_text").val();
            item.priority = $("#priority_id").val();
            item.status = $("#status_id").val();
            item.start_date = $("#start_date").val();
            item.end_date = $("#end_date").val();
        }
    })
    Update_Main_Data_File();
    clear_update_list();
}

function clear_full_list(){

    $.confirm({
        icon: 'fa fa-warning',
        theme: 'modern',
        closeIcon: true,
        animation: 'scale',
        type: 'red',
        title: 'Warning',
        content: 'Are You Sure Delete All Items',
        buttons: { 
            ok: function(){ 
                MainDataArray = [];
                localStorage.removeItem('todoList');
                Update_Main_Data_File();
                clear_update_list(); 
            } 
        }
    });

}

function edit(id=""){

    if(id!=""){

        $("#add_item_list").addClass("d-none");
        $("#clear_full_list").addClass("d-none");

        $("#update_item_list").removeClass("d-none");
        $("#clear_update_list").removeClass("d-none");

        MainDataArray.forEach(function(item, index){
            if(item.id==id){

                $("#update_item_list").attr("data-id",item.id)

                $("#title_text").val(item.title);
                $("#description_text").val(item.description);
                $("#tag_text").val(item.tag);
                $("#priority_id").val(item.priority);
                $("#status_id").val(item.status);
                $("#start_date").val(item.start_date);
                $("#end_date").val(item.end_date);

                if(item.start_date!=""){
                    $('#start_date').attr('type', 'datetime-local')
                }
                if(item.end_date!=""){
                    $('#end_date').attr('type', 'datetime-local')
                }

            }
        })

    }

}

function reset_entry_form(){
    $("#title_text").val("");
    $("#description_text").val("");
    $("#tag_text").val("");
    $("#priority_id").val("");
    $("#status_id").val("3");
    $("#start_date").val("");
    $("#end_date").val("");
    $('#start_date').attr('type', 'text')
    $('#end_date').attr('type', 'text')
    $("#search_text").val("");
    $("#search_priority_id").val("");
    $("#search_status_id").val("");
}

function clear_update_list(){
    $("#update_item_list").addClass("d-none");
    $("#clear_update_list").addClass("d-none");

    $("#add_item_list").removeClass("d-none");
    $("#clear_full_list").removeClass("d-none");

    reset_entry_form();
}

function remove(id=""){

    $.confirm({
        icon: 'fa fa-warning',
        theme: 'modern',
        closeIcon: true,
        animation: 'scale',
        type: 'red',
        title: 'Warning',
        content: 'Are You Sure Delete Items',
        buttons: { 
            ok: function(){ 
                if(id!=""){
                    MainDataArray.forEach(function(item, index){
                        if(item.id==id){
                            MainDataArray.splice(index,1);
                        }
                    })
                    Update_Main_Data_File()
                    clear_update_list()
                } 
            } 
        }
    });
    
}

function update_priority(id,value){
    MainDataArray.forEach(function(item){
        if(item.id==id){
            item.priority = value;
        }
    })
    Update_Main_Data_File()
}

function update_status(id,value){
    MainDataArray.forEach(function(item){
        if(item.id==id){
            item.status = value;
        }
    })
    Update_Main_Data_File()
}

function update_tag(id,value){
    MainDataArray.forEach(function(item){
        if(item.id==id){
            item.tag = value;
        }
    })
    Update_Main_Data_File()
}

function update_start_date(id,value){
    MainDataArray.forEach(function(item){
        if(item.id==id){
            item.start_date = value;
        }
    })
    Update_Main_Data_File()
}

function update_end_date(id,value){
    MainDataArray.forEach(function(item){
        if(item.id==id){
            item.end_date = value;
        }
    })
    Update_Main_Data_File()
}

function Update_Main_Data_File(){

    var data = MainDataArray;
    $("#main_data_list").html(JSON.stringify(MainDataArray))
    change_list(JSON.stringify(MainDataArray))
    // localStorage.removeItem('todoList');
    // localStorage.setItem('todoList', JSON.stringify(data));
    list_html()

}

function list_html(search_text="",search_priority_id="",search_status_id=""){

    $("#todoList").html("");
    // var list = localStorage.getItem('todoList');
    var list = $("#main_data_list").html();
    if(list != null){
        todos = JSON.parse(list);
        MainDataArray = todos;

        if(search_priority_id!="" || search_status_id!="" || search_text!=""){
            if(search_priority_id!=""){
                var regex = new RegExp(`^${search_priority_id}`,'gi');
                todos = todos.filter(ele => {
                    return ele.priority.match(regex)
                });
            }
            if(search_status_id!=""){
                var regex = new RegExp(`^${search_status_id}`,'gi');
                todos = todos.filter(ele => {
                    return ele.status.match(regex)
                });
            }
            if(search_text!=""){
                var regex = new RegExp(`^${search_text}`,'gi');
                todos = todos.filter(ele => {
                    return ele.title.match(regex) || ele.description.match(regex) || ele.tag.match(regex)
                });
            }
            SearchDataArray = todos 

            SearchDataArray.forEach(function(ele){
                $("#todoList").append(generate_html_of_list(ele))
            })
            return 0;
        }

        MainDataArray.forEach(function(ele){
            $("#todoList").append(generate_html_of_list(ele))
        })
        reset_entry_form()
    }

}

function search_text(){
    var seach_value = $("#search_text").val();
    var search_priority_id = $("#search_priority_id").val();
    var search_status_id = $("#search_status_id").val();
    list_html(`${seach_value}`,`${search_priority_id}`,`${search_status_id}`);
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

function generate_html_of_list(ele){

    let div =  `
    
        ${ele.status=="1"?'<li class="alert alert-success done row ">':''}
        ${ele.status=="2"?'<li class="alert alert-warning row ">':''}
        ${ele.status=="3"?'<li class="alert alert-danger row test">':''}
        ${ele.status=="4"?'<li class="alert alert-secondary row ">':''}

            <div style="display:none" class="col-12">
                <label>${ele.id}</label>
            </div>
            <div class="col-12 row">
                <div class="col-3">
                    <label><b>${ele.title}</b></label>
                </div>
                <div class="col-2 form-group">
                    <input onchange="update_tag(${ele.id},this.value)"  class="btn btn-sm bg-white form-control-sm w-100" value="${ele.tag}" />
                </div>
                <div class="col-3 form-group">
                    <select onChange="update_priority(${ele.id},this.options[this.selectedIndex].value)" class="btn btn-sm form-control-sm bg-light w-100">
                        <option ${ele.priority==""?'Selected':''} value="">Select Priority</option>
                        <option ${ele.priority=="3"?'Selected':''} value="3">High - ⏫</option>
                        <option ${ele.priority=="2"?'Selected':''} value="2">Med - ➖</option>
                        <option ${ele.priority=="1"?'Selected':''} value="1">Low - ⏬</option>
                    </select>
                </div>
                <div class="col-3 form-group">
                    <select onChange="update_status(${ele.id},this.options[this.selectedIndex].value)" class="btn btn-sm form-control-sm bg-light w-100">
                        <option ${ele.status=="1"?'Selected':''} value="1">Complete - ✔️</option>
                        <option ${ele.status=="2"?'Selected':''} value="2">In Progress - 🚀</option>
                        <option ${ele.status=="3"?'Selected':''} value="3">In Complete - ⌛</option>
                        <option ${ele.status=="4"?'Selected':''} value="4">Hold - 🛑</option>
                    </select>
                </div>
                <div class="col-1 form-group">
                    <button class="btn btn-sm btn-primary w-100" onclick="edit(${ele.id})">📝</button>
                </div>
            </div>
            <div class="mt-3 col-12 row">
                <div class="col-5">
                    <label class="description_text">${ele.description}</label>
                </div>
                <div class="col-3">
                    <input  class="btn btn-sm bg-light form-control-sm  w-100" type="${ele.start_date!=""?"datetime-local":"text"}" placeholder="Start Date" value="${ele.start_date}" onclick="(this.type='datetime-local');this.showPicker()" onchange="update_start_date(${ele.id},this.value)" />
                </div>
                <div class="col-3">
                    <input  class="btn btn-sm bg-light form-control-sm w-100" type="${ele.end_date!=""?"datetime-local":"text"}" placeholder="End Date" value="${ele.end_date}" onclick="(this.type='datetime-local');this.showPicker()" onchange="update_end_date(${ele.id},this.value)" />
                </div>
                <div class="col-1">
                    <button class="btn btn-sm btn-danger w-100" onclick="remove(${ele.id})">❌</button>
                </div>
            </div>
        </li>
    `; 

    return div;

}