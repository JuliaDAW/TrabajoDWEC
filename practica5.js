//iniciar una base de datos
let iniciar_db=indexedDB.open("nombre", 3);

//Apertura o creación fallida
iniciar_db.onerror = function(){ console.log("Error"); }

//Se lanza con una nueva versión o una nueva creación
iniciar_db.onupgradeneeded = function(){}

//Apertura o creación exitosa
iniciar_db.onsuccess = function(){
    //Continuación de la programación
}

//Borra base de datos
let borrar_db=indexedDB.deleteDatabase("nombre");