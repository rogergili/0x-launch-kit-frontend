import { ThemeMetaData } from './commons';
import { DarkTheme } from './dark_theme';
import { BlueTheme } from './blue_theme';
import { DefaultTheme } from './default_theme';

export const KNOWN_THEMES_META_DATA: ThemeMetaData[] = [
    {
        name: 'LIGHT_THEME',
        theme: new DefaultTheme(),
    },
    {
        name: 'DARK_THEME',
        theme: new DarkTheme(),
    },
    {
        name: 'BLUE_THEME',
        theme: new BlueTheme(),
    },
];
