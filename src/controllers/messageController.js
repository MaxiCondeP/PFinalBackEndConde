import { daoMessages } from '../../server.js'

export const getUsrMessages = async (req, res) => {
    let email = req.params.email;
    const messages = await daoMessages.getByUsr(email)
    res.status(200).send(messages)
}

export const getMessages = async (req, res) => {
    const messages = await daoMessages.getAll();
    res.status(200).send(messages)
}