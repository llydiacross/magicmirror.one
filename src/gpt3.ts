import { apiFetch } from './api';

// Fetches a prompt response from chat gpt3, make sure to run prompt through the moderation function first to avoid abuse
export const fetchPrompt = async (
  prompt: string,
  abort?: AbortController,
  options?: any
) => {
  return await apiFetch(
    'gpt3',
    'prompt',
    { prompt, ...(options || {}) },
    'POST',
    abort
  );
};

export const fetchWebpage = async (
  ensAddress: string,
  abort?: AbortController,
  options?: any
) => {
  return await apiFetch(
    'gpt3',
    'webpage',
    { ensAddress, ...(options || {}) },
    'POST',
    abort
  );
};

// Fetches a moderation response from chat gpt3
export const fetchModeration = async (
  prompt: string,
  abort: AbortController,
  options?: any
) => {
  return await apiFetch(
    'gpt3',
    'moderation',
    { prompt, ...(options || {}) },
    'POST',
    abort
  );
};
