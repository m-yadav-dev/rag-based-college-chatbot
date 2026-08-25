/**
 * Splits text into overlapping chunks
 * @param {string} text - The raw text to split
 * @param {number} chunkSize - Maximum characters per chunk
 * @param {number} chunkOverlap - Number of characters to overlap between chunks
 * @returns {string[]} Array of text chunks
 */
const splitText = (text, chunkSize = 1000, chunkOverlap = 200) => {
    if (!text || text.trim() === '') return [];
    
    // Clean up whitespace and newlines for better tokenization later
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    const chunks = [];
    let startIndex = 0;
    
    while (startIndex < cleanText.length) {
        let endIndex = startIndex + chunkSize;
        
        // If we're not at the very end, try to snap to the nearest space 
        // to avoid cutting words in half, but don't look back too far.
        if (endIndex < cleanText.length) {
            const lastSpaceIndex = cleanText.lastIndexOf(' ', endIndex);
            // Only snap to space if it's within the last 100 chars to maintain roughly equal chunk sizes
            if (lastSpaceIndex > endIndex - 100 && lastSpaceIndex > startIndex) {
                endIndex = lastSpaceIndex;
            }
        }

        chunks.push(cleanText.substring(startIndex, endIndex).trim());
        
        // Step forward by the exact amount we advanced, minus the overlap
        // So the next chunk starts `chunkOverlap` characters before the end of the current chunk
        startIndex = endIndex - chunkOverlap;
    }
    
    return chunks;
};

module.exports = { splitText };
