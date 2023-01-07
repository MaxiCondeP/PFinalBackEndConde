import bcrypt from 'bcrypt';

export const isValidPassword = (userPassword, password) => {
    return bcrypt.compareSync(userPassword.toString(), password.toString())

}


export const createHash = (password) => {
    return bcrypt.hashSync(password.toString(), bcrypt.genSaltSync(10), null);
}


export const getProductsHTML = (products) => {

    let html= "<h1>Detalles del pedido: </h1><br>";
    products.map((prod)=>{
        html= html +
        `<p>${prod.quantity}x   </p>
        <p><span style="font-style:italic;"> ${prod.title}</span></p>
        <p> $ ${prod.price}</p><br>`;
    })
    return html;
}