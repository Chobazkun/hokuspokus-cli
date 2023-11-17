import { Command } from 'commander';
import { CommandGenerator } from './CommandGenerator';
import { ConfigurationManager } from './ConfigurationManager';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import packageJson from '../package.json';

export class HokusPokusCLI {
    program: Command;
    commandGenerator: CommandGenerator;
    configManager: ConfigurationManager;

    constructor() {
        this.program = new Command();
        this.configManager = new ConfigurationManager();
        this.commandGenerator = new CommandGenerator(this.configManager);
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
            .option('-m, --man <command>', 'Get the latest manual for a specific command')
            .argument('[prompt]', 'User prompt for generating a command')
            .action((prompt, options) => {
                if (options.man) {
                    this.handleManualCommand(options.man);
                } else {
                    this.handleTranslateCommand(prompt, options.tool);
                }
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
            console.log(prompt);
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

    run() {
        this.program.parse(process.argv);
    }
}
