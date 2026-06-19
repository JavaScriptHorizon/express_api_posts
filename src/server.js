const dotenv = require('dotenv');
dotenv.config();

const app = require("./app");
const http = require('http');
const mongoose = require("mongoose");
const port = process.env.PORT;
const [username, password] = [process.env.MONGODB_DB_USERNAME, process.env.MONGODB_DB_PASSWORD];
const uri = `mongodb+srv://${username}:${password}@data-profile.irsmbec.mongodb.net/?retryWrites=true&w=majority&appName=data-profile`;
const server = http.createServer(app);


// connect db
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected'));


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});