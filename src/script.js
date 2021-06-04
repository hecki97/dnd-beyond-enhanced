/* global marked */

let noteObserver = null;

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 *
 * Based on this gist by [jwilson8767](https://gist.github.com/jwilson8767): https://gist.github.com/jwilson8767/db379026efcbd932f64382db4b02853e
 *
 * @param {string} selector valid html selector
 * @returns {Promise<Element>} HTML element
 */
function elementReady(selector) {
  return new Promise((resolve) => {
    Array.from(document.querySelectorAll(selector)).forEach((element) => {
      resolve(element);
    });

    const mutObserver = new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        // Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    });

    mutObserver.observe(document.documentElement, { childList: true, subtree: true });
  });
}

/**
 * Creates and injects a new tab option that opens an external resource for Markdown into the page
 *
 * @returns void
 */
function injectExternalMarkdownResource() {
  const anchor = document.createElement('a');
  anchor.href = 'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet';
  anchor.text = 'MD Cheatsheet';
  anchor.rel = 'nofollow';
  anchor.type = 'noopener';
  anchor.target = '_blank';
  anchor.classList.add('ddbc-tab-options__header-heading');

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

window.onload = async () => {
  await elementReady('.ct-primary-box__tab--notes');
  await elementReady('.ct-notes .ct-content-group:last-child .ct-notes__note');

  injectExternalMarkdownResource();
  observeUserNotes();
};

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
