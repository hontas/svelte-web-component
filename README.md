# svelte-web-component

based on [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Usage

```html
<script type="module">
  import './svelte-wc.js';
</script>

<svelte-wc></svelte-wc>
```

## Linting with ESLint, Prettier, and Types

To scan the project for linting errors, run

```bash
npm run lint
```

## Testing with Karma

To run the suite of karma tests, run

```bash
npm run test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```
