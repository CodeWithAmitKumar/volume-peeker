(function () {
  let audioCtx;
  let gainNode;
  let mediaElementSource;

  // Setup Web Audio API and connect video element
  function setupAudioBoost() {
    const video = document.querySelector("video");
    if (!video) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioCtx.createGain();

      // Check if mediaElementSource already exists
      if (!mediaElementSource) {
        mediaElementSource = audioCtx.createMediaElementSource(video);
        mediaElementSource.connect(gainNode).connect(audioCtx.destination);
      }
    }
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
