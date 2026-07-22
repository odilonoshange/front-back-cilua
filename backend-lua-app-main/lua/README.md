# 🎬 LUA (Luanda Audiovisual) — Backend API 🎭

> **Repositório:** `backend-lua-app`
> **Versão:** 1.0.0 (MVP)

API RESTful desenvolvida para a **LUA**, uma plataforma dedicada à Exibição e Divulgação de Conteúdos Cinematográficos e Teatrais Angolanos, com foco na Província de Luanda. Este projeto foi desenvolvido como requisito para a cadeira de Projeto Bacharelato (3º Ano de Engenharia Informática/Computação).

---

## ⚙️ Tecnologias Utilizadas

O ecossistema do servidor foi construído utilizando as melhores práticas do mercado para aplicações corporativas:

*   **Linguagem:** Java (JDK 21)
*   **Framework Principal:** Spring Boot 4.0.3
*   **Segurança:** Spring Security + JWT (JSON Web Tokens)
*   **Persistência de Dados:** Spring Data JPA / Hibernate
*   **Base de Dados:** MySQL
*   **Integração de Mídia:** Cloudinary (Armazenamento de Cartazes e Vídeos gerido via Front-end, com persistência de URLs no Backend)

---

## 🏛️ Arquitetura e Padrões de Projeto

Para garantir a entrega do MVP num prazo de 1 mês, a equipa de Backend adotou as seguintes decisões arquiteturais:

1.  **Single Table Strategy:** Filmes e Peças de Teatro partilham a mesma entidade `Conteudo` na base de dados, diferenciados pela coluna `tipoConteudo`. Isto otimiza a performance da pesquisa global (RF04) e simplifica os relacionamentos.
2.  **Padrão DTO (Data Transfer Object):** Utilização de *Records* do Java para separar as Entidades da Base de Dados dos dados expostos na API, prevenindo ataques de *Mass Assignment* e formatando a resposta JSON de forma limpa.
3.  **Filtragem de Nulos:** Implementação de `@JsonInclude(JsonInclude.Include.NON_NULL)` para garantir contratos de API elegantes, ocultando campos irrelevantes dependendo do tipo de obra (ex: ocultar `dataEvento` quando a obra for um Filme).
4.  **Fluxo de Publicação Híbrido:** A API suporta a criação inicial da obra apenas com o cartaz (Catálogo/Divulgação) e disponibiliza um endpoint de atualização (`PATCH`) para o upload posterior do vídeo (Streaming) após a realização do evento.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
*   Java Development Kit (JDK) 21.
*   Servidor MySQL a correr localmente (porta 3306).
*   Maven instalado.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/backend-lua-app.git
   cd backend-lua-app
