import { Command } from 'commander';
import { AIResponseHandler } from './AIResponseHandler';
import { ConfigurationManager } from './ConfigurationManager';
import { exec } from 'child_process';
import fs from 'fs/promises';
import inquirer from 'inquirer';
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
            .option('-t, --tool <type>', 'Specify the CLI tool (e.g., aws, gcp, git, ...)')
            .option('-m, --man <command_prompt>', 'Get the latest manual for a specific command')
            .option('-s, --script <script_prompt>', 'Generate a script in the specified language or tool')
            .option('-c, --code <code_prompt>', 'Generate a snippet of code in the specified language or tool')
            .argument('[prompt]', 'User prompt for generating a command')
            .action((prompt, options) => {
                if (options.man) {
                    this.handleManualCommand(options.man);
                    return;
                }

                if (options.script) {
                    this.handleScriptCommand(options.script);
                    return;
                }

                if (options.code) {
                    this.handleCodeCommand(options.code);
                    return;
                }

                this.handleTranslateTextToCLICommand(prompt, options.tool);
            });
    }

    private async handleTranslateTextToCLICommand(prompt: string, tool: string) {
        try {
            const cliAIReponse = await this.commandGenerator.generateCLI(prompt, tool);

            if (this.commandGenerator.isUserPromptUnclear(cliAIReponse)) {
                await this.handleUserPromptUnclear(cliAIReponse);
                return;
            }

            const userResponse = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'executeCommand',
                    message: `Do you want to use the following CLI command? \n${cliAIReponse}`,
                    default: false
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
                    message: `Would you like to save this script as '${filenameAIReponse}'?`,
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
