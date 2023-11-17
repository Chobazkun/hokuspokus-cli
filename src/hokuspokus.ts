#!/usr/bin/env node

// Importing necessary modules
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import axios from 'axios';
import process from 'process';
import { exec } from 'child_process';
import os from 'os';
import path from 'path';

const configFilePath = path.join(os.homedir(), '.hokuspokus', 'config.json');

const program = new Command();

program
    .name('hokuspokus');

// Configure command
program
    .command('configure')
    .description('Configure OpenAI API Key')
    .action(configure);

async function configure() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'password',
                name: 'openaiKey',
                message: 'Enter your OpenAI API Key:'
            }
        ]);

        const configDir = path.dirname(configFilePath);
        await fs.mkdir(configDir, { recursive: true });

        await fs.writeFile(configFilePath, JSON.stringify({ openaiKey: answers.openaiKey }));
        console.log('OpenAI API Key configured successfully.');
    } catch (error) {
        console.error('Error configuring API Key:', error);
    }
}

// Main functionality
program
    .description('CLI tool for translating text into CLI commands using OpenAI')
    .option('-t, --tool <type>', 'Specify the CLI tool (e.g., aws, gcp)')
    .argument('<prompt>', 'User prompt for generating a command')
    .action((prompt, options) => {
        generateCommand(prompt, options.tool);
    });

async function generateCommand(prompt: string, tool: string) {
    try {
        const configData = await fs.readFile(configFilePath, 'utf-8');
        const { openaiKey } = JSON.parse(configData);

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions', // Chat completions endpoint
            {
                model: "gpt-4", // Specifying the model
                messages: [
                    {
                        role: "user",
                        content: `Translate the following to an ${tool} CLI command. Return only the CLI command in the response, nothing else : ${prompt}`
                    }
                ],
                temperature: 0.2  // Adjust as needed
            },
            {
                headers: {
                    'Authorization': `Bearer ${openaiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const cliCommand = response.data.choices[0].message.content.trim();

        // Prompt the user to accept the suggested command
        const userResponse = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'executeCommand',
                message: `Do you want to use the following CLI command? \n${cliCommand}`,
                default: false
            }
        ]);

        if (userResponse.executeCommand) {
            // Execute the command if user accepts
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


program.parse(process.argv);
