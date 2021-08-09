namespace DnDBeyondEnhanced {
  export class MarkdownInjector {
    private primaryBoxObserver: MutationObserver;
    private activeObserver: MutationObserver;

    public observePrimaryBox() {
      this.primaryBoxObserver = new MutationObserver(([first, second]) => {
        const activeListItem = this.hasIsActiveClass(first.target) ? first.target : second.target;

        if (this.activeObserver) {
          this.activeObserver.disconnect();
        }

        switch (activeListItem.textContent) {
          case 'Notes':
            MarkdownRenderer.injectMarkdownHyperlink();
            this.registerNoteObserver(
              document.querySelector('.ct-notes .ct-content-group:last-child div.ct-notes__note'),
              MarkdownRenderer.convertContentToMarkdown,
            );
            break;
          case 'Inventory':
            break;
          default:
            break;
        }
      });

      const primaryTabList = document.querySelector('.ddbc-tab-list__nav');
      this.primaryBoxObserver.observe(primaryTabList, { attributes: true, subtree: true })
    }

    public registerNoteObserver(container: Element, mutationCallback: Function) {
      mutationCallback(container, container);

      const observer = new MutationObserver(([mutation]) => {
        // Only invoke mutationCallback if the first child is *no* Span element
        if (!(mutation.addedNodes.item(0) instanceof HTMLSpanElement)) {
          mutationCallback(container, mutation.target);
        }
      });
    }

    public disconnectPrimaryBoxObserver() {
      if (!this.primaryBoxObserver) {
        throw new Error('Cannot disconnect uninitialized observer');
      }

      this.primaryBoxObserver.disconnect();
    }

    private hasIsActiveClass(element: HTMLElement) {
      return Array.from(element.classList).filter((value) => /--is-active/.test(value)).length > 0;
    }
  }
}
