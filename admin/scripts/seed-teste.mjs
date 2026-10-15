import { withDb } from './db.mjs'

const r = await withDb((db) =>
  db.query(
    `insert into public.candidaturas
       (referencia, equipa, projecto, municipio, area, whatsapp, email,
        descricao, video_path, foto_path, status)
     values ('TESTE-DEL','Equipa Teste','Projecto Teste','Luanda','Tecnologia',
             '900000000','teste@t.t','teste de apagamento',
             'TESTE-DEL/video.mp4','TESTE-DEL/foto.jpg','rejeitada')
     on conflict (referencia) do update set status='rejeitada'
     returning referencia`
  )
)
console.log('linha teste:', r.rows[0].referencia)
