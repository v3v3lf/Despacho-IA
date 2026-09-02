# Despacho IA — Despacho Automático BO (SISP)

## Como Instalar

1. Abra o Chrome e acesse: `chrome://extensions/`
2. Ative o **Modo do desenvolvedor** (canto superior direito)
3. Clique em **"Carregar sem compactação"**
4. Selecione a pasta **`Despacho IA`**
5. A extensão aparecerá com o ícone verde "BO" na barra do Chrome

## Como Usar

### Configurar Multiprovedor de IA para Análise do BO
1. Clique no ícone da extensão para abrir o painel
2. Clique em **"⚙ REGRAS"** na seção **"🤖 Multiprovedor de IA"**
3. Escolha seu provedor favorito entre os 8 suportados:
   - **Google Gemini** (com suporte a Busca no Google / Grounding) — [Obter chave](https://aistudio.google.com/apikey)
   - **OpenAI** (GPT-4o, GPT-4o-mini, o3-mini, o1) — [Obter chave](https://platform.openai.com/api-keys)
   - **Anthropic Claude** (Claude 3.7 Sonnet, 3.5 Sonnet, Haiku) — [Obter chave](https://console.anthropic.com/settings/keys)
   - **Groq** (LPUs Ultrarrápidas ~800 t/s) — [Obter chave](https://console.groq.com/keys)
   - **OpenRouter** (Hub Agregador com auto-roteamento) — [Obter chave](https://openrouter.ai/keys)
   - **Mistral AI** (Mistral Large, Small, Codestral) — [Obter chave](https://console.mistral.ai/api-keys/)
   - **Cohere** (Linha Command-R para RAG e síntese) — [Obter chave](https://dashboard.cohere.com/api-keys)
   - **Cerebras** (Velocidade Extrema ~1500 tokens/s) — [Obter chave](https://cloud.cerebras.ai/)
4. Clique no link direto *"Obter chave no [Provedor] ↗"* para gerar sua API Key em 1 clique
5. Cole a chave, selecione o modelo desejado e clique em **"💾 Salvar Configurações da IA"**
6. Ao acionar o passo **③ Analisar**, a extensão gera e exibe uma análise resumida do BO em parágrafo único estruturado.

### Configurar Regras de Destinatários
1. Clique no ícone da extensão para abrir o popup
2. Na seção **"Regras de Destinatários"**, clique em **"+ Adicionar Regra"**
3. Selecione o tipo de fato (ex: Furto, Estelionato, etc.)
4. Digite o nome completo do policial destinatário (ex: `nome`)
5. As regras são salvas automaticamente

### Processar um BO Manualmente
1. Navegue até o BO no SISP
2. Clique no ícone da extensão
3. Clique em **"Processar BO Atual"**
4. A extensão irá automaticamente:
   - Analisar o conteúdo do BO
   - Identificar o tipo (Furto, Estelionato, etc.)
   - Inserir o despacho correto
   - Selecionar o destinatário configurado
   - Salvar e marcar como resolvido

### Modo Automático
- Clique em **"Modo Automático: OFF"** para ativar
- Quando ativo, a extensão processará BOs automaticamente ao navegar pela lista

## Fluxo Automatizado

| Passo | Ação |
|-------|------|
| 1 | Clica em "Recebidos de outra unidade" → primeira linha |
| 2 | Abre o BO (ícone de três barras) |
| 3 | Analisa o conteúdo do BO |
| 4 | Insere o despacho correto |
| 5 | Clica em "Incluir destinatário" |
| 6 | Seleciona o policial configurado |
| 7 | Clica em "Salvar" |
| 8 | Clica em "Marcar como resolvido" |

## Tipos de Despacho Automático

- **Decidir posteriormente** → Aguarda manifestação da vítima
- **(investigação) Furto** → Verificação preliminar das informações
- **(Estelionato)** → Contato com vítima + representação
- **(Queixa)** → Calúnia/Difamação/Injúria/Dano
- **(JEC-incondicionada)** → Contato com autor
- **(JEC-condicionada)** → Ameaça/Perseguição etc.
- **(Oitivas preliminares)** → Apropriação indébita/Racismo etc.

## Observações

- A extensão funciona exclusivamente nos domínios `sisp.ciasc.sc.gov.br` e `backend.ssp.sc.gov.br`
- As regras de destinatários são salvas localmente no Chrome
- O log de atividades fica visível no popup da extensão
- Em caso de falha na detecção automática, o log indicará intervenção manual
