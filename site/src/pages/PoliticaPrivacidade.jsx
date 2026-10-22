import { Link } from 'react-router-dom'
import { SectionLabel } from '../components/Section.jsx'
import { EMAIL, WHATSAPP_URL } from '../constants.js'
import { useSeo } from '../lib/seo.jsx'

const VERSAO = '1.0'
const VIGOR = '22 de Outubro de 2026'

const DESTAQUES = [
  'A TUA IDEIA É TUA. O TECNATO não toma posse dos projectos apresentados — os direitos permanecem com os criadores (Art.º 4.º).',
  'ATENÇÃO: o TECNATO NÃO se responsabiliza se uma ideia apresentada publicamente for copiada por terceiros. O que o participante revela voluntariamente (vídeos, redes sociais, conversas, apresentações) fica exposto — e pode ser gravado, partilhado e replicado por outras pessoas. (Art.º 8.º).',
  'Apresente a ideia com clareza, mas sem revelar segredos técnicos, processos exclusivos, códigos, credenciais ou detalhes que não precise de mostrar. (Art.º 8.º, n.º 3).',
  'Conteúdos publicados oficialmente nos canais do TECNATO (ex. equipas destacadas, apresentações feitas em eventos e gravações oficiais) podem ficar gravados e divulgados nas nossas redes sociais, conforme as autorizações assinadas. (Art.º 5.º e 10.º).',
]

