namespace DnDBeyondEnhanced {
  export class MarkdownRenderer {
    /**
     * Creates and injects a new tab option that opens an external resource for Markdown into the page
     *
     * @returns void
     */
    public injectMarkdownHyperlink() {
      const anchor = createHyperlink(
        'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet',
        'MD Cheatsheet',
        'ddbc-tab-options__header-heading',
      );

      const tabListItem = document.createElement('div');
      tabListItem.classList.add('ddbc-tab-options__header');
      tabListItem.style = 'margin-left: auto;';
      tabListItem.appendChild(anchor);

      const notesPrimaryTabList = document.querySelector('.ct-notes .ddbc-tab-options__nav');
      notesPrimaryTabList.appendChild(tabListItem);
    }
  }
}