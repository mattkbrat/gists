'use server';

import TurndownService from 'turndown';

import { withScope } from '@sentry/nextjs';

const toMarkdown = new TurndownService();

export type TicketResult = {
  success?: boolean;
};

export type Payload = {
  message: string;
  results: TicketResult;
};

export const submitTicket = async (
  _prevState: unknown,
  e: FormData,
): Promise<Payload> => {
  const feedbackHTML = e.get('feedback');

  const feedback =
    typeof feedbackHTML === 'string' ? toMarkdown.turndown(feedbackHTML) : '';

  const camera = e.get('camera') || '';

  const userFeedback = {
    name: e.get('name')?.toString() || 'No Name',
    email: e.get('email')?.toString() || 'No Email',
  };

  try {
    withScope((scope) => {
      scope.setContext('report', {
        camera,
        feedback,
      });

      scope.setContext('user', userFeedback);

      scope.captureMessage(`Feedback: ${camera}`);
    });
    return {
      message: 'success',
      results: { success: true },
    };
  } catch (error) {
    console.log(error);
    return { message: 'An unknown error occurred', results: { success: false } };
  }
};
