const questionAnswerPrompt = (role, experience, topics, desc, numberOfQuestions) => {
    return `
  You are an expert technical interviewer preparing questions for a candidate applying for a ${role} position.
  The candidate has ${experience} level experience in this field.
  The interview will focus on these topics: ${topics}.
  Additional context about the position: ${desc}.

  Generate ${numberOfQuestions} high-quality interview questions that:
  1. Are tailored to the specified role and experience level
  2. Cover both fundamental concepts and advanced topics
  3. Include scenario-based and behavioral questions where appropriate
  4. Progress from easier to more difficult questions
  5. Are clear, concise, and unambiguous

  For each question, provide:
  - The question text
  - The expected answer

  strictly Format your response as a JSON array with these fields for each question:
  {
    "question": "question text",
    "answer": "key points of expected answer"
  }
  `;
}

const questionExplanation = (question) => {
    return `
  You are an AI technical interview coach explaining concepts to beginner developers.

  Generate a clear explanation of this interview question:
  "${question}"

  Requirements:

  1. Explain the underlying concept thoroughly but simply
  2. Assume the reader is a beginner developer
  3. Include a code example if relevant (formatted properly)
  4. Provide a concise title summarizing the concept
  5. Format must be valid JSON with exactly these fields:
     {
       "title": "string (5-7 words max)",
       "explanation": "string (3-5 paragraphs)"
     }

  Guidelines:
  - Use simple language with practical examples
  - Focus on real-world applications
  - Highlight common misconceptions if applicable
  - Code examples should be short and illustrative
  - Never include markdown formatting or extra text outside the JSON

  Only return the JSON object with no additional text or formatting.
  `;
}


module.exports = {
    questionAnswerPrompt,
    questionExplanation
}