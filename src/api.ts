import config from "./config";

export const getEndpointHref = () => {
  let isLocalhost = window.location.href.indexOf("localhost") > -1;
  if (isLocalhost && config.useLocalApi) return config.localApiEndpoint;
  else return config.apiEndpoint;
};

export const getChatGPTEndpoint = () => {
  return getEndpointHref() + config.chatGPTendpoint;
};
