# Stock Manager

O projeto Stock Manager visa gerenciar a entrada de produtos em um estoque físico, assim como controlar a data de vencimento desses produtos.

A ferramenta permite a criação de dados de produtos, a entrada destes em lotes, e controle de saída ou data de vencimento dos mesmos de um estoque físico.

## Instalação do sistema

O projeto necessita de um ambiente com o [Node](https://nodejs.org/en/download/package-manager) versão 20 instalado para seu funcionamento.

- Lembre-se de criar um arquivo `.env` seguindo o padrão do `.env.example` para o funcionamento correto da aplicação.
- A documentação das rotas do projeto podem ser encontradas na rota `/docs` quando o projeto estiver rodando tanto em desenvolvimento quanto em produção.

### Rodando localmente

Para rodar o sistema localmente, em modo de desenvolvimento, basta rodar os comandos:
- `npm run db:migrate` - Que fará a criação do banco de dados,
- `npm run dev` - Que iniciará o servidor local na porta 3001 (http://localhost:3001)

Caso haja a necessidade de ver os dados diretamente no banco de dados, o comando `npm run db:studio` rodará um servidor local do prisma para a verificação destes dados.

### Criando a build para Produção

Para rodar o projeto em produção, simplesmente rode o comando `npm start`, que já será feita a build e o início do servidor local.

# Dados de desenvolvimento

O projeto foi inicialmente desenvolvido como maneira de estudo, seguindo as necessidades de uma empresa fictícia que tinha necessidade de organizar seus produtos em estoque, sabendo quando os mesmos iriam sair da validade.

## Tecnologias

O projeto utilizou as seguintes tecnologias em seu desenvolvimento: [Prisma](https://www.prisma.io), [Fastify](https://fastify.dev), [Zod](https://zod.dev), [TypeScript](https://www.typescriptlang.org).

## Funcionalidades

- Cadastro de dados gerais de produtos.
- Cadastro de fornecedores, com dados de contato.
    - Cada fornecedor pode vender vários dos produtos cadastrados.
- Os produtos tem cadastrados valores para cada fornecedor que os vende, facilitando a escolha do melhor fornecedor para fazer o pedido.
- Entrada de produtos em lotes.
    - Lotes podem ter vários produtos.
    - Cada lote tem um fornecedor responsável.
    - Não pode ser cadastrado um lote futuro, apenas lotes entregues podem dar entrada no estoque.

## Planos futuros

- [ ] Sistema de autenticidade
    - [ ] Cadastro de usuários com níveis de permissão
    - [ ] Controle de atualizações ou exclusão de dados
- [ ] Escrita de Dockerfiles para facilitar o uso do sistema
- [ ] Escrita de testes para manter a qualidade do sistema em caso de atualizações futuras
