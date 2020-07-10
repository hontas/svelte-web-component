import '../Section/Section.svelte';
import './Button.svelte';

export default { title: 'Button' };

export const examples = () => `
  <x-section heading="with Text">
    <x-button>Hello World</x-button>
  </x-section>

  <x-section heading="using slots">
    <x-button>
      <p slot="pre">pre</p>
      Hello World
      <p slot="post">post</p>
    </x-button>
  </x-section>

  <x-section heading="with emojis">
    <x-button>😀 😎 👍 💯</x-button>
  </x-section>
`;
