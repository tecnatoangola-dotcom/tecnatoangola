import { Link } from 'react-router-dom'
import { SectionLabel } from '../components/Section.jsx'
import { EMAIL, whatsappUrl } from '../constants.js'
import { useIdioma } from '../i18n/idioma.jsx'
import { useSeo } from '../lib/seo.jsx'

const VERSAO = '1.0'
const VIGOR = { pt: '22 de Outubro de 2026', en: '22 October 2026' }

const T = {
  pt: {
    seoTitulo: 'Política de privacidade e protecção de projectos',
    seoDescricao:
      'Política de privacidade, confidencialidade e protecção de projectos e participantes do TECNATO — dados pessoais, propriedade das ideias, divulgação de vídeos e deveres de confidencialidade.',
    voltar: '← Início',
    etiqueta: 'Transparência',
    titulo1: 'Política de privacidade, confidencialidade e ',
    tituloDestaque: 'protecção',
    titulo2: ' de projectos e participantes.',
    marca: 'TECNATO — A luz para os génios da banda.',
    versao: 'Versão',
    emVigor: 'Em vigor desde',
    simples: 'Em termos simples',
    artigo: 'Artigo',
    entidade:
      'TECNATO — plataforma angolana de identificação, valorização e visibilidade de talentos.',
    entidadeRotulo: 'Entidade responsável:',
    contactoRotulo: 'Contacto para questões de privacidade e confidencialidade:',
    whatsapp: 'WhatsApp oficial',
    dataVigorRotulo: 'Data de entrada em vigor:',
    pagina: 'Página:',
  },
  en: {
    seoTitulo: 'Privacy policy and project protection',
    seoDescricao:
      'TECNATO privacy, confidentiality and project and participant protection policy — personal data, ownership of ideas, video disclosure and duties of confidentiality.',
    voltar: '← Home',
    etiqueta: 'Transparency',
    titulo1: 'Privacy policy, confidentiality and ',
    tituloDestaque: 'protection',
    titulo2: ' of projects and participants.',
    marca: 'TECNATO — The light for the neighbourhood geniuses.',
    versao: 'Version',
    emVigor: 'In force since',
    simples: 'In simple terms',
    artigo: 'Article',
    entidade:
      'TECNATO — an Angolan platform for identifying, valuing and giving visibility to talent.',
    entidadeRotulo: 'Responsible entity:',
    contactoRotulo: 'Contact for privacy and confidentiality matters:',
    whatsapp: 'Official WhatsApp',
    dataVigorRotulo: 'Date of entry into force:',
    pagina: 'Page:',
  },
}

const DESTAQUES = {
  pt: [
    'A TUA IDEIA É TUA. O TECNATO não toma posse dos projectos apresentados — os direitos permanecem com os criadores (Art.º 4.º).',
    'ATENÇÃO: o TECNATO NÃO se responsabiliza se uma ideia apresentada publicamente for copiada por terceiros. O que o participante revela voluntariamente (vídeos, redes sociais, conversas, apresentações) fica exposto — e pode ser gravado, partilhado e replicado por outras pessoas. (Art.º 8.º).',
    'Apresente a ideia com clareza, mas sem revelar segredos técnicos, processos exclusivos, códigos, credenciais ou detalhes que não precise de mostrar. (Art.º 8.º, n.º 3).',
    'Conteúdos publicados oficialmente nos canais do TECNATO (ex. equipas destacadas, apresentações feitas em eventos e gravações oficiais) podem ficar gravados e divulgados nas nossas redes sociais, conforme as autorizações assinadas. (Art.º 5.º e 10.º).',
  ],
  en: [
    'YOUR IDEA IS YOURS. TECNATO does not take ownership of the projects presented — the rights remain with the creators (Article 4).',
    'WARNING: TECNATO is NOT responsible if an idea presented publicly is copied by third parties. What the participant voluntarily reveals (videos, social media, conversations, presentations) becomes exposed — and may be recorded, shared and replicated by other people. (Article 8).',
    'Present the idea clearly, but without revealing technical secrets, proprietary processes, code, credentials or details you do not need to show. (Article 8(3)).',
    'Content published officially on TECNATO channels (e.g. featured teams, presentations made at events and official recordings) may be recorded and disseminated on our social media, in accordance with the signed authorisations. (Articles 5 and 10).',
  ],
}

