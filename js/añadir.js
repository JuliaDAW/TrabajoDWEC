const aniadir = document.getElementById("id_aniadir");
const jsConfetti = new JSConfetti();

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
    const db = event.target.result;

    aniadir.addEventListener("submit", (event)=>{
        event.preventDefault();

        let transaction = db.transaction(["platos"], "readwrite");
        let objectStore = transaction.objectStore("platos");
        const plato = {
            nombre: aniadir.nombre.value, 
            precio: aniadir.precio.value, 
            ingredientes: aniadir.ingredientes.value, 
            imagen: aniadir.image.value
        };
        objectStore.add(plato); //añade datos
        
        transaction.oncomplete = function(event) {
            console.log("Añadido correctamente el plato: ", plato.nombre, " con precio: ", plato.precio, "€");
            if(jsConfetti) jsConfetti.clearCanvas();
            jsConfetti.addConfetti({
                emojis: ['🐸', '🍙', '🍖', '🍶', '🍻'],
                emojiSize: 30,
                confettiNumber: 80,
            });

            aniadir.reset();
        }
    });
    
};


// Este evento solo se ejecuta en la primera creación de la base de datos o en el cambio de versión
request.onupgradeneeded = function (event) {
    console.log("Actualizando la base de datos");
    const db = event.target.result;

    if(db.objectStoreNames.contains("platos")){ //si existe la elimina
        db.deleteObjectStore("platos");
    }
    // Crear un almacén de objetos para esta base de datos
    // id autoincrementado
    const objectStore = db.createObjectStore("platos", { keyPath: "id", autoIncrement: true });
    // Definir qué datos queremos guardar en el almacén de objetos
    objectStore.createIndex("nombre", "nombre", { unique: true });
    objectStore.createIndex("precio", "precio", { unique: false });
    objectStore.createIndex("ingredientes", "ingredientes", { unique: false });

    //Ejemplo de datos
    //let request = index.openCursor(IDBKeyRange.only(price));
}