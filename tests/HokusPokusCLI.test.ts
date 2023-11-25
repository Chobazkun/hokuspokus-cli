import { Command } from 'commander';
import { HokusPokusCLI } from '../src/HokusPokusCLI';
import { AIResponseHandler } from '../src/AIResponseHandler';
import { ConfigurationManager } from '../src/ConfigurationManager';
import clipboardy from 'clipboardy';

jest.mock('commander', () => {
    const originalModule = jest.requireActual('commander');
    originalModule.Command.prototype.name = jest.fn().mockReturnThis();
    originalModule.Command.prototype.description = jest.fn().mockReturnThis();
    originalModule.Command.prototype.version = jest.fn().mockReturnThis();
    originalModule.Command.prototype.command = jest.fn().mockReturnThis();
    originalModule.Command.prototype.action = jest.fn().mockReturnThis();
    return originalModule;
});

jest.mock('../src/ConfigurationManager', () => ({
    ConfigurationManager: jest.fn().mockImplementation(() => ({
        isOpenAIKeyConfigured: jest.fn().mockResolvedValue(true),
        configure: jest.fn(),
        readConfig: jest.fn().mockResolvedValue({ openaiKey: 'test-key' }),
    })),
}));

jest.mock('child_process', () => ({
    exec: jest.fn().mockImplementation((cmd, callback) => callback(null, 'output', '')),
}));

jest.mock('inquirer', () => ({
    prompt: jest.fn().mockResolvedValue({ executeCommand: true }),
}));

jest.mock('clipboardy', () => ( {
    writeSync: jest.fn(),
    readSync: jest.fn()
}));

jest.mock('../src/AIResponseHandler',() => ({
    AIResponseHandler: jest.fn().mockImplementation(() => ({
        isUserPromptUnclear: jest.fn().mockResolvedValue(false),
        generateCLI: jest.fn().mockResolvedValue('ls -l')
    }))
}));

describe('HokusPokusCLI', () => {
    let cli: HokusPokusCLI;
    let mockCommander: Command;
    let mockAIResponseHandler: AIResponseHandler;
    let mockConfigurationManager: ConfigurationManager;

    beforeEach(() => {
        mockCommander = new Command();
        mockConfigurationManager = new ConfigurationManager();
        mockAIResponseHandler = new AIResponseHandler(mockConfigurationManager);
        cli = new HokusPokusCLI();
    });

    // Test for setupCommands
    it('should setup commands correctly', () => {
        cli.setupCommands();

        const prototype = Object.getPrototypeOf(mockCommander);
        
        expect(mockCommander.command).toHaveBeenCalledWith('configure');
        expect(mockCommander.command).toHaveBeenCalledWith('cli <cli_prompt>');
        expect(mockCommander.command).toHaveBeenCalledWith('man <manual_prompt>');
        expect(mockCommander.command).toHaveBeenCalledWith('script <script_prompt>');
        expect(mockCommander.command).toHaveBeenCalledWith('code <code_prompt>');
        expect(mockCommander.command).toHaveBeenCalledWith('question <question_prompt>');
        expect(mockCommander.command).toHaveBeenCalledWith('code-review');
    });

    // Test for handleCliCommand
    it('should handle CLI command correctly', async () => {
        //(mockAIResponseHandler.generateCLI as jest.Mock) = jest.fn().mockResolvedValue('ls -l');
        
        clipboardy.writeSync = jest.fn();
        const mockPrompt = require('inquirer').prompt;
        const mockExec = require('child_process').exec;

        await cli.handleCliCommand('list files');
        
        expect(mockPrompt).toHaveBeenCalledWith(expect.any(Object));
    });

    // ... Tests for other methods
});
