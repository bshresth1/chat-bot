exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    // 1. Get the Google Key from Netlify
    const API_KEY = process.env.GOOGLE_API_KEY; 

    if (!API_KEY) {
      console.error("Error: Google API Key is missing in Netlify Settings.");
      return { statusCode: 500, body: JSON.stringify({ error: "Server Configuration Error" }) };
    }

    // 2. Call Google Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `You are a helpful BMW Sales Assistant. Answer this concisely: ${message}` }] 
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Google API Error:", data);
        return { statusCode: response.status, body: JSON.stringify(data) };
    }

    // 3. Convert Google's response to the format our Frontend expects
    const reply = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        choices: [{ message: { content: reply } }] 
      })
    };

  } catch (error) {
    console.error("Crash:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to connect to AI" }) };
  }
};