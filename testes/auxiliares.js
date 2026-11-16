import { readFileSync, readdirSync } from 'node:fs';

// Cria um injetor novo para cada teste, com DI estrita como na página (ng-strict-di).
export function criarInjetor() {
  const $injector = angular.injector(['ng', 'ngMock', 'portal'], true);
  const $templateCache = $injector.get('$templateCache');
  // templateUrl: coloca cada .html no cache com a mesma chave usada nas diretivas.
  for (const arquivo of readdirSync('app/componentes', { recursive: true })) {
    if (String(arquivo).endsWith('.html')) {
      const caminho = 'app/componentes/' + arquivo;
      $templateCache.put(caminho, readFileSync(caminho, 'utf8'));
    }
  }
  return $injector;
}
