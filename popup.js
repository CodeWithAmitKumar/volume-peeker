const slider = document.getElementById("boostSlider");
const boostValue = document.getElementById("boostValue");
const resetButton = document.getElementById("resetButton");

// Sync slider value with the display and send it to the content script
function updateBoostLevel(boostLevel) {
  boostValue.textContent = `${boostLevel}x`;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "setBoost", boostLevel });
  });
}

// Listen to slider changes
slider.addEventListener("input", () => {
  const boostLevel = parseFloat(slider.value);
  updateBoostLevel(boostLevel);
});

// Reset button functionality
resetButton.addEventListener("click", () => {
  slider.value = 1; // Reset to normal volume level (1x)
  updateBoostLevel(1);
});

// Reset volume to 1 when the popup closes
window.addEventListener("beforeunload", () => {
  updateBoostLevel(1);
});

// Initialize slider to the default value (1x)
updateBoostLevel(1);
