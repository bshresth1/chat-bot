exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);
    const API_KEY = process.env.GOOGLE_API_KEY; 

    if (!API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing Google API Key" }) };
    }

    // 🛠️ SMART FIX: Ask Google which model to use (Securely)
    let modelName = "models/gemini-pro"; // Default fallback
    try {
      const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
      const listData = await listResponse.json();
      
      if (listData.models) {
        // Find the first model that supports 'generateContent'
        const bestModel = listData.models.find(m => 
          m.name.includes("gemini") && 
          m.supportedGenerationMethods.includes("generateContent")
        );
        if (bestModel) {
            modelName = bestModel.name;
            console.log("Auto-detected Model:", modelName);
        }
      }
    } catch (e) {
      console.log("Model detection failed, using default.");
    }

    // 2. Call Google Gemini API with the detected model
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${API_KEY}`;
    
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
        console.error("Google Error:", data);
        return { statusCode: response.status, body: JSON.stringify(data) };
    }

    const reply = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        choices: [{ message: { content: reply } }] 
      })
    };

  } catch (error) {
    console.error("Crash:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Server Crash" }) };
  }
};
