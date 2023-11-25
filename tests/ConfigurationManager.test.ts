import { ConfigurationManager } from '../src/ConfigurationManager';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('ConfigurationManager', () => {
    let configManager: ConfigurationManager;

    beforeEach(() => {
        configManager = new ConfigurationManager();
    });

    describe('isOpenAIKeyConfigured', () => {
        it('should return true if the OpenAI key is configured', async () => {
            (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify({ openaiKey: 'test-key' }));

            const result = await configManager.isOpenAIKeyConfigured();
            expect(result).toBe(true);
        });

        it('should return false if the OpenAI key is not configured', async () => {
            (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

            const result = await configManager.isOpenAIKeyConfigured();
            expect(result).toBe(false);
        });
    });
});