const ARTIGOS = [
  {
    numero: '1.º',
    titulo: 'Objecto e âmbito',
    itens: [
      'A presente política estabelece os princípios e as regras de privacidade, confidencialidade, protecção de informações e tratamento de dados aplicáveis ao TECNATO, aos seus candidatos, concorrentes, membros de equipas, colaboradores, jurados, parceiros e demais pessoas que participem nas suas actividades.',
      'O seu objectivo é promover um ambiente de participação seguro, transparente e responsável, protegendo os dados pessoais, as informações não públicas, os projectos, as criações e os interesses legítimos dos participantes e da organização.',
      'A presente política aplica-se às candidaturas, aos vídeos de apresentação, aos documentos submetidos, às entrevistas, aos castings, às actividades internas, às avaliações, às reuniões, às gravações e às demais interacções relacionadas com o TECNATO.',
      'A política deve ser interpretada em conformidade com a legislação aplicável na República de Angola, sem prejuízo de outros direitos e obrigações legalmente reconhecidos.',
    ],
  },
  {
    numero: '2.º',
    titulo: 'Dados pessoais e finalidades do tratamento',
    itens: [
      'O TECNATO poderá recolher e tratar os dados estritamente necessários para gerir as candidaturas, verificar os requisitos de participação, contactar os candidatos, organizar as actividades, realizar avaliações, comunicar resultados e administrar a plataforma.',
      'Dependendo da fase de participação, poderão ser solicitados dados como nome, contacto, município, identificação da equipa, informações sobre o projecto, imagem, voz e outros elementos necessários à organização da iniciativa.',
      'Os dados pessoais não deverão ser recolhidos ou utilizados para finalidades incompatíveis com aquelas que foram comunicadas aos participantes, salvo quando exista fundamento legal adequado.',
      'O acesso aos dados deverá ser limitado às pessoas que necessitem deles para desempenhar funções relacionadas com o TECNATO.',
      'O TECNATO deverá adoptar medidas adequadas para proteger os dados contra acesso, utilização, alteração, perda ou divulgação não autorizados.',
      'Os dados serão conservados apenas durante o período necessário às finalidades comunicadas, sem prejuízo de obrigações legais, da defesa de direitos ou de outros fundamentos legítimos de conservação.',
    ],
  },
  {
    numero: '3.º',
    titulo: 'Classificação das informações',
    itens: [
      'a) Informação pública: informações cuja divulgação foi autorizada, incluindo conteúdos publicados oficialmente, apresentações públicas e materiais promocionais aprovados.',
      'b) Informação de acesso restrito: candidaturas, contactos, documentos administrativos, avaliações, comunicações internas, informações de bastidores e outros elementos não destinados ao público.',
      'c) Informação confidencial do projecto: detalhes técnicos, comerciais, financeiros ou estratégicos que o titular identifique ou que, pela sua natureza, devam razoavelmente ser tratados como confidenciais.',
      'd) Informação pessoal: dados que identifiquem ou permitam identificar uma pessoa, incluindo contactos, imagem, voz e informações relativas à sua vida privada.',
      'A classificação de uma informação deverá orientar a forma como é recolhida, armazenada, utilizada, partilhada e divulgada.',
    ],
  },
  {
    numero: '4.º',
    titulo: 'Propriedade dos projectos e criações',
    itens: [
      'A participação no TECNATO não transfere automaticamente para a organização a propriedade dos projectos, invenções, marcas, desenhos, documentos, códigos, métodos, conteúdos originais ou demais criações pertencentes aos participantes.',
      'Salvo acordo escrito em contrário, os direitos sobre cada projecto permanecem com os respectivos titulares, nos termos da legislação aplicável.',
      'A submissão de uma candidatura não confere ao TECNATO qualquer direito automático de explorar comercialmente, vender, reproduzir integralmente, comercializar ou registar em nome próprio o projecto de um participante.',
      'Os participantes são responsáveis por verificar a titularidade dos materiais apresentados, respeitar os direitos de terceiros e obter as autorizações necessárias para a utilização de conteúdos que não lhes pertençam.',
      'Quando um projecto envolver vários criadores, os membros da equipa deverão esclarecer entre si a titularidade dos direitos, as contribuições individuais e as condições de utilização do projecto antes de o submeter.',
      'A organização poderá solicitar esclarecimentos ou documentos adicionais quando existam dúvidas razoáveis sobre a titularidade de um projecto ou sobre a autorização para o apresentar.',
    ],
  },
  {
    numero: '5.º',
    titulo: 'Autorização de utilização dos materiais submetidos',
    itens: [
      'Ao submeter materiais para efeitos de candidatura, o participante autoriza o TECNATO a recebê-los, armazená-los e analisá-los na medida necessária à gestão da candidatura e à avaliação da participação.',
      'A autorização para utilizar um material na avaliação interna não equivale a uma autorização geral para o publicar, transmitir, comercializar ou disponibilizar ao público.',
      'A publicação de vídeos, fotografias, entrevistas, excertos de apresentações ou outros materiais identificáveis deverá respeitar a finalidade comunicada e as autorizações aplicáveis.',
      'Sempre que se pretenda utilizar um projecto ou material para fins promocionais, publicitários ou comerciais que ultrapassem a gestão normal da candidatura, deverá ser obtida a autorização adequada do respectivo titular, quando legalmente exigida.',
      'Qualquer autorização adicional deverá indicar, de forma clara, os materiais abrangidos, as finalidades, os canais de utilização e as condições relevantes.',
      'A autorização para divulgar a apresentação de um projecto não implica a autorização para divulgar informações técnicas ou comerciais confidenciais que não façam parte do conteúdo aprovado para publicação.',
    ],
  },
  {
    numero: '6.º',
    titulo: 'Dever de confidencialidade da organização',
    itens: [
      'Os fundadores, dirigentes, colaboradores, membros da produção, jurados, consultores, voluntários e demais pessoas autorizadas a aceder a informações não públicas ficam sujeitos a deveres de confidencialidade adequados às suas funções e às obrigações legais aplicáveis.',
      'As pessoas abrangidas pelo número anterior não deverão divulgar, copiar, utilizar para benefício próprio ou disponibilizar a terceiros informações confidenciais a que tenham acesso em virtude da sua participação no TECNATO, salvo autorização adequada ou fundamento legal.',
      'O acesso a documentos, candidaturas e projectos deverá ser limitado ao estritamente necessário para o exercício das funções atribuídas.',
      'A organização deverá adoptar procedimentos razoáveis para reduzir os riscos de divulgação indevida, incluindo controlo de acessos, armazenamento adequado e regras de partilha de documentos.',
      'Os deveres de confidencialidade deverão continuar a aplicar-se após o fim da colaboração ou da participação, enquanto as informações mantiverem natureza confidencial ou pelo período estabelecido no compromisso aplicável, sem prejuízo das obrigações legais.',
      'A organização deverá tratar as violações destes deveres de acordo com a sua gravidade, os compromissos assumidos e a legislação aplicável, podendo adoptar medidas internas e recorrer aos mecanismos legais disponíveis.',
    ],
  },
  {
    numero: '7.º',
    titulo: 'Deveres de confidencialidade dos participantes',
    itens: [
      'Os participantes comprometem-se a respeitar as informações não públicas de outros candidatos, concorrentes, membros das equipas, jurados, colaboradores e da organização a que tenham acesso durante as actividades do TECNATO.',
      'É proibido divulgar, sem autorização adequada, documentos internos, candidaturas alheias, dados pessoais, comunicações privadas, gravações restritas, informações confidenciais ou detalhes não públicos de projectos de terceiros.',
      'Os participantes não deverão utilizar informações confidenciais obtidas através da plataforma para prejudicar outros concorrentes, obter vantagens indevidas ou apropriar-se de criações alheias.',
      'A participação numa actividade interna, reunião ou sessão de avaliação não constitui autorização para fotografar, gravar ou divulgar o seu conteúdo quando tal não tenha sido permitido.',
      'Os participantes deverão comunicar à organização, através dos canais indicados, situações de acesso indevido, divulgação não autorizada ou suspeita de utilização abusiva de informações.',
      'A violação destes deveres poderá dar lugar a advertência, restrição de acesso, afastamento de actividades ou outras medidas previstas no regulamento, desde que adequadas, proporcionais e compatíveis com a legislação aplicável.',
    ],
  },
  {
    numero: '8.º',
    titulo: 'Responsabilidade pela divulgação voluntária ou descuidada de projectos',
    itens: [
      'Cada participante é responsável pelas informações que decide revelar voluntariamente sobre o seu projecto, incluindo os detalhes técnicos, comerciais, financeiros, estratégicos e operacionais que apresenta em vídeos, entrevistas, reuniões, demonstrações, redes sociais ou outras comunicações.',
      'Antes de divulgar informações sensíveis, o participante deverá avaliar os riscos da sua exposição e, quando necessário, consultar os demais titulares do projecto ou um profissional habilitado em propriedade intelectual.',
      'O TECNATO recomenda que os participantes apresentem os seus projectos de forma suficientemente clara para permitir a sua compreensão e avaliação, evitando divulgar fórmulas, desenhos técnicos detalhados, códigos-fonte, processos exclusivos, credenciais de acesso, segredos comerciais ou outros elementos cuja revelação não seja necessária.',
      'Quando um participante revelar voluntariamente, ou por falta de cuidado que lhe seja imputável, informações confidenciais do seu projecto a pessoas não autorizadas, a organização não será automaticamente responsável pelas consequências dessa divulgação, desde que estas não resultem de acto ou omissão imputável ao TECNATO ou a pessoas pelas quais este deva legalmente responder.',
      'O TECNATO não garante que informações divulgadas publicamente pelo próprio participante possam ser mantidas em segredo por terceiros, nem pode assegurar que o conteúdo publicado não seja copiado, reproduzido, partilhado ou utilizado indevidamente por pessoas alheias à organização.',
      'A presente disposição não exclui nem limita responsabilidades que legalmente caibam ao TECNATO, aos seus representantes ou a terceiros, incluindo as que resultem de violação de confidencialidade, falha de segurança imputável, utilização não autorizada de informações ou incumprimento de obrigações legais.',
      'Sempre que uma divulgação não autorizada seja imputável à organização ou a alguém sujeito aos seus deveres de confidencialidade, o TECNATO deverá avaliar o incidente, adoptar medidas razoáveis para conter a divulgação e cumprir as obrigações legais aplicáveis.',
      'A divulgação voluntária de uma informação pelo participante não significa, por si só, que este renuncie a todos os direitos de propriedade intelectual ou que qualquer utilização posterior por terceiros seja necessariamente lícita.',
    ],
  },
  {
    numero: '9.º',
    titulo: 'Limites da confidencialidade e riscos externos',
    itens: [
      'A obrigação de confidencialidade não se aplica, na medida legalmente permitida, a informações que:',
      'a) Já sejam legitimamente públicas, sem violação de um dever de confidencialidade;',
      'b) Já fossem legitimamente conhecidas pelo destinatário antes da sua comunicação;',
      'c) Sejam desenvolvidas de forma independente, sem utilização indevida de informação confidencial;',
      'd) Tenham sido legitimamente recebidas de terceiro autorizado a divulgá-las;',
      'e) Tenham de ser comunicadas por força da lei, de decisão judicial ou de ordem de autoridade competente.',
      'Quando legalmente permitido e adequado, a pessoa obrigada a divulgar informação confidencial por imposição legal deverá limitar a divulgação ao necessário e informar previamente o titular ou a organização.',
      'O TECNATO não poderá garantir a eliminação de cópias já obtidas ou distribuídas por terceiros, nem controlar integralmente a actuação de plataformas externas, redes sociais, serviços de mensagens ou outros sistemas que não administre.',
      'A organização deverá, contudo, adoptar medidas razoáveis dentro da sua esfera de controlo para prevenir e responder a divulgações não autorizadas.',
    ],
  },
  {
    numero: '10.º',
    titulo: 'Submissão e publicação de vídeos',
    itens: [
      'O vídeo de candidatura destina-se a apresentar a equipa, o município que pretende representar, o projecto e a sua finalidade.',
      'Os participantes devem evitar incluir no vídeo informações que não pretendam tornar acessíveis a pessoas envolvidas na avaliação ou que não sejam necessárias para apresentar a candidatura.',
      'A publicação de um vídeo nos canais oficiais do TECNATO deverá respeitar as condições comunicadas aos participantes e as autorizações necessárias.',
      'A publicação pelo próprio candidato em redes sociais ou outros meios públicos é da sua responsabilidade, sem prejuízo dos direitos de terceiros e das obrigações legais aplicáveis.',
      'A organização não deverá assumir que a autorização para receber ou avaliar um vídeo inclui automaticamente a autorização para o publicar em qualquer plataforma, por tempo ilimitado ou para fins comerciais.',
      'Sempre que o vídeo inclua pessoas identificáveis, informações pessoais de terceiros ou materiais protegidos, o participante deverá assegurar que dispõe das autorizações necessárias.',
    ],
  },
  {
    numero: '11.º',
    titulo: 'Menores de idade',
    itens: [
      'Quando uma candidatura ou actividade envolver participantes menores de idade, a organização deverá aplicar procedimentos adequados à sua idade e à natureza da actividade.',
      'Sempre que legalmente exigido, deverão ser obtidos o consentimento ou a autorização do representante legal para a recolha e o tratamento de dados, a participação e a utilização pública de imagem e voz.',
      'Os dados de menores deverão ser tratados com especial cuidado, evitando a divulgação desnecessária de contactos pessoais, moradas, rotinas ou outras informações que possam comprometer a sua segurança.',
      'A participação de um menor não deverá ser interpretada como autorização ilimitada para a utilização comercial da sua imagem, voz ou projecto.',
    ],
  },
  {
    numero: '12.º',
    titulo: 'Incidentes de segurança e divulgações não autorizadas',
    itens: [
      'Qualquer pessoa que identifique ou suspeite de uma fuga de informação, acesso não autorizado, perda de documentos ou utilização indevida de dados deverá comunicar o incidente à organização através dos contactos oficiais.',
      'A organização deverá avaliar o incidente, limitar os acessos afectados, preservar os elementos necessários à averiguação e adoptar medidas razoáveis para reduzir os riscos.',
      'Quando aplicável, o TECNATO deverá cumprir os deveres legais de comunicação, notificação ou cooperação com as autoridades competentes e com os titulares afectados.',
      'Os incidentes serão tratados com discrição, imparcialidade e respeito pelos direitos das pessoas envolvidas.',
      'A comunicação de um incidente não deverá resultar automaticamente em penalização do participante que o reporte de boa-fé.',
    ],
  },
  {
    numero: '13.º',
    titulo: 'Direitos dos titulares dos dados',
    itens: [
      'Os titulares dos dados poderão exercer os direitos que lhes sejam reconhecidos pela legislação aplicável, incluindo, conforme o caso, solicitar informação sobre o tratamento, aceder aos seus dados, pedir a rectificação de dados incorrectos e requerer o cancelamento, a eliminação ou a oposição ao tratamento quando legalmente admissível.',
      'Os pedidos deverão ser dirigidos aos contactos oficiais do TECNATO. A organização analisará cada pedido e responderá de acordo com os prazos e as condições legais aplicáveis.',
      'O exercício de um direito poderá estar sujeito a limitações legais ou à necessidade de conservar determinados elementos para cumprir obrigações legais ou defender direitos legítimos.',
    ],
  },
  {
    numero: '14.º',
    titulo: 'Alterações à política',
    itens: [
      'O TECNATO poderá rever esta política para acompanhar alterações legais, tecnológicas, organizacionais ou operacionais.',
      'A versão actualizada deverá ser disponibilizada pelos canais oficiais, com indicação da data de entrada em vigor.',
      'Quando uma alteração afecte materialmente as finalidades ou as condições de tratamento dos dados pessoais, a organização deverá prestar a informação necessária e obter novo consentimento quando legalmente exigido.',
    ],
  },
  {
    numero: '15.º',
    titulo: 'Disposições finais',
    itens: [
      'A presente política complementa o regulamento de participação, os compromissos de confidencialidade e os demais documentos aplicáveis ao TECNATO.',
      'Em caso de conflito, prevalecerão as disposições legais imperativas aplicáveis.',
      'Nenhuma cláusula deverá ser interpretada como uma renúncia geral aos direitos legalmente reconhecidos aos participantes ou como uma exclusão de responsabilidade que a lei não permita.',
      'A participação no TECNATO deverá ocorrer mediante conhecimento das regras aplicáveis e aceitação dos compromissos de participação e confidencialidade que sejam legitimamente exigidos.',
    ],
  },
]

