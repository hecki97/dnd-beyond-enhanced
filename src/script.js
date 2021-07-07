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

function convertContentToMarkdown(container, mutation) {
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

function hasDarkModeClass(element) {
  return [...element.classList].filter((value) => /--dark-mode/.test(value)).length > 0;
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