const ARTIGOS = {
  pt: [
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
  ],
  en: [
    {
      numero: '1',
      titulo: 'Purpose and scope',
      itens: [
        'This policy sets out the principles and rules on privacy, confidentiality, protection of information and processing of data applicable to TECNATO, its applicants, contestants, team members, collaborators, jurors, partners and all other persons who take part in its activities.',
        'Its purpose is to promote a safe, transparent and responsible participation environment, protecting the personal data, non-public information, projects, creations and legitimate interests of participants and of the organisation.',
        'This policy applies to applications, presentation videos, submitted documents, interviews, castings, internal activities, assessments, meetings, recordings and all other interactions related to TECNATO.',
        'This policy shall be interpreted in accordance with the legislation applicable in the Republic of Angola, without prejudice to other rights and obligations recognised by law.',
      ],
    },
    {
      numero: '2',
      titulo: 'Personal data and purposes of processing',
      itens: [
        'TECNATO may collect and process the data strictly necessary to manage applications, verify participation requirements, contact applicants, organise activities, carry out assessments, communicate results and administer the platform.',
        'Depending on the stage of participation, data such as name, contact details, municipality, team identification, information about the project, image, voice and other elements necessary for organising the initiative may be requested.',
        'Personal data shall not be collected or used for purposes incompatible with those communicated to participants, except where an adequate legal basis exists.',
        'Access to data shall be limited to the persons who need it to carry out duties related to TECNATO.',
        'TECNATO shall adopt appropriate measures to protect data against unauthorised access, use, alteration, loss or disclosure.',
        'Data will be kept only for the period necessary for the purposes communicated, without prejudice to legal obligations, the defence of rights or other legitimate grounds for retention.',
      ],
    },
    {
      numero: '3',
      titulo: 'Classification of information',
      itens: [
        'a) Public information: information whose disclosure has been authorised, including officially published content, public presentations and approved promotional materials.',
        'b) Restricted-access information: applications, contacts, administrative documents, assessments, internal communications, behind-the-scenes information and other elements not intended for the public.',
        'c) Confidential project information: technical, commercial, financial or strategic details that the holder identifies as such or that, by their nature, should reasonably be treated as confidential.',
        'd) Personal information: data that identify or allow a person to be identified, including contacts, image, voice and information relating to their private life.',
        'The classification of information shall guide the way in which it is collected, stored, used, shared and disclosed.',
      ],
    },
    {
      numero: '4',
      titulo: 'Ownership of projects and creations',
      itens: [
        'Participation in TECNATO does not automatically transfer to the organisation ownership of the projects, inventions, brands, designs, documents, code, methods, original content or other creations belonging to participants.',
        'Unless otherwise agreed in writing, the rights over each project remain with their respective holders, in accordance with applicable legislation.',
        'The submission of an application does not grant TECNATO any automatic right to commercially exploit, sell, reproduce in full, market or register in its own name a participant’s project.',
        'Participants are responsible for verifying the ownership of the materials presented, respecting third-party rights and obtaining the necessary authorisations for the use of content that does not belong to them.',
        'Where a project involves several creators, team members shall clarify among themselves the ownership of rights, the individual contributions and the conditions for using the project before submitting it.',
        'The organisation may request clarifications or additional documents where there are reasonable doubts about the ownership of a project or about the authorisation to present it.',
      ],
    },
    {
      numero: '5',
      titulo: 'Authorisation to use submitted materials',
      itens: [
        'By submitting materials for application purposes, the participant authorises TECNATO to receive, store and analyse them to the extent necessary for managing the application and assessing participation.',
        'Authorisation to use a material in the internal assessment does not amount to a general authorisation to publish, transmit, market or make it available to the public.',
        'The publication of videos, photographs, interviews, excerpts of presentations or other identifiable materials shall respect the purpose communicated and the applicable authorisations.',
        'Whenever a project or material is to be used for promotional, advertising or commercial purposes beyond the normal management of the application, the appropriate authorisation from the respective holder shall be obtained, where legally required.',
        'Any additional authorisation shall clearly state the materials covered, the purposes, the channels of use and the relevant conditions.',
        'Authorisation to disclose the presentation of a project does not imply authorisation to disclose confidential technical or commercial information that is not part of the content approved for publication.',
      ],
    },
    {
      numero: '6',
      titulo: 'Duty of confidentiality of the organisation',
      itens: [
        'Founders, directors, collaborators, production members, jurors, consultants, volunteers and other persons authorised to access non-public information are subject to duties of confidentiality appropriate to their duties and to the applicable legal obligations.',
        'Persons covered by the previous paragraph shall not disclose, copy, use for their own benefit or make available to third parties confidential information to which they have access by virtue of their participation in TECNATO, except with proper authorisation or legal grounds.',
        'Access to documents, applications and projects shall be limited to what is strictly necessary for the performance of the duties assigned.',
        'The organisation shall adopt reasonable procedures to reduce the risks of improper disclosure, including access control, appropriate storage and rules on document sharing.',
        'The duties of confidentiality shall continue to apply after the end of the collaboration or participation, for as long as the information remains confidential in nature or for the period established in the applicable commitment, without prejudice to legal obligations.',
        'The organisation shall deal with breaches of these duties according to their seriousness, the commitments assumed and applicable legislation, and may adopt internal measures and resort to the available legal mechanisms.',
      ],
    },
    {
      numero: '7',
      titulo: 'Duties of confidentiality of participants',
      itens: [
        'Participants undertake to respect the non-public information of other applicants, contestants, team members, jurors, collaborators and of the organisation to which they have access during TECNATO activities.',
        'It is prohibited to disclose, without proper authorisation, internal documents, other people’s applications, personal data, private communications, restricted recordings, confidential information or non-public details of third-party projects.',
        'Participants shall not use confidential information obtained through the platform to harm other contestants, obtain undue advantages or appropriate the creations of others.',
        'Participation in an internal activity, meeting or assessment session does not constitute authorisation to photograph, record or disclose its content where this has not been permitted.',
        'Participants shall report to the organisation, through the indicated channels, situations of improper access, unauthorised disclosure or suspected misuse of information.',
        'Breach of these duties may give rise to a warning, restriction of access, removal from activities or other measures provided for in the regulations, provided they are adequate, proportionate and compatible with applicable legislation.',
      ],
    },
    {
      numero: '8',
      titulo: 'Liability for voluntary or careless disclosure of projects',
      itens: [
        'Each participant is responsible for the information they choose to reveal voluntarily about their project, including the technical, commercial, financial, strategic and operational details presented in videos, interviews, meetings, demonstrations, social media or other communications.',
        'Before disclosing sensitive information, the participant shall assess the risks of its exposure and, where necessary, consult the other holders of the project or a professional qualified in intellectual property.',
        'TECNATO recommends that participants present their projects clearly enough to allow them to be understood and assessed, avoiding disclosure of formulas, detailed technical drawings, source code, proprietary processes, access credentials, trade secrets or other elements whose disclosure is not necessary.',
        'Where a participant voluntarily reveals, or reveals through a lack of care attributable to them, confidential information about their project to unauthorised persons, the organisation shall not automatically be liable for the consequences of that disclosure, provided these do not result from an act or omission attributable to TECNATO or to persons for whom it is legally responsible.',
        'TECNATO does not guarantee that information publicly disclosed by the participant themselves can be kept secret by third parties, nor can it ensure that published content will not be copied, reproduced, shared or improperly used by persons outside the organisation.',
        'This provision does not exclude or limit liabilities that legally fall on TECNATO, its representatives or third parties, including those arising from a breach of confidentiality, an attributable security failure, unauthorised use of information or non-compliance with legal obligations.',
        'Whenever an unauthorised disclosure is attributable to the organisation or to someone subject to its duties of confidentiality, TECNATO shall assess the incident, adopt reasonable measures to contain the disclosure and comply with the applicable legal obligations.',
        'The voluntary disclosure of information by the participant does not, by itself, mean that they waive all intellectual property rights or that any subsequent use by third parties is necessarily lawful.',
      ],
    },
    {
      numero: '9',
      titulo: 'Limits of confidentiality and external risks',
      itens: [
        'The obligation of confidentiality does not apply, to the extent legally permitted, to information that:',
        'a) Is already lawfully public, without breach of a duty of confidentiality;',
        'b) Was already lawfully known to the recipient before it was communicated;',
        'c) Is developed independently, without improper use of confidential information;',
        'd) Has been lawfully received from a third party authorised to disclose it;',
        'e) Must be communicated by virtue of law, a court decision or an order of a competent authority.',
        'Where legally permitted and appropriate, a person obliged to disclose confidential information by legal requirement shall limit the disclosure to what is necessary and inform the holder or the organisation in advance.',
        'TECNATO cannot guarantee the elimination of copies already obtained or distributed by third parties, nor fully control the actions of external platforms, social networks, messaging services or other systems that it does not administer.',
        'The organisation shall, however, adopt reasonable measures within its sphere of control to prevent and respond to unauthorised disclosures.',
      ],
    },
    {
      numero: '10',
      titulo: 'Submission and publication of videos',
      itens: [
        'The application video is intended to present the team, the municipality it intends to represent, the project and its purpose.',
        'Participants should avoid including in the video information that they do not wish to make accessible to persons involved in the assessment or that is not necessary to present the application.',
        'The publication of a video on TECNATO official channels shall respect the conditions communicated to participants and the necessary authorisations.',
        'Publication by the applicant themselves on social media or other public media is their responsibility, without prejudice to third-party rights and the applicable legal obligations.',
        'The organisation shall not assume that authorisation to receive or assess a video automatically includes authorisation to publish it on any platform, for an unlimited period or for commercial purposes.',
        'Whenever the video includes identifiable persons, personal information of third parties or protected materials, the participant shall ensure that they hold the necessary authorisations.',
      ],
    },
    {
      numero: '11',
      titulo: 'Minors',
      itens: [
        'Where an application or activity involves participants who are minors, the organisation shall apply procedures appropriate to their age and to the nature of the activity.',
        'Wherever legally required, the consent or authorisation of the legal representative shall be obtained for the collection and processing of data, for participation and for the public use of image and voice.',
        'Data of minors shall be handled with particular care, avoiding the unnecessary disclosure of personal contacts, addresses, routines or other information that could compromise their safety.',
        'The participation of a minor shall not be interpreted as unlimited authorisation for the commercial use of their image, voice or project.',
      ],
    },
    {
      numero: '12',
      titulo: 'Security incidents and unauthorised disclosures',
      itens: [
        'Anyone who identifies or suspects a leakage of information, unauthorised access, loss of documents or improper use of data shall report the incident to the organisation through the official contacts.',
        'The organisation shall assess the incident, limit the affected accesses, preserve the elements necessary for the investigation and adopt reasonable measures to reduce the risks.',
        'Where applicable, TECNATO shall comply with the legal duties of communication, notification or cooperation with the competent authorities and with the affected holders.',
        'Incidents will be handled with discretion, impartiality and respect for the rights of the persons involved.',
        'The reporting of an incident shall not automatically result in any penalty for the participant who reports it in good faith.',
      ],
    },
    {
      numero: '13',
      titulo: 'Rights of data subjects',
      itens: [
        'Data subjects may exercise the rights recognised to them by applicable legislation, including, as the case may be, requesting information about the processing, accessing their data, requesting the rectification of incorrect data and requesting the cancellation of, erasure of or objection to the processing where legally admissible.',
        'Requests shall be addressed to TECNATO official contacts. The organisation will analyse each request and respond in accordance with the applicable deadlines and conditions.',
        'The exercise of a right may be subject to legal limitations or to the need to retain certain elements in order to comply with legal obligations or defend legitimate rights.',
      ],
    },
    {
      numero: '14',
      titulo: 'Changes to the policy',
      itens: [
        'TECNATO may revise this policy to keep pace with legal, technological, organisational or operational changes.',
        'The updated version shall be made available through the official channels, stating the date of entry into force.',
        'Where a change materially affects the purposes or the conditions of personal data processing, the organisation shall provide the necessary information and obtain new consent where legally required.',
      ],
    },
    {
      numero: '15',
      titulo: 'Final provisions',
      itens: [
        'This policy supplements the participation regulations, the confidentiality commitments and the other documents applicable to TECNATO.',
        'In the event of conflict, the applicable mandatory legal provisions shall prevail.',
        'No clause shall be interpreted as a general waiver of the rights legally recognised to participants or as an exclusion of liability that the law does not permit.',
        'Participation in TECNATO shall take place with knowledge of the applicable rules and acceptance of the participation and confidentiality commitments that are legitimately required.',
      ],
    },
  ],
}

