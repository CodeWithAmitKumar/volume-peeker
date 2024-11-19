const slider = document.getElementById("boostSlider");
const boostValue = document.getElementById("boostValue");
const resetButton = document.getElementById("resetButton");

// Check if a saved boost level exists in localStorage
const savedBoostLevel = localStorage.getItem("boostLevel");
if (savedBoostLevel) {
  slider.value = savedBoostLevel;  // Set slider to saved value
  updateBoostLevel(savedBoostLevel); // Apply saved boost level
} else {
  // Set default to 1x if no saved value
  updateBoostLevel(1);
  slider.value = 1;
}

// Sync slider value with the display and send it to the content script
function updateBoostLevel(boostLevel) {
  boostValue.textContent = `${boostLevel}x`;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "setBoost", boostLevel });
  });

  // Save the boost level in localStorage
  localStorage.setItem("boostLevel", boostLevel);
}

// Listen to slider changes
slider.addEventListener("input", () => {
  const boostLevel = parseFloat(slider.value);
  updateBoostLevel(boostLevel);
});

// Reset button functionality
resetButton.addEventListener("click", () => {
  slider.value = 1; // Reset to normal volume level (1x)
  updateBoostLevel(1); // Reset saved value
});

// Reset volume to 1 when the popup closes (ensure persistence on close)
window.addEventListener("beforeunload", () => {
  updateBoostLevel(slider.value);
});
