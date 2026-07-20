/**
 * Calculates estimated reading time for a block of text and optional bullet points.
 * Returns an object containing word count, estimated seconds, estimated minutes,
 * and a formatted readable label.
 */
export function calculateReadingTime(
  text: string,
  bullets: string[] = []
): { words: number; seconds: number; minutes: number; label: string } {
  const combinedText = [text, ...bullets].join(" ");
  const cleanText = combinedText.replace(/[^\w\s]/g, ""); // strip punctuation
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  
  // Technical/academic content reading speed is around 150-180 words per minute
  const wordsPerMinute = 160;
  const totalMinutes = words / wordsPerMinute;
  const totalSeconds = Math.round(totalMinutes * 60);
  
  let label = "";
  if (totalSeconds < 15) {
    label = "10 sec read";
  } else if (totalSeconds < 30) {
    label = "20 sec read";
  } else if (totalSeconds < 45) {
    label = "30 sec read";
  } else if (totalSeconds < 60) {
    label = "45 sec read";
  } else {
    const roundedMinutes = Math.max(1, Math.round(totalMinutes));
    label = `${roundedMinutes} min read`;
  }
  
  return {
    words,
    seconds: totalSeconds,
    minutes: Math.ceil(totalMinutes),
    label,
  };
}
