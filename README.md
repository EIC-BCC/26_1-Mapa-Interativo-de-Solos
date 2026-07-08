# Mapa Interativo de Tipos de Solo

**Autores:** Julie dos Santos Moura e Gabriel Renato Oliveira Camargo
**Semestre de Defesa:** 2025-2
[PDF do TCC](docs/tcc.pdf)

---

## TL;DR

Aplicação web que exibe o mapa oficial de solos do Brasil (IBGE, escala
1:5.000.000, classificação SiBCS 5ª ed.) direto no navegador, sem necessidade
de software de SIG. É composta por duas frentes: um frontend (React + MapLibre
GL) que renderiza, filtra e detalha os polígonos, e uma camada de dados própria
(uma API de interoperabilidade em Express que consome uma fonte de solos em
json-server e entrega ao frontend um contrato padronizado de `data` +
`metadata`).

Para subir o backend (API de interoperabilidade + fonte de dados) via Docker:

```
$ docker compose up --build
```

O frontend roda à parte, em seu próprio repositório:

```
$ npm install && npm run dev
```

Em produção: API em `https://soils-bff.vercel.app/soils` e fonte de dados em
`https://mock-soils.vercel.app`.


## 1. Introdução

O conhecimento sobre os tipos de solo é um insumo fundamental para diversas
áreas — agricultura, planejamento urbano, gestão ambiental, engenharia civil
e estudos acadêmicos sobre o território brasileiro. O Brasil dispõe de um
mapeamento pedológico oficial, mantido pelo IBGE e estruturado segundo o
**Sistema Brasileiro de Classificação de Solos (SiBCS)**, que reúne dezenas
de classes distintas distribuídas em milhares de polígonos espalhados pelo
país. A versão adotada como referência neste trabalho é a 5ª edição do
sistema, publicada pela Embrapa em 2018. Apesar da riqueza desses dados, eles
costumam ser distribuídos em
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

A solução, contudo, não se resume à interface. Entre o dado oficial e a tela
existe uma **camada de interoperabilidade** — uma API própria que lê a base
geoespacial do IBGE, valida e padroniza cada registro e o entrega ao frontend
em um formato estável e simples de consumir. É essa camada que isola a
complexidade do dado geográfico do restante da aplicação: o frontend nunca
precisa saber que a origem é um *shapefile* ou um GeoJSON, apenas consome um
contrato de resposta uniforme. Dessa forma, o sistema se divide em duas
frentes complementares — a **camada de visualização** (a biblioteca de mapa e
o app que a consome) e a **camada de dados** (a API de interoperabilidade e a
fonte que a alimenta).

O documento descreve o produto desenvolvido, as tecnologias adotadas para
sua construção, a estrutura do código que dá suporte à aplicação e as
conclusões obtidas com o desenvolvimento.


## 2. Texto principal

A aplicação tem como objetivo central permitir que qualquer pessoa visualize,
de forma intuitiva, a distribuição dos tipos de solo no território brasileiro.
Para isso, a interface foi pensada em três níveis de interação que se
sobrepõem sobre um mapa-base do Brasil. A Figura 1 apresenta a tela principal
da aplicação em funcionamento.

![Figura 1: Tela principal da aplicação, com o mapa de solos do Brasil colorido por classe, o painel de filtros e a legenda.](figuras/tela-principal.png)

**Visualização dos polígonos.** Logo no carregamento, a aplicação consome
os dados de solo servidos pela API de interoperabilidade do projeto — que,
por sua vez, tem origem no arquivo GeoJSON oficial de solos do IBGE
(aproximadamente 12 MB e cerca de 2.959 polígonos) — e renderiza todos os
polígonos sobre o mapa, cada um pintado com uma cor associada à sua classe
pedológica. As cores foram escolhidas para refletir, dentro do possível, a
coloração real do solo: tons avermelhados para Latossolos Vermelhos,
amarelados para Argissolos Amarelos, azulados para Gleissolos, e assim por
diante. Essa convenção visual ajuda o usuário a construir uma associação
rápida entre cor e tipo de solo.

