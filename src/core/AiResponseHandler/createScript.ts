import { getOpenAIResponse } from './utils';
import { UNCLEAR_PROMPT } from './constants';
import { readConfig } from '../Configuration';

const createScript = async (
    prompt: string,
): Promise<{ filename: string; script: string }> => {
    const content = `Create a filename and a corresponding script for this task : ${prompt}.
                    Respond only with the name of the file and the code of the script.
                    The first line of your response should contain only the filename and nothing else. 
                    Starting from the second line, provide the script code and nothing else. 
                    If you cannot generate a script, start your response with '${UNCLEAR_PROMPT}' 
                    followed by an explanation or suggestions related to the task.`;
    const configManager = await readConfig();
    const response = await getOpenAIResponse(content, configManager);

    if (response.startsWith(UNCLEAR_PROMPT)) {
        return { filename: '', script: response };
    }

    const responseLines = response.split('\n');
    const filename = responseLines[0].trim();
    const script = responseLines.slice(1).join('\n');

    return { filename, script };
};

export default createScript;