export default function PoliticaPrivacidade() {
  const { lang } = useIdioma()
  const c = T[lang]

  useSeo({
    titulo: c.seoTitulo,
    descricao: c.seoDescricao,
    caminho: '/politica-de-privacidade',
  })

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Link to="/" className="text-sm font-semibold text-ink/60 transition-colors hover:text-ink">
            {c.voltar}
          </Link>
          <div className="mt-8">
            <SectionLabel icone="escudo">{c.etiqueta}</SectionLabel>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold sm:text-5xl">
            {c.titulo1}
            <span className="text-brand-deep">{c.tituloDestaque}</span>
            {c.titulo2}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            {c.marca} {c.versao} {VERSAO} · {c.emVigor} {VIGOR[lang]}.
          </p>
        </div>
      </section>

      <section className="bg-paper pb-6">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative border border-line bg-white px-5 py-6 sm:px-8">
            <div className="absolute inset-y-0 left-0 w-1 bg-brand" aria-hidden="true" />
            <h2 className="text-xl font-bold sm:text-2xl">{c.simples}</h2>
            <ul className="mt-4 space-y-3">
              {DESTAQUES[lang].map((texto) => (
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
            {ARTIGOS[lang].map((artigo, indice) => (
              <div key={artigo.numero} className={indice > 0 ? 'mt-10' : undefined}>
                <h2 className="text-lg font-bold sm:text-xl">
                  {c.artigo} {artigo.numero} — {artigo.titulo}
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
                <strong>{c.entidadeRotulo}</strong> {c.entidade}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                <strong>{c.contactoRotulo}</strong>{' '}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-brand-deep hover:underline">
                  {EMAIL}
                </a>{' '}
                ·{' '}
                <a
                  href={whatsappUrl(lang)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-deep hover:underline"
                >
                  {c.whatsapp}
                </a>
              </p>
              <p className="mt-3 text-sm text-ink/60">
                <strong>{c.dataVigorRotulo}</strong> {VIGOR[lang]} · {c.versao} {VERSAO} · {c.pagina}{' '}
                /politica-de-privacidade
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
