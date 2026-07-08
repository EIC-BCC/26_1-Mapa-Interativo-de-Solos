# Mapa Interativo de Tipos de Solo

**Autores:** Julie dos Santos Moura e Gabriel Renato Oliveira Camargo

---

## 1. Introdução

O conhecimento sobre os tipos de solo é um insumo fundamental para diversas
áreas — agricultura, planejamento urbano, gestão ambiental, engenharia civil
e estudos acadêmicos sobre o território brasileiro. O Brasil dispõe de um
mapeamento pedológico oficial, mantido pelo IBGE e estruturado segundo o
**Sistema Brasileiro de Classificação de Solos (SiBCS)**, que reúne dezenas
de classes distintas distribuídas em milhares de polígonos espalhados pelo
país. Apesar da riqueza desses dados, eles costumam ser distribuídos em
formatos pouco acessíveis (como *shapefiles*), exigindo softwares
especializados de SIG (Sistema de Informações Geográficas) e conhecimento
técnico para a sua visualização.

Este trabalho propõe uma **aplicação web interativa** que torna esse mapeamento
acessível diretamente em um navegador, sem instalações ou conhecimento
prévio de SIG. O usuário consegue navegar pelo mapa do Brasil, observar
os polígonos coloridos por classe de solo, filtrar quais classes deseja
visualizar e consultar os atributos detalhados de cada região clicando
sobre ela. Em paralelo, a aplicação serve como uma **biblioteca reutilizável**
de visualização de solos, podendo ser incorporada em outros projetos que
necessitem do mesmo recurso.

O documento descreve o produto desenvolvido, as tecnologias adotadas para
sua construção, a estrutura do código que dá suporte à aplicação e as
conclusões obtidas com o desenvolvimento.


## 2. Texto principal

A aplicação tem como objetivo central permitir que qualquer pessoa visualize,
de forma intuitiva, a distribuição dos tipos de solo no território brasileiro.
Para isso, a interface foi pensada em três níveis de interação que se
sobrepõem sobre um mapa-base do Brasil.

**Visualização dos polígonos.** Logo no carregamento, a aplicação consome
o arquivo GeoJSON oficial de solos do IBGE (aproximadamente 12 MB e cerca de
2.959 polígonos) e renderiza todos os polígonos sobre o mapa, cada um
pintado com uma cor associada à sua classe pedológica. As cores foram
escolhidas para refletir, dentro do possível, a coloração real do solo:
tons avermelhados para Latossolos Vermelhos, amarelados para Argissolos
Amarelos, azulados para Gleissolos, e assim por diante. Essa convenção
visual ajuda o usuário a construir uma associação rápida entre cor e tipo
de solo.

**Filtragem por classe.** Sobre o mapa, um painel de filtros — acionado
no cabeçalho — permite ao usuário ligar e desligar a exibição de cada
classe de solo individualmente. O painel mostra apenas as classes que
realmente aparecem no GeoJSON carregado, junto com a contagem de polígonos
de cada classe, evitando opções vazias e oferecendo uma noção da
diversidade de solos representada. Há também um campo de busca textual
que filtra a lista por nome ou código (ignorando acentos e diferenças de
maiúsculas/minúsculas), além de atalhos para selecionar todas as classes
ou limpar a seleção. A filtragem é instantânea: ao alternar uma classe,
os polígonos correspondentes aparecem ou desaparecem em tempo real, sem
recarregar a página.

**Detalhamento por clique.** Quando o usuário clica em qualquer polígono,
um *popup* surge na coordenada do clique exibindo as informações
detalhadas daquela região: a classe de solo identificada, o componente
pedológico, a textura e o código de legenda original do IBGE. Esse
detalhamento permite que o usuário transite naturalmente entre a visão
panorâmica (o mapa colorido como um todo) e a visão pontual (os atributos
de uma região específica).

**Camada de projetos ativos.** A aplicação também suporta a sobreposição
de uma camada adicional de *pins* sobre o mapa, representando projetos
em execução vinculados aos solos. Cada projeto é descrito por coordenadas,
título, descrição, link para mais informações e uma foto, abrindo
caminho para que a aplicação seja utilizada não só como ferramenta
de consulta, mas também como vitrine de trabalhos em andamento.

**Legenda persistente.** No canto inferior do mapa, uma legenda lista
todas as classes de solo com suas respectivas cores. Como ela é construída
a partir do mesmo catálogo que pinta os polígonos, a consistência entre
mapa e legenda fica garantida automaticamente — não há risco de a
legenda divergir das cores efetivamente exibidas.

**Guia de classes para download.** Por fim, um botão flutuante permite
baixar um guia explicativo (em HTML) das classes de solo do SiBCS,
oferecendo material de apoio para quem deseja entender o significado
de cada classe identificada no mapa.


## 3. Tecnologias usadas e estrutura do projeto

### 3.1 Tecnologias

A escolha das tecnologias seguiu três critérios principais: maturidade
da ferramenta, custo zero (todas as bibliotecas e serviços usados são
gratuitos e abertos) e adequação à natureza interativa da aplicação.

