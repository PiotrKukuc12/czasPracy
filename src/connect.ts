import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

let database: mongoose.Connection;

export const connect = () => {
    if (database) {
        return database
    }

    mongoose.connect(
        process.env.MONGO_URI as string,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        }
    )

    database = mongoose.connection;

    database.once('open',async () => {
        console.log('Connected to database')
    })

    database.on("Error", () => {
        console.log("Error connecting to database")
    })
}

export const disconnect = () => {
    if (!database) {
        return
    }
    mongoose.disconnect()
}