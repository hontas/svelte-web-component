<script>
  import isBoolAttr from '../../utils/isBoolAttr';

  export let disabled = false;
  export let disabledMofo = false;
  export let counter = 0;
  /**
   * comment
   * @type {boolean}
   */
  export let kiss;

  function handleClick() {
    counter += 1;
  }

  $: {
    if (isBoolAttr(disabled)) disabled = true;
    if (isBoolAttr(disabledMofo)) disabledMofo = true;
  }
</script>

<svelte:options tag="ica-button" />
<button {disabled} on:click="{handleClick}">
  <slot name="pre" />
  <slot />
  <slot name="post" />
</button>

<style lang="scss">
  @import '../../styles/variables.scss';

  button {
    background-color: $base-color;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
  }

  button[disabled] {
    background: $border-dark;
  }
</style>
