import {
    translateToCLICommand,
    isUserPromptUnclear,
} from '../../../core/AiResponseHandler';
import { isAIKeyConfigured } from '../../../core/Configuration';
import displayUserPromptUnclear from './utils';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import { exec } from 'child_process';

const handleCliCommand = async (cli_prompt: string) => {
    if (!(await isAIKeyConfigured())) {
        console.error(
            '\n❌ Error: OpenAI API key is not configured. Please run "hokuspokus configure" first.',
        );
        return;
    }

    try {
        const cliAIResponse = await translateToCLICommand(cli_prompt);

        if (isUserPromptUnclear(cliAIResponse)) {
            await displayUserPromptUnclear(cliAIResponse);
            return;
        }

        clipboardy.writeSync(cliAIResponse);

        const userResponse = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'executeCommand',
                message: `The following command has been copied to your clipboard. You can paste and edit it.\n\n${cliAIResponse}\n\nDo you want to use the following CLI command? `,
                default: true,
            },
        ]);

        if (userResponse.executeCommand) {
            exec(cliAIResponse, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return;
                }
                console.log(`Output: ${stdout}`);
            });
        }
    } catch (error) {
        console.error('Error in translating text:', error);
    }
};

export default handleCliCommand;
