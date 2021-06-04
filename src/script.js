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

window.onload = async () => {
  await elementReady('.ct-primary-box__tab--notes');
  await elementReady('.ct-notes .ct-content-group:last-child .ct-notes__note');

  injectExternalMarkdownResource();
};
