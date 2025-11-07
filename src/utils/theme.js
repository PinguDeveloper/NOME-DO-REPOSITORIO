// Gerenciar tema claro/escuro
export function getTheme() {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  
  // Detectar preferência do sistema
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function setTheme(theme) {
  localStorage.setItem('theme', theme)
  applyTheme(theme)
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  if (theme === 'dark') {
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
  } else {
    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
  }
}

// Aplicar tema ao carregar
applyTheme(getTheme())