export default function PoliticaPrivacidade() {
  useSeo({
    titulo: 'Política de privacidade e protecção de projectos',
    descricao:
      'Política de privacidade, confidencialidade e protecção de projectos e participantes do TECNATO — dados pessoais, propriedade das ideias, divulgação de vídeos e deveres de confidencialidade.',
    caminho: '/politica-de-privacidade',
  })

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Link to="/" className="text-sm font-semibold text-ink/60 transition-colors hover:text-ink">
            ← Início
          </Link>
          <div className="mt-8">
            <SectionLabel index="§">Transparência</SectionLabel>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold sm:text-5xl">
            Política de privacidade, confidencialidade e <span className="text-brand-deep">protecção</span> de projectos e participantes.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            TECNATO — A luz para os génios da banda. Versão {VERSAO} · Em vigor desde {VIGOR}.
          </p>
        </div>
      </section>

      <section className="bg-paper pb-6">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative border border-line bg-white px-5 py-6 sm:px-8">
            <div className="absolute inset-y-0 left-0 w-1 bg-brand" aria-hidden="true" />
            <h2 className="text-xl font-bold sm:text-2xl">Em termos simples</h2>
            <ul className="mt-4 space-y-3">
              {DESTAQUES.map((texto) => (
                <li key={texto} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                  <span className="mt-0.5 text-brand-deep" aria-hidden="true">
                    ▪
                  </span>
                  <span>{texto}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <article className="relative border border-line bg-white px-5 py-8 sm:px-10 sm:py-12">
            {ARTIGOS.map((artigo, indice) => (
              <div key={artigo.numero} className={indice > 0 ? 'mt-10' : undefined}>
                <h2 className="text-lg font-bold sm:text-xl">
                  Artigo {artigo.numero} — {artigo.titulo}
                </h2>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80 sm:text-[15px]">
                  {artigo.itens.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            ))}

            <div className="mt-12 border-t border-line pt-8">
              <p className="text-sm leading-relaxed text-ink/80">
                <strong>Entidade responsável:</strong> TECNATO — plataforma angolana de identificação,
                valorização e visibilidade de talentos.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                <strong>Contacto para questões de privacidade e confidencialidade:</strong>{' '}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-brand-deep hover:underline">
                  {EMAIL}
                </a>{' '}
                ·{' '}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-deep hover:underline"
                >
                  WhatsApp oficial
                </a>
              </p>
              <p className="mt-3 text-sm text-ink/60">
                <strong>Data de entrada em vigor:</strong> {VIGOR} · Versão {VERSAO} · Página:{' '}
                /politica-de-privacidade
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
