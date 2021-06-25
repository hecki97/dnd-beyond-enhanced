/* global marked */
const { elementReady, createHyperlink } = window.DDBE_Util;

let noteObserver = null;

/**
 * Creates and injects a new tab option that opens an external resource for Markdown into the page
 *
 * @returns void
 */
function injectExternalMarkdownResource() {
  const anchor = createHyperlink(
    'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet',
    'MD Cheatsheet',
    'ddbc-tab-options__header-heading',
  );

  const option = document.createElement('div');
  option.classList.add('ddbc-tab-options__header');
  option.style = 'margin-left: auto;';
  option.appendChild(anchor);

  document.querySelector('.ct-notes .ddbc-tab-options__nav').appendChild(option);
}

function convertToMarkdown(container, text) {
  const injectedSpan = document.createElement('span');
  injectedSpan.id = 'injected-by-dnd-beyond-enhanced';
  injectedSpan.innerHTML = marked(text);
  container.replaceChild(injectedSpan, container.firstChild);
}

function observeUserNotes() {
  const noteContainer = document.querySelector('.ct-notes .ct-content-group:last-child div.ct-notes__note');

  noteContainer.classList.add('markdown-body');
  convertToMarkdown(noteContainer, noteContainer.textContent);

  // Create an observer instance linked to the callback function
  noteObserver = new MutationObserver(([mutation]) => {
    if (mutation.addedNodes.item(0) instanceof HTMLSpanElement) {
      return;
    }

    convertToMarkdown(noteContainer, mutation.target.textContent);
  });

  // Start observing the target node for configured mutations
  noteObserver.observe(noteContainer, { childList: true });
}

window.onpagehide = () => {
  if (noteObserver) {
    noteObserver.disconnect();
  }
};

window.onload = async () => {
  await elementReady('.ct-primary-box__tab--notes');
  await elementReady('.ct-notes .ct-content-group:last-child .ct-notes__note');

  injectExternalMarkdownResource();
};
