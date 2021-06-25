/* global marked */
const { elementReady, createHyperlink } = window.DDBE_Util;

/**
 * Creates and injects a new tab option that opens an external resource for Markdown into the page
 *
 * @returns void
 */
function injectMarkdownHyperlink() {
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

function convertToMarkdown(container, text) {
  const injectedSpan = document.createElement('span');
  injectedSpan.id = 'injected-by-dnd-beyond-enhanced';
  injectedSpan.innerHTML = marked(text);
  container.replaceChild(injectedSpan, container.firstChild);
}

function registerNoteObserver(container, mutationCallback) {
  mutationCallback(container, container);

  const observer = new MutationObserver(([mutation]) => {
    // Only invoke mutationCallback if the first child is *no* Span element
    if (!(mutation.addedNodes.item(0) instanceof HTMLSpanElement)) {
      mutationCallback(container, mutation.target);
    }
  });

  observer.observe(container, { childList: true });
  return observer;
}

/*
window.onpagehide = () => {
  if (observer) {
    observer.disconnect();
  }
};
*/

function hasIsActiveClass(element) {
  return [...element.classList].filter((value) => /--is-active/.test(value)).length > 0;
}

window.onload = async () => {
  await elementReady('.ct-character-sheet');
  await elementReady('.ct-primary-box');
  console.log('Site Initialized!');

  const observePrimaryTabList = new MutationObserver(([first, second]) => {
    const activeListItem = hasIsActiveClass(first.target) ? first.target : second.target;

    switch (activeListItem.textContent) {
      case 'Notes':
        injectMarkdownHyperlink();
        registerNoteObserver(
          document.querySelector('.ct-notes .ct-content-group:last-child div.ct-notes__note'),
          convertContentToMarkdown,
        );
        break;
      case 'Actions':
        break;
      default:
        break;
    }
  });

  const primaryTabList = document.querySelector('.ddbc-tab-list__nav');
  observePrimaryTabList.observe(primaryTabList, { attributes: true, subtree: true });
};
