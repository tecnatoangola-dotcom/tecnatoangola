import { useEffect, useState } from 'react'
import { CONTEUDO_PADRAO, ConteudoContext } from './conteudo.js'
import { supabase } from './supabase.js'

// Via 1 (preferida): a function /api/conteudo (builds Git/Netlify function).
// Via 2 (fallback directo ao Supabase, pelo browser, com a anon key):
//    cobre deploys estáticos (drag & drop) e permite o conteúdo editado no
//    CRM aparecer sem redeploy — a leitura pública de site_conteudo é
//    intencional (é o copy do próprio site).
async function buscarViaFunction() {
  const r = await fetch('/api/conteudo')
  const corpo = await r.json()
  if (!corpo?.conteudo || (r.ok === false)) throw new Error('function indisponível')
  return corpo
}

async function buscarViaSupabase() {
  if (!supabase) throw new Error('supabase não configurado')
  const { data, error } = await supabase.from('site_conteudo').select('chave,valor')
  if (error) throw error
  const conteudo = {}
  for (const row of data ?? []) conteudo[row.chave] = row.valor
  return { conteudo }
}

export function ConteudoProvider({ children }) {
  const [conteudo, setConteudo] = useState(CONTEUDO_PADRAO)

  useEffect(() => {
    let vivo = true

    async function carregar() {
      let json = null
      try {
        json = await buscarViaFunction()
      } catch {
        json = null
      }
      if (!json?.conteudo) {
        try {
          json = await buscarViaSupabase()
        } catch {
          json = null
        }
      }
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
    }

    carregar()
    return () => {
      vivo = false
    }
  }, [])

  return <ConteudoContext.Provider value={conteudo}>{children}</ConteudoContext.Provider>
}
