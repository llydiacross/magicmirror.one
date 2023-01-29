import config from "./config";
import { apiFetch } from "./api";

export const fetchPrompt = async (prompt: string, abort: AbortController) => {
  return await apiFetch("gpt3", "prompt", { prompt }, "POST", abort);
};

export const fetchModeration = async (
  prompt: string,
  abort: AbortController
) => {
  return await apiFetch("gpt3", "moderation", { prompt }, "POST", abort);
};
