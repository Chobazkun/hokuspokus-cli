import { Command } from 'commander';
import {
    handleConfigureCommand,
    handleCliCommand,
    handleScriptCommand,
    handleCodeCommand,
    handleQuestionCommand,
    handleCodeReview,
    handleDebugCommand,
    handleDevelopCommand,
} from './adapters/primary/cli';
import packageJson from '../package.json';

const program = new Command();

program
    .name('hokuspokus')
    .description('CLI tool to boost your developer productivity using AI')
    .version(packageJson.version);

program
    .command('configure')
    .description('Configure OpenAI API Key')
    .action(handleConfigureCommand);

program
    .command('cli <cli_prompt>')
    .description('Translate a description to a CLI command')
    .action((cli_prompt) => handleCliCommand(cli_prompt));

program
    .command('script <script_prompt>')
    .description('Generate a script in the specified language or tool')
    .action((script_prompt) => handleScriptCommand(script_prompt));

program
    .command('code <code_prompt>')
    .description('Generate a snippet of code in the specified language or tool')
    .action((code_prompt) => handleCodeCommand(code_prompt));

program
    .command('question <question_prompt>')
    .description('Ask the Wize Guru a general software engineering question')
    .action((question_prompt) => handleQuestionCommand(question_prompt));

program
    .command('code-review')
    .description(
        'Review recent code changes in the current folder. Requires git command to be installed.',
    )
    .action(handleCodeReview);

program
    .command('debug <error_message> [filePaths...]')
    .description(
        'Debug an issue with the help of the Great Wizard. Scans specified files, or all files in the directory if none are specified.',
    )
    .action((error_message, filePaths) =>
        handleDebugCommand(error_message, filePaths),
    );

program
    .command('develop <feature_description> [filePaths...]')
    .description(
        'Generate a development plan for a new feature with the help of the Great Wizard. Scans specified files, or all files in the directory if none are specified.',
    )
    .action((feature_description, filePaths) =>
        handleDevelopCommand(feature_description, filePaths),
    );

program.parse(process.argv);
