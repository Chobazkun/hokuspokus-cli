import { getOpenAIResponse } from './utils';
import { UNCLEAR_PROMPT } from './constants';
import { readConfig } from '../Configuration';

const createDevelopmentPlan = async (
    feature: string,
    folderContents: string,
): Promise<string> => {
    const content = `I need a development plan and code changes for a new feature in a coding project. 
                    Feature description: ${feature}
                    Current Project Files:
                    Each file's content is prefixed with 'File: <filename.ext>', followed by the content of the file.
                    ${folderContents}
                    If the question is unclear, irrelevant to software engineering, or lacks a straightforward answer, begin your response with '${UNCLEAR_PROMPT}' followed by a brief clarification.
                    Otherwise please provide a concise and actionable plan for developing this feature, including any necessary changes or additions to the code.`;
    const configManager = await readConfig();
    return getOpenAIResponse(content, configManager);
};

export default createDevelopmentPlan;
