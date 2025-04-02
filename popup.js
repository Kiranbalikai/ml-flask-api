document.addEventListener("DOMContentLoaded", function () {
  // Request latest email data from background script
  chrome.runtime.sendMessage({ action: "requestLatestEmail" }, (response) => {
    if (response) {
      updatePopup(response);
    }
  });

  // Listen for incoming updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updatePopup") {
      updatePopup(message);
    }
  });
});

// Function to update popup UI
function updatePopup(message) {
  document.getElementById("Sender").innerText += message.emailData.sender;
  document.getElementById("Subject").innerText += message.emailData.subject;
  document.getElementById("Message").innerText = message.emailData.message;
  const statusElement = document.getElementById("status");
  statusElement.innerText =
    message.phishingResult === 1 ? " Phishing Detected" : " Safe Email";
  statusElement.style.color = message.phishingResult === 1 ? "red" : "green";
  statusElement.style.backgroundColor =
    message.phishingResult === 1 ? "#ffdddd" : "#e2ffdd";
  statusElement.style.padding = message.phishingResult === 1 ? "10px" : "10px";
  statusElement.style.borderRadius =
    message.phishingResult === 1 ? "5px" : "5px";

  console.log("Updated popup with email data:", message.emailData.sender);
}
