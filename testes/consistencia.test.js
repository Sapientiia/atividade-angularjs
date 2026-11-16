import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// As duas versões usam o mesmo CSS. O Vue não pode ler fora de vue/, então
// guarda uma cópia; este teste falha se a cópia ficar diferente do original.
// Para atualizar: cp css/estilo.css vue/src/estilo.css
describe('consistência entre as versões AngularJS e Vue', () => {
  it('vue/src/estilo.css é idêntico a css/estilo.css', () => {
    const original = readFileSync(resolve('css/estilo.css'), 'utf8');
    const copia = readFileSync(resolve('vue/src/estilo.css'), 'utf8');
    expect(copia).toBe(original);
  });
});
