const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib1BHa0NjN0lBQWJ0cTJldzI3VHJOcXhDTFJFTjRSRklwajBkWXR1MVUwcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiak1IVml3Yk1OQWpISExFTXp0ZzJKU3NTYksvdUNHVVJEVEVNUzBhMjFVUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4UHUxMlN4ZnVsM0lFUnJLOHkySFRRUm5NU29jMmFpUFE3VUJSVFpXRzNRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJkalovVWpRT3Z3ZkRnZTZETHhYV0ovaGhpTVFKR2UxN21tbWthcFpJdGg4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IitGM1M5OGZjUXNLdDZLR1Rldm1vSy9mOTdYQXdENnB4aXlpZjlOSTdhMGs9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii9ZY3BnbnluTFFRZjRLdld4RmNkb2VHbGo2a0tUUXJKUGpVN2lIdXlwRkE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK0h5aFJkSmNNSEp4ejdJVEJSS0pVVXc4YmltZXdyMVpPVFNPc3d1LzJGWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTkcyeGMxNEVuK0lFSG1GSmxmSkl5MG9oNTc2N3dsTTI0clRoQ25LZU1HRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImIvZHExek41bkNMSTUvQUdpTEh4WTRlcUtIQ2xWb0paNXA3Z1FXaFY5RXN5akRJZkxNQjNLTVRXQjZhcHlBY2tybVdCRXlUMUhESEo2MU8wOHMvN2lnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTgxLCJhZHZTZWNyZXRLZXkiOiJjKzUrOEZIRklzTzN6V3ZnMWNJUFpBR1lRQ3BwaURjOU1GVDRwalgzT05rPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJISTJCYUh5c1JkSzNDUkRvTm4wdDRRIiwicGhvbmVJZCI6IjU4NDU3ZTFhLTc2NjEtNDU4MC1iOTc5LWJiODhlZGQ1NTdmZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJKalJrdVl0WWRBSVZWYkl2aTk2OGxXMjdDbm89In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieDB3aTRxb1d4cnB6SGlyd0YwdXRDS24reHlvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjZYS0NXRFY3IiwibWUiOnsiaWQiOiI1Njk4NDI5NTUxMDoxMkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLwnZCF8J2Qq/CdkJ7wnZCeIPCdkJPwnZCe8J2QnPCdkKEg8J2QkfCdkKjwnZCiIiwibGlkIjoiNjMxMjgxNjc1Njc1NTk6MTJAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNMNzZ0cTRIRU55S2hNZ0dHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJkZmF6c1cwb2FaSXpxclNnOElIWTdlZ3cvQ1BSWDI0YUwzQnMya090OWpvPSIsImFjY291bnRTaWduYXR1cmUiOiJlRjVnS2ZhM25OdHZJaDdrcmJjNlFsbDVES2ZtRXIwU0FoQ3BFSDZnVWFrT3ZVWW5NODl4TElnYWROcmxPSzVFN2FWeThaMmZoNUcxNWxxUGRjQjZDZz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiZkEraStBYTRpMlpIV0tJYTNzdzRCZDV5d2s0K25VT2VDM0tSMldObVhGbEYvMVV3bFRHV2RQc05aV3NGTE5hWkhnV2F1T0ZLVlA0ZW5PU0lqaDk1aWc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI1Njk4NDI5NTUxMDoxMkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJYWDJzN0Z0S0dtU002cTBvUENCMk8zb01Qd2owVjl1R2k5d2JOcERyZlk2In19XSwicGxhdGZvcm0iOiJzbWJhIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQVVJQ0E9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NjE2NzQ2MDEsImxhc3RQcm9wSGFzaCI6IjJWNzdxVSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQUJ4In0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "xh_clinton",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254735342808",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",       
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "yes",                     
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'Toxic-MD',
    URL : process.env.BOT_MENU_LINKS || 'https://i.ibb.co/mChCjFPL/ad76194e124ff34e.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
