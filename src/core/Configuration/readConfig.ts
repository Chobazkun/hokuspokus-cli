import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const configFilePath = path.join(os.homedir(), '.hokuspokus', 'config.json');

const readConfig = async () => {
    const configData = await fs.readFile(configFilePath, 'utf-8');
    return JSON.parse(configData);
};

export default readConfig;