**React** é a biblioteca JavaScript que estrutura a interface. Ela trabalha
com o conceito de *componentes* — blocos reutilizáveis de interface — e
foi escolhida pela sua larga adoção no mercado, ampla comunidade e por
facilitar a construção de telas que reagem dinamicamente às interações do
usuário, como é o caso dos filtros de classe.

**TypeScript** é a linguagem usada em todo o código-fonte. Trata-se de uma
extensão do JavaScript que adiciona tipagem estática, o que significa que
declaramos antecipadamente o formato dos dados (por exemplo: o campo
`COD_SIMBOL` de uma feature do GeoJSON deve ser uma *string* ou *null*).
Essa rigidez extra previne uma classe inteira de erros — campos digitados
errado, valores inesperados — antes mesmo de o código rodar.

**MapLibre GL** é a biblioteca responsável por desenhar o mapa em si.
É um *fork* aberto do antigo Mapbox GL e renderiza tiles vetoriais
diretamente na GPU do navegador, alcançando alta performance mesmo com
milhares de polígonos simultâneos. Por ser totalmente gratuita e não
exigir chave de API paga, foi a escolha natural para um projeto
acadêmico.

**react-map-gl** é a ponte entre o React e o MapLibre. Sem ela, o código
precisaria manipular o mapa de forma imperativa (chamando métodos passo
a passo); com ela, o mapa, as camadas e os popups são declarados como
componentes React, o que mantém o estilo do código coerente com o
restante da aplicação.

**OpenFreeMap** é o servidor público de tiles vetoriais que fornece o
mapa-base. Ele oferece, gratuitamente e sem necessidade de cadastro,
estilos de mapa abertos baseados nos dados do OpenStreetMap.

**Vite** é a ferramenta de *build* — responsável por transformar o código
TypeScript em arquivos que o navegador entende. Foi escolhido pela sua
velocidade: o servidor de desenvolvimento sobe em milissegundos e
recarrega a tela automaticamente conforme o código é editado.

**npm workspaces** é o recurso do npm que permite organizar o projeto
como **monorepo** — um único repositório contendo dois pacotes
interligados. É o que faz a biblioteca de mapa enxergar como
"instalada" dentro do app de teste, sem precisar publicá-la em um
registro externo.


### 3.2 Estrutura do projeto

O código está organizado como um monorepo dividido em dois pacotes
independentes. A separação foi proposital: a biblioteca de mapa é
desenvolvida como se fosse um pacote publicável de forma autônoma, e o
app de teste a consome exatamente como qualquer outro projeto a
consumiria no futuro. Essa restrição força a biblioteca a ter uma
interface pública limpa.

```
maps-project/
├── package.json              → manifesto raiz com a config de workspaces
├── eslint.config.js          → regras de lint compartilhadas
└── packages/
    ├── map-manager/          → biblioteca: o componente de mapa
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── src/
    │       ├── index.ts          → superfície pública (exports do pacote)
    │       ├── MapView.tsx       → componente React principal
    │       ├── soilClasses.ts    → catálogo SiBCS e funções utilitárias
    │       ├── types.ts          → tipos TypeScript do GeoJSON e projetos
    │       └── map-manager.css   → estilos do mapa, popup e legenda
    └── test-app/             → aplicação que consome a biblioteca
        ├── package.json
        ├── vite.config.js
        ├── index.html
        ├── public/
        │   ├── solos.geojson     → dados geográficos do IBGE (~12 MB)
        │   ├── projetos.json     → projetos ativos exibidos como pins
        │   └── guia-solos.html   → guia das classes para download
        └── src/
            ├── main.tsx          → ponto de entrada do React
            ├── App.tsx           → componente raiz da aplicação
            ├── index.css         → estilos do app (header, filtros, etc.)
            └── components/
                └── SoilFilter.tsx → painel de filtros por classe
```

**O pacote `map-manager`** é a peça central do trabalho. Ele exporta um
componente React chamado `MapView`, que aceita como propriedades a
coleção GeoJSON de solos, o conjunto de classes atualmente visíveis,
opcionalmente uma lista de projetos a serem plotados como pins e uma
URL para o guia das classes. Internamente, o `MapView` monta três
camadas sobrepostas: o **mapa-base** (consumido do OpenFreeMap), a
**camada de polígonos** (os solos pintados a partir de uma expressão
do próprio MapLibre, comparando o campo `soilClass` de cada feature com
o catálogo de classes) e a **camada de interação** (que captura cliques
e exibe o popup). Junto com o componente, a biblioteca exporta o
catálogo `SOIL_CLASSES` — uma lista fixa de 37 classes do SiBCS, cada
uma com código, nome e cor — e duas funções utilitárias: uma para
classificar o código bruto do IBGE em uma das classes do catálogo
(`classifyCodSimbol`), e outra para recuperar o registro completo a
partir de um código já normalizado (`getSoilClass`).

