const express = require("express")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT
const promptRouter = require('./routes/gemini')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/',promptRouter)

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
