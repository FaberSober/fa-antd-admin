module.exports = {
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off', // 不可使用require
    '@typescript-eslint/no-explicit-any': 'off', // 不可使用any类型
    '@typescript-eslint/no-empty-interface': 'off', // 空属性interface
    '@typescript-eslint/no-empty-function': 'off', // 空方法体{}
    '@typescript-eslint/no-unused-vars': 'off', // 未使用的变量
    '@typescript-eslint/no-namespace': 'off', // 不可使用namespace
    '@typescript-eslint/ban-ts-comment': 'off', // 不可使用@ts-ignore
  },
};
