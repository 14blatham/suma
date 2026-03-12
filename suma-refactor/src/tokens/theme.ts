/*
 * Six tokens. As little as possible, as much as necessary.
 * All values mirror CSS custom properties in index.css.
 * Use CSS vars in components; use this file for TypeScript logic only.
 */
export const theme = {
  colors: {
    bg:       '#F7F4EF',
    surface:  '#EFEBE4',
    border:   '#D5CFC6',
    text:     '#1C1A18',
    text2:    '#6B6459',
    ink:      '#4A3C2E',
    inkHover: '#362C21',
    error:    '#7A3535',
  },
} as const;
