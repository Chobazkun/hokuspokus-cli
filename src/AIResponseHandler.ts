import axios from 'axios';
import { ConfigurationManager } from './ConfigurationManager';

export class AIResponseHandler {
    static UNCLEAR_PROMPT: string = 'UNCLEAR PROMPT : ';

    configManager: ConfigurationManager;

    constructor(configManager: ConfigurationManager) {
        this.configManager = configManager;
    }

    async generateCLI(prompt: string, tool: string): Promise<string> {
        const content = `Translate the following to an ${tool} CLI command. 
                         If you are able to find a corresponding CLI command, reply only with the command in one line and nothing else. Do not give further explanation, the CLI command is enough.
                         If you are not able to generate a command, reply by saying first '${AIResponseHandler.UNCLEAR_PROMPT}' 
                         followed by an explanation or suggestions on how to accomplish the task: ${prompt}`;
        return this.getOpenAIResponse(content);
    }

    async generateManual(prompt: string): Promise<string> {
        const content = `I need the manual for a CLI command based on the following description. 
                         Please provide the complete manual for the command. 
                         If the version isn't specified in the description, provide the manual of the latest version of the CLI command.
                         If a direct manual is available for this command, include only the manual content. 
                         If there's no specific manual or the command is unclear, start your response with '${AIResponseHandler.UNCLEAR_PROMPT}', 
                         followed by an explanation or suggestions on how to accomplish the task: ${prompt}`;
        return this.getOpenAIResponse(content);
    }

    async generateScript(prompt: string): Promise<{ filename: string, script: string }> {
        const content = `Create a filename and a corresponding script for this task : ${prompt}.
                         Respond only with the name of the file and the code of the script.
                         The first line of your response should contain only the filename and nothing else. 
                         Starting from the second line, provide the script code and nothing else. 
                         If you cannot generate a script, start your response with '${AIResponseHandler.UNCLEAR_PROMPT}' 
                         followed by an explanation or suggestions related to the task.`;
        const response = await this.getOpenAIResponse(content);

        if (response.startsWith(AIResponseHandler.UNCLEAR_PROMPT)) {
            return { filename: '', script: response };
        }

        const responseLines = response.split('\n');
        const filename = responseLines[0].trim();
        const script = responseLines.slice(1).join('\n');

        return { filename, script };
    }

    async generateCode(prompt: string): Promise<string> {
        const content = `Generate a very short and consise code snippet for the following task: ${prompt}.
                         Respond only with the code snippet. Add comments within the code to explains key lines.
                         I do not want explanation of the code. I only want the code snippet.
                         Be concise and respond with the most advanced and elegant way of writing the code, following the clean code, KISS, YAGNI, DRY and SOLID principles.
                         If you cannot generate a snippet, start your response with '${AIResponseHandler.UNCLEAR_PROMPT}' 
                         followed by an explanation or suggestions related to the task.`;
        return this.getOpenAIResponse(content);
    }


    isUserPromptUnclear(response: string): boolean {
        return response.startsWith(AIResponseHandler.UNCLEAR_PROMPT);
    }

    private async getOpenAIResponse(content: string): Promise<string> {
        const { openaiKey } = await this.configManager.readConfig();

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4",
                messages: [{ role: "user", content }],
                temperature: 0.2
            },
            {
                headers: {
                    'Authorization': `Bearer ${openaiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content.trim();
    }
}
