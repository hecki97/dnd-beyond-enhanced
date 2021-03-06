export class Util {
  /**
   * Waits for an element satisfying selector to exist, then resolves promise with the element.
   *
   * Based on this gist by [jwilson8767](https://gist.github.com/jwilson8767): https://gist.github.com/jwilson8767/db379026efcbd932f64382db4b02853e
   *
   * @param {string} selector valid html selector
   * @returns {Promise<Element>} HTML element
   */
  public static elementReady(selector: string): Promise<Element> {
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

  public static DOMChanged(): Promise<MutationRecord[]> {
    return new Promise((resolve) => {
      const mutationObserver = new MutationObserver((observedMutations, observer) => {
        resolve(observedMutations);
        observer.disconnect();
      });

      mutationObserver.observe(document.documentElement, { subtree: true, childList: true });
    });
  }

  public static createHyperlink(href: string, text: string, ...classList: string[]): HTMLAnchorElement {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.text = text;
    anchor.rel = 'nofollow';
    anchor.type = 'noopener';
    anchor.target = '_blank';
    anchor.classList.add(...classList);

    return anchor;
  }

  public static getLocalResourceURL(path: string): string {
    return (chrome || browser).runtime.getURL(path);
  }
}
