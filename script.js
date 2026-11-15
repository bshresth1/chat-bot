const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");
const imageBtn = document.getElementById("image-btn");
const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");
const imagePreviewContainer = document.getElementById("image-preview-container");
const removeImageBtn = document.getElementById("remove-image");
const chatbox = document.querySelector(".chatbox");

let userMessage;
let selectedImageBase64 = null;  // stores uploaded image
let isRecording = false;

// ─── Image Upload ─────────────────────────────────────────────

// Click image button → open file picker
imageBtn.addEventListener("click", () => {
    imageInput.click();
});

// When user selects an image
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        selectedImageBase64 = e.target.result;  // save base64 image

        // Show preview
        imagePreview.src = selectedImageBase64;
        imagePreviewContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
});

// Remove image button
removeImageBtn.addEventListener("click", () => {
    selectedImageBase64 = null;
    imageInput.value = "";
    imagePreviewContainer.style.display = "none";
});

// ─── Voice Input ──────────────────────────────────────────────
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {
        if (!isRecording) {
            recognition.start();
            isRecording = true;
            voiceBtn.classList.add("recording");
            voiceBtn.textContent = "mic_off";
            chatInput.placeholder = "Listening...";
        } else {
            recognition.stop();
            isRecording = false;
            voiceBtn.classList.remove("recording");
            voiceBtn.textContent = "mic";
            chatInput.placeholder = "Type your message...";
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        handleChat();
    };

    recognition.onend = () => {
        isRecording = false;
        voiceBtn.classList.remove("recording");
        voiceBtn.textContent = "mic";
        chatInput.placeholder = "Type your message...";
    };

    recognition.onerror = (event) => {
        isRecording = false;
        voiceBtn.classList.remove("recording");
        voiceBtn.textContent = "mic";
        chatInput.placeholder = "Type your message...";
        if (event.error === "not-allowed") {
            alert("Please allow microphone access!");
        }
    };
} else {
    voiceBtn.style.display = "none";
}

// ─── Chat Functions ───────────────────────────────────────────
const createChatLi = (message, className, imageSrc = null) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);

    let imageHTML = imageSrc ? `<img src="${imageSrc}" class="chat-image">` : "";

    let chatContent = className === "outgoing"
        ? `<p>${imageHTML}${message}</p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p>${imageHTML}${message}</p>`;

    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = async (incomingChatLi, image = null) => {
    const messageElement = incomingChatLi.querySelector("p");

    try {
        // Send the message (and image, if any) to our Netlify function
        const response = await fetch("/.netlify/functions/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: userMessage,
                image: image
            })
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(text.slice(0, 200)); // server sent plain text (e.g. a timeout)
        }

        if (!response.ok || data.error) {
            throw new Error(data.error || "Request failed");
        }

        messageElement.textContent = data.reply;

    } catch (error) {
        console.error(error);
        messageElement.textContent = "Error: " + error.message;
        messageElement.style.color = "red";
    }

    chatbox.scrollTo(0, chatbox.scrollHeight);
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage && !selectedImageBase64) return;

    // Show user message with image if attached
    const displayMessage = userMessage || "📷 Image sent";
    chatbox.appendChild(createChatLi(displayMessage, "outgoing", selectedImageBase64));
    chatInput.value = "";

    // Clear image preview
    const sentImage = selectedImageBase64;
    selectedImageBase64 = null;
    imageInput.value = "";
    imagePreviewContainer.style.display = "none";

    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, sentImage);
    }, 600);
}

if (sendChatBtn) sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});