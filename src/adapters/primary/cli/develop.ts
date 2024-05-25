import {
    createDevelopmentPlan,
    isUserPromptUnclear,
} from '../../../core/AiResponseHandler';
import { isAIKeyConfigured } from '../../../core/Configuration';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';

const handleDevelopCommand = async (
    feature_description: string,
    filePaths?: string[],
) => {
    if (!(await isAIKeyConfigured())) {
        console.error(
            '\n❌ Error: OpenAI API key is not configured. Please run "hokuspokus configure" first.',
        );
        return;
    }

    try {
        const folderContents =
            filePaths && filePaths.length > 0
                ? await getSpecifiedFilesContents(filePaths)
                : await getFolderContents('.');

        const developResponse = await createDevelopmentPlan(
            feature_description,
            folderContents,
        );

        if (isUserPromptUnclear(developResponse)) {
            await displayUserPromptUnclear(developResponse);
            return;
        }

        console.log(
            '\nThe Great Wizard Development Plan:\n\n',
            developResponse,
        );
    } catch (error) {
        console.error('Error in developing feature:', error);
    }
};

const getFolderContents = async (dir: string): Promise<string> => {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const files = entries.filter((file) => !file.isDirectory());
        const folders = entries.filter((folder) => folder.isDirectory());

        const fileContents = await Promise.all(
            files.map(async (file) => {
                try {
                    const filePath = path.join(dir, file.name);
                    const content = await fs.readFile(filePath, 'utf-8');
                    return `File: ${file.name}\n${content}`;
                } catch (readFileError) {
                    console.error(`Error reading file ${file.name}\n`);
                    throw readFileError;
                }
            }),
        );

        const folderContents = await Promise.all(
            folders.map(async (folder) => {
                return getFolderContents(path.join(dir, folder.name));
            }),
        );

        return fileContents.concat(folderContents.flat()).join('\n\n');
    } catch (readdirError) {
        console.error(`Error reading directory ${dir}\n`);
        throw readdirError;
    }
};

const getSpecifiedFilesContents = async (
    filePaths: string[],
): Promise<string> => {
    return Promise.all(
        filePaths.map(async (filePath) => {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                return `File: ${path.basename(filePath)}\n${content}`;
            } catch (error) {
                console.error(`Error reading file ${filePath}\n`);
                throw error;
            }
        }),
    ).then((contents) => contents.filter((c) => c).join('\n\n'));
};

const displayUserPromptUnclear = async (aiResponse: string): Promise<void> => {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'error',
            message: aiResponse,
            choices: ['OK'],
        },
    ]);
};

export default handleDevelopCommand;
