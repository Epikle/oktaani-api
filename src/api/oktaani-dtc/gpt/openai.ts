import OpenAI from 'openai';

if (process.env.OPENAI_API_KEY === undefined) {
  throw new Error('env OPENAI_API_KEY missing');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
