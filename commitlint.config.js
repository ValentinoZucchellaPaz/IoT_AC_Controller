module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scope is mandatory
    'scope-empty': [2, 'never'],

    // Types allowed in the project
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'test', 'chore', 'refactor', 'style', 'ci'],
    ],

    // Without capital letter at the beginning
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],

    // No period at the end
    'subject-full-stop': [2, 'never', '.'],

    // Description cannot be empty
    'subject-empty': [2, 'never'],

    // Maximum 72 characters
    'header-max-length': [2, 'always', 72],
  },
}