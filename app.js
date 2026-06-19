const exp = require('express');
const cors = require('cors');
const path = require("path");
const app = exp();
const origin = process.env.ORIGIN_HOST_APP || 'http://localhost:3001';


// Middleware
app.use(cors({
    origin, // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));


// uses in app
app.use(exp.json());
app.use(exp.static(path.join(__dirname, "/public")));
app.use("/api", require("./routes/index"));


module.exports = app;