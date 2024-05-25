import {
    provideBriefSEAnswer,
    provideDetailedSEAnswer,
    isUserPromptUnclear,
} from '../../../core/AiResponseHandler';
import displayUserPromptUnclear from './utils';
import { isAIKeyConfigured } from '../../../core/Configuration';
import inquirer from 'inquirer';

const handleQuestionCommand = async (question_prompt: string) => {
    if (!(await isAIKeyConfigured())) {
        console.error(
            '\n❌ Error: OpenAI API key is not configured. Please run "hokuspokus configure" first.',
        );
        return;
    }

    try {
        const seAnswer = await provideBriefSEAnswer(question_prompt);

        if (isUserPromptUnclear(seAnswer)) {
            await displayUserPromptUnclear(seAnswer);
            return;
        }
        console.log(`\nShort Answer:\n\n ${seAnswer}\n`);

        const userResponse = await inquirer.prompt([
            {
                type: 'list',
                name: 'nextAction',
                message:
                    'Would you like to ask for more details or thank the guru for the wisdom?',
                choices: [
                    '💰 Thank the Wize Guru for his wisdom and leave',
                    '🧠 Ask for more details',
                ],
            },
        ]);

        if (userResponse.nextAction === '🧠 Ask for more details') {
            const detailedSEAnswer = await provideDetailedSEAnswer(
                question_prompt,
                seAnswer,
            );
            console.log(`\nLong Answer:\n\n ${detailedSEAnswer}\n`);
        }
    } catch (error) {
        console.error('Error in processing your question:', error);
    }
};

export default handleQuestionCommand;
