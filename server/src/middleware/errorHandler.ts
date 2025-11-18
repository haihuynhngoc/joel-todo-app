import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
  }

  let statusCode = 500;
  let message = 'Internal server error';

  const errorMessage = err.message.toLowerCase();

  if (err.name === 'SyntaxError' && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON';
  } else if (
    errorMessage.includes('not found') ||
    errorMessage.includes('does not exist') ||
    errorMessage.includes('doesn\'t exist')
  ) {
    statusCode = 404;
    message = err.message;
  } else if (
    errorMessage.includes('required') ||
    errorMessage.includes('invalid') ||
    errorMessage.includes('must be') ||
    errorMessage.includes('cannot be') ||
    errorMessage.includes('characters or less')
  ) {
    statusCode = 400;
    message = err.message;
  } else {
    statusCode = 500;
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    error: message,
  });
}
