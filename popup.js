const slider = document.getElementById("boostSlider");
const boostValue = document.getElementById("boostValue");

slider.addEventListener("input", () => {
  const boostLevel = parseFloat(slider.value);
  boostValue.textContent = `${boostLevel}x`;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "setBoost", boostLevel });
  });
});