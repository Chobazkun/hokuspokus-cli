import axios from 'axios';
import { readConfig } from '../../../core/Configuration';

const openaiClient = async (content: string): Promise<string> => {
    try {
        const { openaiKey } = await readConfig();
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are an experienced and skilled senior software engineer. Your goal is to provide the best responses about software engineering, generate CLI scripts, code snippets, help with debugging, answer software engineering questions and advice about development plans.',
                    },
                    { role: 'user', content },
                ],
                temperature: 0.3,
                max_tokens: 2048,
            },
            {
                headers: {
                    Authorization: `Bearer ${openaiKey}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        throw new Error('Failed to get response from OpenAI');
    }
};

export default openaiClient;
