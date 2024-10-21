import nodemailer from "nodemailer";
import config from "../config/config.js"


const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "keyla.keyla.munoz@gmail.com",
        pass: config.mailingPass
    }
})

export const sendEmail = async (req, res) => {
    try {
        await transport.sendMail({
        from: "TestCoder <keyla.keyla.munoz@gmail.com>",
        to: "clisandrobarrionuevo@gmail.com",
        subject: "Mercado Libre",
        html: `
            <div>
                <h1>¡Compra generada con exito!</h1>
                <h3>Numero de Orden: w495654jji45YT3</h3>
                <p>¡GRACIAS POR TU COMPRA!</p>
            </div>`
        })
        console.log('Correo enviado correctamente')
        res.send('Correo enviado correctamente');
        
    } catch (error) {
        console.error("Error enviando correo:", error);
        res.status(500).send('Error enviando correo');
    }
}