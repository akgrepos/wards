// Picks light or dark before the first paint so the screen never flashes the wrong color.
// A separate file (not inline) so the page's security policy can allow only the app's own scripts.
document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'ios-dark' : 'ios-light';
