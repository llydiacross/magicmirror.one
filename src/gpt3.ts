import { apiFetch } from "./api";

//fetches a prompt response from chat gpt3, make sure to run prompt through the moderation function first to avoid abuse
export const fetchPrompt = async (
  prompt: string,
  abort?: AbortController,
  options?: any
) => {
  return await apiFetch(
    "gpt3",
    "prompt",
    { prompt, ...(options || {}) },
    "POST",
    abort
  );
};

//fetches a moderation response from chat gpt3
export const fetchModeration = async (
  prompt: string,
  abort: AbortController,
  options?: any
) => {
  return await apiFetch(
    "gpt3",
    "moderation",
    { prompt, ...(options || {}) },
    "POST",
    abort
  );
};
