import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';

export class ConfigurationManager {
    configFilePath: string;

    constructor() {
        this.configFilePath = path.join(os.homedir(), '.hokuspokus', 'config.json');
    }

    async configure() {
        try {
            const answers = await inquirer.prompt([
                {
                    type: 'password',
                    name: 'openaiKey',
                    message: 'Enter your OpenAI API Key:'
                }
            ]);

            const configDir = path.dirname(this.configFilePath);
            await fs.mkdir(configDir, { recursive: true });
            await fs.writeFile(this.configFilePath, JSON.stringify({ openaiKey: answers.openaiKey }));

            console.log('OpenAI API Key configured successfully.');
        } catch (error) {
            console.error('Error configuring API Key:', error);
        }
    }

    async readConfig() {
        const configData = await fs.readFile(this.configFilePath, 'utf-8');
        return JSON.parse(configData);
    }

    async isOpenAIKeyConfigured(): Promise<boolean> {
        try {
            const config = await fs.readFile(this.configFilePath, 'utf8');
            const { openaiKey } = JSON.parse(config);
            return !!openaiKey;
        } catch (error) {
            return false;
        }
    }
}
