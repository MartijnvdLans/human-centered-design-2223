
let socket = io();
const chatMain = document.querySelector('#chatbox')
const loginMain = document.querySelector('#loginRoom')
const video = document.getElementById('video')
const urlParams = new URLSearchParams(window.location.search) // create a URLSearchParams that searches for parameters in the searchbar
const username = urlParams.get('username') // get the username parameter

socket.emit('user connected', username) // send the server socket the username of the client that has joined

if (chatMain) {
    let messages = document.querySelector('section section:nth-of-type(3) ul')
    let input = document.querySelector('#message-input')
    const moodBox = document.querySelector(".box section:nth-of-type(1)")

    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models')
    ]).then(startVideo())

    function startVideo() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
              .then(function (stream) {
                video.srcObject = stream;
              })
          }
    }

    function startVideo() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
              .then(function (stream) {
                video.srcObject = stream;
              })
              .catch(function (err0r) {
                console.log("Something went wrong!");
              });
          }
    }

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.querySelector('#video-grid').append(canvas)
    const displaySize = {width: video.width, height: video.height}
    console.log('FSGDFWSDZ')
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detection = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        // console.log(detection)
        const resizedDetections = faceapi.resizeResults(detection, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        let lastLi = document.querySelector(".main-ul li:last-of-type")
        if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.happy > 0.9) {
            moodBox.classList = ""
            moodBox.classList.add('happy')
            lastLi.classList = ""
            lastLi.classList.add('happy')
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.sad > 0.9) {
            moodBox.classList = ""
            moodBox.classList.add('sad')
            lastLi.classList = ""
            lastLi.classList.add('sad')
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.surprised > 0.9) {
            moodBox.classList = ""
            moodBox.classList.add('surprised')
            lastLi.classList = ""
            lastLi.classList.add('surprised')
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.disgusted > 0.9) {
            moodBox.classList = ""
            moodBox.classList.add('disgust')
            lastLi.classList = ""
            lastLi.classList.add('disgust')
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.angry > 0.9) {
            moodBox.classList = ""
             moodBox.classList.add('angry')
             lastLi.classList = ""
             lastLi.classList.add('angry')      
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.neutral > 0.9) {
            moodBox.classList = ""
            if (lastLi) {
                // lastLi.classList = ""
            }
        }
    }, 100)
})



    document.querySelector('#chatroom').addEventListener('submit', event => {
        event.preventDefault()
        if (input.value) {
          socket.emit('message', 'Erik: ' + input.value)
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
        let messageLine = document.createElement('li')
        messageLine.textContent = message
        messages.appendChild(messageLine)
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