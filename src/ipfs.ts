import { Web3Storage, File, Web3File } from 'web3.storage';
import { apiFetch } from './api';
import config from './config';
import storage from './storage';

/**
 * IPFS File interface
 */
export interface IPFSFile {
	cid: string;
	name: string;
	type: string;
	size: number;
	path: string;
	content: ReadableStream<Uint8Array>;
}

/**
 * IPFS Directory interface
 */
export interface IPFSDirectory {
	cid: string;
	files: IPFSFile[];
}

/**
 * IPFS Directory interface
 */
export interface IPFSStats {
	cid: string;
	files: IPFSFile[];
	hasXENS: boolean;
	hasIndex: boolean;
	hasReadme: boolean;
	hasLicense: boolean;
	hasPackage: boolean;
	hasManifest: boolean;
	hasSettings: boolean;
	hasMusic: boolean;
	hasCSS: boolean;
	hasJS: boolean;
	hasImages: boolean;
	hasVideos: boolean;
	videoCount: number;
	imageCount: number;
	musicCount: number;
	fileCount: number;
}

/**
 * IPFS Provider abstract class defining the methods that need to be implemented
 */
export abstract class IPFSProvider {
	abstract createInstance(options: any): void;
	abstract uploadFile(
		filename: string,
		data: any,
		type?: string
	): Promise<string>;
	abstract uploadFiles(
		files: {
			name: string;
			data: any;
			type?: string;
		}[]
	): Promise<string>;
	abstract getFile(cid: string, fileName: string): Promise<IPFSFile>;
	abstract getContentType(type: string): string;
	abstract getContentExtension(type: string): string;
	abstract getDirectory(
		cid: string,
		abortController: AbortController,
		domainName?: string
	): Promise<IPFSDirectory>;
	abstract getStats(
		cid: string,
		abortController: AbortController,
		currentEnsDomain?: string
	): Promise<IPFSStats>;
	destroy() {
		//
	}
}

/**
 * IPFS Companion provider
 */
export class IPFSWebProvider extends IPFSProvider {
	createInstance(options: any) {
		//no instance required
	}

	async uploadFile(filename: string, data: any, type?: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async uploadFiles(
		files: {
			name: string;
			data: any;
			type?: string;
		}[]
	): Promise<string> {
		throw new Error('Method not implemented.');
	}

	getContentType(type: string) {
		type = type.toLowerCase();
		switch (type) {
			case 'png':
			case 'vector':
				return 'image/png';
			case 'svg':
				return 'image/svg+xml';
			case 'jpeg':
				return 'image/jpeg';
			default:
				return 'text/plain';
		}
	}

	getContentExtension(type) {
		type = type.toLowerCase();
		switch (type) {
			case 'image/png':
			case 'png':
			case 'image':
				return 'png';
			case 'image/jpeg':
			case 'jpeg':
				return 'jpg';
			case 'vector':
			case 'image/svg+xml':
			case 'svg':
				return 'svg';
			case 'tinysvg':
			case 'image/tinysvg':
				return 'tinysvg';
			default:
				return 'bin';
		}
	}

	async getStats(
		cid: string,
		abortController: AbortController,
		currentEnsDomain?: string
	) {
		let result = await apiFetch(
			'ipfs',
			'stats',
			{ cid, domainName: currentEnsDomain },
			'POST'
		);
		return result;
	}

	async getFile(cid: string, fileName: string): Promise<IPFSFile> {
		let result = await apiFetch('ipfs', 'get', { cid }, 'POST');
		result.content = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(result.content);
				controller.close();
			},
		});
		return result;
	}

	async getDirectory(
		cid: string,
		abortController?: AbortController,
		domainName?: string
	): Promise<IPFSDirectory> {
		//fetch from our api
		let result = await apiFetch(
			'ipfs',
			'files',
			{ cid, domainName },
			'POST',
			abortController
		);

		result.files.forEach((file) => {
			//create new readable UINT8 array from content
			let stream = new ReadableStream<Uint8Array>({
				start(controller) {
					controller.enqueue(result.content);
					controller.close();
				},
			});
			file.content = stream;
		});

		return result;
	}
}

