import { useEffect, useState } from 'react'
import { CONTEUDO_PADRAO, ConteudoContext } from './conteudo.js'

export function ConteudoProvider({ children }) {
  const [conteudo, setConteudo] = useState(CONTEUDO_PADRAO)

  useEffect(() => {
    let vivo = true
    fetch('/api/conteudo')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Sem conteúdo.'))))
      .then((json) => {
        if (!vivo || !json?.conteudo) return
        setConteudo(() => {
          const proximo = { ...CONTEUDO_PADRAO }
          for (const [chave, valor] of Object.entries(json.conteudo)) {
            if (CONTEUDO_PADRAO[chave]) {
              proximo[chave] = { ...CONTEUDO_PADRAO[chave], ...(valor || {}) }
            }
          }
          return proximo
        })
      })
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [])

  return <ConteudoContext.Provider value={conteudo}>{children}</ConteudoContext.Provider>
}
