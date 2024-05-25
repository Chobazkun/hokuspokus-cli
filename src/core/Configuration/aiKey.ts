import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const configFilePath = path.join(os.homedir(), '.hokuspokus', 'config.json');

const isAIKeyConfigured = async (): Promise<boolean> => {
    try {
        const config = await fs.readFile(configFilePath, 'utf8');
        const { openaiKey } = JSON.parse(config);
        return !!openaiKey;
    } catch (error) {
        return false;
    }
};

export default isAIKeyConfigured;
