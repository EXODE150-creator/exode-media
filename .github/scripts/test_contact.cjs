const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.resolve(__dirname, '../../site.js'), 'utf8').split('// Même ordre')[0];
function boot(clipboard) {
  const button = { hidden: true, addEventListener(type, handler) { this.handler = handler; } };
  const status = { textContent: '' };
  const document = { querySelector: selector => selector === '[data-copy-email]' ? button : status };
  vm.runInNewContext(source, { document, navigator: { clipboard } });
  return { button, status };
}
(async () => {
  let copied;
  const ok = boot({ writeText: async text => { copied = text; } });
  assert.equal(ok.button.hidden, false);
  ok.button.handler();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(copied, 'contact@exode-media.com');
  assert.match(ok.status.textContent, /Adresse copiée/);
  const denied = boot({ writeText: async () => { throw Error('denied'); } });
  denied.button.handler();
  await new Promise(resolve => setImmediate(resolve));
  assert.match(denied.status.textContent, /manuellement/);
  assert.equal(boot(undefined).button.hidden, true);
  console.log('Contact : copie, refus et navigateur sans presse-papiers vérifiés.');
})().catch(error => { console.error(error); process.exitCode = 1; });
