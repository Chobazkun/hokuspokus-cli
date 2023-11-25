import { AIResponseHandler } from '../src/AIResponseHandler';
import { ConfigurationManager } from '../src/ConfigurationManager';
import axios from 'axios';

jest.mock('axios');
jest.mock('../src/ConfigurationManager');
jest.mock('ora', () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn().mockReturnThis(),
        stop: jest.fn(),
    }));
});

describe('AIResponseHandler', () => {
    let aiResponseHandler: AIResponseHandler;
    let mockConfigurationManager: ConfigurationManager;

    beforeEach(() => {
        mockConfigurationManager = new ConfigurationManager();
        aiResponseHandler = new AIResponseHandler(mockConfigurationManager);
    });

    describe('generateCLI', () => {
        it('should call OpenAI API and return the CLI command', async () => {
            const mockResponse = { data: { choices: [{ message: { content: 'ls -l' } }] } };
            (axios.post as jest.Mock).mockResolvedValue(mockResponse);
            (mockConfigurationManager.readConfig as jest.Mock).mockResolvedValue({ openaiKey: 'test-key' });

            const result = await aiResponseHandler.generateCLI('list files in the directory');
            expect(axios.post).toHaveBeenCalled();
            expect(result).toBe('ls -l');
        });
    });

    describe('generateManual', () => {
        it('should call OpenAI API and return manual information', async () => {
            const mockResponse = { data: { choices: [{ message: { content: 'Manual Content' } }] } };
            (axios.post as jest.Mock).mockResolvedValue(mockResponse);
            (mockConfigurationManager.readConfig as jest.Mock).mockResolvedValue({ openaiKey: 'test-key' });

            const result = await aiResponseHandler.generateManual('git commit manual');
            expect(axios.post).toHaveBeenCalled();
            expect(result).toBe('Manual Content');
        });
    });

    // Tests for generateScript, generateCode, generateSEAnswer, generateDetailledSEAnswer, reviewCode

    // Example for generateScript
    describe('generateScript', () => {
        it('should call OpenAI API and return script information', async () => {
            const mockResponse = { data: { choices: [{ message: { content: 'filename.js\nconsole.log("Hello World");' } }] } };
            (axios.post as jest.Mock).mockResolvedValue(mockResponse);
            (mockConfigurationManager.readConfig as jest.Mock).mockResolvedValue({ openaiKey: 'test-key' });

            const result = await aiResponseHandler.generateScript('Create a JavaScript file that prints Hello World');
            expect(axios.post).toHaveBeenCalled();
            expect(result.filename).toBe('filename.js');
            expect(result.script).toBe('console.log("Hello World");');
        });
    });

    // Tests for generateCode
    describe('generateCode', () => {
        it('should call OpenAI API and return a code snippet', async () => {
            const mockResponse = { data: { choices: [{ message: { content: 'console.log("Hello, world!");' } }] } };
            (axios.post as jest.Mock).mockResolvedValue(mockResponse);
            (mockConfigurationManager.readConfig as jest.Mock).mockResolvedValue({ openaiKey: 'test-key' });

            const result = await aiResponseHandler.generateCode('JavaScript code to print Hello, world');
            expect(axios.post).toHaveBeenCalled();
            expect(result).toBe('console.log("Hello, world!");');
        });
    });

    // Tests for generateSEAnswer
    describe('generateSEAnswer', () => {
        it('should call OpenAI API and return a software engineering answer', async () => {
            const mockResponse = { data: { choices: [{ message: { content: 'Use a binary search algorithm.' } }] } };
            (axios.post as jest.Mock).mockResolvedValue(mockResponse);
            (mockConfigurationManager.readConfig as jest.Mock).mockResolvedValue({ openaiKey: 'test-key' });

            const result = await aiResponseHandler.generateSEAnswer('How to optimize search in a sorted array?');
            expect(axios.post).toHaveBeenCalled();
            expect(result).toBe('Use a binary search algorithm.');
        });
    });

    // Tests for generateDetailledSEAnswer
    describe('generateDetailledSEAnswer', () => {
        it('should call OpenAI API and return a detailed software engineering answer', async () => {
            const mockResponse = { data: { choices: [{ message: { content: 'Detailed explanation about binary search.' } }] } };
            (axios.post as jest.Mock).mockResolvedValue(mockResponse);
            (mockConfigurationManager.readConfig as jest.Mock).mockResolvedValue({ openaiKey: 'test-key' });

            const result = await aiResponseHandler.generateDetailledSEAnswer('How to optimize search in a sorted array?', 'Use a binary search algorithm.');
            expect(axios.post).toHaveBeenCalled();
            expect(result).toBe('Detailed explanation about binary search.');
        });
    });

    // Tests for reviewCode
    describe('reviewCode', () => {
        it('should call OpenAI API and return a code review', async () => {
            const mockResponse = { data: { choices: [{ message: { content: 'Review of the code changes provided.' } }] } };
            (axios.post as jest.Mock).mockResolvedValue(mockResponse);
            (mockConfigurationManager.readConfig as jest.Mock).mockResolvedValue({ openaiKey: 'test-key' });

            const result = await aiResponseHandler.reviewCode('diff of code changes');
            expect(axios.post).toHaveBeenCalled();
            expect(result).toBe('Review of the code changes provided.');
        });
    });

    // Tests for cleanApiResponse
    describe('cleanApiResponse', () => {
        it('should clean the API response correctly', () => {
            const response = "```bash\nls -l\n```";
            const cleanedResponse = aiResponseHandler.cleanApiResponse(response);
            expect(cleanedResponse).toBe("ls -l");
        });

        it('should return the response as is if no cleaning needed', () => {
            const response = "ls -l";
            const cleanedResponse = aiResponseHandler.cleanApiResponse(response);
            expect(cleanedResponse).toBe("ls -l");
        });
    });

    // Tests for getRandomSpinnerMessage
    describe('getRandomSpinnerMessage', () => {
        it('should return a random spinner message', () => {
            const message = aiResponseHandler.getRandomSpinnerMessage();
            expect(typeof message).toBe('string');
            expect(message).toMatch(/\.\.\./); // Assuming all messages contain ellipsis
        });
    });


});
