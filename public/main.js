
let socket = io();
const chatMain = document.querySelector('#chatbox')
const loginMain = document.querySelector('#loginRoom')
const video = document.getElementById('video')
const videoBtn = document.querySelector('#videoBtn')
const fightBtn = document.querySelector('#fightBtn')
const videoImg = document.querySelector("#videoBtn img")
const urlParams = new URLSearchParams(window.location.search) // create a URLSearchParams that searches for parameters in the searchbar
const username = urlParams.get('username') // get the username parameter
let cameraStatus = true

const happyBtn = document.getElementById('happy')
const angryBtn = document.getElementById('angry')
const sadBtn = document.getElementById('sad')
const disgustedBtn = document.getElementById('disgusted')
const surprisedBtn = document.getElementById('surprised')
const neutralBtn = document.getElementById('neutral')

const wizard = document.getElementById("wizard")
const fireball = document.getElementById("fireball")
const knight = document.getElementById("knight")
const deadKnight = document.getElementById("dead-knight")

socket.emit('user connected', username) // send the server socket the username of the client that has joined

if (chatMain) {
    let messages = document.querySelector('section section:nth-of-type(3) ul')
    let input = document.querySelector('#message-input')
    const moodBox = document.querySelector(".box section:nth-of-type(1)")

    happyBtn.addEventListener('click', () => {
        let color = 'happy'
            moodBox.classList = ""
            moodBox.classList.add(color)
            socket.emit('changeColor', color)
    })

    angryBtn.addEventListener('click', () => {
        let color = 'angry'
            moodBox.classList = ""
            moodBox.classList.add(color)
            socket.emit('changeColor', color)
    })

    sadBtn.addEventListener('click', () => {
        let color = 'sad'
            moodBox.classList = ""
            moodBox.classList.add(color)
            socket.emit('changeColor', color)
    })

    disgustedBtn.addEventListener('click', () => {
        let color = 'disgust'
            moodBox.classList = ""
            moodBox.classList.add(color)
            socket.emit('changeColor', color)
    })

    surprisedBtn.addEventListener('click', () => {
        let color = 'surprised'
            moodBox.classList = ""
            moodBox.classList.add(color)
            socket.emit('changeColor', color)
    })

    neutralBtn.addEventListener('click', () => {
        let color = 'neutral'
            moodBox.classList = ""
            moodBox.classList.add(color)
            socket.emit('changeColor', color)
    })


    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models')
    ]).then(startVideo())

    // function startVideo() {
    //     if (navigator.mediaDevices.getUserMedia) {
    //         navigator.mediaDevices.getUserMedia({ video: true })
    //           .then(function (stream) {
    //             video.srcObject = stream;
    //           })
    //       }
    // }

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

    videoBtn.addEventListener('click', () => {
        if (cameraStatus === true) {
            videoImg.src = "/images/videoOff.svg"
            cameraStatus = false
            const stream = video.srcObject
            stream.getTracks().forEach(function(track) {
                track.stop();
            });
            video.style.display = "none"
            const removeCanvas = document.querySelector("#video-grid canvas")  
            removeCanvas.remove()          
        } else {
            video.style.display = ""
            videoImg.src = "/images/video.svg"
            cameraStatus = true
            startVideo()
        }
    })

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.querySelector('#video-grid').append(canvas)
    const displaySize = {width: video.width, height: video.height}
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
            let color = 'happy'
            moodBox.classList = ""
            moodBox.classList.add(color)
            socket.emit('changeColor', color)
            // lastLi.classList = ""
            // lastLi.classList.add('happy')
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.sad > 0.9) {
            let color = 'sad'
            moodBox.classList = ""
            moodBox.classList.add('sad')
            socket.emit('changeColor', color)
            // lastLi.classList = ""
            // lastLi.classList.add('sad')
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.surprised > 0.9) {
            let color = 'surprised'
            moodBox.classList = ""
            moodBox.classList.add('surprised')
            socket.emit('changeColor', color)
            // lastLi.classList = ""
            // lastLi.classList.add('surprised')
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.disgusted > 0.9) {
            let color = 'disgust'
            moodBox.classList = ""
            moodBox.classList.add('disgust')
            socket.emit('changeColor', color)
            // lastLi.classList = ""
            // lastLi.classList.add('disgust')
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.angry > 0.9) {
            let color = 'angry'
            moodBox.classList = ""
             moodBox.classList.add('angry')
             socket.emit('changeColor', color)
            //  lastLi.classList = ""
            //  lastLi.classList.add('angry')      
        } else if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.neutral > 0.9) {
            moodBox.classList = ""
            let color = 'neutral'
            moodBox.classList.add('neutral')
            socket.emit('changeColor', color)
            if (lastLi) {
                // lastLi.classList = ""
            }
        }
    }, 100)
})

document.querySelector('#chatroom').addEventListener('submit', event => {
    event.preventDefault()
    if (input.value) {        
        let mainColor = document.querySelector(".box section")
        socket.emit('message', {text:input.value, color:mainColor.classList.value})
        input.value = ''
    }
  });

function checkColor() {
}

var currentcolor = checkColor()
// console.log(currentcolor)

// let colorVal = color
// console.log(color)

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
        let nameSpan = document.createElement('span')
        messageLine.textContent = message.text
        if (message.color) {
            messageLine.classList.add(message.color)
            nameSpan.textContent = `Eric · ${message.color}`
        } else {
            nameSpan.textContent = `Eric · neutral`
        }
        messages.appendChild(messageLine)
        messageLine.appendChild(nameSpan)
        messages.scrollTop = messages.scrollHeight
      });
      
      socket.on('display', (data)=>{
          if(data.typing==true)
          document.querySelector('.typing').innerHTML = "Eric is aan het typen ..."
          else
          document.querySelector('.typing').innerHTML = ""
        })

        fightBtn.addEventListener('click', () => {
            knight.classList.add("knight")
            deadKnight.classList.add("dead-knight")
            fireball.classList.add("fireball")
            wizard.classList.add("wizard")
            setTimeout(resetClass, 9000)
        })

        function resetClass() {
            knight.classList.remove("knight")
            deadKnight.classList.remove("dead-knight")
            fireball.classList.remove("fireball")
            wizard.classList.remove("wizard")
        }
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
    typing = false
    socket.emit('typing', {typing: false})
}