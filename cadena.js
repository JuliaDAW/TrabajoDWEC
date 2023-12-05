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

    //Añadir
    let aniadir=document.getElementById("id_aniadir");
    if(aniadir){
        const jsConfetti = new JSConfetti();
        document.getElementById("id_aniadir").addEventListener("submit", (event)=>{
            event.preventDefault();

            let transaction = db.transaction(["platos"], "readwrite");

            let objectStore = transaction.objectStore("platos");

            objectStore.add({nombre: aniadir.nombre.value, precio: aniadir.precio.value, ingredientes: aniadir.ingredientes.value, imagen: aniadir.image.value}); //añade datos
            console.log({nombre: aniadir.nombre.value, precio: aniadir.precio.value, ingredientes: aniadir.ingredientes.value, imagen: aniadir.image.value});

            transaction.oncomplete = function(event) {
                if(jsConfetti) jsConfetti.clearCanvas();
                jsConfetti.addConfetti({
                    emojis: ['🐸', '🍙', '🍖', '🍶', '🍻'],
                    emojiSize: 50,
                    confettiNumber: 80,
                });

                aniadir.reset();
            }
        });
    }

    //Modificar y eliminar
    let modificar=document.getElementById("id_modificar");
    if(modificar){
        const jsConfetti = new JSConfetti();

        let transaction = db.transaction(["platos"], "readonly");
    
        let objectStore = transaction.objectStore("platos");

        let array=[];
        let cursor = objectStore.openCursor();
        cursor.onsuccess = function(event){
            let datos = event.target.result;
            if(datos){
                array.push(datos.value);
                datos.continue();
            } else{
                let elegir=document.getElementById("id_elegir");
                array.forEach(comida =>{
                    elegir.innerHTML+=`<option value=${comida.id}>${comida.nombre}</option>`;
                });

                elegir.addEventListener("change", (event)=>{
                    let aux=event.target.value;
        
                    let encontrada=array.find(comida=>{
                        return comida.id==aux;
                    })

                    modificar.nombre.value=encontrada.nombre;
                    modificar.precio.value=encontrada.precio;
                    modificar.ingredientes.value=encontrada.ingredientes;
                    modificar.image.value=encontrada.imagen;

                    modificar.nombre.disabled=false;
                    modificar.precio.disabled=false;
                    modificar.ingredientes.disabled=false;
                    modificar.image.disabled=false;
                    modificar.modifica.disabled=false;
                    modificar.elimina.disabled=false;
                });
            }
        }
        
        modificar.addEventListener("submit", (event)=>{ //botón modificar
            event.preventDefault();
    
            let transaction1 = db.transaction(["platos"], "readwrite");
    
            let objectStore1 = transaction1.objectStore("platos");
    
            objectStore1.put({id: parseInt(modificar.elegir.value), nombre: modificar.nombre.value, precio: modificar.precio.value, ingredientes: modificar.ingredientes.value, imagen: modificar.image.value}); //modifica datos
            console.log({id: modificar.elegir.value, nombre: modificar.nombre.value, precio: modificar.precio.value, ingredientes: modificar.ingredientes.value, imagen: modificar.image.value});

            transaction1.oncomplete = function(event) { //transacción exitosa
                if(jsConfetti) jsConfetti.clearCanvas();
                jsConfetti.addConfetti({
                    emojis: ['🐸', '🍙', '🍖', '🍶', '🍻'],
                    emojiSize: 50,
                    confettiNumber: 80,
                });

                modificar.reset();
            }
        });

        modificar.elimina.addEventListener("click", (event)=>{ //botón eliminar
            event.preventDefault();

            let transaction1 = db.transaction(["platos"], "readwrite");
    
            let objectStore1 = transaction1.objectStore("platos");

            let peticion = objectStore1.get(parseInt(modificar.elegir.value));
            peticion.onsuccess = function(event){
                objectStore1.delete(event.target.result.id); //elimina datos
            }
            
            //hacer que la página se actualice sola

            transaction1.oncomplete = function(event) { //transacción exitosa
                if(jsConfetti) jsConfetti.clearCanvas();
                jsConfetti.addConfetti({
                    emojis: ['🐸', '🍙', '🍖', '🍶', '🍻'],
                    emojiSize: 50,
                    confettiNumber: 80,
                });

                modificar.reset();
            }
        });
    }
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
}