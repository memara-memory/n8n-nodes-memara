import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MemaraApi implements ICredentialType {
	name = 'memaraApi';
	displayName = 'Memara API';
	documentationUrl = 'https://docs.memara.io/integrations/n8n';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Memara API key. Get it from Settings > API Keys in your Memara dashboard.',
			placeholder: 'mk_live_...',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.memara.io',
			required: false,
			description: 'Base URL for Memara API. Use default unless you have a custom deployment.',
			placeholder: 'https://api.memara.io',
		},
		{
			displayName: 'Default Space ID',
			name: 'defaultSpaceId',
			type: 'string',
			default: '',
			required: false,
			description: 'Default memory space to use when no space is specified in operations. Leave empty to use your default space.',
			placeholder: 'space_abc123...',
		},
	];

	// Authentication configuration for HTTP requests
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.apiKey}}',
				'Content-Type': 'application/json',
				'User-Agent': 'n8n-memara-node/1.0.0',
			},
		},
	};

	// Test the credential by making a simple API call
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/spaces',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'spaces',
					value: [],
					message: 'API key is valid and can access Memara API',
				},
			},
		],
	};
}
