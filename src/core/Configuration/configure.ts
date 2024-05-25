import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';

const configFilePath = path.join(os.homedir(), '.hokuspokus', 'config.json');

const configure = async () => {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'password',
                name: 'openaiKey',
                message: 'Enter your OpenAI API Key:',
            },
        ]);

        const configDir = path.dirname(configFilePath);
        await fs.mkdir(configDir, { recursive: true });
        await fs.writeFile(
            configFilePath,
            JSON.stringify({ openaiKey: answers.openaiKey }),
        );

        console.log('OpenAI API Key configured successfully.');
    } catch (error) {
        console.error('Error configuring API Key:', error);
    }
};

export default configure;
