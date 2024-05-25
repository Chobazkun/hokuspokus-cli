import axios from 'axios';
import { readConfig } from '../../../core/Configuration';

const openaiClient = async (content: string): Promise<string> => {
    const { openaiKey } = await readConfig();
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-4-1106-preview',
            messages: [{ role: 'user', content }],
            temperature: 0.2,
        },
        {
            headers: {
                Authorization: `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data.choices[0].message.content.trim();
};

export default openaiClient;
