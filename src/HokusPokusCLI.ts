import { Command } from 'commander';
import { exec } from 'child_process';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';

import { AIResponseHandler } from './AIResponseHandler.js';
import { ConfigurationManager } from './ConfigurationManager.js';
import packageJson from '../package.json';

export class HokusPokusCLI {
    program: Command;
    commandGenerator: AIResponseHandler;
    configManager: ConfigurationManager;

    constructor() {
        this.program = new Command();
        this.configManager = new ConfigurationManager();
        this.commandGenerator = new AIResponseHandler(this.configManager);
        this.setupCommands();
    }


    run() {
        this.program.parse(process.argv);
    }

    private setupCommands() {
        this.program
            .name('hokuspokus')
            .description('CLI tool for translating text into CLI commands using OpenAI')
            .version(packageJson.version);

        this.program
            .command('configure')
            .description('Configure OpenAI API Key')
            .action(() => this.configManager.configure());

        this.program
            .command('cli <cli_prompt>')
            .description('Translate a description to a CLI command')
            .action((cli_prompt) => this.handleCliCommand(cli_prompt));

        this.program
            .command('man <manual_prompt>')
            .description('Get the latest manual for a specific command')
            .action((manual_prompt) => this.handleManualCommand(manual_prompt));

        this.program
            .command('script <script_prompt>')
            .description('Generate a script in the specified language or tool')
            .action((script_prompt) => this.handleScriptCommand(script_prompt));

        this.program
            .command('code <code_prompt>')
            .description('Generate a snippet of code in the specified language or tool')
            .action((code_prompt) => this.handleCodeCommand(code_prompt));
    }

    private async verifyOpenAIKey(): Promise<boolean> {
        if (!await this.configManager.isOpenAIKeyConfigured()) {
            console.error('\n❌ Error: OpenAI API key is not configured. Please run "hokuspokus configure" first.');
            return false;
        }
        return true;
    }

    private async handleCliCommand(prompt: string) {
        if (!await this.verifyOpenAIKey()) return;

        try {
            const cliAIReponse = await this.commandGenerator.generateCLI(prompt);

            if (this.commandGenerator.isUserPromptUnclear(cliAIReponse)) {
                await this.handleUserPromptUnclear(cliAIReponse);
                return;
            }

            clipboardy.writeSync(cliAIReponse);

            const userResponse = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'executeCommand',
                    message: `The following command has been copied to your clipboard. You can paste and edit it.\n\n${cliAIReponse}\n\nDo you want to use the following CLI command? `,
                    default: true
                }
            ]);

            if (userResponse.executeCommand) {
                exec(cliAIReponse, (error, stdout, stderr) => {
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
    }

    private async handleManualCommand(prompt: string) {
        if (!await this.verifyOpenAIKey()) return;

        try {
            const manualAIResponse = await this.commandGenerator.generateManual(prompt);

            if (this.commandGenerator.isUserPromptUnclear(manualAIResponse)) {
                await this.handleUserPromptUnclear(manualAIResponse);
                return;
            }

            await inquirer.prompt([
                {
                    type: 'list',
                    name: 'Manual',
                    message: manualAIResponse,
                    choices: ['OK']
                }
            ]);
        } catch (error) {
            console.error('Error in generating command manual:', error);
        }
    }

    private async handleScriptCommand(prompt: string) {
        if (!await this.verifyOpenAIKey()) return;

        try {
            const { filename: filenameAIReponse, script: scriptAIResponse } = await this.commandGenerator.generateScript(prompt);

            if (this.commandGenerator.isUserPromptUnclear(scriptAIResponse)) {
                await this.handleUserPromptUnclear(scriptAIResponse);
                return;
            }

            console.log("Generated Script:\n", scriptAIResponse);

            const userResponse = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'saveScript',
                    message: `Would you like to save this script as '${filenameAIReponse}'?\n`,
                    default: false
                }
            ]);

            if (userResponse.saveScript) {
                await fs.writeFile(filenameAIReponse, scriptAIResponse);
                console.log(`Script saved to ${filenameAIReponse}`);
            }
        } catch (error) {
            console.error('Error in script generation:', error);
        }
    }

    private async handleCodeCommand(prompt: string) {
        if (!await this.verifyOpenAIKey()) return;

        try {
            const codeAIReponse = await this.commandGenerator.generateCode(prompt);

            if (this.commandGenerator.isUserPromptUnclear(codeAIReponse)) {
                await this.handleUserPromptUnclear(codeAIReponse);
                return;
            }

            await inquirer.prompt([
                {
                    type: 'list',
                    name: 'Manual',
                    message: "Code snippet :\n\n" + codeAIReponse,
                    choices: ['OK']
                }
            ]);
        } catch (error) {
            console.error('Error in generating code snippet :', error);
        }
    }

    private async handleUserPromptUnclear(aiResponse: string): Promise<void> {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'error',
                message: aiResponse,
                choices: ['OK']
            }
        ]);
    }
}
