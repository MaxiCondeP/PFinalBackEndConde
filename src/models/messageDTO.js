export class Message {
    constructor(mail, name, lastname, age, avatar, role, text) {
        this.author = {
            email: mail,
            name: name,
            age: age,
            role: role,
            avatar: avatar
        }
        this.text = text;
        this.date = new Date().toLocaleString();
    }

}