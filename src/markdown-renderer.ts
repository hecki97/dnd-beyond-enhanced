namespace DnDBeyondEnhanced {
  export class MarkdownRenderer {
    /**
     * Creates and injects a new tab option that opens an external resource for Markdown into the page
     *
     * @returns void
     */
    public static injectMarkdownHyperlink() {
      const anchor = Util.createHyperlink(
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

    public static convertContentToMarkdown(container: HTMLElement, mutation: HTMLElement) {
      const textContent = mutation ? mutation.textContent : container.textContent;

      const markdownContainer = document.createElement('span');
      markdownContainer.id = 'injected-by-dnd-beyond-enhanced';
      // marked returns compiled html, so usage of unsafe innerHTML property is required
      // TODO: Escape compiled HTML before setting innerHTML
      markdownContainer.innerHTML = marked(textContent);

      // Add necessary class for proper markdown rendering
      container.classList.add('markdown-body');

      if (container.hasChildNodes()) {
        container.replaceChild(markdownContainer, container.firstChild);
      } else {
        container.appendChild(markdownContainer);
      }
    }
  }
}