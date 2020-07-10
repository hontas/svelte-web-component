<script>
  import getBoolFromAttr from '../../utils/getBool';

  /**
   * comment
   * @type {boolean}
   */
  export let disabled = false;
  export let counter = 0;

  function handleClick() {
    counter += 1;
  }

  $: {
    disabled = getBoolFromAttr(disabled);
  }
</script>

<svelte:options tag="x-button" />
<button {disabled} on:click="{handleClick}">
  <slot name="pre" />
  <slot />
  <slot name="post">clicked: {counter}</slot>
</button>

<style>
  :host {
    --Button--base-color: #c6538c;
    --Button--disabled-color: #c6538ce1;
  }

  button {
    background-color: var(--Button--base-color);
    border: none;
    color: white;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
  }

  button[disabled] {
    background: var(--Button--disabled-color);
  }
</style>
