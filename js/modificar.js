const jsConfetti = new JSConfetti();

if(!window.indexedDB){
    console.log("Tu navegador no soporta IndexedDB");
}

let modificar=document.getElementById("id_modificar");
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

    //Rellenar por primera vez el Select
    select();
    
    modificar.addEventListener("submit", (event) => { //botón modificar
        event.preventDefault();
        if(!modificar.elegir.value) return;
        let transaction = db.transaction(["platos"], "readwrite");
        let objectStore = transaction.objectStore("platos");

        const plato = {
            id: parseInt(modificar.elegir.value),
            nombre: modificar.nombre.value,
            precio: modificar.precio.value,
            ingredientes: modificar.ingredientes.value,
            imagen: modificar.image.value
        };
        objectStore.put(plato); //modifica datos

        transaction.oncomplete = function(event) { //transacción exitosa
            console.log("Modificado correctamente el plato: ", plato.nombre, " con precio: ", plato.precio, "€");
            if(jsConfetti) jsConfetti.clearCanvas();
            jsConfetti.addConfetti({
                emojis: ['🐸', '✅'],
                emojiSize: 30,
                confettiNumber: 80,
            });

            modificar.reset();
            select();
        }
    });

        modificar.elimina.addEventListener("click", (event)=>{ //botón eliminar
            event.preventDefault();
            if(!modificar.elegir.value) return;

            let transaction1 = db.transaction(["platos"], "readwrite");
            let objectStore1 = transaction1.objectStore("platos");

            objectStore1.delete(parseInt(modificar.elegir.value)); //elimina datos
            
            transaction1.oncomplete = function(event) { //transacción exitosa
                if(jsConfetti) jsConfetti.clearCanvas();
                jsConfetti.addConfetti({
                    emojis: ['🐸', '🍙', '🍖', '🍶', '✅'],
                    emojiSize: 30,
                    confettiNumber: 80,
                });

                modificar.reset();
                select();
            }
        });
    function select(){
        let transaction = db.transaction(["platos"], "readonly");
        let objectStore = transaction.objectStore("platos");
        let cursor = objectStore.openCursor();
        let array=[];
        disableForm();
        cursor.onerror = function(event) {
            console.log(event.target.errorCode)
        }
        cursor.onsuccess = function(event){
            let datos = event.target.result;
            console.log("Continuando cursor...")
            if(datos){
                array.push(datos.value);
                datos.continue();
            } else{
                let elegir=document.getElementById("id_elegir");
                elegir.innerHTML="<option value=''>--Seleccione una opción--</option>";
                array.forEach(comida =>{
                    elegir.innerHTML+=`<option value=${comida.id}>${comida.nombre}</option>`;
                });

                elegir.addEventListener("change", (event) => {
                    let aux=event.target.value;
                    if(!aux) {
                        disableForm();
                        modificar.reset();
                    return;
                    }
                    console.log(array);
        
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
        transaction.oncomplete = function(event) { //transacción exitosa
            console.log("Select terminado");
        }
    }
}

// Este evento solo se ejecuta en la primera creación de la base de datos o en el cambio de versión
request.onupgradeneeded = function (event) {
    console.log("Actualizando la base de datos");
    const db = event.target.result;

    //si existe la elimina, alternativamente se podría hacer una copia y modificar los datos para introducirlos en la nueva
    if(db.objectStoreNames.contains("platos")){
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

function disableForm() {
    modificar.nombre.disabled=true;
    modificar.precio.disabled=true;
    modificar.ingredientes.disabled=true;
    modificar.image.disabled=true;
    modificar.modifica.disabled=true;
    modificar.elimina.disabled=true;
}