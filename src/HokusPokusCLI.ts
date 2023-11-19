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

    setupCommands() {
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
                    this.handleManualCommand(options.man);
                    return;
                }

                if (options.script) {
                    this.handleScriptGeneration(options.script);
                    return;
                }

                this.handleTranslateCommand(prompt, options.tool);
            });
    }

    async handleTranslateCommand(prompt: string, tool: string) {
        try {
            const cliCommand = await this.commandGenerator.generateTranslateCommand(prompt, tool);

            if (this.commandGenerator.isCommandNotFound(cliCommand)) {
                await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'error',
                        message: cliCommand,
                        choices: ['OK']
                    }
                ]);
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

    async handleManualCommand(prompt: string) {
        try {
            const cliCommand = await this.commandGenerator.generateManualCommand(prompt);

            if (this.commandGenerator.isCommandNotFound(cliCommand)) {
                await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'error',
                        message: cliCommand,
                        choices: ['OK']
                    }
                ]);
                return;
            }

            await inquirer.prompt([
                {
                    type: 'list',
                    name: 'Manual',
                    message: cliCommand,
                    choices: ['OK']
                }
            ]);
        } catch (error) {
            console.error('Error in translating text:', error);
        }
    }

    async handleScriptGeneration(prompt: string) {
        try {
            const { filename, script } = await this.commandGenerator.generateScript(prompt);

            if (this.commandGenerator.isCommandNotFound(script)) {
                // Refactor error handling
                await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'error',
                        message: script,
                        choices: ['OK']
                    }
                ]);
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

    run() {
        this.program.parse(process.argv);
    }
}
