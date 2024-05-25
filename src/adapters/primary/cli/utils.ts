import inquirer from 'inquirer';

const displayUserPromptUnclear = async (aiResponse: string): Promise<void> => {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'error',
            message: aiResponse,
            choices: ['OK'],
        },
    ]);
};

export default displayUserPromptUnclear;
