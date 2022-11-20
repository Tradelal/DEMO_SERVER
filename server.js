const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
require("./db/conn");
const userModel = require("./model/user.model");
const adminModel = require("./model/admin.model");
const courseModel = require("./model/course.model");
const middleware = require("./middleware/auth")


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "*"],
  methods: ["GET", "POST"],
  credentials: true
}))

app.use(express.json());
dotenv.config({ path: "config.env" });



// defining port
const PORT = process.env.PORT || 3001;
app.use(require("./routes/register"));
app.use(require("./routes/videoToUrl"));
app.use(require("./routes/getVideos"));
app.use(require("./routes/addNewMeeting"));
app.use(require("./routes/getMeetings"));
app.use(require("./routes/getMeetingById"));
app.use(require("./routes/deleteMeeting"));
app.use(require("./routes/addBlogs"));
app.use(require("./routes/getBlogs"));
app.use(require("./routes/getBlog"));
app.use(require("./routes/getOrder"));
app.use(require("./routes/getCourse"));
app.use(require("./routes/updateCourse"));
app.use(require("./routes/getCourseById"));
app.use(require("./routes/deleteCourse"));
app.use(require("./routes/getRecentPurchase"));
app.use(require("./routes/login"))
app.use(require("./routes/register"))
app.use(require("./routes/addCourse"))
app.use(require("./routes/pay"))
app.use(require("./routes/order"))
app.use(require("./routes/getUsers"))
app.use(require("./routes/getUser"))
app.use(require("./routes/updatePassword"));
app.use(require("./routes/deleteBlog"));
app.use(require("./routes/getSales"));

// setting up an empty GET Route
app.get('/', (req, res) => { res.json({ message: "You've come to the right place... it's a GET request!!" }) });

// Starting Server on PORT
app.listen(PORT, () => console.log('Server started on PORT Number: ' + PORT))