/**
 * MarkItDown Engine - Motor Autônomo de Conversão DOM/HTML para Markdown (.md)
 * Otimizado para sistemas policiais (SISP) e pré-processamento para LLMs.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MarkItDownEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * Converte um nó DOM ou string HTML em Markdown limpo e estruturado.
   */
  class MarkItDownEngine {
    constructor(options = {}) {
      this.options = Object.assign({
        headingStyle: 'atx', // '#'
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        strongDelimiter: '**',
        cleanBoilerplate: true,
        maxTableColumns: 16,
        removeHiddenElements: true,
        preserveLineBreaks: true
      }, options);
    }

    /**
     * Ponto de entrada principal
     * @param {HTMLElement|string|Document} input
     * @returns {string} Markdown gerado
     */
    convert(input) {
      if (!input) return '';

      let doc;
      if (typeof input === 'string') {
        if (typeof DOMParser !== 'undefined') {
          const parser = new DOMParser();
          doc = parser.parseFromString(input, 'text/html');
        } else {
          return this._convertPlainText(input);
        }
      } else if (input.nodeType === 9) { // Document
        doc = input;
      } else if (input.nodeType === 1) { // Element
        const clone = input.cloneNode(true);
        return this._convertNode(clone).trim();
      } else {
        return String(input);
      }

      if (!doc || !doc.body) return '';
      const bodyClone = doc.body.cloneNode(true);
      this._preProcessDOM(bodyClone);
      const markdown = this._convertNode(bodyClone);
      return this._postProcessMarkdown(markdown);
    }

    /**
     * Limpeza prévia da árvore DOM (remove ruídos, scripts, estilos e botões)
     */
    _preProcessDOM(rootNode) {
      if (!rootNode || !rootNode.querySelectorAll) return;

      // Elementos que devem ser completamente descartados
      const tagsToRemove = [
        'script', 'style', 'noscript', 'template', 'svg', 'canvas',
        'iframe', 'frame', 'applet', 'object', 'embed', 'mat-icon',
        'button', '.btn', '.mat-button', '.mat-icon-button',
        '.no-print', '.hidden-print', '[aria-hidden="true"]',
        'header.header-sistema', 'footer.footer-sistema', 'nav'
      ];

      tagsToRemove.forEach(selector => {
        try {
          const elements = rootNode.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        } catch (e) {}
      });

      if (this.options.removeHiddenElements) {
        try {
          const allEls = rootNode.querySelectorAll('*');
          allEls.forEach(el => {
            const style = el.getAttribute('style') || '';
            if (/display\s*:\s*none/i.test(style) || /visibility\s*:\s*hidden/i.test(style)) {
              el.remove();
            }
          });
        } catch (e) {}
      }
    }

    /**
     * Conversão recursiva de nós DOM
     */
    _convertNode(node) {
      if (!node) return '';

      // Nó de Texto
      if (node.nodeType === 3) {
        return this._escapeText(node.nodeValue);
      }

      // Nó de Comentário
      if (node.nodeType === 8) return '';

      // Não é um Elemento
      if (node.nodeType !== 1) return '';

      const tag = node.tagName.toLowerCase();

      // Tratamento especial de estruturas do SISP e formulários
      if (this._isKeyValueRow(node)) {
        return this._convertKeyValueRow(node);
      }

      switch (tag) {
        case 'h1':
          return '\n\n# ' + this._getChildrenText(node).trim() + '\n\n';
        case 'h2':
          return '\n\n## ' + this._getChildrenText(node).trim() + '\n\n';
        case 'h3':
          return '\n\n### ' + this._getChildrenText(node).trim() + '\n\n';
        case 'h4':
          return '\n\n#### ' + this._getChildrenText(node).trim() + '\n\n';
        case 'h5':
          return '\n\n##### ' + this._getChildrenText(node).trim() + '\n\n';
        case 'h6':
          return '\n\n###### ' + this._getChildrenText(node).trim() + '\n\n';

        case 'p':
        case 'div':
        case 'section':
        case 'article':
        case 'mat-expansion-panel':
        case 'mat-card':
          return '\n\n' + this._getChildrenMarkdown(node).trim() + '\n\n';

        case 'br':
          return '\n';

        case 'hr':
          return '\n\n---\n\n';

        case 'strong':
        case 'b': {
          const content = this._getChildrenMarkdown(node).trim();
          return content ? ` **${content}** ` : '';
        }

        case 'em':
        case 'i': {
          const content = this._getChildrenMarkdown(node).trim();
          return content ? ` *${content}* ` : '';
        }

        case 'code':
          return ' `' + node.textContent.replace(/`/g, '\\`') + '` ';

        case 'pre':
          return '\n\n```\n' + node.textContent.trim() + '\n```\n\n';

        case 'blockquote':
          return '\n\n> ' + this._getChildrenMarkdown(node).trim().replace(/\n/g, '\n> ') + '\n\n';

        case 'ul':
          return '\n\n' + this._convertList(node, false) + '\n\n';

        case 'ol':
          return '\n\n' + this._convertList(node, true) + '\n\n';

        case 'li':
          return this._getChildrenMarkdown(node).trim();

        case 'table':
          return '\n\n' + this._convertTable(node) + '\n\n';

        case 'a': {
          const text = this._getChildrenMarkdown(node).trim() || node.getAttribute('href') || '';
          const href = node.getAttribute('href');
          if (!href || href.startsWith('javascript:')) return text;
          return ` [${text}](${href}) `;
        }

        case 'input':
        case 'textarea':
        case 'select': {
          const val = (node.value || node.getAttribute('value') || '').trim();
          return val ? ` ${val} ` : '';
        }

        default:
          return this._getChildrenMarkdown(node);
      }
    }

    _getChildrenMarkdown(node) {
      let output = '';
      for (let i = 0; i < node.childNodes.length; i++) {
        output += this._convertNode(node.childNodes[i]);
      }
      return output;
    }

    _getChildrenText(node) {
      return (node.textContent || '').replace(/\s+/g, ' ');
    }

    /**
     * Detecta linhas de par Chave-Valor típicas de formulários do SISP
     */
    _isKeyValueRow(node) {
      if (!node || node.nodeType !== 1) return false;
      const classList = (node.className || '').toString();
      if (/row|campo|form-group|d-flex|grid/i.test(classList)) {
        const labels = node.querySelectorAll('label, .label, .rotulo, .titulo-campo, dt, strong');
        const values = node.querySelectorAll('.valor, .dado, .conteudo, dd, span, input, select');
        if (labels.length === 1 && values.length >= 1 && node.children.length <= 4) {
          const labelText = (labels[0].textContent || '').trim();
          return labelText.length > 1 && labelText.length < 50;
        }
      }
      return false;
    }

    _convertKeyValueRow(node) {
      const labelEl = node.querySelector('label, .label, .rotulo, .titulo-campo, dt, strong');
      if (!labelEl) return this._getChildrenMarkdown(node);

      const labelText = labelEl.textContent.replace(/[:\s]+$/, '').trim();
      const clone = node.cloneNode(true);
      const cloneLabel = clone.querySelector('label, .label, .rotulo, .titulo-campo, dt, strong');
      if (cloneLabel) cloneLabel.remove();

      let valueText = (clone.textContent || '').trim();
      valueText = valueText.replace(/\s+/g, ' ');

      if (labelText && valueText && valueText !== '-') {
        return `\n- **${labelText}:** ${valueText}`;
      }
      return this._getChildrenMarkdown(node);
    }

    /**
     * Converte listas ordenadas e não ordenadas
     */
    _convertList(listNode, isOrdered) {
      const items = [];
      const children = Array.from(listNode.children).filter(c => c.tagName && c.tagName.toLowerCase() === 'li');

      children.forEach((li, idx) => {
        const marker = isOrdered ? `${idx + 1}.` : this.options.bulletListMarker;
        const itemContent = this._convertNode(li).trim().replace(/\n+/g, ' ');
        if (itemContent) {
          items.push(`${marker} ${itemContent}`);
        }
      });

      return items.join('\n');
    }

    /**
     * Converte tabelas HTML em tabelas Markdown com alinhamento perfeito
     */
    _convertTable(tableNode) {
      const rows = [];
      const trElements = tableNode.querySelectorAll('tr');
      if (!trElements || trElements.length === 0) return '';

      let maxCols = 0;
      const matrix = [];

      trElements.forEach(tr => {
        const cells = Array.from(tr.querySelectorAll('th, td'));
        if (cells.length === 0) return;

        const rowValues = cells.map(cell => {
          let cellText = this._getChildrenMarkdown(cell).trim();
          // Remove quebras de linha duras dentro de células de tabela
          cellText = cellText.replace(/\n+/g, ' <br> ').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
          return cellText;
        });

        if (rowValues.some(val => val.length > 0)) {
          matrix.push(rowValues);
          if (rowValues.length > maxCols) {
            maxCols = rowValues.length;
          }
        }
      });

      if (matrix.length === 0 || maxCols === 0) return '';

      // Limitar número máximo de colunas para legibilidade
      maxCols = Math.min(maxCols, this.options.maxTableColumns);

      // Normaliza todas as linhas para terem o mesmo número de colunas
      const normalizedMatrix = matrix.map(row => {
        const normalizedRow = [];
        for (let c = 0; c < maxCols; c++) {
          normalizedRow.push(row[c] || '');
        }
        return normalizedRow;
      });

      // Se a primeira linha não for cabeçalho explícito (th), usamos como cabeçalho
      const headerRow = normalizedMatrix[0];
      const dataRows = normalizedMatrix.slice(1);

      // Constrói cabeçalho
      let mdTable = '| ' + headerRow.join(' | ') + ' |\n';
      mdTable += '| ' + headerRow.map(() => ':---').join(' | ') + ' |\n';

      // Constrói linhas de dados
      dataRows.forEach(row => {
        mdTable += '| ' + row.join(' | ') + ' |\n';
      });

      return mdTable.trim();
    }

    _escapeText(text) {
      if (!text) return '';
      // Normaliza espaços múltiplos sem quebrar pontuação
      return text.replace(/[\t\r]/g, ' ');
    }

    _convertPlainText(text) {
      return text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }

    /**
     * Pós-processamento de sanitização e compactação
     */
    _postProcessMarkdown(md) {
      if (!md) return '';

      return md
        .replace(/\r\n/g, '\n')
        // Remove múltiplos saltos de linha desnecessários
        .replace(/\n{3,}/g, '\n\n')
        // Remove espaços no final de cada linha
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        // Garante que cabeçalhos tenham quebra antes e depois
        .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
        .trim();
    }
  }

  return MarkItDownEngine;
}));
