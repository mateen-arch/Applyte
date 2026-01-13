function extractJsonStringAdvanced(rawString) {
  // Try to find a code block marked as ```json or just ```
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  
  let potentialJson = rawString;
  const codeBlockMatch = rawString.match(codeBlockRegex);
  
  // If a code block is found, use the content inside it
  if (codeBlockMatch) {
    potentialJson = codeBlockMatch[1];
  }
  
  // Now try to find a JSON object or array within the potentially cleaned string
  const jsonRegex = /(\{[\s\S]*\}|\[[\s\S]*\])/;
  const jsonMatch = potentialJson.match(jsonRegex);
  
  if (jsonMatch) {
    return jsonMatch[0].trim();
  } else {
    throw new Error('Failed to extract JSON from the response');
  }
}

module.exports = {
    extractJsonStringAdvanced
}