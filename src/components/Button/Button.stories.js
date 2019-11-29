export default { title: 'Button' };

export const withText = () => '<ica-button>Hello World</ica-button>';

export const withSlots = () => `
<ica-button>
<p slot="pre">pre</p>
Hello World
<p slot="post">post</p>
</ica-button>`;

export const withEmoji = () => '<ica-button>😀 😎 👍 💯</ica-button>';
