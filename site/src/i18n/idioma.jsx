import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Idiomas suportados pelo site público (o admin fica só em português).
export const IDIOMAS = {
  pt: { codigo: 'pt-AO', curto: 'PT', nome: 'Português' },
  en: { codigo: 'en', curto: 'EN', nome: 'English' },
}

const CHAVE = 'tecnato:idioma'

const IdiomaContext = createContext({ lang: 'pt', setLang: () => {} })

function idiomaInicial() {
  try {
    const guardado = window.localStorage.getItem(CHAVE)
    if (guardado === 'pt' || guardado === 'en') return guardado
  } catch {
    /* localStorage indisponível (modo privado) */
  }
  return 'pt'
}

export function IdiomaProvider({ children }) {
  const [lang, setLangState] = useState(idiomaInicial)

  const setLang = useCallback((novo) => {
    if (novo !== 'pt' && novo !== 'en') return
    setLangState(novo)
    try {
      window.localStorage.setItem(CHAVE, novo)
    } catch {
      /* ignorar */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = IDIOMAS[lang].codigo
  }, [lang])

  const valor = useMemo(() => ({ lang, setLang }), [lang, setLang])

  return <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>
}

export function useIdioma() {
  return useContext(IdiomaContext)
}

// Escolhe o texto certo fora de componentes (ex.: função utilitária).
export function texto(lang, pt, en) {
  return lang === 'en' ? en : pt
}

// Hook de conveniência para textos curtos: t('Português', 'English')
export function useT() {
  const { lang } = useIdioma()
  return useCallback((pt, en) => texto(lang, pt, en), [lang])
}
