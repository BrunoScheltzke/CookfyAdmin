var categoryJson = "";

//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(function(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function() {
    
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    
    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Valor não pode ser menor que 0');
        $(this).val($(this).data('0'));
    }
});
$(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

$(document).ready(function() {
    var max_fields      = 100; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $("#add_field_button"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div class="row"><div class="form-group col-md-5"><input class="form-control" placeholder="Ingrediente" type="text" name="ingredient[]"></div><div class="form-group col-md-5"><input placeholder="Medida" class="form-control"type="text" name="measure[]"></div><div class="form-group col-md-2"><button type="button" id="remove_field_button" class="btn btn-primary" data-type="minus"><span class="glyphicon glyphicon-minus"></span></button></div></div>'); //add input box
        }
    });
    
    $(wrapper).on("click","#remove_field_button", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').parent('div').remove(); x--;
    })
});

function createRecipe(){
    var dto = new Object();
    var jsonToSend;
    var url = "https://cookfy.herokuapp.com/recipes";
    var xhttp = new XMLHttpRequest();
    var recipeSteps = [];
    var descriptionFull = document.getElementById("recipeDesc").value;
    var description = "";
    var categories = [];
    var categoryOptions = document.getElementById("categoryField");
    var opt;

    //arruma as categorias antes de enviar
    for(var i = 0; i<categoryOptions.length;i++){
        opt = categoryOptions[i];
        if(opt.selected){
            categories.push(opt.value);
        }
    }

    //arruma os ingredientes antes de enviar o request
    var ingredient = document.forms[0].elements['ingredient[]'];
    var measure = document.forms[0].elements['measure[]'];
    var ingredientMeasure = [];
    for(var i=0;i<ingredient.length;i++){
        ingredientMeasure.push(ingredient[i].value + ";" + measure[i].value);
    }

    //arruma description antes de enviar o request
    var steps = descriptionFull.split("\n");
    for(var i = 0;i<steps.length;i++){
    	var stepObj = new Object();
    	stepObj.stepOrder = i+1;
    	stepObj.description = steps[i];
    	recipeSteps.push(stepObj);
    	description += steps[i] + ";";
    }

    dto.recipe_name = document.getElementById("nameField").value;
    //change this to an Admin Id
    dto.chef_id = 3;
    dto.difficulty = document.getElementById("difficultyField").value;
    dto.prepTime = document.getElementById("prepTimeField").value;
    dto.cookTime = document.getElementById("cookTimeField").value;
    dto.category_id = categories;
    dto.ingredient_measure = ingredientMeasure;
    dto.picture = document.getElementById("imgTest").value;
    dto.recipeStep = recipeSteps;
    dto.description = description;

    jsonToSend = JSON.stringify(dto);

    xhttp.onreadystatechange = function(){
    	if(this.readyState==4 && this.status == 200){
    		alert("Receita criada com sucesso \n"+this.responseText);
    		location.reload();
    	}else if (this.readyState==4){
    		alert("A requisição falhou :( \nMas nós não tratamos isso mesmo :) \nOlha só :(\n\n"+this.responseText);
    	}
    }

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(jsonToSend);
}

function getCategories(){
    var url = "https://cookfy.herokuapp.com/categories";
    var xhttp = new XMLHttpRequest();
    document.getElementById("categoryField").disabled = true;

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            categoryJson = JSON.parse(this.responseText);
            document.getElementById("categoryField").disabled = false;
            populateCategoryDropdown();
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function populateCategoryDropdown(){
    
    var dropdownContent;
    
    for(i = 0; i<categoryJson.length; i++){
        dropdownContent = dropdownContent + 
        "<option value="+ categoryJson[i].id + ">" + categoryJson[i].name +"</option>";
    }
    
    document.getElementById("categoryField").innerHTML = dropdownContent;
}

    var handleFileSelect = function(evt) {
    var files = evt.target.files;
    var file = files[0];

        if (files && file) {
            var reader = new FileReader();

            reader.onload = function(readerEvt) {
                var binaryString = readerEvt.target.result;
                document.getElementById("imgTest").value = btoa(binaryString);
            };

            reader.readAsBinaryString(file);
        }
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('pictureField').addEventListener('change', handleFileSelect, false);
    } else {
        alert('A API de arquivos não funciona nesse navegador.');
    }