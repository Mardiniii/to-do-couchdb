$(document).ready(function(){
	var server= "http://makeitreal.iriscouch.com/sebas-mardini";
	var date = new Date();

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

	//Funcion para mostrar tarea en el website
	function showTask(text,data){
		var newDivTask = $('<li id="'+data.id+'" class="itemTask"><input class="done" type="checkbox" name="check">' + text + '</li>');
		console.log(data._id);
		$(".todo-list").append(newDivTask);
	}

	//Block to entry a new task into HTML
	function insertTask(data){
		var newDivTask = '<li id="'+data.id+'" class="itemTask">';
	    newDivTask += data.done ? '<input class="done" type="checkbox" name="check" checked="checked">' : '<input class="done" type="checkbox" name="check" >'; 
	    newDivTask += data.title;
	    newDivTask += '</li>';
	    var ndt = $(newDivTask);
	    $(".todo-list").append(ndt);
	    if( $(".done", ndt).is(':checked') ){
	    	ndt.addClass("checked");
	    }
    }

    //Functio to generate Slug ID for each Task
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
});