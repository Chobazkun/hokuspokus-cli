import { getOpenAIResponse, cleanApiResponse } from './utils';
import { UNCLEAR_PROMPT } from './constants';
import { readConfig } from '../Configuration';

const translateToCLICommand = async (prompt: string): Promise<string> => {
    const content = `Translate the following to a CLI command. 
                    If you are able to find a corresponding CLI command, reply only with the command in one line and nothing else. Do not give further explanation, the CLI command is enough.
                    If you are not able to generate a command, reply by saying first '${UNCLEAR_PROMPT}' 
                    followed by an explanation or suggestions on how to accomplish the task: ${prompt}`;
    const configManager = await readConfig();
    return getOpenAIResponse(cleanApiResponse(content), configManager);
};

export default translateToCLICommand;
