import { Web3Storage, File } from "web3.storage/dist/bundle.esm.min.js";

/**
 * IPFS Provider abstract class defining the methods that need to be implemented
 */
abstract class IPFSProvider {
  abstract createInstance(apikey: string): void;
  abstract uploadFile(filename: string, data: any, type?: string): Promise<any>;
  abstract getFile(cid?: string, fileName?: string): Promise<any>;
  abstract getContentType(type: string): string;
  abstract getContentExtension(type: string): string;
}

/**
 * IPFS Companion provider
 */
class IPFSCompanionProvider extends IPFSProvider {
  createInstance(apikey: string) {
    throw new Error("Method not implemented.");
  }
  uploadFile(filename: string, data: any, type?: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getContentType(type: string): string {
    throw new Error("Method not implemented.");
  }
  getContentExtension(type: string): string {
    throw new Error("Method not implemented.");
  }
  getFile(cid?: string, fileName?: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

/**
 * Handles Web3Storage provider
 */
class Web3StorageProvider extends IPFSProvider {
  private instance: Web3Storage;

  createInstance(apikey) {
    if (this.instance) return;
    this.instance = new Web3Storage({ token: apikey });
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

  getFile(cid?: string, fileName?: string): Promise<any> {
    throw new Error("Method not implemented.");
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
