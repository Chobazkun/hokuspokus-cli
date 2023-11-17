import axios from 'axios';
import { ConfigurationManager } from './ConfigurationManager';

export class CommandGenerator {
    static COMMAND_NOT_FOUND: string = 'COMMAND NOT FOUND : ';

    configManager: ConfigurationManager;

    constructor(configManager: ConfigurationManager) {
        this.configManager = configManager;
    }

    async generateTranslateCommand(prompt: string, tool: string): Promise<string> {
        const content = `Translate the following to an ${tool} CLI command. 
                         If you are able to find a corresponding CLI command, reply only with the command in one line and nothing else. Do not give further explanation, the CLI command is enough.
                         If you are not able to generate a command, reply by saying first '${CommandGenerator.COMMAND_NOT_FOUND}' 
                         followed by an explanation or suggestions on how to accomplish the task: ${prompt}`;
        return this.getOpenAIResponse(content);
    }

    async generateManualCommand(prompt: string): Promise<string> {
        const content = `I need the manual for a CLI command based on the following description. 
                         Please provide the complete manual for the command. 
                         If the version isn't specified in the description, provide the manual of the latest version of the CLI command.
                         If a direct manual is available for this command, include only the manual content. 
                         If there's no specific manual or the command is unclear, start your response with '${CommandGenerator.COMMAND_NOT_FOUND}', 
                         followed by an explanation or suggestions on how to accomplish the task: ${prompt}`;
        return this.getOpenAIResponse(content);
    }

    async getOpenAIResponse(content: string): Promise<string> {
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

    isCommandNotFound(response: string): boolean {
        return response.startsWith(CommandGenerator.COMMAND_NOT_FOUND);
    }
}
