import { getOpenAIResponse } from './utils';
import { UNCLEAR_PROMPT } from './constants';
import { readConfig } from '../Configuration';

const provideBriefSEAnswer = async (prompt: string): Promise<string> => {
    const content = `Respond as a software engineering and programming expert with a concise, precise, and extremely brief answer. 
                    If the question is unclear, irrelevant to software engineering, or lacks a straightforward answer, begin your response with '${UNCLEAR_PROMPT}' followed by a brief clarification.
                    Otherwise, provide a direct answer without additional explanations or details.
                    Question: ${prompt}`;
    const configManager = await readConfig();
    return getOpenAIResponse(content, configManager);
};

const provideDetailedSEAnswer = async (
    question: string,
    initialAnswer: string,
): Promise<string> => {
    const content = `Respond as a software engineering and programming expert. Here is a software engineering question and its brief answer. 
                    Please provide more detailed information on this topic, in the limit of a paragraph or two maximum.
                    Question: ${question}
                    Initial Answer: ${initialAnswer}`;
    const configManager = await readConfig();
    return getOpenAIResponse(content, configManager);
};

export { provideBriefSEAnswer, provideDetailedSEAnswer };
