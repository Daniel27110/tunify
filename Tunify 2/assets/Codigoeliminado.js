


/**
 * Track selector
 *
const trackList = wrapper.querySelector(".at-track-list");
api.scoreLoaded.on((score) => {
  // clear items
  trackList.innerHTML = "";
  // generate a track item for all tracks of the score
  score.tracks.forEach((track) => {
    trackList.appendChild(createTrackItem(track));
  });
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
*/
/** 
  * Track selector
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

const loop = wrapper.querySelector("controls .at-loop");
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
*/
api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;

/**
 * Player loading indicator
 
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
*/
/**
 * Main player controls
 
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
*/
