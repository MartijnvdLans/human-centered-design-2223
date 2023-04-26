const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

// set templating engine
app.set('view engine', 'ejs');
//where the templates are stored
app.set('views', 'views');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

let users = []

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/chat', (req, res) => {
    username = req.query.nameInput
    console.log(username)
    res.render('chat', { username })
    // res.render('chat')
})

io.on("connection", (socket) => {

    socket.on('user connected', username => {
        // users.push({
        //     username: username,
        //     id: socket.id
        // })
        // io.emit('new user', (users))
        console.log(users)
    })

    socket.on('new user', users => {
      
    })

  console.log("a user connected");

//   socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));

  socket.on('typing', (data)=>{
    if(data.typing==true)
       io.emit('display', data)
    else
       io.emit('display', data)
  })

  socket.on('changeColor', color => {
    console.log(color)
    io.emit('textColor', color)
  })

  socket.on("message", (message) => {

    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    let name = ''

        // users.forEach(user => {
        //     if (user.id === socket.id) {
        //         name = username

        //         users = users.filter(user => user.id != socket.id)
        //     }
        // })

        // io.emit('new user', (users))
    })
    console.log("user disconnected");
});

http.listen(port, () => {
  console.log("listening on port ", port);
});