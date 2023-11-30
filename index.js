const ingredientes = document.querySelector('#ingredientes');
const formulario = document.querySelector('form');
const btn_add = document.querySelector('#btn_add');
const btn_rmv = document.querySelector('#btn_rmv');
btn_add.addEventListener('click', addIngrediente);
btn_rmv.addEventListener('click', rmvIngrediente);
formulario.addEventListener('submit', function (event) {
    event.preventDefault();
});
function addIngrediente() {
    const ingrediente = document.createElement('input')
    ingrediente.type = 'text';
    ingrediente.name = 'ingredientes[]';
    ingrediente.placeholder = 'Ingrediente';
    btn_add.insertAdjacentElement('beforebegin', ingrediente);
    
}
function rmvIngrediente() {
    const ingrediente = ingredientes.lastChild;
    if (ingrediente) {
        ingredientes.removeChild(ingrediente);
    }
}
