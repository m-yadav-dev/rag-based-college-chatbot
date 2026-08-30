/**
 * Builds the prompt string formatted for the LLM based on user query and retrieved contexts.
 * 
 * @param {string} userMessage - The question asked by the student.
 * @param {Array} retrievedContexts - Array of RAG context objects { title, textChunk }.
 * @returns {string} The final formatted prompt string.
 */
const buildRAGPrompt = (userMessage, retrievedContexts) => {
    // 1. Construct the context block
    const contextBlocks = retrievedContexts
        .map(r => `Document: ${r.title}\nContent: ${r.textChunk}`)
        .join('\n\n');

    // 2. Strict system instruction forcing reliance on context
    const systemPrompt = `You are a helpful college assistant. 
Answer the user's question using ONLY the information in the provided context. 
You are allowed to perform basic calculations (like converting semesters to years) 
if the data is present in the context. If the provided context does not contain 
enough information to logically deduce the answer, strictly reply exactly with: 
'Information not found in college documents.' Do not bring in outside knowledge.

CONTEXT:
${contextBlocks}`;

    // 3. Combine with the user query
    return `${systemPrompt}\n\nSTUDENT QUESTION:\n${userMessage}`;
};

module.exports = { buildRAGPrompt };
