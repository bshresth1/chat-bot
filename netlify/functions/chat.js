// netlify/functions/chat.js
// Runs on the server (Netlify), so your API key stays secret.

const MODEL = "gemini-3.5-flash-lite"; // fast, low-cost Gemini model

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Use POST" }) };
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: "GOOGLE_API_KEY is missing" }) };
    }

    try {
        const { message, image } = JSON.parse(event.body || "{}");

        // Build the message parts (text + optional image)
        const parts = [];
        if (image) {
            // image looks like "data:image/png;base64,AAAA..."
            const [header, base64Data] = image.split(",");
            const mimeType = header.match(/data:(.*?);base64/)[1];
            parts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
        }
        parts.push({ text: message || "What is in this image? Describe it." });

        // Give up after 9 seconds so we get a clear error instead of a timeout
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 9000);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
            {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: "You are a helpful assistant. Answer concisely and accurately." }]
                    },
                    contents: [{ role: "user", parts }]
                })
            }
        );

        clearTimeout(timer);
        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.error?.message || "Gemini request failed" })
            };
        }

        const reply = (data.candidates?.[0]?.content?.parts || [])
            .map((p) => p.text || "")
            .join("")
            .trim();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: reply || "Sorry, I couldn't generate a reply." })
        };
    } catch (err) {
        console.error("Gemini error:", err);
        const msg = err.name === "AbortError"
            ? "Google did not answer within 9 seconds. Check your internet, firewall/antivirus (McAfee), or API key."
            : err.message;
        return { statusCode: 500, body: JSON.stringify({ error: msg }) };
    }
};