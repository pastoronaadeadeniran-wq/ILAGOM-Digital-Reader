const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// Serve everything inside the public folder
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log("");
    console.log("======================================");
    console.log(" ILAGOM Digital Reader v1.1");
    console.log(" Running at:");
    console.log(` http://localhost:${PORT}`);
    console.log("======================================");
    console.log("");
});