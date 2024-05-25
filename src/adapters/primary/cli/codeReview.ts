import { reviewCodeChanges } from '../../../core/AiResponseHandler';
import { isAIKeyConfigured } from '../../../core/Configuration';
import { exec } from 'child_process';

const handleCodeReviewCommand = async () => {
    if (!(await isAIKeyConfigured())) {
        console.error(
            '\n❌ Error: OpenAI API key is not configured. Please run "hokuspokus configure" first.',
        );
        return;
    }

    exec('git diff', async (error, stdout, stderr) => {
        if (error || stderr) {
            console.error('Error executing git diff:', error || stderr);
            return;
        }

        try {
            const review = await reviewCodeChanges(stdout);
            console.log('\nCode Review:\n\n', review);
        } catch (apiError) {
            console.error('Error in code review:', apiError);
        }
    });
};

export default handleCodeReviewCommand;
