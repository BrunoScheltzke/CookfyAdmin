function createIngredient(){
    var url = "https://cookfy.herokuapp.com/ingredient";
    var xhttp = new XMLHttpRequest();
    var dto = new Object();
    var jsonToSend = "";

    dto.name = document.getElementById("ingredientnameField").value;
    dto.description = document.getElementById("ingredientdescriptionField").value;
    dto.picture = document.getElementById("imgTest").value;

    jsonToSend = JSON.stringify(dto);


    xhttp.onreadystatechange = function(){
        if(this.readyState==4 && this.status == 200){
            alert("Ingredient criada com sucesso \n"+this.responseText);
            location.reload();
        }else if (this.readyState==4){
            alert("A requisição falhou :( \nMas nós não tratamos isso mesmo :) \nOlha só :(\n\n"+this.responseText);
        }
    }

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(jsonToSend);
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