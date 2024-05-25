import openaiClient from '../../adapters/secondary/http/openaiClient';
import ora from 'ora';
import { UNCLEAR_PROMPT } from './constants';

const getOpenAIResponse = async (content: string): Promise<string> => {
    const spinner = ora({
        text: `${getRandomSpinnerMessage()} 🧙 `,
        spinner: 'moon',
    }).start();

    try {
        const response = await openaiClient(content);
        spinner.stop();
        return response;
    } catch (error) {
        spinner.stop();
        throw error;
    }
};

const cleanApiResponse = (response: string): string => {
    return response.replace(/^```(\w+\s)?|```$/g, '').trim();
};

const getRandomSpinnerMessage = (): string => {
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
        '...Venturing into the realm of recursive spells...',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

const isUserPromptUnclear = (response: string): boolean => {
    return response.startsWith(UNCLEAR_PROMPT);
};

export {
    getOpenAIResponse,
    cleanApiResponse,
    getRandomSpinnerMessage,
    isUserPromptUnclear,
};
