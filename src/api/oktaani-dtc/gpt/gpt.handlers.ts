import { Request, Response } from 'express';
import { openai } from './openai';

function generatePrompt(code: string) {
  return `Please provide a brief explanation for the car diagnostic trouble code listed after "Code:" at the end. 
  If the code ends with an alphabet character, please disregard it. 
  If you are unsure of its meaning or if the code does not conform to a proper diagnostic trouble code, 
  kindly respond with 'no explanation found' instead of attempting to provide an inaccurate response. 
  Code: ${code}`;
}

export async function getCompletion(req: Request, res: Response) {
  const { codeTitle } = req.query;

  if (!codeTitle || typeof codeTitle !== 'string') return res.status(400).json({ message: 'Invalid request.' });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: false,
    messages: [
      {
        role: 'user',
        content: generatePrompt(codeTitle),
      },
    ],
  });

  return res.status(200).json({ message: response.choices[0].message.content });
}
