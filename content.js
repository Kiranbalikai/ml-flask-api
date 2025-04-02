document.addEventListener("click", function () {
  setTimeout(() => {
    let senderElement = document.querySelector(".gD");
    let subjectElement = document.querySelector(".hP");
    let messageElement = document.querySelector(".a3s.aiL");

    if (senderElement && subjectElement && messageElement) {
      let emailData = {
        sender: senderElement.innerText,
        subject: subjectElement.innerText,
        message: messageElement.innerText,
      };

      console.log("Extracted Email Data:", emailData);

      // Send email data to background.js
      chrome.runtime.sendMessage({
        action: "emailExtracted",
        data: emailData,
      });
    }
  }, 1000);
});
