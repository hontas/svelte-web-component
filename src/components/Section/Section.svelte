<script>
  /**
   * Section heading
   */
  export let heading = '';
</script>

<svelte:options tag="x-section" />
<section class:with-heading="{heading}">
  <!-- If you wanna overwrite the default h3 -->
  <slot name="heading">
    <h3>{heading}</h3>
  </slot>
  <!-- Segment content -->
  <div class="card">
    <slot />
  </div>
</section>

<style>
  :host {
    --Section--heading-color: #555;
  }

  section {
    margin: 0.5rem 0;
  }

  h3,
  [name='heading']::slotted(*) {
    font-family: system-ui, sans-serif;
    font-size: 0.75rem;
    color: var(--Section--heading-color);
    margin: 0;
    text-transform: uppercase;
  }

  .card {
    background: white;
    padding: 0.5rem;
  }
</style>
