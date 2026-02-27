const songs = [
    { title: "Kun Anta", src: "music/Kun Anta.mp3", category: "pop", bg: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1920&q=80" },
    { title: "Belki", src: "music/Belki.mp3", category: "rock", bg: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80" },
    { title: "Bana Seni Gerek Seni", src: "music/Bana Seni Gerek Seni.mp3", category: "pop", bg: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1920&q=80" }
];

let currentSong = 0;
const audio = document.getElementById("audio");
const playlist = document.getElementById("playlist");
const playBtn = document.getElementById("playBtn");

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function setBackground(index) {
    const bg = songs[index].bg;
    document.body.style.backgroundImage = `url('${bg}')`;
}

function loadPlaylist(filter = "all", searchText = "") {
    playlist.innerHTML = "";

    songs
        .filter(song =>
            (filter === "all" || song.category === filter) &&
            song.title.toLowerCase().includes(searchText.toLowerCase())
        )
        .forEach((song, index) => {
            const li = document.createElement("li");
            li.textContent = song.title;
            li.onclick = () => playSong(index);
            if (index === currentSong) li.classList.add("active");
            playlist.appendChild(li);
        });
}

function playSong(index) {
    currentSong = index;
    audio.src = songs[index].src;
    audio.play();
    playBtn.textContent = "⏸";
    setBackground(index);
    loadPlaylist();
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
}

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    playSong(currentSong);
}

function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    playSong(currentSong);
}

document.getElementById("volume").addEventListener("input", e => {
    audio.volume = e.target.value;
    document.getElementById("volumePercent").textContent = Math.round(e.target.value * 100) + "%";
});

audio.addEventListener("loadedmetadata", () => {
    document.getElementById("totalTime").textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    document.getElementById("progress").value =
        (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
    document.getElementById("totalTime").textContent = formatTime(audio.duration);
});

document.getElementById("search").addEventListener("input", e => {
    loadPlaylist(document.getElementById("categoryFilter").value, e.target.value);
});

document.getElementById("categoryFilter").addEventListener("change", e => {
    loadPlaylist(e.target.value, document.getElementById("search").value);
});

loadPlaylist();
