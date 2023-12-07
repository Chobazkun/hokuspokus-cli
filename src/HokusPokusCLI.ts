import { Command } from 'commander';
import { exec } from 'child_process';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import path from 'path';

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
            .description('Ask the Wize Guru a general software engineering question')
            .action((question_prompt) => this.handleQuestionCommand(question_prompt));

        this.program
            .command('code-review')
            .description('Review recent code changes in the current folder. Requires git command to be installed.')
            .action(() => this.handleCodeReview());

        this.program
            .command('debug <error_message> [filePaths...]')
            .description('Debug an issue with the help of the Great Wizard. Scans specified files, or all files in the directory if none are specified.')
            .action((error_message, filePaths) => this.handleDebugCommand(error_message, filePaths));

        this.program
            .command('develop <feature_description> [filePaths...]')
            .description('Generate a development plan for a new feature with the help of the Great Wizard. Scans specified files, or all files in the directory if none are specified.')
            .action((feature_description, filePaths) => this.handleDevelopCommand(feature_description, filePaths));

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
                    choices: ['💰 Thank the Wize Guru for his wisdom and leave', '🧠 Ask for more details']
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

    private async handleDebugCommand(error_message: string, filePaths?: string[]) {
        if (!await this.verifyOpenAIKey()) return;

        try {
            const folderContents = filePaths && filePaths.length > 0
                ? await this.getSpecifiedFilesContents(filePaths)
                : await this.getFolderContents('.');

            const debugResponse = await this.aiResponseHandler.generateDebugResponse(error_message, folderContents);

            if (this.aiResponseHandler.isUserPromptUnclear(debugResponse)) {
                await this.handleUserPromptUnclear(debugResponse);
                return;
            }

            console.log('\nThe Great Wizard Debugging Opinion:\n\n', debugResponse);
        } catch (error) {
            console.error('Error in debugging:', error);
        }
    }

    private async handleDevelopCommand(feature_description: string, filePaths?: string[]) {
        if (!await this.verifyOpenAIKey()) return;

        try {
            const folderContents = filePaths && filePaths.length > 0
                ? await this.getSpecifiedFilesContents(filePaths)
                : await this.getFolderContents('.');

            const developResponse = await this.aiResponseHandler.generateDevelopmentPlan(feature_description, folderContents);

            if (this.aiResponseHandler.isUserPromptUnclear(developResponse)) {
                await this.handleUserPromptUnclear(developResponse);
                return;
            }

            console.log('\nThe Great Wizard Development Plan:\n\n', developResponse);
        } catch (error) {
            console.error('Error in developing feature:', error);
        }
    }

    private async getFolderContents(dir: string): Promise<string> {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            const files = entries.filter(file => !file.isDirectory());
            const folders = entries.filter(folder => folder.isDirectory());

            const fileContents = await Promise.all(files.map(async file => {
                try {
                    const filePath = path.join(dir, file.name);
                    const content = await fs.readFile(filePath, 'utf-8');
                    return `File: ${file.name}\n${content}`;
                } catch (readFileError) {
                    console.error(`Error reading file ${file.name}\n`);
                    throw readFileError;
                }
            }));

            const folderContents = await Promise.all(folders.map(async folder => {
                return this.getFolderContents(path.join(dir, folder.name));
            }));

            return fileContents.concat(folderContents.flat()).join('\n\n');
        } catch (readdirError) {
            console.error(`Error reading directory ${dir}\n`);
            throw readdirError;
        }
    }

    private async getSpecifiedFilesContents(filePaths: string[]): Promise<string> {
        return Promise.all(filePaths.map(async (filePath) => {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                return `File: ${path.basename(filePath)}\n${content}`;
            } catch (error) {
                console.error(`Error reading file ${filePath}\n`);
                throw error;
            }
        })).then(contents => contents.filter(c => c).join('\n\n'));
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