**Filtragem por classe.** Sobre o mapa, um painel de filtros — acionado
no cabeçalho — permite ao usuário ligar e desligar a exibição de cada
classe de solo individualmente. O painel mostra apenas as classes que
realmente aparecem nos dados carregados, junto com a contagem de polígonos
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

**TypeScript** é a linguagem usada em todo o código-fonte, tanto no frontend
quanto na API. Trata-se de uma extensão do JavaScript que adiciona tipagem
estática, o que significa que declaramos antecipadamente o formato dos dados
(por exemplo: o campo `COD_SIMBOL` de uma feature do GeoJSON deve ser uma
*string* ou *null*). Essa rigidez extra previne uma classe inteira de erros —
campos digitados errado, valores inesperados — antes mesmo de o código rodar,
e no backend ela tipa toda a cadeia de tratamento do dado, do parâmetro de
entrada ao contrato de resposta.

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

**npm workspaces** é o recurso do npm que permite organizar o frontend
como **monorepo** — um único repositório contendo dois pacotes
interligados. É o que faz a biblioteca de mapa enxergar como
"instalada" dentro do app de teste, sem precisar publicá-la em um
registro externo.

Do lado do servidor, a camada de dados apoia-se em um conjunto próprio
de tecnologias, todas igualmente abertas e gratuitas.

**Express 5** é o framework que estrutura a API de interoperabilidade.
Minimalista e amplamente adotado no ecossistema Node.js, ele organiza a
aplicação em rotas e *middlewares*, o que se encaixa naturalmente na
separação em camadas adotada pela API (rotas, controllers e serviços).

**json-server** é a biblioteca usada para expor a fonte de dados de solos
como uma API REST de simulação. Em vez de utilizar a ferramenta pela sua
linha de comando, ela é empregada de forma **programática** (via
`jsonServer.router()`), o que permite embuti-la em um servidor próprio e,
com isso, torná-la compatível com ambientes de execução mais restritos,
como plataformas *serverless*.

**Turf.js** — especificamente o módulo `@turf/boolean-valid` — é a
biblioteca de análise geoespacial responsável por validar a geometria de
cada polígono antes de ele ser servido, descartando feições cuja geometria
seja inválida. Faz parte do monorepo oficial do Turf.js e é distribuída sob
licença aberta.

**Docker** é usado para padronizar o ambiente de desenvolvimento da camada
de dados, empacotando a API e a fonte de dados em contêineres orquestrados
por um único arquivo de composição. Isso garante que o backend rode de
maneira idêntica em qualquer máquina, independentemente das versões de
Node.js instaladas localmente.

**Vercel** é a plataforma de hospedagem escolhida para publicar a API e a
fonte de dados. Foi selecionada por oferecer um plano gratuito, sem
necessidade de cartão de crédito, adequado ao orçamento nulo de um trabalho
acadêmico.


### 3.2 Estrutura do projeto

O sistema se divide em dois repositórios de responsabilidades distintas: o
**frontend** — organizado como um monorepo que separa a biblioteca de mapa
do app que a consome — e a **camada de dados** — a API de interoperabilidade
e a fonte de solos que a alimenta. Essa separação em fronteiras bem definidas
foi proposital: cada parte pode evoluir de forma independente, desde que
respeite os contratos que as ligam. A Figura 2 resume essa organização em
camadas e o fluxo de uma requisição.

![Figura 2: Arquitetura do sistema, com a camada de visualização, a API de interoperabilidade e a fonte de dados, e o fluxo dos dados entre elas.](figuras/arquitetura.svg)

#### Frontend

O frontend está organizado como um monorepo dividido em dois pacotes
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
        │   ├── projetos.json     → projetos ativos exibidos como pins
        │   └── guia-solos.html   → guia das classes para download
        └── src/
            ├── main.tsx          → ponto de entrada do React
            ├── App.tsx           → componente raiz da aplicação
            ├── index.css         → estilos do app (header, filtros, etc.)
            └── components/
                └── SoilFilter.tsx → painel de filtros por classe
