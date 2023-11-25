import { Command } from 'commander';
import { exec } from 'child_process';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';

import { AIResponseHandler } from '../src/AIResponseHandler';
import { ConfigurationManager } from '../src/ConfigurationManager';
import packageJson from '../package.json';

export class HokusPokusCLI {
    program: Command;
    aiResponseHandler: AIResponseHandler;
    configManager: ConfigurationManager;

    constructor() {
        this.program = new Command();
        this.configManager = new ConfigurationManager();
        this.aiResponseHandler = new AIResponseHandler(this.configManager);
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

        this.program
            .command('question <question_prompt>')
            .description('Ask a general software engineering question')
            .action((question_prompt) => this.handleQuestionCommand(question_prompt));

        this.program
            .command('code-review')
            .description('Review recent code changes in the current folder. Requires git command to be installed.')
            .action(() => this.handleCodeReview());
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
            const cliAIReponse = await this.aiResponseHandler.generateCLI(prompt);

            if (this.aiResponseHandler.isUserPromptUnclear(cliAIReponse)) {
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
            const manualAIResponse = await this.aiResponseHandler.generateManual(prompt);

            if (this.aiResponseHandler.isUserPromptUnclear(manualAIResponse)) {
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
            const { filename: filenameAIReponse, script: scriptAIResponse } = await this.aiResponseHandler.generateScript(prompt);

            if (this.aiResponseHandler.isUserPromptUnclear(scriptAIResponse)) {
                await this.handleUserPromptUnclear(scriptAIResponse);
                return;
            }
            
            // How about redirecting the user directly to an interface where he can save/edit his content ?
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
            const codeAIReponse = await this.aiResponseHandler.generateCode(prompt);

            if (this.aiResponseHandler.isUserPromptUnclear(codeAIReponse)) {
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

    private async handleQuestionCommand(prompt: string) {
        if (!await this.verifyOpenAIKey()) return;

        try {
            const seAnswer = await this.aiResponseHandler.generateSEAnswer(prompt);

            if (this.aiResponseHandler.isUserPromptUnclear(seAnswer)) {
                await this.handleUserPromptUnclear(seAnswer);
                return;
            }
            console.log(`\nShort Answer:\n\n ${seAnswer}\n`);

            const userResponse = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'nextAction',
                    message: 'Would you like to ask for more details or thank the guru for the wisdom?',
                    choices: ['💰 Thank the guru for his wisdom and exit', '🧠 Ask for more details']
                }
            ]);

            if (userResponse.nextAction === '🧠 Ask for more details') {
                const detailledSEAnswer = await this.aiResponseHandler.generateDetailledSEAnswer(prompt, seAnswer);

                console.log(`\nLong Answer:\n\n ${detailledSEAnswer}\n`);
            }
        } catch (error) {
            console.error('Error in processing your question:', error);
        }
    }

    private async handleCodeReview() {
        if (!await this.verifyOpenAIKey()) return;

        exec('git diff', async (error, stdout, stderr) => {
            if (error || stderr) {
                console.error('Error executing git diff:', error || stderr);
                return;
            }

            try {
                const review = await this.aiResponseHandler.reviewCode(stdout);
                console.log('\nCode Review:\n\n', review);
            } catch (apiError) {
                console.error('Error in code review:', apiError);
            }
        });
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
