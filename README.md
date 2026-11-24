# É golpe ou não? — Quiz da FB Negócios

Versão independente do quiz "É golpe ou não?" do site da FB Negócios. Visual, perguntas e comportamento são os mesmos do site.

Publicado em: https://vitorbr085.github.io/quiz-golpe/

## Arquivos

```
index.html   → página do quiz
quiz.css     → estilos (cores, cartões, botões, animações)
quiz.js      → perguntas e funcionamento (arrastar, botões, placar, resultado)
```

## Mostrar o quiz em outro site

Cole este código no lugar da página onde o quiz deve aparecer:

```html
<iframe src="https://vitorbr085.github.io/quiz-golpe/" style="width:100%;height:760px;border:0" title="É golpe ou não?"></iframe>
```

## Testar no computador

Abra a pasta no VS Code e clique em **Go Live**, ou abra o `index.html` direto no navegador.

## Editar as perguntas

As perguntas ficam no início de `quiz.js`, na lista `quizGolpe`. Cada item tem:
- `texto`: a situação mostrada no cartão;
- `resposta`: `"golpe"` ou `"seguro"`;
- `explicacao`: o texto que aparece depois da resposta.

O número do WhatsApp do botão "Falar com a FB" fica na linha `const E = { whatsapp: { numero: ... } }`.
