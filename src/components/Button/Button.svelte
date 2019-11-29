<script>
  import isBoolAttr from '../../utils/isBoolAttr';

  /**
   * @type {boolean}
   */
  export let disabled = false;
  /**
   * @type {boolean}
   */
  export let readonly = false;
  /**
   * @type {string}
   */
  export let title = 'Hey there';
  /**
   * @type {number}
   */
  export let counter = 5;

  function handleClick() {
    counter += 1;
  }

  $: {
    if (isBoolAttr(disabled)) disabled = true;
    if (isBoolAttr(readonly)) readonly = true;
  }
</script>

<svelte:options tag="ica-button" />
<h2>{title} Nr. {counter}!</h2>
<input aria-label="input" type="text" {readonly} bind:value="{title}" />
<button {disabled} on:click="{handleClick}">
  <slot name="pre" />
  <slot />
  <slot name="post" />
</button>

<style>
  button {
    background: darkred;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
  }
</style>
