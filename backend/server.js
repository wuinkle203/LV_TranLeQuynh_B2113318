const express =  require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const userRoute = require("./routes/users.route");
const bookRoute = require("./routes/books.route")
const dbConnect = require("./utils/mongodb.util")
const errorMiddleware = require("./middlewares/error")


const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//route
app.use('/api/users', userRoute);
app.use('/api/books', bookRoute);

app.use(errorMiddleware);

dbConnect.connect();

app.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`);
});