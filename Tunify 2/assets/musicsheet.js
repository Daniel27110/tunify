/**
 * Load elements and initialize alphatab
 */
/**
 * Load elements and initialize alphatab
 */
const wrapper = document.querySelector(".at-wrap");
const main = wrapper.querySelector(".at-main");
const settings = {
  file: "https://www.alphatab.net/files/canon.gp",
  player: {
    enablePlayer: true,
    soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
    scrollElement: wrapper.querySelector('.at-viewport')
  },
  core: {
    includeNoteBounds: true,
    tex: true,
  }
};

fetch("output.txt")
  .then((response) => response.text())
  .then((fileContents) => {
    // Pass the fileContents to AlphaTab for rendering
    settings.data = fileContents;
    const api = new alphaTab.AlphaTabApi(main, settings);
    api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
    console.log("File contents:", fileContents);
  })
  .catch((error) => {
    console.error("Error loading 'output.txt':", error);
    
  });

/** 
// Load "output.txt" using a fetch request
fetch("output.txt")
  .then((response) => response.text())
  .then((fileContents) => {
    // Pass the fileContents to AlphaTab for rendering
    settings.data = fileContents;
    const api = new alphaTab.AlphaTabApi(main, settings);
    api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
    console.log("File contents:", fileContents);
  })
  .catch((error) => {
    console.error("Error loading 'output.txt':", error);
    
  });
*/
  
const api = new alphaTab.AlphaTabApi(main, settings);
api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
/**
 * Overlay logic
 */
const overlay = wrapper.querySelector(".at-overlay");
api.renderStarted.on(() => {
  overlay.style.display = "flex";
});
api.renderFinished.on(() => {
  overlay.style.display = "none";
});

/**
 * Create track item
 * @param {Object} track - The track object
 * @returns {Object} - The track item
 */
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

/**
 * Song position
 */
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

/**
 * Find note at position
 * @param {number} x - The x position
 * @param {number} y - The y position
 * @returns {Object} - The note object
 */
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
  const semitonesPerFret = 1;
  const noteNames = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

  // Find the index of the open string note in the noteNames array
  const openStringNoteIndex = noteNames.indexOf(openStringNote);

  // Calculate the note at the given fret
  const noteIndex = (openStringNoteIndex + fret) % 12;
  const note = noteNames[noteIndex];

  // Calculate the octave number
  const octave = Math.floor((openStringNoteIndex + fret) / 12) + 1;

  return note + octave;
}



/**
 * Finds the next note based on the current position of the beat cursor.
 * @async
 * @function findNextNote
 * @returns {Promise<void>} A Promise that resolves when the next note is found.
 */
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
    // Here is the fix
    if (note.noteHeadBounds.x <= x && x <= right) {
      return note.note;
    }
  }
  return null;
}

const nextNoteName = document.getElementById('warning');
nextNoteName.innerHTML = 'First Note has not been clicked!'
// api.settings.player.enableAnimatedBeatCursor = false;


