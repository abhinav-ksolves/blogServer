const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./models/dbSetup');
const mainRouter = require('./routes/routes');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
console.log(db);
db.sequelize.sync()
    .then(() => console.log("moddes created!"))
    .catch((err) => console.log(err))
app.use('/', mainRouter);



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});