var isImportant = false;
const serverUrl = "http://fsdiapi.azurewebsites.net/";


//function to toggle side panel
function togglePanel(){
    console.log("button clicked");
    //hide the section/element
    $("#form").toggle();
}

$(document).keydown(function(e){
    if(e.key === "Enter"){
        saveTask();
    }
})

//function to save task
function saveTask(){
    console.log("task saved");

    const title = $("#txtTask").val();
    const descript = $("#txtDescript").val();
    const due = $("#selDue").val();
    const duration = $("#txtDuration").val();
    const status = $("#selStatus").val();
    const color = $("#txtColor").val();
    const budget =$("#txtBudget").val();

    //validations
    if(!title || !descript || !due || !budget){
        //show and error
        $("#pnlError").slideToggle('slow');
        setTimeout(() => {
            $("#pnlError").slideToggle('slow');
        }, 4000);
        //stop the execution, don't do anything else in this fn
        return;
    }

    let task = new Task(title, isImportant, descript, duration, status, color, budget);

    //send obj to the server
    function loadTapk()    $.ajax({
        type:"POST",
        url: serverUrl + "api/tasks/",
        data: JSON.stringify(task),
        contentType: "application/json",
        success: function(res){
            console.log("Save Worked", res);
            displayTask(task);
            clearForm();

            $("#pnlSuccess").slideToggle('show');
            setTimeout(() => {
                $("#pnlSuccess").slideToggle('slow');
            }, 6000);
        },
        error: function(error){
            console.log("Save failed", error);
            alert("Unexpected Error, task was not saved :(");
        }
    })
    
}//end saveTask function

//formatting date
function formatDate(date){
    console.log(date);
    let trueDate = new Date(date); //parse date string to date obj
    return trueDate.toLocaleDateString();
}

//to display imp or notImp icon
function getIcon(savedAsImportant){

    if(savedAsImportant){
        return '<i class="fa-solid fa-bookmark imp"></i>';
    }
    else{
        return '<i class="fa-regular fa-bookmark notImp"></i>';
    }
}

function formatBudget(budget){
    if(!budget){
        return "0.00";
    }
    else{
        return parseFloat(budget).toFixed(2);
    }
}
//function to display inputed tasks
function displayTask(task){
    let syntax = `
        <div class = "info"
        <h5>${task.title}"</h5>
        <p>${task.discription}</p>
        <div>
        <lable>${task.status}</lable>
        <div> class="data-budget">
        <lable>${task.date}</lable>
        <lable>${task.buget}</lable>
        </div>
        </div>`
        ;

    $("#pendingTasks").append(syntax);
}

function deleteTask(id){
    console.log('icon clicked', id);

    $.ajax({
        type: "DELETE",
        url: serverUrl + `api/tasks/${id}/`,
        success: function(){
            console.log('Task removed');
            $("#" + id).remove(); //remove div/task from screen
        },
        error: function(error){
            console.log("Error deleting:", error);
        }


    })
}

//function to clear form after submission
function clearForm(){
    $('input').val("");
    $('select').val("");
    $('textarea').val("");
    $("#iImportant").removeClass("imp").addClass("notImp");
}


// //function to toggle bookmark icon
// function toggleImportant(){
//     const nonImpClasses = "fa-regular fa-bookmark notImp";
//     const impClasses = "fa-solid fa-bookmark imp";

//     if(isImportant){
//         $("#iImportant").removeClass(impClasses).addClass(nonImpClasses);
//         isImportant = false;
//     }
//     else{
//         $("#iImportant").removeClass(nonImpClasses).addClass(impClasses);
//         isImportant = true;
//     }
// }

//functions to get tasks from server
function fetchTasks(){
    //retrieve all the tasks from the server
    $.ajax({
        url: serverUrl + "api/tasks/",
        type: "GET", //casing doesn't matter, stndrd is to capitalize
        success: function(response){
            const list = JSON.parse(response);
            console.log(list);

            for(let i = 0; i < list.length; i++){
                let record = list[i];
                if(record.name === "Jorge"){
                    displayTask(record);
                }
            }
        },
        error: function(error){
            console.log("Error", error);
        }
    });
}

//function to delete all tasks
function deleteAllTasks(){
    $.ajax({
        url: serverUrl + "api/tasks/clear/Jorge/",
        type: "DELETE",
        success: function(){
            $("#pendingTasks").html('');
            console.log('All tasks deleted.')
        },
        error: function(error){
            console.log("Error clearing tasks", error);
        }

    })
}

//init function
function init(){
    console.log("This is the Task Manager site.");

    //retrieve data
    fetchTasks();

    //hook events
    $("#btnShowPanel").click(togglePanel);
    $('#btnDeleteAll').click(deleteAllTasks);
    $("#saveBtn").click(saveTask);
    $("#iImportant").click(toggleImportant);

}
window.onload = init;