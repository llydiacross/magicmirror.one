import config from "./config";

const fetchPrompt = async (prompt: string, abort: AbortController) => {
  let result = await fetch(config.chatGPTendpoint + "prompt", {
    signal: abort?.signal,
    method: "POST",
    body: JSON.stringify({ prompt }),
  });

  let json = await result.json();
  if (result.status !== 200) throw new Error("bad response", json || {});

  return json;
};

const fetchModeration = async (prompt: string, abort: AbortController) => {
  let result = await fetch(config.chatGPTendpoint + "moderation", {
    signal: abort?.signal,
    method: "POST",
    body: JSON.stringify({ prompt }),
  });

  let json = await result.json();
  if (result.status !== 200) throw new Error("bad response", json || {});

  return json;
};
