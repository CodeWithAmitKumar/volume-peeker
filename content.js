(function () {
  let audioCtx;
  let gainNode;
  const connectedVideos = new Set(); // Track connected video elements

  // Setup Web Audio API and connect video element
  function setupAudioBoost() {
    const video = document.querySelector("video");
    if (!video || connectedVideos.has(video)) return; // Skip if already connected

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioCtx.createGain();
    }

    // Create and connect the media source node if not already connected
    const mediaElementSource = audioCtx.createMediaElementSource(video);
    mediaElementSource.connect(gainNode).connect(audioCtx.destination);
    connectedVideos.add(video); // Mark this video as connected
  }

  // Adjust gain (volume boost)
  function setVolumeBoost(boostLevel) {
    if (gainNode) {
      gainNode.gain.value = boostLevel;
    }
  }

  // Observe DOM for video elements
  const observer = new MutationObserver(() => {
    setupAudioBoost();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Listen for messages from popup to adjust volume
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "setBoost") {
      setVolumeBoost(message.boostLevel);
    }
  });
})();
