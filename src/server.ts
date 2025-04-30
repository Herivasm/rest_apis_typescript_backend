import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi, { serve } from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

// Connect to database
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.bgGreen.white.bold('Conexión exitosa a la base de datos'));

    } catch (error) {
        // console.log(error);
        console.log(colors.bgRed.white('Error al conectar la base de datos'));
    }
}
connectDB()

// Express instance
const server = express()

// Permits connections
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true)

        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))

// Read forms data
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server