/**
 * Handles Web3Storage provider
 */
class Web3StorageProvider extends IPFSProvider {
	private instance: Web3Storage;

	createInstance(options: any) {
		this.instance = new Web3Storage({
			token:
				options?.apiKey ||
				storage.getGlobalPreference('web3StorageKey'),
		});
	}

	/**
	 * Returns the CID of the newly uploaded file
	 * @param filename
	 * @param data
	 * @param type
	 * @returns
	 */
	async uploadFile(filename: string, data: any, type = 'image/png') {
		if (this.instance === undefined || this.instance === null) {
			throw new Error('create instance needs to be ran first');
		}

		let file: any;
		if (type !== null) {
			file = new File([data], filename, {
				type,
			});
		} else file = new File([data], filename);

		return await this.instance.put([file]);
	}

	async uploadFiles(
		files: { name: string; data: any; type?: string }[]
	): Promise<string> {
		let fileTypes = [];

		Object.values(files).forEach((file) => {
			fileTypes.push(
				new File([file.data], file.name, {
					type: file.type,
				})
			);
		});

		return await this.instance.put(fileTypes);
	}

	async getStats(
		cid: string,
		abortController: AbortController,
		currentDomainName?: string
	): Promise<IPFSStats> {
		//replace with web3storage stats
		let result = await apiFetch(
			'ipfs',
			'stats',
			{ cid, domainName: currentDomainName },
			'POST',
			abortController
		);
		return result;
	}

	async getDirectory(
		cid: string,
		abortController?: any,
		domainName?: string
	): Promise<IPFSDirectory> {
		if (this.instance === undefined || this.instance === null) {
			throw new Error('create instance needs to be ran first');
		}

		let result = await this.instance.get(cid.replace('ipfs://', ''), {
			signal: abortController?.signal,
		});
		if (!result.ok) {
			throw new Error('bad IPFS CID "' + cid + '" : ' + result.status);
		}

		let files = await result.files();
		let response: IPFSDirectory = {
			cid: cid,
			files: files.map((file: Web3File) => {
				return {
					cid: cid,
					name: file.name,
					type: file.type,
					size: file.size,
					path: file.cid + '/' + file.name,
					content: file.stream(),
				};
			}),
		};

		return response;
	}

	async getFile(
		cid: string,
		fileName: string,
		abortController?: AbortController,
		domainName?: string
	): Promise<IPFSFile> {
		let result = await this.getDirectory(cid, abortController, domainName);
		let file = result.files.find((file) => file.name === fileName);
		if (!file) {
			throw new Error('File not found');
		}
		return file;
	}

	getContentType(type: string) {
		type = type.toLowerCase();
		switch (type) {
			case 'png':
			case 'vector':
				return 'image/png';
			case 'svg':
				return 'image/svg+xml';
			case 'jpeg':
				return 'image/jpeg';
			default:
				return 'text/plain';
		}
	}

	getContentExtension(type) {
		type = type.toLowerCase();
		switch (type) {
			case 'image/png':
			case 'png':
			case 'image':
				return 'png';
			case 'image/jpeg':
			case 'jpeg':
				return 'jpg';
			case 'vector':
			case 'image/svg+xml':
			case 'svg':
				return 'svg';
			case 'tinysvg':
			case 'image/tinysvg':
				return 'tinysvg';
			default:
				return 'bin';
		}
	}

	destroyInstance() {
		this.instance = null;
	}
}

export {
	IPFSProvider as Provider,
	IPFSWebProvider as IPFSCompanionProvider,
	Web3StorageProvider,
};

export const resolveIPNS = async (
	ipnsHash: string,
	abortController?: AbortController
) => {
	let result = await apiFetch(
		'ipns',
		'resolve',
		{
			path: ipnsHash,
		},
		'POST',
		abortController
	);

	return result.cid;
};

/**
 *
 * @param potentialCID
 * @param fileName
 * @param provider
 * @returns
 */
export const resolveFile = async (
	potentialCID: string,
	fileName?: string,
	abortController: AbortController = null,
	provider?: IPFSProvider,
	domainName?: string
): Promise<IPFSFile> => {
	fileName = fileName || potentialCID.split('/').pop();
	console.log('resolving ' + potentialCID);
	let result = await resolveDirectory(
		potentialCID,
		abortController,
		provider,
		domainName
	);
	return result.files.filter((file) => file.name === fileName)[0];
};