```

**O pacote `map-manager`** é a peça central da camada de visualização. Ele
exporta um componente React chamado `MapView`, que aceita como propriedades a
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

#### Camada de dados: API de interoperabilidade e fonte de solos

A camada de dados é o que permite ao frontend consumir o mapeamento oficial
sem lidar com o formato geoespacial bruto. Ela reside em um repositório
próprio, organizado em torno de dois serviços independentes que rodam lado a
lado: uma **fonte de dados** (o *mock* de solos) e a **API de
interoperabilidade** (o BFF, do inglês *Backend for Frontend*), que consome
essa fonte, trata os dados e os expõe ao frontend. Cada serviço tem seu
próprio manifesto e configuração de implantação (`vercel.json`), podendo ser
publicado de forma totalmente autônoma.

```
tcc/
├── docker-compose.yaml           → orquestra os dois serviços em contêineres
├── docker/                       → Dockerfiles de desenvolvimento
├── api/                          → API de interoperabilidade (BFF)
│   ├── api/                      → entrypoint serverless (execução na Vercel)
│   ├── src/                      → código-fonte da API
│   │   ├── index.ts              → inicialização do Express e warmup
│   │   ├── routes.ts             → definição das rotas da API
│   │   ├── settings.ts           → configurações e variáveis de ambiente
│   │   └── modules/
│   │       └── soil/
│   │           ├── soil_query.handler.ts        → controller: valida a query e aciona o serviço
│   │           ├── soil.service.ts              → busca, cache e orquestração do tratamento
│   │           ├── geojson_soil.normalizer.ts   → normaliza cada feature do GeoJSON
│   │           ├── soil.normalizer.ts           → normaliza a coleção e apura contadores
│   │           └── geometry.validator.ts        → validação de geometria (Turf.js)
│   ├── .env.example
│   ├── jest.config.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json
│   └── yarn.lock
└── mock/                         → fonte de dados (serviço independente)
    ├── api/                      → entrypoint serverless (execução na Vercel)
    ├── db.js                     → servidor json-server programático
    ├── db.json                   → base servida pelo json-server
    ├── solos.geojson             → base de solos do IBGE (~12 MB, ~2.959 polígonos)
    ├── package.json
    ├── vercel.json
    └── yarn.lock
```

**A fonte de dados (`mock`)** cumpre, dentro do trabalho, o papel de uma base
institucional de solos. Ela usa o json-server, de forma programática
(`db.js`), para servir o arquivo GeoJSON oficial do IBGE, derivado do Mapa de Solos do
Brasil na escala 1:5.000.000, como uma API REST publicada em
`https://mock-soils.vercel.app`. Estruturá-la como um serviço à
parte — com manifesto e configuração de implantação próprios — não é um mero
detalhe de implementação: ela simula justamente o cenário real em que os dados
viriam de uma fonte externa e independente, o que torna concreta a proposta de
desacoplamento. Trocar essa fonte por um banco de dados ou por um serviço
institucional não exigiria mudanças no frontend, apenas na API que a consome.

**A API de interoperabilidade (`api`)** é a peça central da camada de dados.
Ela é organizada em camadas bem delimitadas — **rotas → controllers →
serviços** —, e cada camada tem uma única responsabilidade. A rota expõe o
endpoint público; o controller (`soil_query.handler.ts`) recebe a requisição
e valida os parâmetros de filtro passados na *query string* (`soilType` e
`soilShape`); e o serviço (`soil.service.ts`) concentra a lógica de negócio:
buscar os dados, aplicar os filtros, normalizá-los e padronizá-los antes de
devolver a resposta. Toda essa cadeia é tipada com TypeScript, do parâmetro
de entrada ao modelo de resposta final, o que faz com que incompatibilidades
sejam detectadas em tempo de compilação, e não em produção.

Três mecanismos merecem destaque na API:

