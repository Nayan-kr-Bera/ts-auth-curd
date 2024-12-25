import {config as conf} from 'dotenv';
conf()
const _config ={
    port:process.env.PORT,
    database:process.env.MONGO_CONNECTION_STRING,
    env:process.env.NODE_ENV,
    // jwtsecret:process.env.JWT_SECRET,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    refreshtoken:process.env.REFRESH_TOKEN_SECRET,
    refreshexpiry:process.env.REFRESH_TOKEN_EXPIRY ,
    accesstoken:process.env.ACCESS_TOKEN_SECRET,
    accessexpiry:process.env.ACCESS_TOKEN_EXPIRY
}
export const config = Object.freeze(_config);