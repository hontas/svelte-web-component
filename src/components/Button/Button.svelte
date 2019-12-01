<script>
  import isBoolAttr from '../../utils/isBoolAttr';

  export let disabled = false;
  export let counter = 0;

  function handleClick() {
    counter += 1;
  }

  $: {
    if (isBoolAttr(disabled)) disabled = true;
  }
</script>

<svelte:options tag="ica-button" />
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

  button[disabled] {
    background: gray;
  }
</style>
