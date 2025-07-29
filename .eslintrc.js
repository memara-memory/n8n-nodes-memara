module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'n8n-nodes-base',
  ],
  rules: {
    // n8n community node specific rules
    'n8n-nodes-base/node-filename-against-convention': 'off',
    'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'off',
    'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger': 'off',
    'n8n-nodes-base/node-class-description-display-name-unsuffixed': 'off',
    'n8n-nodes-base/node-class-description-name-unsuffixed-trigger-node': 'off',
    'n8n-nodes-base/node-class-description-name-unsuffixed-trigger': 'off',
    'n8n-nodes-base/node-class-description-name-unsuffixed': 'off',
    'n8n-nodes-base/node-param-display-name-unsuffixed-trigger-node': 'off',
    'n8n-nodes-base/node-param-display-name-unsuffixed-trigger': 'off',
    'n8n-nodes-base/node-param-display-name-unsuffixed': 'off',
    'n8n-nodes-base/node-param-name-unsuffixed-trigger-node': 'off',
    'n8n-nodes-base/node-param-name-unsuffixed-trigger': 'off',
    'n8n-nodes-base/node-param-name-unsuffixed': 'off',
  },
}; 