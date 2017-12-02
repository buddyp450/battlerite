export const RATE_LIMIT = 'Please note: The default rate limit is 10 requests per minute for testing/development purposes! To increase your rate limit, log into your admin dashboard, find the app you would like a higher rate limit for, and click “request a higher rate limit”';
export const UNAUTHORIZED = 'Unauthorized Access. invalid API key provided.';
export const UNKNOWN = 'Unknown error, please check your request and try again.';
export const INTERNAL = 'Internal Server Error.';
export const NO_BODY = 'No body returned from response.';
export const NOT_FOUND = 'The specified object could not be found.';
export const OFFLINE = 'API is currently offline, try again later.';
export const NOT_ACCEPTABLE = 'You requested a format that is\'t JSON';
export const NETWORK_ERROR = 'Network error, check host name.';

export function normalizeError(messages = 'Unknown Client error', attachments = {}) {
  return {
    errors: true,
    messages,
    ...attachments,
  }
}
