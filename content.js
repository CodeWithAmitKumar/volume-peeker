(function () {
  let audioCtx;
  let gainNode;

  // Create the Web Audio API context and set default gain
  function setupAudioBoost() {
    const video = document.querySelector("video");
    if (!video) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(video);
      gainNode = audioCtx.createGain();
      gainNode.gain.value = 1; // Normal volume
      source.connect(gainNode).connect(audioCtx.destination);
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
