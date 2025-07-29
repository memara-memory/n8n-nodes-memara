import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class Memara implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Memara',
		name: 'memara',
		icon: 'file:memara.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Store and retrieve memories from Memara with semantic search',
		defaults: {
			name: 'Memara',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'memaraApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl || "https://api.memara.io"}}',
			headers: {
				'Authorization': '=Bearer {{$credentials.apiKey}}',
				'Content-Type': 'application/json',
				'User-Agent': 'n8n-memara-node/1.0.0',
			},
		},
		properties: [
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Memory',
						value: 'memory',
						description: 'Operations for individual memories',
					},
					{
						name: 'Memory Space',
						value: 'space',
						description: 'Operations for memory spaces',
					},
				],
				default: 'memory',
				required: true,
				description: 'Choose the resource type to work with',
			},

			// Memory Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['memory'],
					},
				},
				noDataExpression: true,
				options: [
					{
						name: 'Create Memory',
						value: 'create',
						description: 'Store information as a memory',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/memories',
								body: {
									content: '={{$parameter.content}}',
									title: '={{$parameter.title}}',
									tags: '={{$parameter.tags ? $parameter.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : []}}',
								},
							},
							output: {
								postReceive: [
									{
										type: 'set',
										properties: {
											value: '={{ { "success": true, "id": $response.body.id, "memory": $response.body } }}',
										},
									},
								],
							},
						},
						action: 'Create a memory',
					},
					{
						name: 'Search Memories',
						value: 'search',
						description: 'Find relevant memories using semantic search',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/memories/search',
								body: {
									query: '={{$parameter.query}}',
									limit: '={{$parameter.limit || 10}}',
								},
							},
							output: {
								postReceive: [
									{
										type: 'set',
										properties: {
											value: '={{ $response.body.memories || [] }}',
										},
									},
								],
							},
						},
						action: 'Search memories',
					},
					{
						name: 'Update Memory',
						value: 'update',
						description: 'Modify an existing memory',
						routing: {
							request: {
								method: 'PUT',
								url: '=/v1/memories/{{$parameter.memoryId}}',
								body: {
									content: '={{$parameter.content}}',
									title: '={{$parameter.title}}',
									tags: '={{$parameter.tags ? $parameter.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : undefined}}',
								},
							},
							output: {
								postReceive: [
									{
										type: 'set',
										properties: {
											value: '={{ { "success": true, "id": $parameter.memoryId, "memory": $response.body } }}',
										},
									},
								],
							},
						},
						action: 'Update a memory',
					},
					{
						name: 'Delete Memory',
						value: 'delete',
						description: 'Remove a memory permanently',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/v1/memories/{{$parameter.memoryId}}',
							},
							output: {
								postReceive: [
									{
										type: 'set',
										properties: {
											value: '={{ { "success": true, "id": $parameter.memoryId, "deleted": true } }}',
										},
									},
								],
							},
						},
						action: 'Delete a memory',
					},
					{
						name: 'List Memories',
						value: 'list',
						description: 'Get memories from your space',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/memories',
								qs: {
									limit: '={{$parameter.limit || 50}}',
									offset: '={{$parameter.offset || 0}}',
								},
							},
							output: {
								postReceive: [
									{
										type: 'set',
										properties: {
											value: '={{ $response.body.memories || [] }}',
										},
									},
								],
							},
						},
						action: 'List memories',
					},
				],
				default: 'create',
				required: true,
			},

			// Memory Space Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['space'],
					},
				},
				noDataExpression: true,
				options: [
					{
						name: 'List Spaces',
						value: 'list',
						description: 'Get all available memory spaces',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/spaces',
							},
							output: {
								postReceive: [
									{
										type: 'set',
										properties: {
											value: '={{ $response.body.spaces || [] }}',
										},
									},
								],
							},
						},
						action: 'List memory spaces',
					},
					{
						name: 'Create Space',
						value: 'create',
						description: 'Create a new memory space',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/spaces',
								body: {
									name: '={{$parameter.spaceName}}',
									description: '={{$parameter.spaceDescription || ""}}',
								},
							},
							output: {
								postReceive: [
									{
										type: 'set',
										properties: {
											value: '={{ { "success": true, "space": $response.body } }}',
										},
									},
								],
							},
						},
						action: 'Create a memory space',
					},
				],
				default: 'list',
				required: true,
			},

			// Memory Parameters
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				required: true,
				description: 'The content of the memory to store or update',
				placeholder: 'Enter the information you want to remember...',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Optional title for the memory',
				placeholder: 'Memory title',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Comma-separated tags for organizing memories',
				placeholder: 'tag1, tag2, tag3',
			},
			{
				displayName: 'Memory ID',
				name: 'memoryId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the memory to update or delete',
				placeholder: 'mem_abc123...',
			},
			{
				displayName: 'Search Query',
				name: 'query',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search'],
					},
				},
				default: '',
				required: true,
				description: 'Search query to find relevant memories',
				placeholder: 'What are you looking for?',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search', 'list'],
					},
				},
				default: 10,
				description: 'Maximum number of memories to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['list'],
					},
				},
				default: 0,
				description: 'Number of memories to skip (for pagination)',
				typeOptions: {
					minValue: 0,
				},
			},

			// Space Parameters
			{
				displayName: 'Space Name',
				name: 'spaceName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['space'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Name for the new memory space',
				placeholder: 'My Project Space',
			},
			{
				displayName: 'Space Description',
				name: 'spaceDescription',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['space'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Optional description for the memory space',
				placeholder: 'Space for project-related memories',
			},
		],
	};
}
