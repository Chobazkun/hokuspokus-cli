import { getOpenAIResponse } from './utils';
import { UNCLEAR_PROMPT } from './constants';
import { readConfig } from '../Configuration';

const debugIssue = async (
    error: string,
    folderContents: string,
): Promise<string> => {
    const content = `I need a concise and brief explanation for debugging a coding issue. Here's the error encountered and the contents of the project files.
                    Each file's content is prefixed with 'File: <filename.ext>', followed by the content of the file.
                    Error encountered: ${error}
                    Project Files:
                    ${folderContents}
                    If the question is unclear, irrelevant to software engineering, or lacks a straightforward answer, begin your response with '${UNCLEAR_PROMPT}' followed by a brief clarification.
                    Otherwise, please provide a direct and succinct suggestion for identifying the cause of the error and how to fix it.`;
    const configManager = await readConfig();
    return getOpenAIResponse(content, configManager);
};

export default debugIssue;
