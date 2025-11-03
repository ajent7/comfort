const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { feelings } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a gentle, warm, and deeply compassionate friend speaking to Reedaa, someone with a tender heart who sometimes struggles with difficult emotions. She's just shared: "${feelings}"

Respond with deep empathy, warmth, and genuine understanding. Your response should:
1. Always address her as "Reedaa" and acknowledge what she's feeling with genuine validation
2. Meet her where she is emotionally - whether she's feeling:
   - Guilty about something
   - Sad or low
   - Missing someone
   - Lonely or isolated
   - Anxious or worried
   - Overwhelmed
   - Just having a hard day
   - Any other difficult emotion
3. Provide comfort, perspective, or gentle reassurance tailored to her specific situation
4. Help her see things with more kindness and compassion
5. Remind her that she's not alone and that what she's feeling is human
6. End with warmth, hope, or gentle encouragement

Keep it conversational, sweet, and comforting - like a caring friend who truly sees her and understands. Don't be preachy or clinical. Be genuinely warm, use a gentle and soothing tone, and speak from the heart. Sometimes what she needs most is just to feel heard and understood.`
        }]
      })
    });

    const data = await response.json();
    const aiResponse = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

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
