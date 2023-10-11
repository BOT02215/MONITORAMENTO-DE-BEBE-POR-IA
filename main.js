modelStatus = false
alarmStatus = ""

function setup() {
    canvas = createCanvas(682, 500)
    video = createCapture(VIDEO)
    video.hide()

    objectDetected = ml5.objectDetector("cocossd", modelLoaded)
}

function preload() {
    alarm = loadSound("alarm.mp3")
}

function modelLoaded() {
    console.log("Modelo Carregado")
    modelStatus = true
}

object = []
function gotResult(error, result) {
    if(error) {
        console.log(error)
    }
    else {
        console.log(result)
        object = result
    }
}

function draw() {
    image(video, 0, 0, 682, 500)
    
    if(modelStatus == true) {
        objectDetected.detect(video, gotResult)

        for(i = 0; i < object.length; i++) {
            noFill()
            rect(object[i].x, object[i].y, object[i].width, object[i].height)
            stroke("red")
            fill("black")
            percent = object[i].confidence.toFixed(2)*100
            text(object[i].label + ": " + percent + "%", object[i].x, object[i].y)

            if(object[i].label == "person") {
                alarm.stop()
                document.getElementById("babyFounded").innerHTML = "Informaçãoes: Bebê detectado"
            }
            else {
                document.getElementById("babyFounded").innerHTML = "Informações: Bebê não detectado"
                alarm.play()
            }
        }

        if(object.length == 0) {
            alarm.play()
            document.getElementById("babyFounded").innerHTML = "Informações: Bebê não detectado"

        }
    }
}