**Normalização.** Os dados brutos do IBGE não têm o formato ideal para o
frontend — os nomes de campo seguem a nomenclatura do *shapefile* original
(`COD_SIMBOL`, `DSC_COMPON`, `DSC_TEXTUR`, entre outros). Os *normalizers*
convertem cada feição para um modelo de domínio limpo e consistente: o
`geojson_soil.normalizer.ts` trata uma feature individual, e o
`soil.normalizer.ts` percorre a coleção inteira, apurando os contadores que
depois compõem os metadados da resposta. Dos nove campos originais da base,
foram selecionados os sete relevantes à identificação e classificação
pedológica, descartando-se atributos de controle interno do dado geoespacial
sem valor para a visualização.

**Validação de geometria.** Antes de servir um polígono, a API verifica se a
sua geometria é válida, por meio do `geometry.validator.ts`, que utiliza o
`@turf/boolean-valid`. Feições com geometria inválida são descartadas e
contabilizadas separadamente. Executada sobre a base real, a validação
confirmou que nenhum dos 2.959 polígonos apresenta geometria inválida. Cabe
registrar uma limitação conhecida: a biblioteca não detecta de forma
confiável polígonos com auto-interseção (o caso *bowtie*), o que foi
documentado como restrição do método em vez de ser tratado como garantia.

**Warmup e cache.** Ler e parsear a base geoespacial a cada requisição seria
inviável — geraria I/O e processamento repetidos, com impacto direto na
latência. Para evitar isso, a API adota duas estratégias complementares. O
**warmup** carrega e prepara os dados em memória na inicialização do processo,
antes de o servidor aceitar tráfego, de modo que a primeira requisição já
encontre tudo pronto. O **cache** reaproveita respostas de consultas
repetidas (mesmos filtros), o que é seguro porque a base de solo é
essencialmente estática — não há necessidade de uma política de invalidação
complexa.

**Contrato de resposta.** Independentemente da fonte por trás, toda resposta
da API segue o mesmo formato: um campo `data` (o array de registros de solo)
e um campo `metadata` (informações agregadas, como o total de feições, os
filtros aplicados e a contagem de polígonos descartados por geometria
inválida). É esse contrato uniforme que permite ao frontend consumir os dados
sem conhecer nada sobre a origem — a promessa central da camada de
interoperabilidade.

#### Fluxo de dados

Para fechar a imagem, vale rastrear o caminho completo que um polígono
percorre, da fonte até o pixel: (1) a **fonte de dados** (o mock) expõe o
GeoJSON oficial do IBGE como uma API REST; (2) a **API de interoperabilidade**
consome essa fonte, valida a geometria de cada feição, normaliza os atributos
para o modelo de domínio e mantém tudo pronto em memória (warmup) e em cache;
(3) diante de uma requisição, o controller valida os filtros da *query string*
e o serviço devolve a resposta no contrato padronizado (`data` + `metadata`);
(4) no navegador, o `App` faz *fetch* em `https://soils-bff.vercel.app/soils`
e converte cada registro para uma *feature* GeoJSON, acrescentando o campo
`soilClass` com o código normalizado do catálogo; (5) o objeto inteiro vai
para o estado do React e é passado como prop para o `MapView`; (6) o MapLibre
desenha cada polígono, escolhendo cor e visibilidade por meio de expressões
nativas — o que mantém a performance fluida mesmo com milhares de polígonos;
(7) ao clicar, o react-map-gl entrega a feature clicada e o popup é
renderizado por cima do mapa.


### 3.3 Decisões arquiteturais

Algumas escolhas tomadas ao longo do desenvolvimento merecem registro:

- **Separar biblioteca e app.** Mesmo que o app de teste seja, hoje, o
  único consumidor da biblioteca, mantê-los em pacotes separados nos
  obrigou a desenhar uma interface pública limpa — coisa que tende a se
  diluir quando tudo vive em uma única pasta.
