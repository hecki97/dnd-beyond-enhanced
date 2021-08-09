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
            this.injectMarkdownHyperlink();
            this.registerNoteObserver(
              document.querySelector('.ct-notes .ct-content-group:last-child div.ct-notes__note'),
              convertContentToMarkdown,
            );
            break;
          case 'Inventory':
            break;
          default:
            break;
        }
      });
        disconnectPrimaryBoxObserver() {
    
        }
    }
}
