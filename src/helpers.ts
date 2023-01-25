import storage from "./storage";
import { getProvider } from "./ipfs";

export const getPreferedProvider = (
  provider?: "web3-storage" | "ipfs-companion"
) => {
  let instance = getProvider(
    provider || storage.getGlobalPreference("ipfs_provider") || "web3-storage"
  );
  instance.createInstance(storage.getGlobalPreference("web3_storage_token"));
  return instance;
};