export const resolvePotentialCID = async (
	potentialCID: string,
	abortController?: AbortController
) => {
	if (potentialCID.includes('ipfs://'))
		potentialCID = potentialCID.split('ipfs://')[1];
	else if (potentialCID.includes('ipns://')) {
		potentialCID = potentialCID.split('ipns://')[1];
		potentialCID = await resolveIPNS(potentialCID, abortController);
	}

	if (potentialCID.includes('ipfs/'))
		potentialCID = potentialCID.split('ipfs/')[1];

	potentialCID = potentialCID.split('/')[0];
	return potentialCID;
};

export const getStats = async (
	potentialCID: string,
	abortController?: AbortController,
	provider?: IPFSProvider,
	currentEnsDomain?: string
) => {
	provider = provider || getDefaultProvider();
	potentialCID = await resolvePotentialCID(potentialCID, abortController);
	let result = await provider.getStats(
		potentialCID,
		abortController,
		currentEnsDomain
	);
	return result;
};

/**
 *
 * @param potentialCID
 * @param provider
 * @returns
 */
export const resolveDirectory = async (
	potentialCID: string,
	abortController: AbortController = null,
	provider?: IPFSProvider,
	domainName?: string
): Promise<IPFSDirectory> => {
	provider = provider || getDefaultProvider();
	potentialCID = await resolvePotentialCID(potentialCID, abortController);
	let response = provider.getDirectory(
		potentialCID,
		abortController,
		domainName
	);
	return response;
};

let _IPFSProvider: IPFSProvider;
export const getDefaultProvider = () => {
	if (_IPFSProvider) return _IPFSProvider;
	else {
		_IPFSProvider = new IPFSWebProvider();
		_IPFSProvider.createInstance({
			url: config.ipfsProviderURL || 'https://ipfs.io/api/v0',
		});
		return _IPFSProvider;
	}
};

let _IPFSCustomProvider: IPFSWebProvider;
let _IPFSApiProvider: IPFSWebProvider;
let _Web3StorageProvider: Web3StorageProvider;
export const getProvider = (
	provider?: 'web3-storage' | 'ipfs-http' | 'ipfs-api',
	options?: {
		apiKey?: string;
		url?: string;
	}
) => {
	provider = provider || 'web3-storage';
	switch (provider) {
		case 'ipfs-http':
			if (_IPFSCustomProvider) return _IPFSCustomProvider;
			else {
				_IPFSCustomProvider = new IPFSWebProvider();
				_IPFSCustomProvider.createInstance(options);
			}

			return _IPFSCustomProvider;
		case 'ipfs-api':
			if (_IPFSApiProvider) return _IPFSApiProvider;
			else {
				_IPFSApiProvider = new IPFSWebProvider();
				_IPFSApiProvider.createInstance(options);
			}
			return _IPFSApiProvider;
		case 'web3-storage':
			if (_Web3StorageProvider) return _Web3StorageProvider;
			else {
				_Web3StorageProvider = new Web3StorageProvider();
				_Web3StorageProvider.createInstance(options);
			}
			return _Web3StorageProvider;
		default:
			throw new Error('invalid provider');
	}
};

export const recreateProvider = (
	provider?: 'web3-storage' | 'ipfs-http',
	options?: {
		apiKey: string;
	}
) => {
	provider = provider || 'web3-storage';
	switch (provider) {
		case 'ipfs-http':
			if (_IPFSCustomProvider) _IPFSCustomProvider.destroy();
			_IPFSCustomProvider = new IPFSWebProvider();
			_IPFSCustomProvider.createInstance(options);
			return _IPFSCustomProvider;
		case 'web3-storage':
			if (_Web3StorageProvider) _Web3StorageProvider.destroy();
			_Web3StorageProvider = new Web3StorageProvider();
			_Web3StorageProvider.createInstance(options);
			return _Web3StorageProvider;
		default:
			throw new Error('invalid provider');
	}
};
