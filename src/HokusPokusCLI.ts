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
            .argument('[prompt]', 'User prompt for generating a command')
            .action((prompt, options) => {
                if (options.man) {
                    this.handleCommandManual(options.man);
                    return;
                }

                if (options.script) {
                    this.handleScriptGeneration(options.script);
                    return;
                }

                this.handleTranslateCommand(prompt, options.tool);
            });
    }

    private async handleTranslateCommand(prompt: string, tool: string) {
        try {
            const cliCommand = await this.commandGenerator.generateTranslateCommand(prompt, tool);

            if (this.commandGenerator.isUserPromptUnclear(cliCommand)) {
                await this.handleUserPromptUnclear(cliCommand);
                return;
            }

            const userResponse = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'executeCommand',
                    message: `Do you want to use the following CLI command? \n${cliCommand}`,
                    default: false
                }
            ]);

            if (userResponse.executeCommand) {
                exec(cliCommand, (error, stdout, stderr) => {
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

    private async handleCommandManual(prompt: string) {
        try {
            const commandManual = await this.commandGenerator.generateManualCommand(prompt);

            if (this.commandGenerator.isUserPromptUnclear(commandManual)) {
                await this.handleUserPromptUnclear(commandManual);
                return;
            }

            await inquirer.prompt([
                {
                    type: 'list',
                    name: 'Manual',
                    message: commandManual,
                    choices: ['OK']
                }
            ]);
        } catch (error) {
            console.error('Error in generating command manual:', error);
        }
    }

    private async handleScriptGeneration(prompt: string) {
        try {
            const { filename, script } = await this.commandGenerator.generateScript(prompt);

            if (this.commandGenerator.isUserPromptUnclear(script)) {
                await this.handleUserPromptUnclear(script);
                return;
            }

            console.log("Generated Script:\n", script);

            const userResponse = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'saveScript',
                    message: `Would you like to save this script as '${filename}'?`,
                    default: false
                }
            ]);

            if (userResponse.saveScript) {
                await fs.writeFile(filename, script);
                console.log(`Script saved to ${filename}`);
            }
        } catch (error) {
            console.error('Error in script generation:', error);
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
