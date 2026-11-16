// Carrega o AngularJS, o ngMock e os scripts da app/ exatamente na ordem do index.html.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import 'angular';
import 'angular-mocks';

const html = readFileSync(resolve('index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="(app\/[^"]+)"/g)].map((m) => m[1]);
for (const src of scripts) {
  await import(resolve(src));
}
