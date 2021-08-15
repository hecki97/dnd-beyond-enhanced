/* global marked */
const { elementReady, createHyperlink } = window.DDBE_Util;

function registerSettingsSyncObserver(callback) {
  const observer = new MutationObserver(async ([mutation]) => {
    if (/sync-blocker-inactive/.test(mutation.oldValue)) {
      // Block until DOM chage has been made
      await DOMChanged();
      callback();
    }
  });

  const syncBlockerElement = document.querySelector('.sync-blocker');
  observer.observe(syncBlockerElement, { attributeOldValue: true });
}

function hasIsActiveClass(element) {
  return [...element.classList].filter((value) => /--is-active/.test(value)).length > 0;
}

function hasDarkModeClass(element) {
  return [...element.classList].filter((value) => /--dark-mode/.test(value)).length > 0;
}
