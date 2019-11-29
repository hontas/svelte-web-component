import { html, fixture, expect } from '@open-wc/testing';

import '../dist/Button.js';

function wait(ms = 50) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe('IcaButton', () => {
  it('has a default title, counter and bool values', async () => {
    const el = await fixture(html`
      <ica-button></ica-button>
    `);

    const button = el.shadowRoot.querySelector('button');
    const input = el.shadowRoot.querySelector('input');

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);

    expect(button.hasAttribute('disabled')).to.equal(false);
    expect(input.hasAttribute('readonly')).to.equal(false);
  });

  it('sets boolean values', async () => {
    const el = await fixture(html`
      <ica-button disabled readonly></ica-button>
    `);

    const button = el.shadowRoot.querySelector('button');
    const input = el.shadowRoot.querySelector('input');

    console.log('button', button);
    console.log('input', input);

    expect(button.hasAttribute('disabled')).to.equal(true);
    expect(input.hasAttribute('readonly')).to.equal(true);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture(html`
      <ica-button></ica-button>
    `);

    el.shadowRoot.querySelector('button').click();
    await wait();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`
      <ica-button title="attribute title"></ica-button>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html`
      <ica-button>text</ica-button>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
