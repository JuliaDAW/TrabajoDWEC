if(!window.indexedDB){
    console.log("Tu navegador no soporta IndexedDB");
}

// Abrir o crear la base de datos
const request = window.indexedDB.open("BD_Practica_5", 3);

//Apertura fallida
request.onerror = function (event) {
    console.log("Error al intentar abrir la base de datos", event);
};

//Apertura exitosa
request.onsuccess = function (event) {
    console.log("Base de datos abierta corréctamente: ", request.result);
    db = event.target.result;

    //Añadir
    let aniadir=document.getElementById("id_aniadir");
    if(aniadir){
        document.getElementById("id_aniadir").addEventListener("submit", (event)=>{
            event.preventDefault();

            let transaction = db.transaction(["platos"], "readwrite");

            let objectStore = transaction.objectStore("platos");

            objectStore.add({nombre: aniadir.nombre.value, precio: aniadir.precio.value, ingredientes: aniadir.ingredientes.value, imagen: aniadir.image.value});
            console.log({nombre: aniadir.nombre.value, precio: aniadir.precio.value, ingredientes: aniadir.ingredientes.value, imagen: aniadir.image.value});
        });
    }

    //Modificar
    let modificar=document.getElementById("id_modificar");
    if(modificar){
        let transaction = db.transaction(["platos"], "readonly");
    
        let objectStore = transaction.objectStore("platos");

        let array=[];
        let cursor = objectStore.openCursor();
        cursor.onsuccess = function(event){
            let datos = event.target.result;
            if(datos){
                console.log(datos.value);
                array.push(datos.value);
                datos.continue();
            }
        }
console.log(array);
        let elegir=document.getElementById("id_elegir");
        array.forEach(comida =>{
            elegir.innerHTML+=`<option value=${comida.id}>${comida.nombre}</option>`;
            console.log(comida);
        });

        document.getElementById("id_modificar").addEventListener("submit", (event)=>{
            event.preventDefault();
    
            let transaction = db.transaction(["platos"], "readwrite");
    
            let objectStore = transaction.objectStore("platos");
    
            objectStore.put({id: modificar.elegir.value, nombre: modificar.nombre.value, precio: modificar.precio.value, ingredientes: modificar.ingredientes.value, imagen: modificar.image.value});
            console.log({id: modificar.elegir.value, nombre: modificar.nombre.value, precio: modificar.precio.value, ingredientes: modificar.ingredientes.value, imagen: modificar.image.value});
        });
    }

    /* Ejemplos de add
        objectStore.add({ id: 1, nombre: "Macarrones", precio: 10, ingredientes: "Arroz, pollo, verduras", imagen: "img/paella.jpg" });
        objectStore.add({ id: 2, nombre: "Paella", precio: 10, ingredientes: "Arroz, pollo, verduras", imagen: "img/paella.jpg" });
    */
    //put
    //objectStore.put({ id: 2, nombre: "Paella", precio: 20, ingredientes: "Arroz, pollo, verduras", imagen: "img/paella.jpg" });
    //get
    /*let peticion = objectStore.get(2);
    peticion.onsuccess=function(event){
        console.log(event.target.result);
    };
    //delete
    objectStore.delete(2);

    
    */
/*
    transaction.oncomplete = function(event) {
        console.log("Transacción completada");
        console.log(event);
    };

    transaction.onerror = function(event) {
        console.log("Transacción no completada", event);
    };
*/
};

// Este evento solo se ejecuta en la primera creación de la base de datos//
// o en el cambio de versión
request.onupgradeneeded = function (event) {
    console.log("Actualizando la base de datos");
    db = event.target.result;

    if(db.objectStoreNames.contains("platos")){ //si existe la elimina
        db.deleteObjectStore("platos");
    }
    // Crear un almacén de objetos para esta base de datos
    //id autoincrementado
    const objectStore = db.createObjectStore("platos", { keyPath: "id", autoIncrement: true });
    // Definir qué datos queremos guardar en el almacén de objetos
    objectStore.createIndex("nombre", "nombre", { unique: true });
    objectStore.createIndex("precio", "precio", { unique: false });
    objectStore.createIndex("ingredientes", "ingredientes", { unique: false });
}