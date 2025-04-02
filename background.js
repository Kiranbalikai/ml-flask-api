let latestEmailData = null; // Store the latest email data globally

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "emailExtracted") {
    console.log("Received Email Data in Background Script:", message.data);

    // Send email data to Flask API for phishing detection
    fetch("https://phishing-email-api.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message.data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Phishing detection:", data);

        console.log("Phishing detection result:", data.phishing);

        // Store the latest email data globally
        latestEmailData = {
          emailData: message.data,
          phishingResult: data.phishing,
        };

        // Send data directly to popup.js if it's open
        chrome.runtime.sendMessage({
          action: "updatePopup",
          emailData: latestEmailData.emailData,
          phishingResult: latestEmailData.phishingResult,
        });

        if (data.phishing === 1) {
          // Alert user if phishing detected
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () =>
                  alert("⚠️ Phishing Detected! Be careful with this email."),
              });
            }
          });
        }
      })
      .catch((error) => console.error("Error sending email data:", error));
  }

  // Handle popup requesting latest email data
  if (message.action === "requestLatestEmail" && latestEmailData) {
    sendResponse({
      action: "updatePopup",
      emailData: latestEmailData.emailData,
      phishingResult: latestEmailData.phishingResult,
    });
  }
});
