import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { config } from 'dotenv';

config();

const llm = new ChatOpenAI({
	modelName: 'gpt-4',
	temperature: 0,
	openAIApiKey: process.env.OPENAI_API_KEY
});

export async function handlePromptWithDocs(prompt: string, docs: string[] | string) {
	console.log('handlePromptWithDocs received prompt:', prompt);
	console.log('handlePromptWithDocs received docs:', docs);
	const documents = Array.isArray(docs) ? docs.join('\n\n') : docs;


	const systemPrompt = `
You are an assistant with access to the following document(s):

${documents}

Use ONLY the content above to answer the user's question. If the answer is not contained in the document, reply with "I could not find the answer in the provided documents."

Be precise, concise, and cite the content if possible.
`.trim();

	const messages = [
		new HumanMessage({ content: systemPrompt }),
		new HumanMessage({ content: prompt })
	];

	const response = await llm.invoke(messages);
	return response.content;
}
