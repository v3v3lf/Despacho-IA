/**
 * MarkItDown Viewer & Renderer
 * Utilitário de renderização visual e gestão de Markdown no popup da extensão.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MarkItDownViewer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class MarkItDownViewer {
    /**
     * Converte Markdown seguro para HTML formatado e estilizado
     * @param {string} markdown
     * @returns {string} HTML renderizado
     */
    static renderToHtml(markdown) {
      if (!markdown) return '<div class="md-empty">Nenhum documento convertido ainda.</div>';

      let html = this._escapeHtml(markdown);

      // 1. Tratar Frontmatter YAML
      html = html.replace(/^---\n([\s\S]*?)\n---/m, (match, yaml) => {
        const lines = yaml.split('\n').filter(l => l.trim().length > 0);
        const badges = lines.map(line => {
          const parts = line.split(':');
          const k = parts[0].trim();
          const v = parts.slice(1).join(':').replace(/["']/g, '').trim();
          return `<span class="md-badge"><strong>${k}:</strong> ${v}</span>`;
        }).join(' ');
        return `<div class="md-frontmatter-card">${badges}</div>`;
      });

      // 2. Blocos de Código Fenced
      html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="md-code-block"><code class="language-${lang}">${code.trim()}</code></pre>`;
      });

      // 3. Código Inline
      html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

      // 4. Cabeçalhos
      html = html.replace(/^###### (.*$)/gim, '<h6 class="md-h6">$1</h6>');
      html = html.replace(/^##### (.*$)/gim, '<h5 class="md-h5">$1</h5>');
      html = html.replace(/^#### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
      html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');

      // 5. Tabelas Markdown (GFM)
      html = this._renderTables(html);

      // 6. Destaques (Negrito e Itálico)
      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // 7. Divisores Horizontais
      html = html.replace(/^---$/gim, '<hr class="md-hr">');

      // 8. Listas não ordenadas
      html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="md-li">$1</li>');
      html = html.replace(/(<li class="md-li">[\s\S]*?<\/li>)(?![\s\S]*?<li class="md-li">)/gim, '<ul class="md-ul">$1</ul>');

      // 9. Citações / Blockquotes
      html = html.replace(/^\>\s+(.*$)/gim, '<blockquote class="md-quote">$1</blockquote>');

      // 10. Links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="md-link">$1 ↗</a>');

      // 11. Parágrafos e quebras de linha
      const blocks = html.split(/\n\n+/);
      html = blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (/^<(h[1-6]|ul|ol|table|pre|blockquote|div|hr)/i.test(trimmed)) {
          return trimmed;
        }
        return `<p class="md-p">${trimmed.replace(/\n/g, '<br>')}</p>`;
      }).join('\n');

      return `<div class="md-rendered-content">${html}</div>`;
    }

    /**
     * Renderiza tabelas GFM em HTML semântico
     */
    static _renderTables(text) {
      const tableRegex = /((?:\|.+?\|\n)+)/g;
      return text.replace(tableRegex, (match) => {
        const lines = match.trim().split('\n');
        if (lines.length < 2) return match;

        let tableHtml = '<table class="md-table">';
        let isHeader = true;

        lines.forEach((line, idx) => {
          // Ignora a linha separadora de alinhamento (| :--- | :--- |)
          if (/^\|\s*:?-+:?\s*\|/.test(line)) {
            isHeader = false;
            return;
          }

          const cells = line.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
          if (cells.length === 0) return;

          if (isHeader && idx === 0) {
            tableHtml += '<thead><tr>';
            cells.forEach(cell => {
              tableHtml += `<th>${cell}</th>`;
            });
            tableHtml += '</tr></thead><tbody>';
          } else {
            tableHtml += '<tr>';
            cells.forEach(cell => {
              tableHtml += `<td>${cell}</td>`;
            });
            tableHtml += '</tr>';
          }
        });

        tableHtml += '</tbody></table>';
        return tableHtml;
      });
    }

    static _escapeHtml(text) {
      return (text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }

  return MarkItDownViewer;
}));
