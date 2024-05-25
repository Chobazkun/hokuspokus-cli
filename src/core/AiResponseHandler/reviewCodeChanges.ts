import { getOpenAIResponse } from './utils';
import { readConfig } from '../Configuration';

const reviewCodeChanges = async (diff: string): Promise<string> => {
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
    const configManager = await readConfig();
    return getOpenAIResponse(content, configManager);
};

export default reviewCodeChanges;
