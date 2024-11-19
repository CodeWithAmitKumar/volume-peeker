(function () {
  let audioCtx;
  let gainNode;

  function setupAudioBoost() {
    const video = document.querySelector("video");
    if (!video) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(video);
      gainNode = audioCtx.createGain();
      source.connect(gainNode).connect(audioCtx.destination);
    }
  }

  function setVolumeBoost(boostLevel) {
    if (gainNode) {
      gainNode.gain.value = boostLevel;
    }
  }

  const observer = new MutationObserver(() => {
    setupAudioBoost();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "setBoost") {
      setVolumeBoost(message.boostLevel);
    }
  });
})();
