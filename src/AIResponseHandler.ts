import axios from 'axios';
import ora from 'ora';
import { ConfigurationManager } from './ConfigurationManager.js';

export class AIResponseHandler {
    static UNCLEAR_PROMPT: string = 'UNCLEAR PROMPT: ';

    configManager: ConfigurationManager;

    constructor(configManager: ConfigurationManager) {
        this.configManager = configManager;
    }

    async generateCLI(prompt: string): Promise<string> {
        const content = `Translate the following to a CLI command. 
                        If you are able to find a corresponding CLI command, reply only with the command in one line and nothing else. Do not give further explanation, the CLI command is enough.
                        If you are not able to generate a command, reply by saying first '${AIResponseHandler.UNCLEAR_PROMPT}' 
                        followed by an explanation or suggestions on how to accomplish the task: ${prompt}`;

        return this.getOpenAIResponse(this.cleanApiResponse(content));
    }

    async generateManual(prompt: string): Promise<string> {
        const content = `I need the manual or the documentation for the CLI command, the tool or the element mentioned in the following description. 
                        Please provide the complete manual if it is a command. 
                        If it is something else, provide the main documentation with only the essential explanations.
                        If the version isn't specified in the description, provide the manual of the latest version.
                        If there's no specific manual/documentation or the command is unclear, start your response with '${AIResponseHandler.UNCLEAR_PROMPT}', 
                        followed by an explanation or suggestions on how to accomplish the task: ${prompt}`;
        return this.getOpenAIResponse(content);
    }

    async generateScript(prompt: string): Promise<{ filename: string, script: string }> {
        const content = `Create a filename and a corresponding script for this task : ${prompt}.
                        Respond only with the name of the file and the code of the script.
                        The first line of your response should contain only the filename and nothing else. 
                        Starting from the second line, provide the script code and nothing else. 
                        If you cannot generate a script, start your response with '${AIResponseHandler.UNCLEAR_PROMPT}' 
                        followed by an explanation or suggestions related to the task.`;
        const response = await this.getOpenAIResponse(content);

        if (response.startsWith(AIResponseHandler.UNCLEAR_PROMPT)) {
            return { filename: '', script: response };
        }

        const responseLines = response.split('\n');
        const filename = responseLines[0].trim();
        const script = responseLines.slice(1).join('\n');

        return { filename, script };
    }

    async generateCode(prompt: string): Promise<string> {
        const content = `Generate a very short and consise code snippet for the following task: ${prompt}.
                        Respond only with the code snippet. Add comments within the code to explains key lines.
                        I do not want explanation of the code. I only want the code snippet.
                        Be concise and respond with the most advanced and elegant way of writing the code, following the clean code, KISS, YAGNI, DRY and SOLID principles.
                        If you cannot generate a snippet, start your response with '${AIResponseHandler.UNCLEAR_PROMPT}' 
                        followed by an explanation or suggestions related to the task.`;
        return this.getOpenAIResponse(content);
    }

    async generateSEAnswer(prompt: string): Promise<string> {
        const content = `Respond as a software engineering and programming expert with a concise, precise, and extremely brief answer. 
                        If the question is unclear, irrelevant to software engineering, or lacks a straightforward answer, begin your response with '${AIResponseHandler.UNCLEAR_PROMPT}' followed by a brief clarification.
                        Otherwise, provide a direct answer without additional explanations or details.
                        Question: ${prompt}`;

        return this.getOpenAIResponse(content);
    }

    async generateDetailledSEAnswer(question: string, initialAnswer: string): Promise<string> {
        // I should use the system role and messages array
        const content = `Respond as a software engineering and programming expert. Here is a software engineering question and its brief answer. 
                        Please provide more detailed information on this topic, in the limit of a paragraph or two maximum.
                        Question: ${question}
                        Initial Answer: ${initialAnswer}`;

        return this.getOpenAIResponse(content);
    }

    async reviewCode(diff: string): Promise<string> {
        const content = `As a seasoned expert in software engineering and programming, conduct a thorough review of the following code changes. 
                        Focus on providing detailed feedback in the following areas:
                        1. Code Quality: Evaluate error handling, efficiency, scalability, and potential bugs or security vulnerabilities.
                        2. Coding Style: Assess adherence to best practices, consistency, and the principles of clean code and clean architecture.
                        3. SOLID and DRY Principles: Check for conformity to SOLID and DRY principles.
                        4. Readability and Maintainability: Analyze the clarity of code structure and comments.
                        5. Refactoring Needs: Suggest areas where the code could benefit from refactoring.
                        6. Unit Testing: Evaluate the existing unit tests and suggest improvements or additional tests needed.

                        Code Changes:
                        ${diff}`;

        return this.getOpenAIResponse(content);
    }

    public isUserPromptUnclear(response: string): boolean {
        return response.startsWith(AIResponseHandler.UNCLEAR_PROMPT);
    }

    private async getOpenAIResponse(content: string): Promise<string> {
        const spinner = ora({
            text: `${this.getRandomSpinnerMessage()} 🧙 `,
            spinner: 'moon'
        }).start();

        try {
            const { openaiKey } = await this.configManager.readConfig();

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4-1106-preview",
                    messages: [{ role: "user", content }],
                    temperature: 0.2
                },
                {
                    headers: {
                        'Authorization': `Bearer ${openaiKey} `,
                        'Content-Type': 'application/json'
                    }
                }
            );

            spinner.stop();
            return response.data.choices[0].message.content.trim();
        } catch (error) {
            spinner.stop();
            throw error; // Rethrow the error to be handled by the caller
        }
    }

    private cleanApiResponse(response: string): string {
        // This regex will match both starting and ending backtick sequences.
        const cleanedResponse = response.replace(/^```(\w+\s)?|```$/g, '').trim();
        return cleanedResponse;
    }

    private getRandomSpinnerMessage(): string {
        const messages = [
            '...Conjuring enchantments in the realm of code...',
            '...Mixing magical potions in the Docker container...',
            '...Casting ancient spells in Python...',
            '...Summoning mystical powers from the cloud servers...',
            '...Reading from the wizard’s tome of Stack Overflow...',
            '...Gazing into the crystal ball of machine learning...',
            '...Consulting with the arcane spirits of open-source...',
            '...Weaving sorcerous incantations in binary...',
            '...Harnessing eldritch energies from quantum computing...',
            '...Unveiling the secrets of alchemy with AI algorithms...',
            '...Brewing elixirs of wisdom in virtual environments...',
            '...Unlocking the mysteries of the universe with neural networks...',
            '...Taming dragons of the code realm...',
            '...Deciphering ancient runes of JavaScript...',
            '...Embarking on a quest for the missing semicolon...',
            '...Whispering to the spirits of the cloud...',
            '...Dancing with the pixies of pixels...',
            '...Summoning the guardians of the git...',
            '...Chanting incantations of the console log...',
            '...Traversing the labyrinth of async-await...',
            '...Navigating the seas of cyber sorcery...',
            '...Exploring the dungeons of data...',
            '...Crafting magical glyphs of HTML...',
            '...Riding the dragons of dependency management...',
            '...Questing for the legendary function of fate...',
            '...Wandering through the enchanted forest of APIs...',
            '...Concocting a brew in the cauldron of creativity...',
            '...Invoking the spirits of serverless architecture...',
            '...Decoding the enigmas of encryption...',
            '...Venturing into the realm of recursive spells...'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

}
