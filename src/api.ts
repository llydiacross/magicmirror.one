import config from './config';

export const getEndpointHref = () => {
  const isLocalhost = window.location.href.includes('localhost');
  if (isLocalhost && config.useLocalApi) return config.localApiEndpoint;
  else return config.apiEndpoint;
};

export const getEndpoint = (
  type: 'chat' | 'gpt3' | 'search' | 'nft' | 'ipfs' | 'ipns'
) => {
  if (config.routes[type] === undefined)
    throw new Error('invalid api type: ' + type);

  return getEndpointHref() + config.routes[type];
};

export const apiFetch = async (
  type: 'chat' | 'gpt3' | 'search' | 'nft' | 'ipfs' | 'ipns',
  method: string,
  data: any,
  requestMethod: 'GET' | 'POST',
  abortController?: AbortController
) => {
  let endPoint = getEndpoint(type);
  requestMethod = requestMethod || 'GET';

  const result = await fetch(endPoint + method, {
    method: requestMethod,
    headers: { 'Content-Type': 'application/json' },
    signal: abortController?.signal,
    body: JSON.stringify(data),
  });

  if (result.status !== 200) {
    throw new Error('bad response', (await result.json()) || {});
  }

  return await result.json();
};
