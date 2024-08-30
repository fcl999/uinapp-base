export class URLSearchParams {
	private params: Map<string, string> = new Map();
	
	constructor (search: string) {
		search
			.split('&')
			.filter((param: string): boolean => param.length > 0)
			.forEach((param: string) => {
				const paramSplit = param.split('=');
				const key = paramSplit[0];
				const value = paramSplit[1];
				const decodedKey = decodeURIComponent(key);
				const decodedValue = decodeURIComponent(value);
				this.params.set(`${decodedKey}`, `${decodedValue}`)
			});
	}
	
	get (key: string): string | null {
		return this.params.get(key);
	}
}

export class URL {
	protocol: string;
	host: string;
	pathname: string;
	search: string;
	searchParams: URLSearchParams;
	
	constructor (url: string) {
		const urlRegex = /^(\w+):\/\/([^\/?#]+)([^?#]*)(\?[^#]*)?(#.*)?$/;
		const match = url.match(urlRegex);
		

		if (match === null) {
			throw new Error('Invalid URL');
		}
		
		if (typeof match !== 'object') {
			throw new Error('Invalid URL');
		}
		
		if (match !== null && match.length === 0) {
			throw new Error('Invalid URL');
		}
		
		this.protocol = match[1]!;
		this.host = match[2]!;
		this.pathname = '/';
		this.search = '';
		
		if (match.length >= 4 && match[3] !== null &&  match[3] !== undefined) {
			this.pathname = `${match[3]}`;
		}
		
		if (match.length >= 5 && match[4] !== null && match[4] !== undefined) {
			this.search = `${match[4]}`;
		}
		
		this.searchParams = new URLSearchParams(this.search.slice(1));
	}
	
	private toStringURL(): string {
		return `${this.protocol}://${this.host}${this.pathname}${this.search}`;
	}
	
	get href (): string {
		return this.toStringURL();
	}
}