import { read } from "fs";
import { Web3Storage, File, Web3Response } from "web3.storage";
import storage from "./storage";

/**
 * IPFS Provider abstract class defining the methods that need to be implemented
 */
abstract class IPFSProvider {
  protected readOnly: boolean;

  constructor(readOnly?: boolean) {
    this.readOnly = readOnly === undefined ? false : readOnly;
  }
  abstract createInstance(apikey: string): void;
  abstract uploadFile(filename: string, data: any, type?: string): Promise<any>;
  abstract getFile(cid: string, fileName: string): Promise<any>;
  abstract getContentType(type: string): string;
  abstract getContentExtension(type: string): string;
  abstract getDirectory(cid: string): any;
}

/**
 * IPFS Companion provider
 */
class IPFSCompanionProvider extends IPFSProvider {
  createInstance(apikey: string) {
    throw new Error("Method not implemented.");
  }
  uploadFile(filename: string, data: any, type?: string): Promise<any> {
    if (this.readOnly) throw new Error("IPFS Provider is read only");

    throw new Error("Method not implemented.");
  }
  getContentType(type: string): string {
    throw new Error("Method not implemented.");
  }
  getContentExtension(type: string): string {
    throw new Error("Method not implemented.");
  }
  getFile(cid: string, fileName: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getDirectory(cid: string) {
    throw new Error("Method not implemented.");
  }
}

/**
 * Handles Web3Storage provider
 */
class Web3StorageProvider extends IPFSProvider {
  private instance: Web3Storage;

  createInstance(apikey: string) {
    if (this.instance) return;
    this.instance = new Web3Storage({
      token:
        storage.getGlobalPreference("web3_storage_token") ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZjZWYwNjFCYTkxNGZhYTdFNjU3NEI2N0E0NjU4YjIyNzgwMTYxQmQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTA0MTM0MTMzMjgsIm5hbWUiOiJpbmZpbml0eS1taW50In0.se1kP3g-ssSs0G8DjIrd2pbUeq1b_OzuCqFoxzepZVA",
    });
  }

  async uploadFile(filename: string, data: any, type = "image/png") {
    if (this.instance === undefined || this.instance === null)
      throw new Error("create instance needs to be ran first");

    let file: any;
    if (type !== null)
      file = new File([data], filename, {
        type: type,
      });
    else file = new File([data], filename);

    return await this.instance.put([file]);
  }

  async getDirectory(cid: string, abort?: any): Promise<Web3Response> {
    if (this.instance === undefined || this.instance === null)
      throw new Error("create instance needs to be ran first");

    let result = await this.instance.get(cid.replace("ipfs://", ""), {
      signal: abort?.signal,
    });
    if (!result.ok)
      throw new Error('bad IPFS CID "' + cid + '" : ' + result.status);

    return result;
  }

  async getFile(cid: string, fileName: string): Promise<any> {
    let files = await (await this.getDirectory(cid)).files();
    return files.filter((file) => file.name === fileName)[0];
  }

  getContentType(type: string) {
    type = type.toLowerCase();
    switch (type) {
      case "png":
      case "vector":
        return "image/png";
      case "svg":
        return "image/svg+xml";
      case "jpeg":
        return "image/jpeg";
      default:
        return "text/plain";
    }
  }

  getContentExtension(type) {
    type = type.toLowerCase();
    switch (type) {
      case "image/png":
      case "png":
      case "image":
        return "png";
      case "image/jpeg":
      case "jpeg":
        return "jpg";
      case "vector":
      case "image/svg+xml":
      case "svg":
        return "svg";
      case "tinysvg":
      case "image/tinysvg":
        return "tinysvg";
      default:
        return "bin";
    }
  }

  destroyInstance() {
    this.instance = null;
  }
}

export { IPFSProvider as Provider, IPFSCompanionProvider, Web3StorageProvider };
let _IPFSCompanionProviderReadOnly: IPFSCompanionProvider;
let _Web3StorageProviderReadOnly: Web3StorageProvider;
export const getReadOnlyProvider = (
  provider?: "web3-storage" | "ipfs-companion"
) => {
  provider = provider || "web3-storage";
  switch (provider) {
    case "ipfs-companion":
      if (_IPFSCompanionProviderReadOnly) return _IPFSCompanionProviderReadOnly;
      _IPFSCompanionProviderReadOnly = new IPFSCompanionProvider(true);
      return _IPFSCompanionProviderReadOnly;
    case "web3-storage":
      if (_Web3StorageProviderReadOnly) return _Web3StorageProviderReadOnly;
      _Web3StorageProviderReadOnly = new Web3StorageProvider(true);
      return _Web3StorageProviderReadOnly;
    default:
      throw new Error("invalid provider");
  }
};

let _IPFSCompanionProvider: IPFSCompanionProvider;
let _Web3StorageProvider: Web3StorageProvider;
export const getProvider = (provider?: "web3-storage" | "ipfs-companion") => {
  provider = provider || "web3-storage";
  switch (provider) {
    case "ipfs-companion":
      if (_IPFSCompanionProvider) return _IPFSCompanionProvider;
      _IPFSCompanionProvider = new IPFSCompanionProvider();
      return _IPFSCompanionProvider;
    case "web3-storage":
      if (_Web3StorageProvider) return _Web3StorageProvider;
      _Web3StorageProvider = new Web3StorageProvider();
      return _Web3StorageProvider;
    default:
      throw new Error("invalid provider");
  }
};
