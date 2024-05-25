import { getOpenAIResponse } from './utils';
import { UNCLEAR_PROMPT } from './constants';
import { readConfig } from '../Configuration';

const generateCodeSnippet = async (prompt: string): Promise<string> => {
    const content = `Generate a very short and concise code snippet for the following task: ${prompt}.
                    Respond only with the code snippet. Add comments within the code to explain key lines.
                    I do not want an explanation of the code. I only want the code snippet.
                    Be concise and respond with the most advanced and elegant way of writing the code, following the clean code, KISS, YAGNI, DRY, and SOLID principles.
                    If you cannot generate a snippet, start your response with '${UNCLEAR_PROMPT}' 
                    followed by an explanation or suggestions related to the task.`;
    const configManager = await readConfig();
    return getOpenAIResponse(content, configManager);
};

export default generateCodeSnippet;
