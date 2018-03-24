/* Set variables */
firstLoad = true;

var stream = new Howl({
    src: ['https://streamer.radio.co/s986435880/listen'],
    format: 'mp3',
    html5: true,
    onload: function() {
        if(firstLoad) {
            togglePlayback(false);
            firstLoad = false;
        }
    }
});

pausedMins = 0;
pausedSecs = 0;

isReloading = false;

playButton = document.getElementById("play-button");
goLiveButton = document.getElementById("go-live");

pauseTimerUpdate = setInterval(updatePausedTimer, 1000);

/* Add animation over player */
var wave = new SiriWave({
    container: document.getElementById('wave'),
    cover: true,
    height: 150,
    speed: 0.02,
    color: '#650014',
    frequency: 5,
    amplitude: 1
});
waveDiv = document.getElementById("wave");


/* Ran when play/pause button clicked */
function togglePlayback(isPlaying) {
    if(isPlaying) {
        stream.pause();
        wave.stop();
        waveDiv.style.visibility = "hidden";
        changePlaybackStatus(false);
        togglePausedTimer(true);
    } else {
        if(isReloading) {
            playButton.innerHTML = '<i class="fas fa-fw fa-spin fa-spinner"></i>';
        }
        isReloading = false;
        stream.play();
        wave.start();
        waveDiv.style.visibility = "visible";
        changePlaybackStatus(true);
        togglePausedTimer(false);
    }

    playButton.disabled = true;
    goLiveButton.disabled = true;

    setTimeout(function() { // Not ideal - this is here to stop people spamming play/pause and breaking it
        playButton.disabled = false;
        goLiveButton.disabled = false;
    }, 1000)
}

function changePlaybackStatus(newStatus) {
    var onClickFunction = "javascript: togglePlayback(" + newStatus + ");";

    playButton.setAttribute("onclick", onClickFunction);

    if(newStatus) {
        playButton.innerHTML = '<i class="fas fa-fw fa-pause"></i>';
    } else {
        playButton.innerHTML = '<i class="fas fa-fw fa-play"></i>';
    }
}

/* Handles timer that shows up when paused */
function togglePausedTimer(isPaused) {
    if(isPaused) {
        pausedMins = 0;
        pausedSecs = 0;
        document.getElementById("paused-timer").innerHTML = "0:00";
        document.getElementById("paused-data-container").style.display = "block";
    } else {
        document.getElementById("paused-data-container").style.display = "none";
    }
}

function updatePausedTimer() {
    pausedSecs++;

    if(pausedSecs == 60) {
        pausedSecs = 0;
        pausedMins++;
    }

    if(pausedSecs < 10) { // Always show seconds as 2 digits - there's probably a better way to do this
        displayPausedSecs = "0" + pausedSecs;
    } else {
        displayPausedSecs = pausedSecs;
    }

    document.getElementById("paused-timer").innerHTML = pausedMins + ":" + displayPausedSecs;
}

/* Return live functionality */
function goLive() {
    stream.unload();
    isReloading = true;
    togglePlayback(false);
}