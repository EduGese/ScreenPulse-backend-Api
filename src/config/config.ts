import dotenv from 'dotenv';

dotenv.config();

//Variables
const MONGODB_USER = process.env.MONGODB_USER ||'';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER || '';
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || '';

const MONGODB_URL = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/${MONGODB_COLLECTION}?retryWrites=true&w=majority`

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 9000;

let CLIENT_URL = ''

//CORS ENV
if(process.env.NODE_ENV ==='production'){
 CLIENT_URL = process.env.CLIENT_URL_PROD || '';

}else{
 CLIENT_URL = process.env.CLIENT_URL_DEV || '';
}

//config object

const config = {
    mongo: {
        url: MONGODB_URL
    },
    server: {
        port: SERVER_PORT
    },
    client: {
        url: CLIENT_URL,
    }
}

export default config;