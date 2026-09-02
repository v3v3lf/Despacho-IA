/**
 * MarkItDown Cleaner & Sanitizer
 * Módulo especializado em normalização e estruturação semântica de dados policiais do SISP.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MarkItDownCleaner = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class MarkItDownCleaner {
    /**
     * Sanitiza e reestrutura o Markdown do Boletim de Ocorrência
     * @param {string} rawMarkdown Markdown bruto gerado pela engine
     * @param {object} metadata Metadados capturados do BO
     * @returns {string} Markdown sanitizado e formatado para o LLM
     */
    static sanitize(rawMarkdown, metadata = {}) {
      if (!rawMarkdown) return '';

      let text = rawMarkdown;

      // 1. Limpeza de ruídos residuais do SISP
      text = this.cleanSispNoise(text);

      // 2. Normalização de espaçamentos e quebras de linha
      text = this.normalizeSpacing(text);

      // 3. Estruturação e demarcação de seções policiais
      text = this.structureSections(text);

      // 4. Injeção de Frontmatter / Cabeçalho de Metadados
      const frontmatter = this.buildFrontmatter(metadata);

      return (frontmatter + text).trim();
    }

    /**
     * Remove ruídos conhecidos da interface do SISP
     */
    static cleanSispNoise(text) {
      let cleaned = text;

      const noisePatterns = [
        /Aguardando\s+leitura/gi,
        /Clique\s+aqui\s+para\s+imprimir/gi,
        /Carregando\s+dados\.\.\./gi,
        /Versão\s+do\s+Sistema:\s*[\d\.]+/gi,
        /Todos\s+os\s+direitos\s+reservados/gi,
        /Imprimir\s+BO|Salvar\s+PDF|Voltar/gi,
        /SISP\s*-\s*Sistema\s+Integrado\s+de\s+Segurança\s+Pública/gi,
        /Administra[çc][ãa]o\s+de\s+Despachos/gi,
        /Registros\s+desta\s+unidade/gi,
        /Recebidos\s+de\s+outras\s+unidades/gi,
        /Visualizar\s+impress[ãa]o/gi,
        /Exportar\s+(?:para\s+)?Excel|Exportar\s+PDF/gi,
        /Filtrar\s+por\s+unidade|Buscar\s+registro/gi
      ];

      noisePatterns.forEach(pattern => {
        cleaned = cleaned.replace(pattern, '');
      });

      return cleaned;
    }

    /**
     * Normaliza quebras de linha, barras de tabela e espaços
     */
    static normalizeSpacing(text) {
      return text
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, '  ')
        .replace(/[ \u00A0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/g, ' ')
        .replace(/\n\s+\n/g, '\n\n')
        .replace(/\n{3,}/g, '\n\n')
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n');
    }

    /**
     * Organiza blocos e seções essenciais do BO
     */
    static structureSections(text) {
      let structured = text;

      // Realce para Título Principal se encontrar padrão de BO
      structured = structured.replace(
        /(?:boletim\s+de\s+ocorr[êe]ncia|b\.?o\.?)\s*(?:n[º°o]?\s*)?(\d+[\/\-]\d{4})/i,
        '\n# BOLETIM DE OCORRÊNCIA Nº $1\n'
      );

      // Tratamento específico e prioritário para o trecho entre "Relato Individual" e "Outras Informações"
      const relatoRegex = /(?:relato\s+individual|relato\s+individual\s*:)\s*([\s\S]*?)(?=(?:outras\s+informa[çc][õo]es|outras\s+informacoes|dados\s+do\s+relato|hist[óo]rico\s+de\s+altera[çc][õo]es|envolvidos\s+no\s+fato|dados\s+do\s+bo|classifica[çc][ãa]o|unidade\s+policial|\n##|\n#|$))/i;
      const relatoMatch = structured.match(relatoRegex);
      if (relatoMatch && relatoMatch[1] && relatoMatch[1].trim().length > 15) {
        const relatoConteudo = relatoMatch[1].trim();
        const blocoRelato = `\n\n## 4. RELATO INDIVIDUAL DOS FATOS (NARRATIVA PRINCIPAL)\n\n> **RELATO INDIVIDUAL INTEGRAL:**\n> ${relatoConteudo.replace(/\n+/g, '\n> ')}\n\n`;
        // Substitui a ocorrência para colocar a seção formatada
        structured = structured.replace(relatoMatch[0], blocoRelato);
      }

      // Padronização de títulos de seções comuns do SISP
      const sectionKeywords = [
        { regex: /(?:^|\n)#*\s*(dados\s+gerais|informa[çc][õo]es\s+do\s+registro)/i, title: '\n## 1. DADOS GERAIS DO REGISTRO\n' },
        { regex: /(?:^|\n)#*\s*(envolvidos(?:\s+no\s+fato)?|partes(?:\s+envolvidas)?|v[íi]tima[s]?|autor(?:es)?)/i, title: '\n## 2. PARTES ENVOLVIDAS\n' },
        { regex: /(?:^|\n)#*\s*(objetos|ve[íi]culos|bens(?:\s+apreendidos)?|transa[çc][õo]es|valores)/i, title: '\n## 3. OBJETOS, VALORES E TRANSAÇÕES\n' },
        { regex: /(?:^|\n)#*\s*(outras\s+informa[çc][õo]es|outras\s+informacoes)/i, title: '\n## 4.1. OUTRAS INFORMAÇÕES DO REGISTRO\n' },
        { regex: /(?:^|\n)#*\s*(hist[óo]rico(?:\s+dos\s+fatos)?|relato(?:\s+dos\s+fatos)?|narrativa)/i, title: '\n## 4. HISTÓRICO / RELATO DOS FATOS\n' },
        { regex: /(?:^|\n)#*\s*(despachos|andamentos|encaminhamentos|hist[óo]rico\s+do\s+bo)/i, title: '\n## 5. HISTÓRICO DE DESPACHOS E ANDAMENTOS\n' }
      ];

      sectionKeywords.forEach(sec => {
        structured = structured.replace(sec.regex, sec.title);
      });

      return structured;
    }

    /**
     * Constrói cabeçalho YAML/Frontmatter estruturado
     */
    static buildFrontmatter(metadata = {}) {
      const boNumber = metadata.boNumber || 'N/D';
      const fato = metadata.fato || 'A definir';
      const timestamp = new Date().toISOString();

      return `---
sistema: "SISP"
tipo_documento: "Boletim de Ocorrência"
numero_bo: "${boNumber}"
fato_principal: "${fato}"
timestamp_conversao: "${timestamp}"
conversor: "MarkItDown-Despacho-v1"
---

`;
    }

    /**
     * Estima tokens e economia percentual
     * Média de ~3.8 caracteres por token em textos em português com markdown
     */
    static computeTokenStats(originalRawText, generatedMarkdown) {
      const origChars = (originalRawText || '').length;
      const mdChars = (generatedMarkdown || '').length;

      const origTokens = Math.ceil(origChars / 3.8);
      const mdTokens = Math.ceil(mdChars / 3.8);

      const diffChars = origChars - mdChars;
      const savedPercent = origChars > 0 ? Math.max(0, Math.round((diffChars / origChars) * 100)) : 0;

      return {
        originalChars: origChars,
        markdownChars: mdChars,
        originalTokens: origTokens,
        markdownTokens: mdTokens,
        savedTokens: Math.max(0, origTokens - mdTokens),
        savedPercent: savedPercent
      };
    }
  }

  return MarkItDownCleaner;
}));
