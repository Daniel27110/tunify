// load elements
const wrapper = document.querySelector(".at-wrap");
const main = wrapper.querySelector(".at-main");

let nextNote = null;

// initialize alphatab
const settings = {
  file: "https://www.alphatab.net/files/canon.gp",
  player: {
    enablePlayer: true,
    soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
    scrollElement: wrapper.querySelector('.at-viewport')
  },
  core: {
    includeNoteBounds: true
  }
};
const api = new alphaTab.AlphaTabApi(main, settings);

// overlay logic
const overlay = wrapper.querySelector(".at-overlay");
api.renderStarted.on(() => {
  overlay.style.display = "flex";
});
api.renderFinished.on(() => {
  overlay.style.display = "none";
});

// track selector
function createTrackItem(track) {
  const trackItem = document
    .querySelector("#at-track-template")
    .content.cloneNode(true).firstElementChild;
  trackItem.querySelector(".at-track-name").innerText = track.name;
  trackItem.track = track;
  trackItem.onclick = (e) => {
    e.stopPropagation();
    api.renderTracks([track]);
  };
  return trackItem;
}
const trackList = wrapper.querySelector(".at-track-list");
api.scoreLoaded.on((score) => {
  // clear items
  trackList.innerHTML = "";
  // generate a track item for all tracks of the score
  /** 
  score.tracks.forEach((track) => {
    trackList.appendChild(createTrackItem(track));
  });*/
  // generate a track item for the first track of the score
  // calla el track para que no hable
  const track = score.tracks[0];
  trackList.appendChild(createTrackItem(track));
});
api.renderStarted.on(() => {
  // collect tracks being rendered
  const tracks = new Map();
  api.tracks.forEach((t) => {
    tracks.set(t.index, t);
  });
  // mark the item as active or not
  const trackItems = trackList.querySelectorAll(".at-track");
  trackItems.forEach((trackItem) => {
    if (tracks.has(trackItem.track.index)) {
      trackItem.classList.add("active");
    } else {
      trackItem.classList.remove("active");
    }
  });
});

/** Controls **/
api.scoreLoaded.on((score) => {
  wrapper.querySelector(".at-song-title").innerText = score.title;
  wrapper.querySelector(".at-song-artist").innerText = score.artist;
});

const countIn = wrapper.querySelector('.at-controls .at-count-in');
countIn.onclick = () => {
  countIn.classList.toggle('active');
  if (countIn.classList.contains('active')) {
    api.countInVolume = 1;
  } else {
    api.countInVolume = 0;
  }
};

const metronome = wrapper.querySelector(".at-controls .at-metronome");
metronome.onclick = () => {
  metronome.classList.toggle("active");
  if (metronome.classList.contains("active")) {
    api.metronomeVolume = 1;
  } else {
    api.metronomeVolume = 0;
  }
};

const loop = wrapper.querySelector(".at-controls .at-loop");
loop.onclick = () => {
  loop.classList.toggle("active");
  api.isLooping = loop.classList.contains("active");
};

wrapper.querySelector(".at-controls .at-print").onclick = () => {
  api.print();
};

const zoom = wrapper.querySelector(".at-controls .at-zoom select");
zoom.onchange = () => {
  const zoomLevel = parseInt(zoom.value) / 100;
  api.settings.display.scale = zoomLevel;
  api.updateSettings();
  api.render();
};

const layout = wrapper.querySelector(".at-controls .at-layout select");
layout.onchange = () => {
  switch (layout.value) {
    case "horizontal":
      api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
      break;
    case "page":
      api.settings.display.layoutMode = alphaTab.LayoutMode.Page;
      break;
  }
  api.updateSettings();
  api.render();
};
api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;

// player loading indicator
const playerIndicator = wrapper.querySelector(
  ".at-controls .at-player-progress"
);
api.soundFontLoad.on((e) => {
  const percentage = Math.floor((e.loaded / e.total) * 100);
  playerIndicator.innerText = percentage + "%";
});
api.playerReady.on(() => {
  playerIndicator.style.display = "none";
});

// main player controls
const playPause = wrapper.querySelector(
  ".at-controls .at-player-play-pause"
);
const stop = wrapper.querySelector(".at-controls .at-player-stop");
playPause.onclick = (e) => {
  if (e.target.classList.contains("disabled")) {
    return;
  }
  api.playPause();
};
stop.onclick = (e) => {
  if (e.target.classList.contains("disabled")) {
    return;
  }
  api.stop();
};
api.playerReady.on(() => {
  playPause.classList.remove("disabled");
  stop.classList.remove("disabled");
});
api.playerStateChanged.on((e) => {
  const icon = playPause.querySelector("i.fas");
  if (e.state === alphaTab.synth.PlayerState.Playing) {
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  } else {
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  }
});

