import {
    generateCodeSnippet,
    isUserPromptUnclear,
} from '../../../core/AiResponseHandler';
import displayUserPromptUnclear from './utils';
import { isAIKeyConfigured } from '../../../core/Configuration';
import inquirer from 'inquirer';

const handleCodeCommand = async (code_prompt: string) => {
    if (!(await isAIKeyConfigured())) {
        console.error(
            '\n❌ Error: OpenAI API key is not configured. Please run "hokuspokus configure" first.',
        );
        return;
    }

    try {
        const codeAIResponse = await generateCodeSnippet(code_prompt);

        if (isUserPromptUnclear(codeAIResponse)) {
            await displayUserPromptUnclear(codeAIResponse);
            return;
        }

        await inquirer.prompt([
            {
                type: 'list',
                name: 'Manual',
                message: 'Code snippet:\n\n' + codeAIResponse,
                choices: ['OK'],
            },
        ]);
    } catch (error) {
        console.error('Error in generating code snippet:', error);
    }
};

export default handleCodeCommand;
