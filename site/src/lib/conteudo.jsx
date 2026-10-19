import { useEffect, useState } from 'react'
import { CONTEUDO_PADRAO, ConteudoContext } from './conteudo.js'
import { supabase } from './supabase.js'

export function ConteudoProvider({ children }) {
  const [conteudo, setConteudo] = useState(CONTEUDO_PADRAO)

  useEffect(() => {
    if (!supabase) return undefined
    let vivo = true
    supabase
      .from('site_conteudo')
      .select('chave, valor')
      .then(({ data }) => {
        if (!vivo || !Array.isArray(data)) return
        setConteudo(() => {
          const proximo = { ...CONTEUDO_PADRAO }
          for (const linha of data) {
            if (CONTEUDO_PADRAO[linha.chave]) {
              proximo[linha.chave] = { ...CONTEUDO_PADRAO[linha.chave], ...(linha.valor || {}) }
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
