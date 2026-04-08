import dotenv from 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3000;


const startServer = async () =>{
    try{
        app.listen(PORT , ()=> console.log(`server is running on http://localhost:${PORT}/`))
    }catch(error:unknown){
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("Failed to connect to DB", err);
        process.exit(1);
    }
};

startServer();