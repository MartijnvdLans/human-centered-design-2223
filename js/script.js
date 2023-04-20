const mic = document.querySelector("#record")
const speaking = document.querySelector(".recording-inner")
const feebackText = document.querySelector(".feedback-text")

if ("webkitSpeechRecognition" in window) {

    console.log('werkt')

    let speechRecognition = new webkitSpeechRecognition();    

    let final_transcript = "";

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "nl-NL"

    speechRecognition.onstart = () => {
        speaking.classList.add('speaking')
        speaking.classList.remove('none')
      };

      speechRecognition.onend = () => {
        speaking.classList.remove('speaking')
        speaking.classList.add('none')
      };

      speechRecognition.onError = () => {
        feebackText.innerHTML = "Er is iets mis gegaan"
      };
      
      speechRecognition.onresult = (event) => {
        // Create the interim transcript string locally because we don't want it to persist like final transcript
        let interim_transcript = "";

        // Loop through the results from the speech recognition object.
for (let i = event.resultIndex; i < event.results.length; ++i) {
    // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }

  
  document.querySelector("#voice-input").value = interim_transcript;
  document.querySelector("#voice-input").value = final_transcript;
    };

    mic.addEventListener('click', event => {
        speechRecognition.start()
        document.querySelector("#voice-input").value = ""
    })
  
  } else {
    console.log("Speech Recognition Not Available")
  }