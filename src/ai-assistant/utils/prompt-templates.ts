import { Prompt, PromptTopic } from './types';

export function getPromptTemplate(prompt: Prompt, sessionId: string): string {
  switch (prompt.topic) {
    case PromptTopic.BUSINESS:
      return businessPromptTemplate(prompt, sessionId);
    case PromptTopic.TRAVEL:
      return travelPromptTemplate(prompt, sessionId);
    case PromptTopic.FINANCE:
      return financePromptTemplate(prompt, sessionId);
    case PromptTopic.SPORT:
      return sportPromptTemplate(prompt, sessionId);
    case PromptTopic.INVESTMENT:
      return investmentPromptTemplate(prompt, sessionId);
    default:
      return generalFunnyTopicTemplate(prompt, sessionId);
  }
}

export const getTitleSuggestions = (
  { topic, subTopic }: Prompt,
  sessionId: string,
): string => {
  const prefix = sessionId
    ? `You are an assistant for a smart calendar app. `
    : '';
  if (!subTopic) {
    return `
        ${prefix} Give me top 3 high popular ${topic} titles each should be max 50 symbols.
        Format the response as valid JSON like:
        {
        "titleSuggestions": ["."]
        }`;
  }

  return `
        ${prefix} Give me top 3 high popular titles for ${topic} with key words: ${subTopic}. Each should be max 50 symbols.
        Format the response as valid JSON like:
        {
        "titleSuggestions": ["."]
        }`;
};

const businessPromptTemplate = (
  { targetItem, subTopic }: Prompt,
  sessionId: string,
): string => {
  const prefix = sessionId
    ? `You are an assistant for a smart calendar app. `
    : '';
  return getTemplate(prefix, PromptTopic.BUSINESS, subTopic, targetItem);
};

const travelPromptTemplate = (
  { targetItem, subTopic }: Prompt,
  sessionId: string,
): string => {
  const prefix = sessionId
    ? `You are an assistant for a smart calendar app. `
    : '';
  return getTemplate(prefix, PromptTopic.TRAVEL, subTopic, targetItem);
};

const financePromptTemplate = (
  { targetItem, subTopic }: Prompt,
  sessionId: string,
): string => {
  const prefix = sessionId
    ? `You are an assistant for a smart calendar app. `
    : '';
  return getTemplate(prefix, PromptTopic.FINANCE, subTopic, targetItem);
};

const sportPromptTemplate = (
  { targetItem, subTopic }: Prompt,
  sessionId: string,
): string => {
  const prefix = sessionId
    ? `You are an assistant for a smart calendar app. `
    : '';
  return getTemplate(prefix, PromptTopic.SPORT, subTopic, targetItem);
};

const investmentPromptTemplate = (
  { targetItem, subTopic }: Prompt,
  sessionId: string,
): string => {
  const prefix = sessionId
    ? `You are an assistant for a smart calendar app. `
    : '';
  return getTemplate(prefix, PromptTopic.INVESTMENT, subTopic, targetItem);
};

const generalFunnyTopicTemplate = (
  { targetItem, subTopic }: Prompt,
  sessionId: string,
): string => {
  const prefix = sessionId
    ? `You are an assistant for a smart calendar app. `
    : '';
  return getTemplate(prefix, PromptTopic.HUMOR, subTopic, targetItem);
};

/***************************************************
 *  HELPERS                                        *
 ***************************************************/

const getTemplate = (
  prefix: string,
  topic: PromptTopic,
  subTopic: string,
  targetItem: string,
): string => `
    ${prefix}
    For the topic "${topic}", ${subTopic ? `about ${subTopic}` : ''}${targetItem ? `, focused on ${targetItem}` : ''}, generate the following:

    - 3 interesting or insightful facts related to the topic
    - key relevant statistics or metrics (adapted to the topic context)
    - a brief summary or description (2-3 sentences)
    - Provide a valid and RELEVANT image URL for this key parameters: ${topic}, ${subTopic}, ${targetItem}. Url should be direct .jpg or .png from open, free image sources like Unsplash, Pexels, or Pixabay. Do not return links from Wikipedia or broken sources.

    Format the response as **valid JSON** like:
    {
      "facts": ["..."],
      "stats": {
        "property name1 ": "...",
        "property name2": "...",
        "property name3": "..."
      },
      "summary": "...",
      "image": "https://example.com/image.jpg"
    }

    Make sure the JSON is **strictly valid**, and tailor the "stats" keys to fit the topic (e.g., revenue, growth rate, market share for business; flight time, destination, cost for travel).
  `;

export const imageUrlPrompt = ({
  topic,
  subTopic,
  targetItem,
}: Prompt): string => `
    - Provide another valid and RELEVANT image URL for ${topic}, ${subTopic}, ${targetItem}. Url should be direct .jpg or .png from open, free image sources like Unsplash, Pexels, or Pixabay. Do not return links from Wikipedia or broken sources.`;