- **Interpor uma camada de interoperabilidade.** O frontend nunca fala
  diretamente com a fonte de dados. Toda a complexidade do dado geoespacial
  — formato, nomenclatura de campos, validação de geometria — fica contida
  na API, e o frontend consome apenas um contrato limpo. Trocar a fonte de
  dados no futuro afeta somente a API, não a interface.
- **Simular a fonte de dados como serviço separado.** Manter o mock como um
  serviço à parte, e não como um arquivo lido diretamente pela API, torna o
  desacoplamento concreto: a arquitetura já está pronta para que essa fonte
  seja substituída por um banco de dados ou por um serviço institucional,
  sem reescrever a API que a consome.
- **Filtrar dentro do MapLibre, não no React.** Quando o usuário marca
  ou desmarca uma classe, não geramos um novo array de features. Em vez
  disso, atualizamos uma expressão de filtro do MapLibre. Isso evita
  recriar elementos React e mantém a interface fluida.
- **Anotar o `soilClass` no carregamento.** A classificação do código
  bruto do IBGE é feita **uma única vez** ao receber os dados. O
  resultado vive na própria feature, pronto para ser lido pelo
  MapLibre nas renderizações seguintes.
- **Preparar os dados uma vez, não a cada requisição.** No backend, o warmup
  e o cache garantem que a base pesada seja lida e tratada uma única vez, e
  não repetidamente a cada chamada — decisão análoga à de anotar o
  `soilClass` no carregamento, aplicada ao lado do servidor.
- **Catálogo como única fonte de verdade.** Cores, rótulos e códigos
  das classes ficam todos em `soilClasses.ts`. Legenda, filtros, popup
  e pintor de polígonos lêem todos do mesmo lugar.


### 3.4 Infraestrutura e implantação

A camada de dados foi pensada para rodar de forma idêntica em
desenvolvimento e em produção, apoiada em duas frentes de infraestrutura.

**Ambiente de desenvolvimento com Docker.** Localmente, a API e a fonte de
dados são executadas em contêineres orquestrados por um único arquivo
`docker-compose.yaml`, que se apoia nas imagens de desenvolvimento definidas
no diretório `docker/` — uma para a API de interoperabilidade e outra para o
mock. Subir todo o backend se resume a um único comando
(`docker compose up --build`), o que elimina divergências entre máquinas e
torna o ambiente reproduzível.

**Implantação em produção na Vercel.** Os dois serviços são publicados na
Vercel, em seu plano gratuito, de forma independente — cada um com seu próprio
`vercel.json` e seu próprio ciclo de implantação, o que reforça, também na
produção, o desacoplamento entre a API e a fonte de dados. A adaptação ao
modelo *serverless* da
plataforma impôs alguns ajustes, todos contornados durante o
desenvolvimento: o json-server precisou ser embrulhado programaticamente
(`jsonServer.router()`), já que sua linha de comando não é compatível com
funções *serverless*; a estrutura de diretórios da plataforma exigiu o uso de
caminhos relativos nos imports, em substituição a *aliases* de caminho que
não são resolvidos pelo empacotador da Vercel; e as variáveis de ambiente
foram revisadas para não duplicar segmentos de rota. Vale registrar uma
característica do modelo *serverless* que afeta o cache: como cada *cold
start* instancia um novo processo, o cache em memória não persiste entre
invocações distintas — o warmup volta a rodar a cada nova instância. A
estratégia continua válida para requisições atendidas por uma mesma instância
"quente", mas essa é uma diferença esperada em relação a um servidor de
longa duração.

**Testes automatizados.** A API conta com uma suíte de testes escrita em
Jest e Supertest, cobrindo tanto testes unitários (do validador de geometria
e dos normalizers) quanto de integração (cenários de sucesso e de erro sobre
os endpoints). Além de resguardar o comportamento esperado, a escrita dos
testes revelou e corrigiu um erro real, em que o controller lia parâmetros de
*query string* com nomes divergentes daqueles documentados.


## Execução

### Pré-requisitos

* Docker e Docker Compose (forma recomendada de subir o backend)
* Node.js com Yarn (para rodar o backend fora do Docker)
* Node.js com npm (para o frontend)