**O pacote `test-app`** é uma aplicação Vite tradicional cujo papel,
dentro do TCC, é provar que a biblioteca funciona e oferecer uma
interface real para demonstrá-la. Seu componente principal, `App`,
consome a API `https://soils-bff.vercel.app/soils`, converte a resposta
para o formato GeoJSON esperado pelo mapa, anota cada feature com o
código de classe correspondente, mantém o estado dos filtros ativos e
compõe a tela com o cabeçalho, o painel de filtros e o `MapView` da
biblioteca. Em paralelo, faz outro *fetch* para `projetos.json` e
repassa a lista de projetos ativos ao mapa. Note que o `App` **não
conhece detalhes de renderização do mapa** — ele apenas fornece os
dados e os filtros, e o `MapView` cuida do resto.

**Fluxo de dados.** Para fechar a imagem, vale rastrear o caminho que
um polígono percorre, da API até o pixel: (1) o `App` faz *fetch* em
`https://soils-bff.vercel.app/soils`; (2) a resposta vem em um formato
próprio, com metadados e geometria por item; (3) o código converte cada
registro para uma *feature* GeoJSON e acrescenta o campo extra
`soilClass` com o código normalizado do catálogo; (4) o objeto inteiro
vai para o estado do React e é passado como prop para o `MapView`; (5)
o MapLibre desenha cada polígono, escolhendo cor e visibilidade por
meio de expressões nativas — o que mantém a performance fluida mesmo
com milhares de polígonos; (6) ao clicar, o react-map-gl entrega a
feature clicada e o popup é renderizado por cima do mapa.


### 3.3 Decisões arquiteturais

Algumas escolhas tomadas ao longo do desenvolvimento merecem registro:

- **Separar biblioteca e app.** Mesmo que o app de teste seja, hoje, o
  único consumidor da biblioteca, mantê-los em pacotes separados nos
  obrigou a desenhar uma interface pública limpa — coisa que tende a se
  diluir quando tudo vive em uma única pasta.
- **Filtrar dentro do MapLibre, não no React.** Quando o usuário marca
  ou desmarca uma classe, não geramos um novo array de features. Em vez
  disso, atualizamos uma expressão de filtro do MapLibre. Isso evita
  recriar elementos React e mantém a interface fluida.
- **Anotar o `soilClass` no carregamento.** A classificação do código
  bruto do IBGE é feita **uma única vez** ao receber o GeoJSON. O
  resultado vive na própria feature, pronto para ser lido pelo
  MapLibre nas renderizações seguintes.
- **Catálogo como única fonte de verdade.** Cores, rótulos e códigos
  das classes ficam todos em `soilClasses.ts`. Legenda, filtros, popup
  e pintor de polígonos lêem todos do mesmo lugar.
- **Dados externos já no app.** Os solos passaram a ser consumidos da
  API `https://soils-bff.vercel.app/soils`, e o `App` é o único lugar
  que conhece essa origem. Isso mantém a biblioteca isolada da fonte de
  dados e facilita futuras trocas de endpoint sem afetar o restante do
  código.


## 4. Conclusão

A aplicação desenvolvida cumpre o objetivo proposto: tornar o mapeamento
oficial de solos do Brasil acessível diretamente em um navegador, com
interatividade suficiente para apoiar consultas tanto panorâmicas quanto
pontuais. Ao longo do desenvolvimento, três aprendizados se mostraram
particularmente relevantes.

O **primeiro** é o ganho que uma boa escolha de tecnologias gratuitas e
abertas (MapLibre, OpenFreeMap, React, Vite) traz para um projeto
acadêmico: foi possível construir uma aplicação cartográfica completa
sem qualquer custo de licença ou chave de API, e o conjunto se mostrou
robusto o bastante para lidar com um GeoJSON de tamanho considerável.

O **segundo** é o valor de tratar a visualização de solos como uma
biblioteca reutilizável, e não apenas como uma página fechada. A
separação entre o pacote `map-manager` e o pacote `test-app` exigiu
disciplina extra durante o desenvolvimento, mas em troca produziu um
componente que pode ser incorporado em qualquer outra aplicação que
precise do mesmo recurso — abrindo caminho para extensões futuras,
como integrações com sistemas institucionais ou com plataformas de
divulgação científica.

O **terceiro** é a importância de delegar trabalho computacional pesado
para a camada certa. Filtrar e colorir polígonos por meio das próprias
expressões nativas do MapLibre — em vez de recalculá-los no React a cada
interação — foi o que permitiu manter a interface fluida com milhares
de polígonos simultâneos. Decisões dessa natureza não aparecem na
interface final, mas são determinantes para a experiência do usuário.

Como **trabalho futuro**, dois caminhos se destacam. O primeiro é
substituir também os projetos estáticos por uma API REST que sirva os
pins a partir de um banco de dados. Como a arquitetura foi planejada
para essa transição desde o início, a mudança envolveria apenas o
`App.tsx`, sem impacto no restante do código. O segundo é o
enriquecimento dos atributos exibidos no popup — incluindo, por exemplo,
informações de aptidão agrícola, riscos de erosão ou histórico de uso —
o que aumentaria o valor da ferramenta para públicos especializados.

Em síntese, o projeto mostra que é viável construir, com tecnologias
abertas e em um escopo de TCC, uma ferramenta de visualização de dados
geográficos que combine usabilidade, performance e capacidade de
extensão futura.
