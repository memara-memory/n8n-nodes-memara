"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemaraApi = void 0;
class MemaraApi {
    constructor() {
        this.name = 'memaraApi';
        this.displayName = 'Memara API';
        this.documentationUrl = 'https://docs.memara.io/integrations/n8n';
        this.properties = [
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
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Authorization': '=Bearer {{$credentials.apiKey}}',
                    'Content-Type': 'application/json',
                    'User-Agent': 'n8n-memara-node/1.0.0',
                },
            },
        };
        this.test = {
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
}
exports.MemaraApi = MemaraApi;
//# sourceMappingURL=MemaraApi.credentials.js.map