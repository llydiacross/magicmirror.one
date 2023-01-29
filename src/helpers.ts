import storage from "./storage"
import { getProvider, getReadOnlyProvider } from "./ipfs"
import config from "./config"

export const getIPFSProvider = (
  provider?: "web3-storage" | "ipfs-companion",
  readOnly?: boolean
) => {
  const instance = readOnly
    ? getReadOnlyProvider(
      provider ||
          storage.getGlobalPreference("ipfs_provider") ||
          "web3-storage"
    )
    : getProvider(
      provider ||
          storage.getGlobalPreference("ipfs_provider") ||
          "web3-storage"
    )

  instance.createInstance(
    readOnly
      ? config.defaultWeb3Storage
      : storage.getGlobalPreference("web3_storage_token")
  )

  return instance
}
