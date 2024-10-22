import dotenv from 'dotenv'
import { Command } from 'commander'

const commander = new Command()

commander
    .option('--port <port>', "Puerto del server", 8080)
    .option('--mode <mode>', "Ambiente donde se usaran las variables de entorno", 'dev')
    .requiredOption('--rol <rol>○', "Rol a ejecutar", "user")
commander.parse()



const modeEnviroment = commander.opts().mode
console.log({modeEnviroment});

dotenv.config({
    path: modeEnviroment == "prod" ? ".env.production" : ".env"
})

export default {
    PORT: process.env.PORT,
    ENVIROMENT: process.env.ENVIROMENT,
}