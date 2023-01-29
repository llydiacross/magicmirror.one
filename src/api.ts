import { json } from "stream/consumers";
import config from "./config";

export const getEndpointHref = () => {
  let isLocalhost = window.location.href.indexOf("localhost") !== -1;
  if (isLocalhost && config.useLocalApi) return config.localApiEndpoint;
  else return config.apiEndpoint;
};

export const getChatGPTEndpoint = () => {
  return getEndpointHref() + config.chatGPTendpoint;
};

export const getSearchEndpoint = () => {
  return getEndpointHref() + config.searchEndpoint;
};

export const getNFTEndpoint = () => {
  return getEndpointHref() + config.nftEndpoint;
};

export const getIPFSEndpoint = () => {
  return getEndpointHref() + config.ipfsEndpoint;
};

export const apiFetch = async (
  type: "chat" | "gpt3" | "search" | "nft" | "ipfs",
  method: string,
  data: any,
  requestMethod: "GET" | "POST",
  abortController: AbortController
) => {
  requestMethod = requestMethod || "GET";
  let endPoint = "";
  //make a switch statement here
  switch (type) {
    case "chat":
    case "gpt3":
      endPoint = getChatGPTEndpoint();
      break;
    case "search":
      endPoint = getSearchEndpoint();
      break;
    case "nft":
      endPoint = getNFTEndpoint();
      break;
    case "ipfs":
      endPoint = getIPFSEndpoint();
      break;
  }

  let result = await fetch(endPoint + method, {
    method: requestMethod,
    headers: { "Content-Type": "application/json" },
    signal: abortController?.signal,
    body: JSON.stringify(data),
  });

  if (result.status !== 200)
    throw new Error("bad response", (await result.json()) || {});

  return await result.json();
};
