$(document).ready(function(){
	var server= "http://makeitreal.iriscouch.com/sebas-mardini";
	var date = new Date();
	var allTasks = "http://makeitreal.iriscouch.com/sebas-mardini/_design/tasklist/_view/alltasks";
	//Block to detect a new task and save the information in CouchDB
	$('#input').keyup(function(event){     
	    var keycode = event.keyCode;         
	    if(keycode == '13'){                 
		    var textTask = $(this).val(); 
		    var id = slugifier(textTask);
		    var created_at = date.getTime();
            console.log(server+"/"+id);
		    $.ajax({
		    	type: "PUT",
		    	url: server+"/"+id,
		    	contentType: "application/json",
		    	data: JSON.stringify({ "title": textTask,"done":false,"created_at": created_at,"updated_at": created_at,"type": "todo" }),
		     	dayaType: "json",
		    	success: function(data){
                    console.log(data);
                    data = JSON.parse(data);
                    console.log(data);
		        	console.log("Tarea enviada");
		        	showTask(textTask,data)}
		      	});
		    $("#input").val('');
		}
	});

	//Function to detect a click on button to filtering task
	$('.btn').on('click',function(){
		var url = $(this).data("link");
		$.get(url, processData);
	});

	//Function to process the return JSON from CouchDB
	function processData(data){
		data = JSON.parse(data);
		var result = data.rows;
		console.log(result);
		result.forEach(insertTask);
	}

	//Function to show task on Website
	function showTask(text,data){
		var newDivTask = $('<li id="'+data.id+'" class="itemTask"><input class="done" type="checkbox" name="check">' + text + '</li>');
		console.log(data._id);
		$(".todo-list").append(newDivTask);
	}

	//Block to entry a new task into HTML
	function insertTask(data){
		var newDivTask = '<li id="'+data.value._id+'" class="itemTask">';
	    newDivTask += data.value.done ? '<input class="done" type="checkbox" name="check" checked="checked">' : '<input class="done" type="checkbox" name="check" >'; 
	    newDivTask += data.value.title;
	    newDivTask += '</li>';
	    var ndt = $(newDivTask);
	    $(".todo-list").append(ndt);
	    if( $(".done", ndt).is(':checked') ){
	    	ndt.addClass("checked");
	    }
    }

    //Function to generate Slug ID for each Task
    function slugifier(string) {
	    string = string.replace(/\s{2,}/g, ' ');
	    string = string.trim();
	    string = string.toLowerCase();
	    string = string.replace(/\s/g, '-');
	    string = string.replace(/ñ/g, 'n');
	    string = string.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
	    string = string.replace(/[^0-9a-z-]/g,'');
	    return string;
    }

    //Loading all task storaged in CouchDB by default
    $.get(allTasks,processData);
});