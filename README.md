
# Desafio Geopixel: Aplicação de Previsão do Tempo

## Visão Geral

A aplicação exibe a previsão do tempo de uma cidade específica em um mapa interativo. Utiliza as seguintes tecnologias:
- **OpenWeather API**: Para obter coordenadas geográficas (latitude e longitude) a partir do nome da cidade.
- **HG Weather API**: Para consultas de previsão do tempo.
- **OpenLayers**: Para exibição do mapa interativo.
- **Cypress**: Para testes end-to-end.

O código foi escrito em TypeScript, com gerenciamento de estados para facilitar o acesso aos dados entre componentes, utilizando o fetch para requisições.

## Funcionalidades

### 1. **Input de Cidade**
- **Campo**: Permite ao usuário digitar o nome da cidade.
- **Botão Consultar**: Realiza a consulta nas APIs e exibe as informações no mapa e na área de consulta.
- **Select de Cidades**: Exibe cidades consultadas. Selecionar uma cidade utiliza as informações cacheadas para atualizar a previsão e o mapa.

### 2. **Exibição no Mapa (OpenLayers)**
- O mapa centraliza a cidade encontrada.

### 3. **Informações da Previsão do Tempo**
- **Dados do Dia Atual**:
  - Nome da cidade.
  - Data da consulta.
  - Temperaturas (atual, máxima, mínima).
  - Tipo do clima atual + ícone.
  - Probabilidade de chuva.
  - Fase da Lua + ícone.
  
- **Previsão dos Próximos 3 Dias**:
  - Data da previsão.
  - Temperaturas (máxima, mínima).
  - Tipo do clima previsto + ícone.
  - Probabilidade de chuva.

### 4. **Cache de Cidades Consultadas**
- As cidades consultadas são armazenadas localmente usando o localStorage do navegador.

## Fluxo de Funcionamento

1. O usuário insere o nome da cidade e clica em "Consultar".
2. A aplicação faz duas chamadas às APIs:
   - Uma para realizar a busca das coordenadas geográficas da cidade a partir do nome.
   - Outra para obter a previsão do tempo.
3. **Se ambas as consultas tiverem sucesso**:
   - As informações meteorológicas e geográficas são exibidas com ícones correspondentes ao clima e à fase da Lua..
   - O mapa é centralizado na cidade.
4. **Se uma das consultas falhar**:
   - Uma mensagem de erro informa que não foi possível encontrar as informações.

## Utilização

Para usar a aplicação, crie um arquivo `.env` na raiz da aplicação e insira a chave da API do OpenWeather no mesmo:

```bash
VITE_OPENWEATHERMAP_API_KEY=db0255caaf89a03739d07ad489a86a51
```

Realize a instalação das dependências da aplicação

```bash
npm install
```

Em seguida, execute o comando para inicializar a aplicação:

```bash
npm run dev
```

## Testes

Para realizar os testes, a aplicação deve estar inicializada:

```bash
npm run dev
```

Em outro terminal, execute o comando para iniciar os testes:

```bash
npm run cy:open
```
