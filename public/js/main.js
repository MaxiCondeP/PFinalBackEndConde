

let loginUsr="";






let logSpan = document.querySelector("#logSpan");



const productsForm = document.querySelector('#productsForm');
productsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = document.querySelector('#titleInput')
    const priceInput = document.querySelector('#priceInput');
    const thumbnailInput = document.querySelector('#thumbnailInput');
    const newProd = {
        title: titleInput.value,
        price: priceInput.value,
        thumbnail: thumbnailInput.value
    }
    socket.emit("ADD_PRODUCT", newProd);
    titleInput.value = "";
    priceInput.value = "";
    thumbnailInput.value = "";
})


    

function delayRedirect(){
    var count = 2;
    setInterval(function(){
        count--;
        if (count == 0) {
            window.location = 'http://localhost:8080/'; 
        }
    },1000);
}

const btnLogout = document.querySelector("#btnLogout");
const divLogout = document.querySelector("#divLogout");
btnLogout.addEventListener('click', (e) => {
    let text= "Hasta luego "+loginUsr;
    logSpan.innerHTML= text;
    delayRedirect()
});









