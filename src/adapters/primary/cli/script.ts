import {
    createScript,
    isUserPromptUnclear,
} from '../../../core/AiResponseHandler';
import displayUserPromptUnclear from './utils';
import { isAIKeyConfigured } from '../../../core/Configuration';
import inquirer from 'inquirer';
import fs from 'fs/promises';

const handleScriptCommand = async (script_prompt: string) => {
    if (!(await isAIKeyConfigured())) {
        console.error(
            '\n❌ Error: OpenAI API key is not configured. Please run "hokuspokus configure" first.',
        );
        return;
    }

    try {
        const { filename: filenameAIResponse, script: scriptAIResponse } =
            await createScript(script_prompt);

        if (isUserPromptUnclear(scriptAIResponse)) {
            await displayUserPromptUnclear(scriptAIResponse);
            return;
        }

        console.log('Generated Script:\n', scriptAIResponse);

        const userResponse = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'saveScript',
                message: `Would you like to save this script as '${filenameAIResponse}'?\n`,
                default: false,
            },
        ]);

        if (userResponse.saveScript) {
            await fs.writeFile(filenameAIResponse, scriptAIResponse);
            console.log(`Script saved to ${filenameAIResponse}`);
        }
    } catch (error) {
        console.error('Error in script generation:', error);
    }
};

export default handleScriptCommand;
