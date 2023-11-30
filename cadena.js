if(!window.indexedDB){
    console.log("Tu navegador no soporta IndexedDB");
}

// Abrir o crear la base de datos
const request = window.indexedDB.open("MyTestDatabase", 1);

//Apertura o creación fallida
request.onerror = function (event) {
    console.log("Error abriendo la base de datos", event);
};

//Apertura o creación exitosa
request.onsuccess = function (event) {
    console.log("Base de datos abierta correctamente: ", request.result);
    db = event.target.result;

    let transaction = db.transaction(["platos"], "readwrite");

    let objectStore = transaction.objectStore("platos");

    //add
    objectStore.add({ id: 1, nombre: "Macarrones", precio: 10, ingredientes: "Arroz, pollo, verduras", imagen: "img/paella.jpg" });
    objectStore.add({ id: 2, nombre: "Paella", precio: 10, ingredientes: "Arroz, pollo, verduras", imagen: "img/paella.jpg" });
    //put
    objectStore.put({ id: 2, nombre: "Paella", precio: 20, ingredientes: "Arroz, pollo, verduras", imagen: "img/paella.jpg" });
    //get
    let peticion = objectStore.get(2);
    peticion.onsuccess=function(event){
        console.log(event.target.result);
    };
    //delete
    objectStore.delete(2);

    let cursor = objectStore.openCursor();
    cursor.onsuccess = function(event){
        let datos = event.target.result;
        if(datos){
            console.log(datos.value);
            datos.continue();
        }
    }
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
    // Crear un almacén de objetos para esta base de datos
    //id autoincrementado
    const objectStore = db.createObjectStore("platos", { keyPath: "id", autoincrement });
    // Definir qué datos queremos guardar en el almacén de objetos
    objectStore.createIndex("nombre", "nombre", { unique: true });
    objectStore.createIndex("precio", "precio", { unique: false });
    objectStore.createIndex("ingredientes", "ingredientes", { unique: false });
}