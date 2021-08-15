import { MarkdownInjector } from './markdown-injector';
import { ThemeObserver } from './theme';
import { Util } from './util';

const markdownInjector = new MarkdownInjector();
const themeObserver = new ThemeObserver();

window.onload = async () => {
    await Util.elementReady('.ct-character-sheet');
    await Util.elementReady('.ct-primary-box');
    console.log('Site Initialized!');

    markdownInjector.observePrimaryBox();
    themeObserver.observeThemeChanges();    
};

window.onpagehide = () => {
    markdownInjector.disconnectPrimaryBoxObserver();
    themeObserver.disconnectThemeChangeObserver();
};