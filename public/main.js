
let socket = io();
const chatMain = document.querySelector('#chatbox')
const loginMain = document.querySelector('#loginRoom')
const urlParams = new URLSearchParams(window.location.search) // create a URLSearchParams that searches for parameters in the searchbar
const username = urlParams.get('username') // get the username parameter

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
])

socket.emit('user connected', username) // send the server socket the username of the client that has joined

if (chatMain) {
    let messages = document.querySelector('section section:nth-of-type(3) ul')
    let input = document.querySelector('#message-input')

    let myVideoStream;
    const videoGrid = document.getElementById("video-grid");
    const myVideo = document.createElement("video");
    myVideo.muted = true;

    document.querySelector('#video').addEventListener('click', () => {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        }).then((stream) => {
            myVideoStream = stream;
                addVideoStream(myVideo, stream);
        });
    })

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
       video.play();
       videoGrid.append(video);
    });
};

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    console.log('FSGDFWSDZ')
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detection = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(detection)
        const resizedDetections = faceapi.resizeResults(detection, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})



    document.querySelector('#chatroom').addEventListener('submit', event => {
        event.preventDefault()
        if (input.value) {
          socket.emit('message', '<%= username %>: ' + input.value)
          input.value = ''
        }
      });

      document.querySelector('#chatroom').addEventListener('keypress', e => {
        if(e.which!=13) {
            typing = true
            socket.emit('typing', {typing:true})
            setTimeout(typingTimeout, 1500)
        } else {
            setTimeout(typingTimeout, 50)
            typingTimeout()
        }
    })

    socket.on('message', message => {
        messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
        messages.scrollTop = messages.scrollHeight
      });
      
      socket.on('display', (data)=>{
          if(data.typing==true)
          document.querySelector('.typing').innerHTML = " ${naam} is aan het typen ..."
          else
          document.querySelector('.typing').innerHTML = ""
        })
}

if (loginMain) {
    let nameInput = document.querySelector('#nameInput')

    let users = {}

document.querySelector('#name-form').addEventListener('submit', event => {
    if (nameInput.value) {
        socket.on('new-user', name => {
            users[socket.id] = name
            socket.broadcast.emit('user-name', name)
        })
        console.log(`Hi ` + nameInput.value + `!`)
        nameInput.value = ""
        console.log(users)
    }
})
}

function typingTimeout() {
    console.log('notyping')
    typing = false
    socket.emit('typing', {typing: false})
}