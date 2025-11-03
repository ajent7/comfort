exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { feelings } = JSON.parse(event.body);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a gentle, warm, and deeply compassionate friend speaking to Reedaa, someone with a tender heart who sometimes struggles with difficult emotions. She's just shared: "${feelings}"

Respond with deep empathy, warmth, and genuine understanding. Your response should:
1. Always address her as "Reedaa" and acknowledge what she's feeling with genuine validation
2. Meet her where she is emotionally - whether she's feeling guilty, sad, lonely, anxious, overwhelmed, or just having a hard day
3. Provide comfort, perspective, or gentle reassurance tailored to her specific situation
4. Help her see things with more kindness and compassion
5. Remind her that she's not alone and that what she's feeling is human
6. End with warmth, hope, or gentle encouragement

Keep it conversational, sweet, and comforting - like a caring friend who truly sees her and understands. Don't be preachy or clinical. Be genuinely warm, use a gentle and soothing tone, and speak from the heart. Sometimes what she needs most is just to feel heard and understood.`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1000
          }
        })
      }
    );

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ response: aiResponse })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response' })
    };
  }
};