### Backend (API de interoperabilidade + fonte de dados)

Forma recomendada, na raiz do repositório do backend, subindo os dois serviços
em contêineres:

```
$ docker compose up --build
```

Para rodar em segundo plano, use `docker compose up --build -d`; para derrubar,
`docker compose down`.

Sem Docker, cada serviço pode ser executado de forma independente:

```
# fonte de dados
$ cd mock && yarn install && yarn dev

# API de interoperabilidade
$ cd api && yarn install && yarn dev
```

### Testes (API)

```
$ cd api && yarn test
```

### Frontend

Em seu próprio repositório:

```
$ npm install && npm run dev
```

### Produção

Ambos os serviços do backend têm deploy independente na Vercel: a API de
interoperabilidade em `https://soils-bff.vercel.app/soils` e a fonte de dados
em `https://mock-soils.vercel.app`.


## 4. Conclusão

A aplicação desenvolvida cumpre o objetivo proposto: tornar o mapeamento
oficial de solos do Brasil acessível diretamente em um navegador, com
interatividade suficiente para apoiar consultas tanto panorâmicas quanto
pontuais. Ao longo do desenvolvimento, quatro aprendizados se mostraram
particularmente relevantes.

O **primeiro** é o ganho que uma boa escolha de tecnologias gratuitas e
abertas (MapLibre, OpenFreeMap, React, Vite, Express, Docker) traz para um
projeto acadêmico: foi possível construir uma aplicação cartográfica completa,
com backend próprio e publicação em produção, sem qualquer custo de licença
ou chave de API, e o conjunto se mostrou robusto o bastante para lidar com um
GeoJSON de tamanho considerável.

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
de polígonos simultâneos. No backend, a mesma lógica aparece no warmup e no
cache, que evitam reprocessar a base pesada a cada requisição. Decisões
dessa natureza não aparecem na interface final, mas são determinantes para a
experiência do usuário.

O **quarto** é o benefício arquitetural de isolar a fonte de dados atrás de
uma camada de interoperabilidade. Ao concentrar na API todo o conhecimento
sobre o formato geoespacial — nomenclatura de campos, validação de geometria,
normalização — e expor ao frontend apenas um contrato estável (`data` +
`metadata`), o sistema ganhou uma fronteira clara: cada lado pode evoluir sem
quebrar o outro, e a origem dos dados pode ser trocada sem impacto na
interface. A disciplina de manter o mock como um serviço separado tornou essa
promessa concreta, e não apenas teórica.

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


## Referências

EMPRESA BRASILEIRA DE PESQUISA AGROPECUÁRIA (EMBRAPA). Sistema Brasileiro de
Classificação de Solos. 5. ed. rev. e ampl. Brasília: Embrapa, 2018.

INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE). Mapa de Solos do
Brasil, escala 1:5.000.000. Rio de Janeiro: IBGE. Disponível em:
https://www.ibge.gov.br/geociencias/informacoes-ambientais/pedologia.
Acesso em: jul. 2026.

MAPLIBRE. MapLibre GL JS. Disponível em: https://maplibre.org.
Acesso em: jul. 2026.

REACT. React. Disponível em: https://react.dev. Acesso em: jul. 2026.

VITE. Vite. Disponível em: https://vitejs.dev. Acesso em: jul. 2026.

EXPRESS. Express. Disponível em: https://expressjs.com. Acesso em: jul. 2026.

TURF.JS. Turf.js: advanced geospatial analysis. Disponível em:
https://turfjs.org. Acesso em: jul. 2026.

TYPICODE. json-server. Disponível em:
https://github.com/typicode/json-server. Acesso em: jul. 2026.

OPENFREEMAP. OpenFreeMap. Disponível em: https://openfreemap.org.
Acesso em: jul. 2026.

OPENSTREETMAP. OpenStreetMap. Disponível em:
https://www.openstreetmap.org. Acesso em: jul. 2026.
