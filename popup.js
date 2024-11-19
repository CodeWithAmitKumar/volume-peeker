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
  slider.value = 0;
  updateBoostLevel(0);
});

// Reset volume to 0 when the popup closes
window.addEventListener("beforeunload", () => {
  updateBoostLevel(0);
});

// Initialize slider to the default value (0x)
updateBoostLevel(0);