// song position
function formatDuration(milliseconds) {
  let seconds = milliseconds / 1000;
  const minutes = (seconds / 60) | 0;
  seconds = (seconds - minutes * 60) | 0;
  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}

const songPosition = wrapper.querySelector(".at-song-position");
let previousTime = -1;
api.playerPositionChanged.on((e) => {
  findNextNote();
  // reduce number of UI updates to second changes.
  const currentSeconds = (e.currentTime / 1000) | 0;
  if (currentSeconds == previousTime) {
    return;
  }

  songPosition.innerText =
    formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);


});


function findNoteAtPos(x, y) {
  if (!this.notes) {
    return null;
  }
  for (let note of this.notes) {
    let bottom = note.noteHeadBounds.y + note.noteHeadBounds.h;
    let right = note.noteHeadBounds.x + note.noteHeadBounds.w;
    // Here is the fix
    if (note.noteHeadBounds.x <= x && note.noteHeadBounds.y <= y && x <= right && y <= bottom) {
      return note.note;
    }
  }

  return null;
}

let nextBeat = null;

$(window).on('alphaTab.beatMouseDown', (event, beat) => {
  const containerOffset = $('.at-main').offset();
  if (containerOffset === undefined) {
    return;
  }
  const x = window.event.pageX - containerOffset.left;
  const y = window.event.pageY - containerOffset.top;
  const beatBounds = api.renderer.boundsLookup.findBeat(beat, x, y);
  let note = findNoteAtPos.bind(beatBounds)(x, y);
  if (note) {
    const nextNoteName = document.getElementById('warning');
    nextNoteName.innerHTML = 'First Note was clicked! Now click play';
    nextBeat = beat;
  }
})  

function getNoteOnGuitar(string, fret) {
  const openStringNotes = ["E", "A", "D", "G", "B", "E"];
  const openStringNote = openStringNotes[string - 1]; // String numbers are 1-based
  const noteNames = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

  // Find the index of the open string note in the noteNames array
  const openStringNoteIndex = noteNames.indexOf(openStringNote);

  // Calculate the note at the given fret
  const noteIndex = (openStringNoteIndex + fret) % 12;
  const note = noteNames[noteIndex];

  // Calculate the octave number
  const octave = Math.floor((openStringNoteIndex + fret) / 12)+2;
  nextNote = note + octave;
  return note + octave;
}

async function findNextNote() {
  // get the x position of the beat cursor, it has the html element class "at-beat-cursor"
  const beatCursor = document.querySelector('.at-cursor-beat');
  const beatCursorRect = beatCursor.getBoundingClientRect();
  const position_x = beatCursorRect.x;

  // gets the window container offset
  const containerOffset = $('.at-main').offset();
  if (containerOffset === undefined) {
    return;
  }
  const nextNoteName = document.getElementById('currentNotePosition');
  nextNoteName.innerHTML = 'The beat cursor is at position ' + (position_x - containerOffset.left) + 'px';

  // gets the variable nextNote, if it's null, return
  if (nextBeat === null) {
    return;
  }

  // Hopefully finds the next note
  findNextNoteFromBeat(nextBeat, position_x - containerOffset.left);

}

function findNextNoteFromBeat(beat, pos_x) {
  const beatBounds = api.renderer.boundsLookup.findBeat(beat, pos_x, 0);
  let note = findNoteAtPos_x.bind(beatBounds)(pos_x);
  if (note) {
    if (nextBeat.nextBeat != null) {
      nextBeat = nextBeat.nextBeat;
      const nextNoteName = document.getElementById('NextNotePosition');
      nextNoteName.innerHTML = `${getNoteOnGuitar(note.string, note.fret)} on string ${note.string} fret ${note.fret}`;
      api.pause();

    } else {
      const nextNoteName = document.getElementById('NextNotePosition');
      nextNoteName.innerHTML = 'No more notes left';
    }
  }
}

function findNoteAtPos_x(x) {
  if (!this.notes) {
    return null;
  }
  for (let note of this.notes) {
    let right = note.noteHeadBounds.x + note.noteHeadBounds.w;
    if (note.noteHeadBounds.x <= x && x <= right) {
      return note.note;
    }
  }

  return null;
}

const nextNoteName = document.getElementById('warning');
nextNoteName.innerHTML = 'First Note has not been clicked!'
// api.settings.player.enableAnimatedBeatCursor = false;

