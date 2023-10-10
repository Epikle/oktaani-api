import { Request, Response } from 'express';
import { openai } from './openai';

function generatePrompt({ code, description }: { code: string; description: string }) {
  return `Please provide a brief explanation for the car diagnostic trouble code listed after 'Code:' at the end. 
  A short description is provided for more context after 'Description:'.

  If the code ends with an alphabet character, please disregard it.
  If you are unsure of the meaning of the code or if the code does not conform to a proper diagnostic trouble code, 
  kindly respond with 'no explanation found' instead of attempting to provide an inaccurate response.

  Format your response as follows: 'Code [inser given Code here], [insert response here]'.

  Code: ${code}
  Description: ${description}`;
}

export async function getCompletion(req: Request, res: Response) {
  const { code, description } = req.query;

  if (!code || typeof code !== 'string' || !description || typeof description !== 'string') {
    return res.status(400).json({ message: 'Invalid request.' });
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: false,
    messages: [
      {
        role: 'user',
        content: generatePrompt({ code, description }),
      },
    ],
  });

  return res.status(200).json({ message: response.choices[0].message.content });
}
