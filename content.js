/**
 * Content Script - Despacho Automatico BO v2
 * Executa em todos os frames, mas cada step so roda no frame correto.
 */

if (window.__sispInjected) {
  console.log('[BO Extension] Content script ja injetado neste frame.');
} else {
  window.__sispInjected = true;

// ---- AUTO-DETECÇÃO DO RELATO INDIVIDUAL COM MARKITDOWN ----
// A cada 2 segundos (por 30 seg), verifica se este frame contém "Relato Individual:"
// Se encontrar, salva o texto bruto e o Markdown estruturado no chrome.storage para o popup consumir.
(function autoDetectRelato() {
  var checks = 0;
  var maxChecks = 15; // 15 * 2s = 30 segundos
  var interval = setInterval(function() {
    checks++;
    if (checks > maxChecks) { clearInterval(interval); return; }
    try {
      var bodyText = document.body ? (document.body.innerText || document.body.textContent || '') : '';
      if (/relato\s+individual/i.test(bodyText)) {
        var mdText = '';
        try {
          if (typeof MarkItDownEngine !== 'undefined') {
            var engine = new MarkItDownEngine();
            var rawMd = engine.convert(document.body);
            if (typeof MarkItDownCleaner !== 'undefined') {
              mdText = MarkItDownCleaner.sanitize(rawMd, { boNumber: '', fato: '' });
            } else {
              mdText = rawMd;
            }
          }
        } catch(errMd) {
          console.error('[BO Extension] Erro ao converter via MarkItDown:', errMd);
        }

        chrome.storage.local.set({
          _sispRelatoText: bodyText,
          _sispRelatoMarkdown: mdText,
          _sispRelatoTimestamp: Date.now()
        });
        console.log('[BO Extension] Relato Individual DETECTADO (' + bodyText.length + ' chars, MD: ' + mdText.length + ' chars). Salvo no storage.');
        clearInterval(interval);
      }
    } catch(e) {}
  }, 2000);
})();

// ============================
// IDENTIFICACAO DO FRAME
// ============================
// Frame principal: ng-version="16.1.4", tem ngx-overlay, NAO tem boin-arvore-registro
// Frame do formulario: ng-version="9.0.4", tem boin-arvore-registro, arvore-despacho, etc.
// Frame da lista de BOs: tem tabela com linhas EE + numeros de BO

function isMainFrame() {
  return window.self === window.top;
}

function isFormFrame() {
  // Angular elements or specific structure
  if (document.querySelector('boin-arvore-registro')) return true;
  if (document.querySelector('.arvore-registro')) return true;
  if (document.querySelector('mat-expansion-panel')) return true;

  var text = '';
  try { text = document.body ? (document.body.innerText || '') : ''; } catch (e) { return false; }

  // More relaxed keywords for form (supports both modern Angular and Legacy portal)
  var hasMarkers = (
    text.includes('Encaminhamento Interno') ||
    text.includes('Outros Despachos') ||
    text.includes('Histórico do BO') ||
    text.includes('Historico do BO') ||
    text.includes('Esclarecimento / Despacho') ||
    text.includes('Relato Individual') ||
    (text.includes('Salvar') && (text.includes('BO') || text.includes('Despacho') || text.includes('Ocorrência') || text.includes('Ocorrencia')))
  );

  return hasMarkers && text.length > 50;
}

function isListFrame() {
  // Relaxed table detection
  var hasTable = document.querySelector('table, tbody, .table');
  if (!hasTable) return false;

  var text = '';
  try { text = (document.body ? (document.body.innerText || '') : '').toLowerCase(); } catch (e) { return false; }

  // Pattern for BO number (e.g. 123/2023 or 1234/2024 or 12345/2024)
  var hasBoPattern = /\d+\/\d{4}/.test(text);

  // High confidence markers for list
  var hasListMarkers = (
    text.includes('pendentes') ||
    text.includes('recebidos') ||
    text.includes('aguardando') ||
    text.includes('registros desta unidade') ||
    text.includes('recebidos de outras unidades') ||
    text.includes('administração de despachos') ||
    text.includes('administracao de despachos') ||
    text.includes('boletins de ocorrencia') ||
    text.includes('boletins de ocorrência') ||
    (text.includes('bo') && hasBoPattern)
  );

  return hasListMarkers;
}

function frameType() {
  if (isFormFrame()) return 'FORM';
  if (isListFrame()) return 'LIST';
  if (isMainFrame()) return 'MAIN';
  return 'OTHER';
}

// ============================
// DESPACHOS
// ============================
var DESPACHOS = {
  fato_atipico: 'O Boletim de Ocorrência narra FATO ATÍPICO. Segundo entendimento do próprio STF, a instauração regular de procedimento investigativo depende necessariamente de "base empírica para tanto idônea e indicação plausível do fato delituoso a ser apurado", o que inexiste no caso em questão.(STF – Primeira Turma – Inq 3847 AgR/GO - Rel. Min. Dias Toffoli – j. em 07.04.2015 – Dje 108 de 05.06.2015 / STF – Primeira Turma – Pet 7354 AgR/DF - Rel. Min. Dias Toffoli – j. em 06.03.2018 – Dje 102 de 24.05.2018) Com efeito, a vedação legal ao poder investigativo em situações dessa natureza decorre, ainda, de eventuais ilações no campo penal por abuso de autoridade (arts. 27 e 30 da Lei n. 13.869/2019).',
  vitima_nao_representar: 'Conforme consta no Boletim de Ocorrência, a vítima não deseja não exercer o direito de representação ou queixa contra o autor.   Segundo entendimento do próprio STF, a instauração regular de procedimento investigativo depende necessariamente de "base empírica para tanto idônea e indicação plausível do fato delituoso a ser apurado", o que inexiste no caso em questão.(STF – Primeira Turma – Inq 3847 AgR/GO - Rel. Min. Dias Toffoli – j. em 07.04.2015 – Dje 108 de 05.06.2015 / STF – Primeira Turma – Pet 7354 AgR/DF - Rel. Min. Dias Toffoli – j. em 06.03.2018 – Dje 102 de 24.05.2018) Com efeito, a vedação legal ao poder investigativo em situações dessa natureza decorre, ainda, de eventuais ilações no campo penal por abuso de autoridade (arts. 27 e 30 da Lei n. 13.869/2019).',
  pericia: 'Requisite-se para Polícia Científica exame pericial no objeto ou local dos fatos mencionado no BO, e solicite-se o envio do laudo pericial a esta Delegacia, depois retorne para este signatário para nova apreciação.',
  dp_om_atribuicao: 'Exmo. (a) Senhor (a) Delegado (a),\nCumprimentando-o (a) cordialmente, encaminho o Boletim de Ocorrência a Vossa Excelência para ciência e providências que achar cabíveis.\nNa oportunidade, renovo protestos de elevada estima e distinta consideração.\nRespeitosamente,',
  decidir_posteriormente: 'VISTOS (Decidir posteriormente). \nAGUARDE-SE A MANIFESTACAO DA VITIMA no prazo decadencial, conforme a cientificacao constante no Boletim de Ocorrencia, em que a vitima Deseja Decidir posteriormente sobre o direito de representacao ou queixa, estando ciente de que o prazo para oferecer a representacao ou a queixa e de 06 (seis) meses, contados da data do fato ou da data em que vier a saber quem e o autor do fato. Pois, nos termos do artigo 5o do CPP: "Par. 4o O inquerito, nos crimes em que a acao publica depender de representacao, nao podera sem ela ser iniciado.; e, \nPar. 5o Nos crimes de acao privada, a autoridade policial somente podera proceder a inquerito a requerimento de quem tenha qualidade para intenta-la."',
  investigacao: 'Efetuar a VERIFICACAO PRELIMINAR DAS INFORMACOES do presente Boletim de Ocorrencia para a identificacao do autor(es), de acordo com as informacoes trazidas, dos termos do artigo 5o, paragrafo 3o do CPP. Caso as diligencias investigatorias realizadas nao seja possivel identificar o(s) autor(es), aguarde-se outro elemento de informacao caracterizador da autoria do delito, nao necessitando realizar nova tramitacao, pois em face da carencia de substrato fatico criminal razoavel a indicacao de da autoria delitiva. Por oportuno, nao custa lembrar que, segundo entendimento do proprio STF, a instauracao regular de procedimento investigativo depende necessariamente de "base empirica para tanto idonea e indicacao plausivel do fato delituoso a ser apurado" (STF - Primeira Turma - Inq 3847 AgR/GO - Rel. Min. Dias Toffoli - j. em 07.04.2015 - Dje 108 de 05.06.2015 / STF - Primeira Turma - Pet 7354 AgR/DF - Rel. Min. Dias Toffoli - j. em 06.03.2018 - Dje 102 de 24.05.2018), o que inexiste no caso em questao.',
  estelionato: `Intime-se a vítima para prestar declarações preliminares, e obrigatoriamente apresentar: a) comprovantes das transações financeiras (PIX, boletos, extratos com dados do recebedor); b) prints de conversas, telefones, perfis ou anúncios do fraudador; e c) dados de contratos ou entrega de mercadorias (se houver). Com o não comparecimento da vítima, certifique-se no SISP e sem tramitação.`,
  estelionato_insignificancia: `Vistos,
Trata-se de notícia-crime registrada mediante Boletim de Ocorrência que noticia, em tese, a suposta prática do delito de estelionato (art. 171 do Código Penal).
Constata-se dos autos que o prejuízo econômico suportado pela vítima/vantagem ilícita auferida reveste-se de valor inexpressivo, sendo o fato despido de violência física, grave ameaça ou periculosidade social, impondo-se a análise da incidência do princípio da insignificância (crime de bagatela) à luz da Nota Técnica nº 007/2026/CAAPJ/ASJUR/DGPC da Polícia Civil do Estado de Santa Catarina.
I. DA EXCLUSÃO DA TIPICIDADE MATERIAL PELO PRINCÍPIO DA INSIGNIFICÂNCIA
Segundo a teoria tripartite do delito, a infração penal compõe-se analiticamente de fato típico, ilícito e culpável, sendo o primeiro substrato constituído por conduta, resultado, nexo causal e tipicidade. A tipicidade compreende as dimensões formal (juízo de subsunção entre o fato e o modelo abstrato da lei) e material (efetiva lesão ou perigo concreto de lesão ao bem jurídico tutelado).
O princípio da insignificância, como vetor de política criminal (Claus Roxin), opera como causa supralegal de exclusão da tipicidade material por meio de interpretação restritiva do tipo penal, tornando a conduta formalmente típica em irrelevante penal, ante a ausência de lesão ou de perigo relevante de lesão ao bem jurídico albergado diante da inexpressividade do comportamento praticado (STF, HC 104.787/RJ, Rel. Min. Ayres Britto; Carlos Vico Mañas; Eugenio Raúl Zaffaroni; Pierpaolo Cruz Bottini).
II. DOS REQUISITOS OBJETIVOS E CRITÉRIOS DE INCIDÊNCIA (STF E STJ)
Conforme fixado pelo Supremo Tribunal Federal (HC 84.412/SP, Rel. Min. Celso de Mello), o reconhecimento da insignificância reclama a presença cumulativa dos seguintes requisitos objetivos:
a) mínima ofensividade da conduta do agente;
b) nenhuma periculosidade social da ação;
c) reduzidíssimo grau de reprovabilidade do comportamento;
d) inexpressividade da lesão jurídica provocada.
No plano dos crimes patrimoniais, o Superior Tribunal de Justiça (STJ) adota a diretriz geral de que o valor da res/prejuízo não ultrapasse 10% (dez por cento) do salário-mínimo vigente à época dos fatos (STJ, AgRg no REsp 1.992.226/RS), admitindo-se a flexibilização do parâmetro para patamares em torno de 30% (trinta por cento) do salário-mínimo conforme as peculiaridades do caso concreto (STJ, 5ª Turma, AgRg no HC 965.993/SP, Rel. Min. Maria Marluce Caldas, j. 13.05.2026), evidenciando o caráter relativo do critério estritamente econômico.
III. DA APLICAÇÃO AO DELITO DE ESTELIONATO (ART. 171 DO CÓDIGO PENAL)
O Superior Tribunal de Justiça admite a aplicação do princípio da insignificância ao crime de estelionato (art. 171, caput, do CP), inclusive reconhecendo a atipicidade material em casos com prejuízo de até 14,72% do salário-mínimo mesmo em se tratando de agente com reincidência específica, quando as circunstâncias do caso recomendem a medida (STJ, 6ª Turma, AREsp 2.847.740/SC, Rel. Min. Otávio de Almeida Toledo, j. 11.06.2025).
Outrossim, no estelionato eletrônico (art. 171, § 2º-A, do CP) e no estelionato contra vulneráveis (art. 171, § 4º, do CP), prevalece a diretriz das Cortes Superiores de que eventuais qualificadoras, reincidência ou concurso de pessoas não são óbices intransponíveis e automáticos à incidência da bagatela na ausência de especial censurabilidade, privilegiando-se o Direito Penal do Fato em detrimento do Direito Penal do Autor (STF, HC 188.494 AgR/SP; STF, HC 245.089 AgR/MG; STJ, AgRg no HC 834.558/GO; STJ, AgRg no AREsp 3.181.994/RJ).
Ressalva-se que a bagatela é inaplicável ao estelionato contra a Administração Pública (art. 171, § 3º, do CP; Súmula 599 do STJ), previdenciário e ao recebimento fraudulento de auxílio emergencial ou seguro-desemprego, admitida exceção apenas em hipóteses de mínimo desvalor da ação e valor ínfimo (STJ, RHC 153.480/CP).
IV. DO PODER-DEVER DA AUTORIDADE POLICIAL DE CONTROLE DA TIPICIDADE MATERIAL
A instauração de inquérito policial e a lavratura de auto de prisão em flagrante reclamam suporte empírico idôneo de fato aparentemente típico, ilícito, culpável e punível (justa causa / juízo de possibilidade investigativa - art. 3º-B, IX, do CPP; fundada suspeita - art. 304, § 1º, do CPP).
A Autoridade Policial, como primeiro agente estatal juridicamente qualificado a analisar os fatos e filtro democrático e garantista do sistema penal (art. 2º da Lei Federal nº 12.830/2013 e art. 26 da Lei Federal nº 14.735/2023 - Lei Orgânica Nacional das Polícias Civis), possui a autonomia e o dever funcional de exercer o controle técnico-jurídico sobre a tipicidade formal e material da conduta (Alexandre Morais da Rosa, Salah Khaled Jr., André Nicolitt, Cleber Masson, Guilherme de Souza Nucci, Guilherme Merolli, Leonardo Marcondes Machado, Nereu Giacomolli).
A constatação de atipicidade material em sede policial não configura arquivamento de inquérito policial (vedado pelo art. 17 do CPP), mas juízo prévio e fundamentado de não instauração de procedimento ou de não formalização de prisão em flagrante por ausência de justa causa investigativa. Ademais, a Resolução nº 279/2023 do CNMP dispensa comunicação individualizada prévia ao Ministério Público nessas hipóteses, ressalvado o pleno exercício do controle externo ordinário por amostragem e inspeções.
V. DISPOSITIVO E DETERMINAÇÕES
Ante o exposto, com fundamento na Nota Técnica nº 007/2026/CAAPJ/ASJUR/DGPC e nos precedentes jurisprudenciais do STF e STJ:
1. RECONHEÇO A ATIPICIDADE MATERIAL da conduta em razão da incidência do PRINCÍPIO DA INSIGNIFICÂNCIA, ante a manifesta inexpressividade da lesão patrimonial e a ausência de relevância penal da conduta;
2. Por conseguinte, DEIXO DE INSTAURAR INQUÉRITO POLICIAL / DEIXO DE RATIFICAR OU LAVRAR AUTO DE PRISÃO EM FLAGRANTE por ausência de justa causa investigativa (art. 3º-B, IX, do CPP);
3. Proceda-se ao registro e baixa do presente Boletim de Ocorrência no sistema policial (SISP), com as devidas anotações no campo de deliberação da Autoridade Policial;
4. Caso discorde do indeferimento da persecução criminal, poderá interpor recurso administrativo ao Chefe de Polícia, a teor do art. 5º, § 2º, do Código de Processo Penal, ou demandar a reparação civil cabível perante o Juízo Cível competente.`,
  queixa: 'Conforme o principio da Celeridade e informalidade do JEC: Fazer contato com a vitima via aplicativo para alertar a vitima que tera que contratar um advogado para propor no juizado especial a queixa-crime em seis meses. Posteriormente, anexar no SISP, sem tramitacao, a captura de tela para a vitima, ou certidao.',
  jec_incondicionada: 'Conforme o principio da Celeridade e informalidade do JEC: Fazer contato com o AUTOR e informar que: Tem o direito de permanecer calado e se quer exercer esse direito; Pode fazer a gravacao em video ou audio de seu depoimento e enviar via Whatsapp, ou Pode disponibilizar link para o AUTOR prestar declaracao, ou Pode fazer o comparecimento pessoal na Delegacia, Posteriormente anexar no SISP o depoimento, o video or o audio (com sua transcricao) e/ou demais informacoes e tramitar ao cartorio de TC.',
  jec_condicionada: `Conforme o princípio da Celeridade e informalidade do JEC:
1) Intimar a vítima para comparecer na delegacia para prestar termo de declaração preliminar e alertar a vítima que ela deverá comparecer no juizado especial todas as vezes que for intimada, caso não queira representar, anexar no SISP esta informação e marcar como resolvido sem necessidade de tramitação.
2) Caso a vítima não renuncie o direito de representação:
2.1) Fazer contato com o AUTOR e informar que:
a) Tem o direito de permanecer calado e se quer exercer esse direito;
b) Pode fazer a gravação em vídeo ou audio de seu depoimento e enviar via Whatsapp, ou
c) Pode disponibilizar link para o AUTOR prestar declaração, ou
d) Pode fazer o comparecimento pessoal na Delegacia,
3) Posteriormente anexar no SISP o depoimento, o vídeo ou o audio (com sua transcrição) e/ou demais informações e tramitar ao cartório de TC.`,
  oitivas_preliminares: 'Intime-se a vitima para prestar termo de declaracao preliminar e juntar documentos (laudos) comprobatorios e maiores informacoes sobre os fatos, depois retorne para ulterior deliberacao.',
  desacordo_comercial: `O STJ tem diversas decisões que tratam do tema. Entre os principais entendimentos, destaca-se: Ausência de dolo caracterizando desacordo comercial: "A mera inadimplência contratual não configura o delito de estelionato, pois exige-se a demonstração do dolo antecedente, ou seja, a intenção de enganar a vítima no momento da celebração do contrato." (HC 455.252/SP, Rel. Min. Nefi Cordeiro, 6ª Turma, julgado em 10/04/2018) Simulação ou fraude no contrato pode configurar estelionato: "Quando demonstrou que o agente celebrou contrato com o objetivo de, desde o início, não cumprir as obrigações pactuadas, valendo-se de planos para induzir a vítima em erro, caracterizando-se o delito de estelionato." (AgRg no AREsp 168.091/RS, Rel. Min. Maria Thereza de Assis Moura, 6ª Turma, julgada em 19/03/2019) Requisitos para caracterização do estelionato: "É indispensável a demonstração de que o agente empregou fraude ou ardil, com dolo antecedente, para obter vantagem ilícita em prejuízo da vítima. A ausência desses elementos remete ao conflito à seara cível." (AgRg no REsp 1.829.943/SP, Rel. Min. Reynaldo Soares da Fonseca, 5ª Turma, julgado em 09/03/2019).\n\nNo caso em tela, não ficou caracterizado o dolo antecedente do suposto autor, afastando o delito de estelionato. Trata-se, portanto, de conflito a ser dirimido no âmbito cível e fatos desta natureza devem ser registrados como "atípicos".\n\nAssim, a pretensão da vítima reputa-se não plausível, conforme exposto acima, e caso a não concorde com o indeferimento de instauração de inquérito policial é possível recurso para o chefe de Polícia, conforme o disposto no art. 5º, § 2º, do CPP (Do despacho que indeferir o requerimento de abertura de inquérito caberá recurso para o chefe de Polícia).`,
  fraude: `Intimar a vítima para comparecer na delegacia para prestar termo de declaração preliminar e juntar os documentos comprobatórios, caso não compareça anexar no SISP esta informação e marcar como resolvido sem necessidade de tramitação. Deixar consignado na intimação que a vítima deverá:\nTrazer documentos que contenham o nome do banco, número da agência (cidade e bairro) e conta corrente do GOLPISTA na qual foi realizado o DEPÓSITO, ou esclarecer que não houve transferência (art. 70, §4, CPP -domicílio da vítima) e juntar o documento comprobatório;\nO documento que contenha o nome do banco, número da agência(cidade e bairro) da VÍTIMA no caso de FURTO de valores da CONTA (ag. da vítima);\nOu documentos para demonstrar o local onde foi efetuada a compra fraudulenta do produto, bairro, cidade e estado em que o autor foi beneficiado com a COMPRA utilizando-se de CARTÃO CLONADO (local da compra no estabelecimento comercial) e juntar o documento comprobatório;\nOu documentos que contenham o nome do banco, número da agência(cidade e bairro) e conta corrente de onde ocorreu o SAQUE de valor com uso de CARTÃO CLONADO (local onde ocorreu o saque fraudulento);\nPara a vítima informar onde foi o local em que ocorreu a ENTREGA A MERCADORIA (retirada do produto) e juntar o documento comprobatório;`,
  estelionato_atribuicao: `Exmo. (a) Senhor (a) Delegado (a),\nCumprimentando-o (a) cordialmente, encaminho o Boletim de Ocorrência de estelionato a Vossa Excelência para ciência e providências que achar cabíveis, nos termos do CPP, art. 70, § 4º Nos crimes previstos no art. 171 do Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), quando praticados mediante depósito, mediante emissão de cheques sem suficiente provisão de fundos em poder do sacado ou com o pagamento frustrado ou mediante transferência de valores, a competência será definida pelo local do domicílio da vítima, e, em caso de pluralidade de vítimas, a competência firmar-se-á pela prevenção.`,
  conflito_visitacao: `Trata-se de CONFLITO RELATIVO AO DIREITO DE VISITAÇÃO DOS FILHOS MENORES DE IDADE, QUE DEVERÁ SER DIRIMIDO EM ÂMBITO CÍVEL, desta forma, não configura delito de desobediência o descumprimento de acordo judicial de visitação dos filhos, vez que é pacífico na doutrina e jurisprudência que tal infração penal não se caracteriza quando a lei comina sanções civis e/ou administrativas para o descumprimento de uma determinação legal. Nesse sentido, inclusive, é a jurisprudência do STJ: PENAL. CRIME DE DESOBEDIÊNCIA. DETERMINAÇÃO JUDICIAL ASSEGURADA POR MULTA DIÁRIA DE NATUREZA CIVIL (ASTREINTES). ATIPICIDADE DA CONDUTA. Para a configuração do delito de desobediência, salvo se a lei ressalvar expressamente a possibilidade de cumulação da sanção de natureza civil ou administrativa com a de natureza penal, não basta apenas o não cumprimento de ordem legal, sendo indispensável que, além de legal a ordem, não haja sanção determinada em lei específica no caso de descumprimento. (Precedentes). Habeas corpus concedido, ratificando os termos da liminar anteriormente concedida. (STJ, HC nº 22721/SP, Rel. Min. Félix Fischer, 5ª Turma, 27.05.03) Trata-se, portanto, de conflito a ser dirimido no âmbito cível e fatos desta natureza devem ser registrados como "atípicos".\n\nAssim, a pretensão da vítima reputa-se não plausível, conforme exposto acima, e caso a não concorde com o indeferimento de instauração de inquérito policial é possível recurso para o chefe de Polícia, conforme o disposto no art. 5º, § 2º, do CPP (Do despacho que indeferir o requerimento de abertura de inquérito caberá recurso para o chefe de Polícia).`,
  devolucao_veiculo: `1 - Verificar onde o veículo se encontra;\n2 - Fazer contato com o proprietário, caso este veículo não tenha sido entregue:\n3 - Analisar os documentos pessoais de propriedade do automóvel;\n4 - Caso esteja regular a documentação, proceder a realização do termo de entrega do veículo, inserindo no SISP;\n5 - Inserir os documentos (termo de entrega e documentos pessoais do proprietário e do veículo) no sistema para baixa no Detrannet/BIN;\n6 - Após as providências acima, encaminhar o BO de recuperação para Delegacia em que foi registrado o furto do veículo.`,
  cnh_sem_perigo: `Trata-se de fato atípico, já que não se enquadra ao art 309 (Dirigir sem Habilitação ou com Direito Cassado, gerando perigo de dano), pois não gerou perigo de dano conforme descrito no relato.`,
  instaurar_ip: `Em razão dos elementos constantes no BO instaurar IP`,
  oitivas_preliminares_testemunha: `Intime-se a(s) testemunha(s) para prestar termo de declaração preliminar para maiores informações sobre os fatos. Juntar documentos ou laudos, se houver, depois retorne para ulterior deliberação.`,
  imagens: `Favor solicitar as imagens do local dos fatos, para esclarecimentos das circunstâncias em que ocorreu o evento.`,
  aguardar_outro_elemento: `Aguarde-se OUTRO ELEMENTO DE INFORMAÇÃO caracterizador de algum delito.
Por ora, impossível estabelecer, quanto à vertente notícia-crime, alguma linha investigativa concreta e condizente com níveis mínimos de eficácia a serem exigidos modernamente para a válida (e racional) instauração de qualquer procedimento oficial de persecução criminal.
Sublinhe-se, in casu, o teor da declaração da vítima é no sentido da absoluta carência de substrato fático criminal razoável à indicação de materialidade e eventual autoria delitiva.
Por oportuno, não custa lembrar que, segundo entendimento do próprio STF, a instauração regular de procedimento investigativo depende necessariamente de "base empírica para tanto idônea e indicação plausível do fato delituoso a ser apurado" (STF – Primeira Turma – Inq 3847 AgR/GO - Rel. Min. Dias Toffoli – j. em 07.04.2015 – Dje 108 de 05.06.2015 / STF – Primeira Turma – Pet 7354 AgR/DF - Rel. Min. Dias Toffoli – j. em 06.03.2018 – Dje 102 de 24.05.2018), o que inexistente no caso em questão.
Com efeito, a vedação legal ao poder investigativo em situações dessa natureza decorre, ainda, de eventuais ilações no campo penal por abuso de autoridade (arts. 27 e 30 da Lei n. 13.869/2019). 
Assim, a pretensão da vítima reputa-se não plausível, conforme exposto acima, e caso a não concorde com o indeferimento de instauração de inquérito policial é possível recurso para o chefe de Polícia, conforme o disposto no art. 5º, § 2º, do CPP (Do despacho que indeferir o requerimento de abertura de inquérito caberá recurso para o chefe de Polícia).`,
  rel_invest_sem_autoria: `CONFORME RELATÓRIO DE INVESTIGAÇÃO, não foi possível identificar o autor do fato.
Em que pese diligências prévias, em anexo, realizadas com o fito de angariar elementos mínimos à instauração de procedimento formal de apuração (inquérito policial) que não se apresentasse natimorto, sob o viés jurídico-penal e investigativo operacional, ausentes na espécie condições necessárias para tanto. Por ora, impossível estabelecer, quanto à vertente notícia-crime, alguma linha investigativa concreta e condizente com níveis mínimos de eficácia a serem exigidos modernamente para a válida (e racional) instauração de qualquer procedimento oficial de persecução criminal.
Sublinhe-se, in casu, conforme o teor do relatório de investigação, todas as diligências cabíveis foram adotadas, não sendo possível identificar o autor do fato, assim, no sentido da absoluta carência de substrato fático criminal razoável à indicação da autoria delitiva. Por oportuno, não custa lembrar que, segundo entendimento do próprio STF, a instauração regular de procedimento investigativo depende necessariamente de "base empírica para tanto idônea e indicação plausível do fato delituoso a ser apurado" (STF – Primeira Turma – Inq 3847 AgR/GO - Rel. Min. Dias Toffoli – j. em 07.04.2015 – Dje 108 de 05.06.2015 / STF – Primeira Turma – Pet 7354 AgR/DF - Rel. Min. Dias Toffoli – j. em 06.03.2018 – Dje 102 de 24.05.2018), o que inexistente no caso em questão.
Com efeito, a vedação legal ao poder investigativo em situações dessa natureza decorre, ainda, de eventuais ilações no campo penal por abuso de autoridade (arts. 27 e 30 da Lei n. 13.869/2019).
Assim, a pretensão da vítima reputa-se não plausível, conforme exposto acima, e caso a não concorde com o indeferimento de instauração de inquérito policial é possível recurso para o chefe de Polícia, conforme o disposto no art. 5º, § 2º, do CPP (Do despacho que indeferir o requerimento de abertura de inquérito caberá recurso para o chefe de Polícia).
Ante todo o exposto, arquive-se, por ora, a vertente notícia-crime, de forma que, havendo novos dados informativos, retorne para providências ulteriores, ou esta autoridade policial poderá proceder a novas pesquisas, se de outras provas tiver notícia.`,
};

var DETECTION_KEYWORDS = {
  fato_atipico: ['fato atipico', 'fato atípico', 'acidente de trânsito (apenas danos materiais)', 'acidente de transito (apenas danos materiais)'],
  vitima_nao_representar: ['vitima nao quer representar', 'vítima não quer representar', 'não exercer o direito de representação', 'não deseja representar'],
  pericia: ['pericia', 'perícia'],
  dp_om_atribuicao: ['dp om atribuicao', 'dp com atribuicao', 'dp com atribuição', 'dp om atribuição'],
  decidir_posteriormente: ['decidir posteriormente', 'deseja decidir posteriormente'],
  estelionato: ['estelionato'],
  estelionato_insignificancia: ['estelionato insignificancia', 'estelionato insignificância', 'estelionato bagatela', 'estelionato - insignificancia', 'estelionato - insignificância', 'estelionato valor inexpressivo'],
  queixa: ['calunia', 'calúnia', 'difamacao', 'difamação', 'injuria', 'injúria', 'exercicio arbitrario das proprias razoes', 'exercício arbitrário das próprias razões', 'dano', 'fraude a execucao', 'fraude à execução', 'alteracao de limites', 'alteração de limites', 'esbulho possessorio', 'esbulho possessório', 'introducao ou abandono de animais em propriedade alheia', 'introdução ou abandono de animais em propriedade alheia'],
  jec_incondicionada: ['vias de fato', 'perturbacao do sossego', 'desobediencia', 'resistencia', 'desacato', 'fuga do local do acidente', 'violacao da suspensao', 'dirigir sem habilitacao', 'entregar veiculo a pessoa nao habilitada', 'trafegar em velocidade incompativel', 'fraude processual no transito'],
  jec_condicionada: ['ameaca', 'ameaça', 'perseguicao', 'outras fraudes', 'omissao de socorro', 'lesao corporal leve', 'lesão corporal leve', 'lesao corporal culposa', 'lesão corporal culposa', 'violacao do segredo profissional', 'violação do segredo profissional', 'invasao de dispositivo informatico', 'invasão de dispositivo informático', 'furto de coisa comum', 'perigo de contagio venereo', 'perigo de contágio venéreo', 'violacao de correspondencia', 'violação de correspondência'],
  oitivas_preliminares: ['apropriacao indebita', 'falsidade documental', 'racismo'],
  investigacao: ['furto', 'roubo'],
  desacordo_comercial: ['desacordo comercial'],
  fraude: ['fraude'],
  conflito_visitacao: ['visitação', 'visita', 'conflito de visitação'],
  devolucao_veiculo: ['devolução de veículo', 'veículo'],
  estelionato_atribuicao: ['estelionato atribuição', 'estelionato atribuicao', 'estelionato competência', 'estelionato competencia'],
  cnh_sem_perigo: ['309', 'sem habilitação', 'sem perigo de dano'],
  instaurar_ip: [],
  oitivas_preliminares_testemunha: ['suicídio', 'suicidio'],
  imagens: [],
  aguardar_outro_elemento: ['outro elemento', 'aguarde-se outro elemento', 'caracterizador de algum delito', 'carência de substrato fático'],
  rel_invest_sem_autoria: ['relatorio de investigacao', 'relatório de investigação', 'não foi possível identificar o autor', 'sem autoria']
};

var DETECTION_PRIORITY = [
  'fato_atipico', 'vitima_nao_representar', 'pericia', 'dp_om_atribuicao',
  'decidir_posteriormente', 'estelionato_insignificancia', 'estelionato', 'queixa',
  'jec_incondicionada', 'jec_condicionada', 'oitivas_preliminares', 'investigacao',
  'desacordo_comercial', 'fraude', 'estelionato_atribuicao', 'conflito_visitacao', 'devolucao_veiculo', 'cnh_sem_perigo', 'instaurar_ip', 'oitivas_preliminares_testemunha', 'imagens', 'aguardar_outro_elemento', 'rel_invest_sem_autoria'
];

// ============================
// UTILS
// ============================
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

function notify(type, payload) {
  chrome.runtime.sendMessage(Object.assign({ type: type }, payload || {})).catch(function () { });
}

function log(msg, level) {
  level = level || 'info';
  console.log('[BO:' + frameType() + '] ' + msg);
  notify('LOG', { msg: msg, level: level });
}

function findByText(selector, text) {
  var t = (text || '').toLowerCase();
  return Array.from(document.querySelectorAll(selector))
    .find(function (el) {
      var content = (el.textContent || '').trim().toLowerCase();
      var val = (el.value || '').trim().toLowerCase();
      // Verifica texto interno ou atributo value (comum em inputs do SISP)
      return content.includes(t) || val.includes(t);
    });
}

function fastClick(el) {
  if (!el) return false;
  el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  el.click();
  return true;
}

function isVisibleElement(el) {
  if (!el) return false;
  var r = el.getBoundingClientRect ? el.getBoundingClientRect() : { width: 0, height: 0 };
  var st = window.getComputedStyle ? window.getComputedStyle(el) : null;
  // Se r.width/height são 0, o elemento não está renderizado ou está display:none
  return (!st || (st.display !== 'none' && st.visibility !== 'hidden')) && (r.width > 0 || r.height > 0);
}

// Cache para texto do BO (evita múltiplas chamadas a innerText)
var cachedBoText = null;
var cachedBoTextTime = 0;

function getBoTextLower() {
  var now = Date.now();
  // Cache válido por 200ms (suficiente para múltiplas chamadas em sequência)
  if (cachedBoText && (now - cachedBoTextTime) < 200) {
    return cachedBoText;
  }
  cachedBoText = document.body.innerText ? document.body.innerText.toLowerCase() : '';
  cachedBoTextTime = now;
  return cachedBoText;
}

// Regex pré-compilada COM TODAS as keywords - uma única busca no texto
// Mapeia índice do grupo capturante -> tipo
var ANALYZE_REGEX = (function() {
  var groupToType = [];
  var patternParts = [];
  
  for (var i = 0; i < DETECTION_PRIORITY.length; i++) {
    var tipo = DETECTION_PRIORITY[i];
    var kws = DETECTION_KEYWORDS[tipo];
    for (var j = 0; j < kws.length; j++) {
      // Escape de caracteres especiais regex
      var escaped = kws[j].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      patternParts.push(escaped);
      groupToType.push(tipo);
    }
  }
  
  // Criar regex única com grupos nomeados
  ///(fato atipico|fato atípico|...)/i
  var regex = new RegExp('(' + patternParts.join(')|(') + ')', 'i');
  return { regex: regex, groupToType: groupToType };
})();

function analyzeBO() {
  var text = getBoTextLower();
  if (!text) return null;
  
  var match = ANALYZE_REGEX.regex.exec(text);
  if (!match) return null;
  
  // match[0] é o texto整体 encontrado (primeiro match)
  // Os grupos start em match[1], match[2], etc.
  // Encontrar qual grupo casou
  for (var g = 1; g < match.length; g++) {
    if (match[g]) {
      // Retorna o tipo correspondente ao grupo que casou
      var tipoIndex = g - 1;
      if (tipoIndex < ANALYZE_REGEX.groupToType.length) {
        return ANALYZE_REGEX.groupToType[tipoIndex];
      }
    }
  }
  
  return null;
}

// ============================
// DEBUG
// ============================
function debugDOM() {
  var info = 'DOM[' + frameType() + ']: ' +
    'tables=' + document.querySelectorAll('table').length +
    ' tbody-rows=' + document.querySelectorAll('tbody tr').length +
    ' buttons=' + document.querySelectorAll('button').length +
    ' contenteditable=' + document.querySelectorAll('[contenteditable]').length +
    ' textarea=' + document.querySelectorAll('textarea').length;
  console.log('[BO DEBUG]', info);
  console.log('[BO DEBUG HTML]', document.body.innerHTML.substring(0, 600));
  notify('LOG', { msg: info, level: 'info' });
}

// ============================
// WAIT FOR ELEMENT / ANGULAR
// ============================
async function waitForAngular(selector, timeout) {
  timeout = timeout || 12000;
  // Se o seletor já existe e está acessível, retorna imediatamente
  if (document.querySelector(selector)) return true;

  var elapsed = 0;
  while (elapsed < timeout) {
    var loader = document.querySelector('.ngx-overlay');
    var loaderGone = !loader || loader.style.opacity === '0' || loader.style.display === 'none' || !loader.offsetParent;
    if (loaderGone && document.querySelector(selector)) return true;
    await sleep(200);
    elapsed += 200;
  }
  return !!document.querySelector(selector);
}

// ============================
// STEP 1 - Lista de BOs (roda no frame com a tabela)
// ============================
function isBoRow(tr) {
  var cells = tr.querySelectorAll('td');
  if (cells.length < 2) return false;
  var cell1 = cells.length > 1 ? cells[1].textContent.trim() : '';
  if (/\d{4,}\/\d{4}-(BO|BOCOP)/i.test(cell1)) return true;
  var cell0 = cells[0].textContent.trim();
  if (cell0 === 'EE' && cells.length >= 4) return true;
  var full = tr.textContent;
  if (/\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}/.test(full) && /\d{4,}\/\d{4}/.test(full)) return true;
  return false;
}

async function step1_clickFirstBO() {
  // Instead of early exit, we wait to see if this frame BECOMES a list frame
  log('Iniciando Passo 1 no frame ' + frameType() + '...', 'info');

  // Wait up to 3 seconds for it to look like a list
  var isList = false;
  for (var i = 0; i < 15; i++) {
    if (isListFrame()) { isList = true; break; }
    await sleep(200);
  }

  if (!isList) {
    if (document.body.innerText.length < 100) {
      log('Frame vazio ou não carregado. Ignorando clique.', 'warning');
    }
    return;
  }

  log('Frame lista confirmado. Aguardando BOs aparecerem...', 'info');

  await waitForAngular('table tbody tr, tbody tr, [class*="pendente"]', 12000);
  await sleep(400);

  // Clicar em "Pendentes" (Prioriza o visível para suportar ambas as abas: Recebidos e Registros)
  var allEls = Array.from(document.querySelectorAll('button, a, label, span, mat-tab-label, .mat-tab-label-content'));
  var pendentesBtn = null;
  
  log('Buscando botão "Pendentes" entre ' + allEls.length + ' elementos...', 'info');

  // Tenta encontrar o botão EXATO e VISÍVEL primeiro
  for (var i = 0; i < allEls.length; i++) {
    var txt = allEls[i].textContent.trim().toLowerCase();
    if ((txt === 'pendentes' || txt === 'pendente') && isVisibleElement(allEls[i])) {
      pendentesBtn = allEls[i];
      log('Botão "Pendentes" visível encontrado.', 'info');
      break;
    }
  }

  // Se não achou exato visível, tenta qualquer um que contenha o texto e seja visível
  if (!pendentesBtn) {
    for (var i2 = 0; i2 < allEls.length; i2++) {
      var txt2 = allEls[i2].textContent.toLowerCase();
      if (txt2.includes('pendente') && isVisibleElement(allEls[i2])) {
        pendentesBtn = allEls[i2];
        log('Botão contendo "pendente" visível encontrado.', 'info');
        break;
      }
    }
  }

  // Fallback se nada visível for encontrado: pega o primeiro do DOM (comportamento antigo)
  if (!pendentesBtn) {
    log('Nenhum botão "Pendentes" visível. Tentando fallback no DOM...', 'warning');
    for (var i3 = 0; i3 < allEls.length; i3++) {
      var txt3 = allEls[i3].textContent.trim().toLowerCase();
      if (txt3 === 'pendentes' || txt3 === 'pendente') { 
        pendentesBtn = allEls[i3]; 
        log('Botão "Pendentes" encontrado via fallback (pode não estar visível).', 'warning');
        break; 
      }
    }
  }

  if (pendentesBtn) {
    log('Clicando em "Pendentes"...', 'info');
    fastClick(pendentesBtn);
    // Tenta clicar no pai label ou mat-tab se for um radio/aba escondida
    var par = pendentesBtn.closest('label') || pendentesBtn.closest('mat-tab-label') || pendentesBtn.closest('.mat-tab-label');
    if (par && par !== pendentesBtn) fastClick(par);
    
    await waitForAngular('tbody tr', 8000);
    await sleep(600);
  } else {
    log('Botão "Pendentes" não localizado. Verifique se a aba de Despachos está aberta.', 'warning');
  }

  // Encontrar primeira linha de BO
  var tbody = document.querySelector('table tbody') || document.querySelector('tbody');
  if (tbody) {
    var rows = tbody.querySelectorAll('tr');
    log('Linhas no tbody: ' + rows.length, 'info');
    for (var r = 0; r < rows.length; r++) {
      if (r < 5) log('Verificando linha ' + r + ': ' + rows[r].textContent.trim().substring(0, 60), 'info');
      if (isBoRow(rows[r])) {
        var cells = rows[r].querySelectorAll('td');
        var clickTarget = cells[2] || cells[1] || cells[0] || rows[r];
        fastClick(clickTarget);
        log('Linha de BO identificada e clicada: "' + rows[r].textContent.trim().substring(0, 80) + '"', 'success');
        notify('STEP_DONE', { step: 1 });
        return;
      }
    }
    // Sem validar, pegar a primeira linha com conteudo
    if (rows.length > 0) {
      var c = rows[0].querySelectorAll('td');
      if (c.length > 0) {
        fastClick(c[2] || c[1] || c[0]);
        log('Clicou primeira linha do tbody (sem validacao)', 'warning');
        notify('STEP_DONE', { step: 1 });
        return;
      }
    }
  }

  // Fallback: td com numero de BO
  var tds = document.querySelectorAll('td');
  for (var t = 0; t < tds.length; t++) {
    if (/\d{4,}\/\d{4}-(BO|BOCOP)/i.test(tds[t].textContent.trim())) {
      var pRow = tds[t].closest('tr') || tds[t];
      var pCells = pRow.querySelectorAll ? pRow.querySelectorAll('td') : [];
      fastClick(pCells[2] || pCells[1] || tds[t]);
      log('Clicou via td com numero BO', 'success');
      notify('STEP_DONE', { step: 1 });
      return;
    }
  }

  debugDOM();
  notify('STEP_ERROR', { step: 1, msg: 'Tabela nao renderizada. tr=' + document.querySelectorAll('tr').length });
}

// ============================
// STEP 2 - Abrir BO (frame da lista): clicar em "Resumo" (sup. direito)
// ============================
async function step2_openBO() {
  // Wait to see if this is the right place
  await sleep(100);
  if (!isListFrame() && !isFormFrame()) return;

  log('Passo 2: Tentando abrir resumo do BO...', 'info');

  for (var w = 0; w < 20; w++) {
    // Estrategia 1: botao com texto exato "Resumo"
    var resumoBtn = findByText('button,a', 'Resumo');
    if (resumoBtn) {
      fastClick(resumoBtn);
      log('Botao "Resumo" clicado ✓', 'success');
      notify('STEP_DONE', { step: 2 });
      return;
    }

    // Estrategia 2: botao/link com icone de lista (fa-list, fa-bars, fa-th-list)
    var iconBtns = Array.from(document.querySelectorAll('button,a')).filter(function (el) {
      return el.innerHTML.includes('fa-list') || el.innerHTML.includes('fa-th-list') ||
        el.innerHTML.includes('fa-bars') || el.innerHTML.includes('list') ||
        el.innerHTML.includes('fa-align-justify') || el.innerHTML.includes('fa-navicon') ||
        (el.title && el.title.toLowerCase().includes('resumo'));
    });
    if (iconBtns.length > 0) {
      fastClick(iconBtns[0]);
      log('Botao Resumo (icone lista) clicado ✓', 'success');
      notify('STEP_DONE', { step: 2 });
      return;
    }

    // Estrategia 3: qualquer botao no canto superior direito da pagina
    var allBtns = Array.from(document.querySelectorAll('button,a')).filter(function (el) {
      var r = el.getBoundingClientRect();
      return r.width > 0 && r.right > (window.innerWidth * 0.6) && r.top < (window.innerHeight * 0.3);
    });
    if (allBtns.length > 0) {
      log('Tentando botao sup. direito: cls="' + (allBtns[0].className || '').substring(0, 40) +
        '" txt="' + allBtns[0].textContent.trim().substring(0, 20) + '"', 'info');
      fastClick(allBtns[0]);
      notify('STEP_DONE', { step: 2 });
      return;
    }

    // Aguarda antes de tentar novamente
    await sleep(200);
  }

  notify('STEP_ERROR', {
    step: 2, msg: 'Botao "Resumo" nao encontrado após 4 segundos.'
  });
}

// ============================
// STEP 3 - Analisar BO (frame do formulario)
// ============================
function cleanBoText(text) {
  return (text || '')
    .normalize('NFC')
    .replace(/\r/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\t\u00A0 ]+/g, ' ')
    .replace(/\n[\t\u00A0 ]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}


function getFormTextCandidates(root) {
  root = root || document;
  var selectors = 'textarea, [contenteditable="true"], input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"])';
  var seen = {};
  return Array.from(root.querySelectorAll(selectors))
    .filter(isVisibleElement)
    .map(function (el) { return cleanBoText(el.value || el.innerText || el.textContent || el.getAttribute('aria-label') || ''); })
    .filter(function (value) {
      if (value.length < 20 || seen[value]) return false;
      seen[value] = true;
      return true;
    })
    .sort(function (a, b) { return b.length - a.length; });
}

function collectDeepText(root, depth) {
  depth = depth || 0;
  if (!root || depth > 8) return '';

  var parts = [];
  try {
    if (root.nodeType === Node.ELEMENT_NODE) {
      var el = root;
      var tag = (el.tagName || '').toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript') return '';
      if (tag === 'textarea' || tag === 'input') parts.push(el.value || '');
      if (el.getAttribute) {
        parts.push(el.getAttribute('aria-label') || '');
        parts.push(el.getAttribute('title') || '');
      }
      if (el.shadowRoot) parts.push(collectDeepText(el.shadowRoot, depth + 1));
    }

    if (root.childNodes && root.childNodes.length) {
      root.childNodes.forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) parts.push(child.textContent || '');
        else parts.push(collectDeepText(child, depth + 1));
      });
    }
  } catch (e) { }

  return cleanBoText(parts.join('\n'));
}

function cutAfterRelato(text) {
  var stopRegex = /\n\s*(?:RELATO\s+INDIVIDUAL|RELATOS?\s+INDIVIDUAIS?|ENVOLVIDOS?|V[ÍI]TIMAS?|COMUNICANTE|DECLARANTE|AUTORES?|SUSPEITOS?|TESTEMUNHAS?|OBJETOS?|ANEXOS?|PROCEDIMENTOS?|PROVID[ÊE]NCIAS?|ENCAMINHAMENTO|OUTROS DESPACHOS|ESCLARECIMENTO\s*\/\s*DESPACHO|DADOS DO BO|CLASSIFICA[ÇC][ÃA]O|NATUREZA|UNIDADE|HIST[ÓO]RICO\s+DE\s+ALTERA[ÇC][ÕO]ES)\b/i;
  var stop = stopRegex.exec(text || '');
  if (stop && stop.index > 80) return text.slice(0, stop.index);
  return text;
}

function extractTextAfterStandaloneRelato(text) {
  var lines = cleanBoText(text).split('\n').map(function (line) { return line.trim(); });
  var labels = /^(?:relato|narrativa|hist[óo]rico|descri[çc][ãa]o(?: dos? fatos)?|texto do relato|conte[úu]do do relato)\s*:?$/i;
  var inline = /^(?:relato|narrativa|hist[óo]rico|descri[çc][ãa]o(?: dos? fatos)?|texto do relato|conte[úu]do do relato)\s*[:\-–—]\s*(.+)$/i;

  for (var i = 0; i < lines.length; i++) {
    var m = inline.exec(lines[i]);
    if (m && m[1] && m[1].length > 30) {
      return cutAfterRelato(cleanBoText([m[1]].concat(lines.slice(i + 1)).join('\n')));
    }
    if (labels.test(lines[i])) {
      return cutAfterRelato(cleanBoText(lines.slice(i + 1).join('\n')));
    }
  }
  return '';
}

function looksLikeNarrative(text) {
  var t = cleanBoText(text);
  if (t.length < 60) return false;
  var words = t.split(/\s+/).length;
  var lower = t.toLowerCase();
  var narrativeWords = /(relata|informa|declara|alega|comunica|foi|estava|teve|sofreu|recebeu|percebeu|constatou|ameaç|agred|ofend|injuri|xing|subtra|furt|roub|golpe|engan|danific|invadi|persegui|ocorreu|autor|suspeit|vítim|vitim)/i.test(lower);
  var metadataOnly = /^(dados do relato|data|hora|unidade|munic[íi]pio|nome|cpf|rg|telefone|endere[çc]o|email|e-mail|tipo do relato|comunicante|declarante|v[íi]tima)[:\s\n\d\/.,-]+$/i.test(t);
  return !metadataOnly && (narrativeWords || (words > 35 && /[.!?]/.test(t)));
}

function findRelatoIndividualSectionText() {
  var elements = Array.from(document.querySelectorAll('body *'))
    .filter(isVisibleElement)
    .filter(function (el) {
      var own = cleanBoText(el.innerText || el.textContent || '');
      return /relato\s+individual/i.test(own);
    })
    .sort(function (a, b) {
      return (cleanBoText(a.innerText || '').length || 0) - (cleanBoText(b.innerText || '').length || 0);
    });

  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    var node = el;
    for (var depth = 0; node && depth < 6; depth++, node = node.parentElement) {
      var parts = [node.innerText || ''].concat(getFormTextCandidates(node));
      var txt = cleanBoText(parts.join('\n'));
      if (/relato\s+individual/i.test(txt) && txt.length > 120) return txt;
    }
  }
  return '';
}

function buildSearchIndex(text) {
  var original = cleanBoText(text);
  var folded = '';
  var map = [];

  for (var i = 0; i < original.length; i++) {
    var normalized = original[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (!normalized) continue;
    for (var j = 0; j < normalized.length; j++) {
      folded += normalized[j];
      map.push(i);
    }
  }

  return { original: original, folded: folded, map: map };
}

function extractRelatoIndividualText(text) {
  var indexed = buildSearchIndex(text);
  if (!indexed.folded) return '';

  var bases = [{ pos: 0, weight: 0 }];
  var envolvidosRegex = /envolvidos?\s*[:\-–—*]?\s*/g;
  var envolvidosMatch;
  while ((envolvidosMatch = envolvidosRegex.exec(indexed.folded)) !== null) {
    bases.push({ pos: envolvidosMatch.index + envolvidosMatch[0].length, weight: 100000 });
  }

  var relatoRegex = /(?:relato\s+individual|hist[oó]rico(?:\s+da\s+ocorr[eê]ncia)?)\s*[:\-–—*]?\s*/g;
  var outrasInfoRegex = /outras\s+informacoes\s*[:\-–—*]?/;
  var sectionEndRegex = /\n\s*(?:dados\s+do\s+relato|relato\s+individual|envolvidos?|objetos?|anexos?|procedimentos?|providencias?|encaminhamento|outros\s+despachos|esclarecimento\s*\/\s*despacho|historico\s+de\s+alteracoes|dados\s+do\s+bo|classificacao|natureza|unidade)\s*[:\-–—*]?/;
  var bestCandidate = '';
  var bestScore = -1;

  for (var b = 0; b < bases.length; b++) {
    var base = bases[b];
    var search = indexed.folded.slice(base.pos);
    relatoRegex.lastIndex = 0;
    var match;

    while ((match = relatoRegex.exec(search)) !== null) {
      var foldedStart = base.pos + match.index + match[0].length;
      var afterStart = indexed.folded.slice(foldedStart);
      var end = outrasInfoRegex.exec(afterStart) || sectionEndRegex.exec(afterStart);

      var originalStart = indexed.map[foldedStart] == null ? indexed.original.length : indexed.map[foldedStart];
      var originalEnd;
      if (end) {
        originalEnd = indexed.map[foldedStart + end.index] == null ? indexed.original.length : indexed.map[foldedStart + end.index];
      } else {
        originalEnd = Math.min(indexed.original.length, originalStart + 6000);
      }

      var candidate = cleanBoText(indexed.original.slice(originalStart, originalEnd));
      if (candidate.length < 20) continue;

      var score = base.weight + candidate.length;
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }
  }

  return bestCandidate;
}

function compactBoText(text) {
  var seen = {};
  var lines = cleanBoText(text).split('\n');
  var out = [];

  for (var i = 0; i < lines.length; i++) {
    var line = cleanBoText(lines[i]);
    if (!line) continue;
    var key = line.toLowerCase();
    if (seen[key]) continue;
    seen[key] = true;
    out.push(line);
  }

  return cleanBoText(out.join('\n'));
}

function extractRelatoBO(silent) {
  var visibleText = cleanBoText(document.body.innerText || '');
  var deepText = cleanBoText(collectDeepText(document.body));
  var formCandidates = getFormTextCandidates(document);
  var sources = [visibleText, deepText].concat(formCandidates);
  var fullText = compactBoText(sources.join('\n'));
  if (fullText) sources.push(fullText);

  var bestCandidate = '';
  for (var i = 0; i < sources.length; i++) {
    var candidate = extractRelatoIndividualText(sources[i]);
    if (candidate.length > bestCandidate.length) bestCandidate = candidate;
  }

  if (bestCandidate) {
    log('Relato Individual extraído do campo ENVOLVIDOS (' + bestCandidate.length + ' chars)', 'info');
    return bestCandidate.slice(0, 12000);
  }

  if (!silent) log('Não foi possível localizar o texto após "Relato Individual" no campo ENVOLVIDOS.', 'warning');
  return '';
}

function step3_analyze() {
  var tipo = analyzeBO();
  var bodyText = document.body.innerText || document.body.textContent || '';
  var fatos = (bodyText.match(/FATOS COMUNICADOS[:\s]+([^\n]+)/i) || [])[1] || '';
  if (!fatos) fatos = (bodyText.match(/Fatos? Comunicados?[:\s]+([^\n]+)/i) || [])[1] || 'Verificar BO';
  
  // Coleta o texto mais completo possível de TODAS as fontes
  var allTexts = [bodyText];
  
  try { allTexts.push(collectDeepText(document.body)); } catch(e) {}
  
  // Também busca dentro de iframes acessíveis
  try {
      var iframes = document.querySelectorAll('iframe');
      for (var f = 0; f < iframes.length; f++) {
          try {
              var iframeDoc = iframes[f].contentDocument || iframes[f].contentWindow.document;
              if (iframeDoc && iframeDoc.body) {
                  var iText = iframeDoc.body.innerText || iframeDoc.body.textContent || '';
                  if (iText.length > 50) allTexts.push(iText);
                  try { allTexts.push(collectDeepText(iframeDoc.body)); } catch(e) {}
              }
          } catch(e) {}
      }
  } catch(e) {}

  // Junta tudo e remove duplicatas de linhas
  var combined = allTexts.join('\n');
  var textToSend = cleanBoText(combined);
  
  if (!isFormFrame() && (!textToSend || textToSend.length < 50)) return null;

  log('Texto completo do BO coletado (' + textToSend.length + ' chars)', 'info');
  return { ok: true, tipo: tipo, despacho: tipo ? DESPACHOS[tipo] : null, fatos: fatos.trim(), relato: textToSend.slice(0, 30000), frameType: frameType() };
}

// ============================
// STEP 4 - Inserir despacho (frame do formulario)
// ============================
async function step4_insertDespacho(despacho) {
  if (!isFormFrame()) {
    log('Frame tipo=' + frameType() + ' — ignorando step4 (nao e FORM)', 'info');
    return;
  }

  if (window.isInsertingDespacho) {
    log('Já existe uma inserção de despacho em andamento. Ignorando múltiplos cliques.', 'warning');
    return;
  }
  window.isInsertingDespacho = true;

  try {
    log('Passo 4: Inserindo despacho...', 'info');
    await sleep(500);

    // PASSO 0: Fechar modais de relatorio abertos
    await fecharModaisRelatorio();
    await sleep(300);

    // PASSO 0.5: Garantir que o painel de encaminhamento esteja aberto
    await tentarAbrirPainelEncaminhamento();
    await sleep(400);

    var editorEl = encontrarEditorDespacho();

    if (!editorEl) {
      // PASSO 1: Encontrar o botao azul "+ Incluir" logo apos "Encaminhamento Interno / Outros Despachos"
      var btnIncluir = encontrarBotaoIncluirEncaminhamento();
      if (!btnIncluir) {
        log('Botao "+ Incluir" do Encaminhamento Interno nao encontrado', 'error');
        // Diagnostico
        var diagHtml = (function () {
          var idx = document.body.innerHTML.indexOf('Encaminhamento Interno');
          if (idx < 0) return '(Encaminhamento Interno nao encontrado no HTML)';
          return document.body.innerHTML.substring(Math.max(0, idx - 50), idx + 800).replace(/<[^>]*>/g, ' ');
        })();
        log('DIAG-HTML (texto): ' + diagHtml.substring(0, 500), 'error');
        
        notify('STEP_ERROR', { step: 4, msg: 'Botao "+ Incluir" nao encontrado. Verifique se o painel "Encaminhamento Interno" esta aberto.' });
        return;
      }

      log('Botao "+ Incluir" encontrado: cls="' + (btnIncluir.className || '').substring(0, 40) +
        '" txt="' + btnIncluir.textContent.trim().substring(0, 30) + '"', 'info');

      // PASSO 2: Clicar no botao e aguardar o formulario "Esclarecimento / Despacho" aparecer
      btnIncluir.scrollIntoView({ block: 'center', behavior: 'auto' });
      await sleep(200);
      btnIncluir.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
      btnIncluir.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
      btnIncluir.click();

      log('"+ Incluir" clicado — aguardando textarea "Esclarecimento / Despacho"...', 'info');

      // Aguardar textarea ou modal (ate 8s)
      for (var w = 0; w < 40; w++) {
        await sleep(200);
        // Procurar primeiro por textarea com label "Esclarecimento / Despacho"
        editorEl = encontrarEditorDespacho();
        if (editorEl) {
          log('Textarea "Esclarecimento / Despacho" encontrada (' + ((w + 1) * 200) + 'ms)', 'success');
          break;
        }
      }
    } else {
      log('Textarea "Esclarecimento / Despacho" já estava aberta.', 'info');
    }

    if (!editorEl) {
      log('Textarea nao apareceu. DIAG-DOM: ' + (function () {
        var ta = Array.from(document.querySelectorAll('textarea, [contenteditable="true"]'));
        return ta.length + ' editores: ' + ta.slice(0, 3).map(function (e) {
          return e.tagName + ' cls="' + (e.className || '').substring(0, 30) + '"';
        }).join(', ');
      })(), 'error');
      notify('STEP_ERROR', { step: 4, msg: 'Textarea "Esclarecimento / Despacho" nao apareceu apos clicar em + Incluir' });
      return;
    }

    // PASSO 3: Inserir o texto do despacho
    var ok = await insertInEditor(editorEl, despacho);
    if (ok) {
      log('Despacho inserido com sucesso ✓', 'success');
      notify('STEP_DONE', { step: 4 });
    } else {
      log('Falha ao inserir no editor', 'error');
      notify('STEP_ERROR', { step: 4, msg: 'Falha ao inserir texto no editor' });
    }
  } finally {
    window.isInsertingDespacho = false;
  }
}

// Encontra o botao azul "+ Incluir" logo apos o label "Encaminhamento Interno / Outros Despachos"
// O botao e azul (btn-primary ou btn-success) e fica na mesma linha/secao do label
function encontrarBotaoIncluirEncaminhamento() {
  // Textos possiveis do botao
  var textosBotao = ['+ Incluir', '+Incluir', 'Incluir', '+ incluir', 'incluir'];

  // Estrategia 1: buscar pelo label e subir para o container, procurar botao azul dentro
  var labelEl = encontrarLabelInterno();
  if (labelEl) {
    log('Label interno encontrado: "' + labelEl.textContent.trim() + '"', 'info');
    var container = labelEl;
    for (var up = 0; up < 8; up++) {
      if (!container.parentElement) break;
      container = container.parentElement;
      // Procurar botao azul (btn-primary, btn-success, btn-info) dentro do container
      var btnsAzuis = Array.from(container.querySelectorAll(
        'button.btn-primary, button.btn-success, button.btn-info, a.btn-primary, a.btn-success'
      )).filter(function (b) {
        var r = b.getBoundingClientRect();
        return r.width > 0;
      });
      if (btnsAzuis.length > 0 && btnsAzuis.length <= 5) {
        log('Botao azul encontrado no container (subiu ' + (up + 1) + ' niveis): "' +
          btnsAzuis[0].textContent.trim().substring(0, 30) + '"', 'info');
        return btnsAzuis[0];
      }
      // Procurar qualquer botao com texto incluir no container
      var btnIncluirTexto = Array.from(container.querySelectorAll('button, a')).find(function (b) {
        var r = b.getBoundingClientRect();
        if (r.width === 0) return false;
        var t = b.textContent.trim().toLowerCase();
        return t.includes('incluir') && !t.includes('destinat');
      });
      if (btnIncluirTexto) return btnIncluirTexto;
    }
  }

  // Estrategia 2: buscar globalmente por botao com texto "+ Incluir" visivel
  var todosbtns = Array.from(document.querySelectorAll('button, a.btn'));
  for (var i = 0; i < todosbtns.length; i++) {
    var b = todosbtns[i];
    var r = b.getBoundingClientRect();
    if (r.width === 0) continue;
    var t = b.textContent.trim();
    for (var j = 0; j < textosBotao.length; j++) {
      if (t === textosBotao[j] || t.toLowerCase() === textosBotao[j].toLowerCase()) {
        log('Botao Incluir encontrado por texto: "' + t + '"', 'info');
        return b;
      }
    }
  }

  return null;
}

// Encontra o textarea/editor do formulario "Esclarecimento / Despacho"
// Apos clicar em "+ Incluir", o SISP abre este formulario
function encontrarEditorDespacho() {
  // Procurar textarea visivel
  var textareas = Array.from(document.querySelectorAll('textarea')).filter(function (el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && !el.disabled;
  });
  if (textareas.length > 0) {
    log('encontrarEditorDespacho: encontrado textarea visivel', 'info');
    return textareas[0];
  }

  // Procurar contenteditable visivel
  var editaveis = Array.from(document.querySelectorAll('[contenteditable="true"]')).filter(function (el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  if (editaveis.length > 0) return editaveis[0];

  // Procurar dentro de modais/dialogs
  var modais = document.querySelectorAll('.modal.in, .modal[style*="block"], [role="dialog"]');
  for (var i = 0; i < modais.length; i++) {
    var m = modais[i];
    var r = m.getBoundingClientRect();
    if (r.width > 0) {
      var edInModal = findEditorIn(m);
      if (edInModal) return edInModal;
    }
  }

  return null;
}


// Aguarda ate timeout por: (1) editor visivel, ou (2) modal Bootstrap abrir
// Retorna { editor, modal } — um dos dois pode ser null
async function waitForModalOrEditor(timeout) {
  var elapsed = 0;
  var intervalo = 200;
  while (elapsed < timeout) {
    await sleep(intervalo);
    elapsed += intervalo;

    // Verificar editor padrao
    var ed = findEditor();
    if (ed) return { editor: ed, modal: null };

    // Verificar modal Bootstrap visivel
    var modais = Array.from(document.querySelectorAll(
      '.modal.in, .modal[style*="display: block"], .modal[aria-hidden="false"], [role="dialog"]'
    )).filter(function (m) {
      var r = m.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

    if (modais.length > 0) {
      var modal = modais[0];
      // Procurar editor dentro do modal
      var edInModal = findEditorIn(modal);
      if (edInModal) return { editor: edInModal, modal: modal };
      // Modal abriu mas editor ainda nao carregou — aguardar mais um pouco
      if (elapsed > 1000) return { editor: null, modal: modal };
    }
  }
  return { editor: null, modal: null };
}

// Igual ao findEditor mas busca dentro de um container especifico
function findEditorIn(container) {
  var candidates = [];
  container.querySelectorAll('[contenteditable="true"]').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) candidates.push(el);
  });
  container.querySelectorAll('textarea').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && !el.disabled) candidates.push(el);
  });
  container.querySelectorAll('[role="textbox"]').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) candidates.push(el);
  });
  container.querySelectorAll('.note-editable, .note-editor').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) candidates.push(el);
  });
  container.querySelectorAll('input[type="text"]:not([readonly]):not([disabled])').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) candidates.push(el);
  });
  return candidates.length > 0 ? candidates[0] : null;
}

// Fecha modais de relatorio abertos (aparecem como botoes "Fechar relatorio" no SISP)
// Esses modais bloqueiam o acesso ao formulario de despacho
async function fecharModaisRelatorio() {
  var fechados = 0;

  // Estrategia 1: botoes com texto "Fechar relatorio" (exato ou parcial)
  var allBtns = Array.from(document.querySelectorAll('button'));
  for (var i = 0; i < allBtns.length; i++) {
    var b = allBtns[i];
    var txt = b.textContent.trim();
    if (txt === 'Fechar relatorio' || txt === 'Fechar Relatório' || txt.toLowerCase().includes('fechar relat')) {
      var r = b.getBoundingClientRect();
      if (r.width > 0) {
        log('Fechando modal relatorio: "' + txt + '"', 'info');
        b.click();
        fechados++;
        await sleep(200);
      }
    }
  }

  // Estrategia 2: botoes .close dentro de modal/.panel/div visivel
  if (fechados === 0) {
    var closeBtns = Array.from(document.querySelectorAll('button.close, [data-dismiss="modal"], .modal .close'));
    for (var j = 0; j < closeBtns.length; j++) {
      var r2 = closeBtns[j].getBoundingClientRect();
      if (r2.width > 0) {
        log('Fechando modal via .close button', 'info');
        closeBtns[j].click();
        fechados++;
        await sleep(150);
      }
    }
  }

  if (fechados > 0) {
    log('Modais fechados: ' + fechados + '. Aguardando...', 'info');
    await sleep(600);
  } else {
    log('Nenhum modal de relatorio encontrado para fechar.', 'info');
  }
}

// Tenta abrir/expandir o painel "Encaminhamento Interno / Outros Despachos"
// Suporta: accordion Angular Material (mat-expansion-panel), collapse Bootstrap, div clicavel
async function tentarAbrirPainelEncaminhamento() {

  var textoAlvo = ['Encaminhamento Interno / Outros Despachos', 'Outros Despachos', 'Encaminhamento Interno'];

  // Busca por mat-expansion-panel-header, button accordion, ou div com o texto
  var candidatos = Array.from(document.querySelectorAll(
    'mat-expansion-panel-header, [role="button"], button, .panel-heading, .card-header, [data-toggle="collapse"], .accordion-button'
  ));

  for (var i = 0; i < candidatos.length; i++) {
    var el = candidatos[i];
    var t = el.textContent.trim();
    var matched = textoAlvo.some(function (txt) {
      return t.includes(txt) && !t.includes('Externo') && !t.includes('externo');
    });
    if (!matched) continue;

    // Verifica se esta colapsado
    var panel = el.closest('mat-expansion-panel') || el.closest('.panel') || el.closest('.card') || el.parentElement;
    var isExpanded = el.getAttribute('aria-expanded') === 'true' ||
      (panel && panel.classList.contains('mat-expanded')) ||
      (panel && panel.classList.contains('in')) || // Bootstrap collapse
      (panel && panel.classList.contains('show'));

    if (!isExpanded) {
      log('Abrindo painel "' + t.substring(0, 50) + '"...', 'info');
      el.scrollIntoView({ block: 'center', behavior: 'auto' });
      await sleep(200);
      el.click();
      await sleep(600);
      return true;
    } else {
      log('Painel "' + t.substring(0, 50) + '" ja esta expandido.', 'info');
      return true;
    }
  }

  // Fallback: busca qualquer elemento clicavel com o texto
  var allEls = Array.from(document.querySelectorAll('*'));
  for (var j = 0; j < allEls.length; j++) {
    var el2 = allEls[j];
    if (el2.children.length > 4) continue;
    var t2 = el2.textContent.trim();
    if (t2.length > 80) continue;
    var matched2 = textoAlvo.some(function (txt) {
      return t2 === txt || t2.startsWith(txt);
    });
    if (!matched2) continue;
    var tag = el2.tagName.toLowerCase();
    if (tag === 'button' || tag === 'a' || el2.getAttribute('role') === 'button' || el2.onclick) {
      log('Fallback: clicando em "' + t2.substring(0, 50) + '" (' + tag + ') para abrir secao', 'info');
      el2.scrollIntoView({ block: 'center', behavior: 'auto' });
      await sleep(200);
      el2.click();
      await sleep(600);
      return true;
    }
  }

  return false;
}

// Encontra qualquer elemento editor visivel na pagina
// Suporta: contenteditable, textarea, input text, quill, tinymce, Summernote, Angular material
function findEditor() {
  var candidates = [];

  // contenteditable=true (inclui quill .ql-editor, ng-contenteditable, etc)
  document.querySelectorAll('[contenteditable="true"]').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) candidates.push({ el: el, type: 'contenteditable' });
  });

  // textarea visivel
  document.querySelectorAll('textarea').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && !el.disabled) candidates.push({ el: el, type: 'textarea' });
  });

  // [role="textbox"] — usado por varios editores ricos
  document.querySelectorAll('[role="textbox"]').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) candidates.push({ el: el, type: 'role-textbox' });
  });

  // Summernote / Bootstrap editor
  document.querySelectorAll('.note-editable, .note-editor').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) candidates.push({ el: el, type: 'summernote' });
  });

  // input[type=text] visivel e nao readonly
  document.querySelectorAll('input[type="text"]:not([readonly]):not([disabled])').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) candidates.push({ el: el, type: 'input-text' });
  });

  if (candidates.length === 0) return null;
  log('findEditor: ' + candidates.length + ' candidatos: ' +
    candidates.map(function (c) { return c.type + '.' + (c.el.className || '').substring(0, 30); }).join(', '), 'info');
  return candidates[0].el;
}

// Insere texto num elemento editor detectado
async function insertInEditor(el, text) {
  try {
    if (!el) return false;
    if (!text) {
      log('insertInEditor: texto vazio, ignorando', 'warning');
      return false;
    }
    log('insertInEditor: inserindo ' + text.length + ' caracteres', 'info');
    
    el.focus();
    var tag = el.tagName.toLowerCase();
    var isContentEditable = el.isContentEditable || el.getAttribute('contenteditable') === 'true';
    var role = el.getAttribute('role') || '';

    if (isContentEditable || role === 'textbox') {
      // Editor rico (contenteditable / quill / Angular)
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);

      // Tentar usar insertHTML primeiro pois converte \n perfeitamente mantendo o texto inteiro num só evento
      var htmlText = text.replace(/\n/g, '<br>');
      var successHtml = document.execCommand('insertHTML', false, htmlText);

      if (!successHtml) {
        // Fallback: usar text/plain na área de transferência (simula um Paste ctrl+v real, muito mais robusto)
        var dt = new DataTransfer();
        dt.setData('text/plain', text);
        var pasteEvent = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
        el.dispatchEvent(pasteEvent);

        // Se ainda estiver vazio, tentar o insertText bruto do texto inteiro
        if (!el.textContent.trim()) {
          document.execCommand('insertText', false, text);
        }
      }

      el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
      log('insertInEditor: texto inserido via execCommand/paste em ' + tag + ' (successHtml=' + successHtml + ')', 'info');
      return true;
    }

    if (tag === 'textarea' || tag === 'input') {
      // Input nativo — usa setter nativo para compatibilidade Angular/React
      var proto = tag === 'textarea' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      var setter = Object.getOwnPropertyDescriptor(proto, 'value');
      if (setter && setter.set) {
        setter.set.call(el, text);
      } else {
        el.value = text;
      }
      el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
      log('insertInEditor: texto inserido via nativeSetter em ' + tag, 'info');
      return true;
    }

    return false;
  } catch (e) {
    log('insertInEditor ERRO: ' + e.message, 'error');
    return false;
  }
}

// Encontra botoes da secao "Encaminhamento Interno / Outros Despachos"
// Estrategia 1: sobe no DOM a partir do label para encontrar o container que contem botoes
// Estrategia 2: TreeWalker DOM-order (botoes APOS o label)
// Estrategia 3: busca bidirecional nos vizinhos do label
function findBotoesSectionInterno() {
  // ---- Encontrar o label da secao ----
  var internoEl = encontrarLabelInterno();
  if (!internoEl) {
    log('Label "Encaminhamento Interno" NAO encontrado', 'warning');
    var texts = Array.from(document.querySelectorAll('h3,h4,h5,strong,label,span,.panel-title,th,td'))
      .filter(function (e) { return e.children.length === 0 && e.textContent.trim().length > 2 && e.textContent.trim().length < 80; })
      .map(function (e) { return '"' + e.textContent.trim() + '"'; }).slice(0, 20);
    log('Titulos visiveis: ' + texts.join(', '), 'info');
    return [];
  }
  log('Label secao INTERNO: <' + internoEl.tagName + '> "' + internoEl.textContent.trim().substring(0, 60) + '"', 'info');

  // ---- Estrategia 1: subir no DOM ate encontrar container com botoes (max 12 botoes = container especifico) ----
  var container = internoEl;
  var melhorContainer = null;
  var melhorBtns = null;
  for (var up = 0; up < 10; up++) {
    if (!container.parentElement) break;
    container = container.parentElement;
    var btnsInside = Array.from(container.querySelectorAll('button')).filter(function (b) {
      var r = b.getBoundingClientRect();
      return r.width > 0 || b.offsetParent !== null;
    });
    if (btnsInside.length > 0 && btnsInside.length <= 12) {
      log('Container encontrado (subiu ' + (up + 1) + ' niveis): <' + container.tagName +
        '> class="' + (container.className || '').substring(0, 40) + '" btns=' + btnsInside.length, 'info');
      btnsInside.slice(0, 5).forEach(function (b, i) {
        log('Btn container[' + i + ']: class="' + (b.className || '').substring(0, 40) +
          '" title="' + (b.title || b.getAttribute('aria-label') || '') +
          '" text="' + b.textContent.trim().substring(0, 20) + '"', 'info');
      });
      return btnsInside;
    }
    // Guardar o melhor container visto ate agora (antes de ficar grande demais)
    if (btnsInside.length > 0 && !melhorBtns) {
      melhorContainer = container;
      melhorBtns = btnsInside;
    }
  }

  // ---- Estrategia 2: TreeWalker DOM-order (botoes DEPOIS do label) ----
  var externoEl = encontrarLabelExterno();
  var btnsAfter = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
  var passedInterno = false;
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node === internoEl || internoEl.contains(node)) { passedInterno = true; continue; }
    if (passedInterno && externoEl && (node === externoEl || externoEl.contains(node))) break;
    if (passedInterno && node.tagName === 'BUTTON') {
      var rect2 = node.getBoundingClientRect();
      if (rect2.width > 0 || node.offsetParent !== null) btnsAfter.push(node);
    }
  }
  log('Estrategia 2 - botoes apos label: ' + btnsAfter.length, 'info');
  if (btnsAfter.length > 0) return btnsAfter;

  // ---- Estrategia 3: busca bidirecional nos 15 vizinhos do label ----
  var btnsBidi = [];
  var parent3 = internoEl.parentElement || document.body;
  var allSiblings = Array.from(parent3.querySelectorAll('button'));
  if (allSiblings.length === 0 && parent3.parentElement) {
    allSiblings = Array.from(parent3.parentElement.querySelectorAll('button'));
  }
  allSiblings.forEach(function (b) {
    var r3 = b.getBoundingClientRect();
    if (r3.width > 0 || b.offsetParent !== null) btnsBidi.push(b);
  });
  log('Estrategia 3 - botoes vizinhos: ' + btnsBidi.length, 'info');
  return btnsBidi;
}

// Encontra o label da secao "Encaminhamento Interno / Outros Despachos"
// Rejeita elementos de resumo (terminam com ':' ou ': N')
function encontrarLabelInterno() {
  var allEls = document.querySelectorAll('*');
  for (var i = 0; i < allEls.length; i++) {
    var el = allEls[i];
    if (el.children.length > 8) continue;
    var t = el.textContent.trim();
    // Rejeitar resumos com contagem: ": 0", ": 1", ou apenas ":"
    if (/:\s*\d*\s*$/.test(t)) continue;
    if (
      t === 'Encaminhamento Interno / Outros Despachos' ||
      t === 'Outros Despachos' ||
      t === 'Encaminhamento Interno' ||
      (t.includes('Encaminhamento') && t.includes('Interno') && !t.includes('externo') && !t.includes('Externo') && t.length < 60)
    ) {
      return el;
    }
  }
  return null;
}

// Encontra o label da secao "Encaminhamento externo"
function encontrarLabelExterno() {
  var allEls = document.querySelectorAll('*');
  for (var i = 0; i < allEls.length; i++) {
    var el = allEls[i];
    if (el.children.length > 8) continue;
    var t = el.textContent.trim();
    if (/:\s*\d*\s*$/.test(t)) continue;
    if (
      t === 'Encaminhamento externo' || t === 'Encaminhamento Externo' ||
      (t.includes('Encaminhamento') && (t.includes('externo') || t.includes('Externo')) && t.length < 60)
    ) {
      return el;
    }
  }
  return null;
}

function findIncluirBtnInterno(isDestinatario) {
  var btns = findBotoesSectionInterno();
  if (btns.length === 0) return null;

  if (isDestinatario) {
    // Para destinatario: procura botao com texto/title "destinat"
    var dest = btns.find(function (b) {
      var t = (b.textContent || '').trim().toLowerCase();
      var cls = (b.className || '').toLowerCase();
      var title = (b.title || '').toLowerCase();
      return t.includes('destinat') || cls.includes('destinat') || title.includes('destinat');
    });
    return dest || null;
  }

  // Para despacho: retorna o primeiro botao visivelmente clicavel
  return btns[0] || null;
}

async function insertText(text) {
  // Tenta em contenteditable primeiro (editores ricos como Quill, Angular contenteditable)
  var editors = document.querySelectorAll('[contenteditable="true"]');
  for (var i = 0; i < editors.length; i++) {
    var ed = editors[i];
    var r = ed.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    // Verifica se e um editor de texto real (nao um campo de autocomplete)
    ed.focus();
    // Limpa o conteudo
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
    // Insere o texto linha por linha
    var lines = text.split('\n');
    for (var j = 0; j < lines.length; j++) {
      document.execCommand('insertText', false, lines[j]);
      if (j < lines.length - 1) document.execCommand('insertParagraph');
    }
    // Dispara eventos para o Angular detectar a mudanca
    ed.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
    ed.dispatchEvent(new Event('change', { bubbles: true }));
    ed.dispatchEvent(new Event('blur', { bubbles: true }));
    log('Texto inserido em contenteditable ✓', 'info');
    return true;
  }
  // Tenta em textarea (Angular usa nativeElement.value + dispatchEvent)
  var tas = document.querySelectorAll('textarea');
  for (var k = 0; k < tas.length; k++) {
    var r2 = tas[k].getBoundingClientRect();
    if (r2.width === 0 && r2.height === 0) continue;
    tas[k].focus();
    // Usa o setter nativo do React/Angular para garantir deteccao da mudanca
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value'
    ).set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(tas[k], text);
    } else {
      tas[k].value = text;
    }
    tas[k].dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
    tas[k].dispatchEvent(new Event('change', { bubbles: true }));
    tas[k].dispatchEvent(new Event('blur', { bubbles: true }));
    log('Texto inserido em textarea ✓ (nativeInputValueSetter)', 'info');
    return true;
  }
  // Tenta em inputs do tipo text visiveis (caso o SISP use input)
  var inputs = document.querySelectorAll('input[type="text"], input:not([type])');
  for (var ii = 0; ii < inputs.length; ii++) {
    var ri = inputs[ii].getBoundingClientRect();
    if (ri.width === 0 && ri.height === 0) continue;
    if (inputs[ii].readOnly || inputs[ii].disabled) continue;
    inputs[ii].focus();
    var nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    if (nativeSetter) {
      nativeSetter.call(inputs[ii], text);
    } else {
      inputs[ii].value = text;
    }
    inputs[ii].dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
    inputs[ii].dispatchEvent(new Event('change', { bubbles: true }));
    inputs[ii].dispatchEvent(new Event('blur', { bubbles: true }));
    log('Texto inserido em input text ✓', 'info');
    return true;
  }
  // iframe interno
  var iframes = document.querySelectorAll('iframe');
  for (var fi = 0; fi < iframes.length; fi++) {
    try {
      var iDoc = iframes[fi].contentDocument || iframes[fi].contentWindow.document;
      var iEd = iDoc.querySelector('[contenteditable="true"]') || iDoc.body;
      if (iEd) {
        iEd.focus();
        iDoc.execCommand('selectAll');
        iDoc.execCommand('insertText', false, text);
        iEd.dispatchEvent(new InputEvent('input', { bubbles: true }));
        log('Texto inserido em iframe interno ✓', 'info');
        return true;
      }
    } catch (e) { }
  }
  return false;
}

// ============================
// STEP 5 - Incluir destinatario
// ============================
async function step5_incluirDestinatario(policial) {
  if (!isFormFrame()) {
    log('Frame nao e o formulario, ignorando step5', 'info');
    return;
  }

  if (window.isInsertingDestinatario) {
    log('Já existe uma inserção de destinatário em andamento. Ignorando múltiplos cliques.', 'warning');
    return;
  }
  window.isInsertingDestinatario = true;

  try {
    log('Passo 5: Incluindo destinatario...', 'info');

    // Tentar evitar colocar duplicata lendo a tela ativamente
    if (policial) {
      var allTdsAndSpans = document.querySelectorAll('td, span');
      var jaExiste = Array.from(allTdsAndSpans).some(function (el) {
        var textoEl = el.textContent.trim().toUpperCase();
        return textoEl.includes(policial.toUpperCase()) && el.children.length === 0;
      });
      if (jaExiste) {
        log('Destinatário "' + policial + '" possivelmente já está na lista. Ignorando...', 'warning');
        notify('STEP_DONE', { step: 5 });
        return;
      }
    }

    // Buscar botao azul "+ incluir destinatario" perto da secao "Destinatarios"
    var btn = encontrarBotaoIncluirDestinatario();

    if (!btn) {
      log('Botao "+ incluir destinatario" nao encontrado', 'error');
      notify('STEP_ERROR', { step: 5, msg: 'Botao "+ incluir destinatario" nao encontrado' });
      return;
    }

    log('Botao destinatario: cls="' + (btn.className || '').substring(0, 40) + '" txt="' + btn.textContent.trim().substring(0, 30) + '"', 'info');
    fastClick(btn);
    log('Clicou "+ incluir destinatario" ✓', 'success');
    await sleep(800);

    if (policial) {
      var sel = await selectPersonInModal(policial);
      if (sel) {
        log('Destinatario "' + policial + '" selecionado ✓', 'success');
        notify('STEP_DONE', { step: 5 });
      } else {
        log('Destinatario nao encontrado no modal — selecione manualmente', 'warning');
        notify('STEP_ERROR', { step: 5, msg: 'Destinatario nao localizado. Insira manualmente.' });
      }
    } else {
      notify('STEP_DONE', { step: 5 });
    }
  } finally {
    window.isInsertingDestinatario = false;
  }
}

// Encontra o botao azul "+ incluir destinatario" perto da secao "Destinatarios"
function encontrarBotaoIncluirDestinatario() {
  // Estrategia 1: botao com texto que inclui "destinat"
  var todosbtns = Array.from(document.querySelectorAll('button, a.btn, a'));
  for (var i = 0; i < todosbtns.length; i++) {
    var b = todosbtns[i];
    var r = b.getBoundingClientRect();
    if (r.width === 0) continue;
    var t = (b.textContent || '').trim().toLowerCase();
    if (t.includes('destinat') && (t.includes('incluir') || t.includes('+') || t.includes('add'))) {
      return b;
    }
  }

  // Estrategia 2: encontrar label "Destinatarios" e subir para pegar botao azul no container
  var allEls = document.querySelectorAll('*');
  var destinLabel = null;
  for (var j = 0; j < allEls.length; j++) {
    var el = allEls[j];
    if (el.children.length > 6) continue;
    var t2 = el.textContent.trim();
    if (t2 === 'Destinatarios' || t2 === 'Destinatário' || t2 === 'Destinatários') {
      destinLabel = el;
      break;
    }
  }
  if (destinLabel) {
    var container = destinLabel;
    for (var up = 0; up < 6; up++) {
      if (!container.parentElement) break;
      container = container.parentElement;
      var azuis = Array.from(container.querySelectorAll(
        'button.btn-primary, button.btn-success, button.btn-info, a.btn-primary'
      )).filter(function (b) { return b.getBoundingClientRect().width > 0; });
      if (azuis.length > 0 && azuis.length <= 3) return azuis[0];
    }
  }

  return null;
}

async function selectPersonInModal(name) {
  // Primeiro, localizar o container do modal/diálogo "Selecionar usuário da Unidade Responsável"
  var modalContainer = null;

  // Estratégia 1: Encontrar pelo título "Selecionar usuário" dentro de modais/diálogos
  var modais = Array.from(document.querySelectorAll(
    '.modal.in, .modal.show, .modal[style*="display: block"], [role="dialog"], .modal-dialog, .modal-content'
  )).filter(function (m) {
    var r = m.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });

  for (var mi = 0; mi < modais.length; mi++) {
    var textoModal = modais[mi].textContent || '';
    if (textoModal.includes('Selecionar usu') || textoModal.includes('Unidade Respons') || textoModal.includes('Usuários da unidade') || textoModal.includes('Usuarios da unidade')) {
      modalContainer = modais[mi];
      break;
    }
  }

  // Estratégia 2: Qualquer container visível com tabela de usuários
  if (!modalContainer) {
    var allContainers = Array.from(document.querySelectorAll('.modal, [role="dialog"], .panel, .card'));
    for (var ci = 0; ci < allContainers.length; ci++) {
      var c = allContainers[ci];
      var r = c.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && c.querySelector('table tbody tr')) {
        modalContainer = c;
        break;
      }
    }
  }

  // Fallback: usar o document inteiro
  if (!modalContainer) {
    log('Container do modal não encontrado, buscando no documento inteiro', 'warning');
    modalContainer = document;
  } else {
    log('Modal encontrado: <' + modalContainer.tagName + '> class="' + (modalContainer.className || '').substring(0, 50) + '"', 'info');
  }

  // Buscar em até 10 páginas
  for (var page = 0; page < 10; page++) {
    // Buscar linhas da tabela DENTRO do container do modal
    var rows = modalContainer.querySelectorAll('table tbody tr');
    if (rows.length === 0) {
      rows = modalContainer.querySelectorAll('table tr');
    }
    log('Página ' + (page + 1) + ': encontradas ' + rows.length + ' linhas na tabela', 'info');

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].textContent.toUpperCase().includes(name.toUpperCase())) {
        log('Destinatário "' + name + '" encontrado na página ' + (page + 1) + '!', 'success');
        var addBtn = rows[i].querySelector('button,a');
        if (addBtn) { fastClick(addBtn); }
        else { fastClick(rows[i]); }

        // Aguardar breve para o clique ser processado
        await sleep(500);

        // Fechar o modal clicando no botão "X" (canto superior direito)
        await fecharModalSelecionarUsuario(modalContainer);

        return true;
      }
    }

    // Se não encontrou nesta página, tentar ir para a próxima
    var nextPageNumber = (page + 2).toString(); // Se tá na pág 1 (loop=0), procura '2'
    var next = null;

    // Buscar controles de paginação DENTRO do modal
    // Estratégia 1: links de paginação com o número da próxima página
    var paginationLinks = Array.from(modalContainer.querySelectorAll('.pagination a, .pagination button, .pagination li a, ul.pagination a, nav a'));
    for (var pi = 0; pi < paginationLinks.length; pi++) {
      var linkText = paginationLinks[pi].textContent.trim();
      if (linkText === nextPageNumber) {
        next = paginationLinks[pi];
        break;
      }
    }

    // Estratégia 2: botão ">" ou ">>" dentro do modal
    if (!next) {
      for (var pi2 = 0; pi2 < paginationLinks.length; pi2++) {
        var lt = paginationLinks[pi2].textContent.trim();
        if (lt === '>' || lt === '›' || lt === '»' || lt === '>>') {
          // Verificar se não está desabilitado
          var parentLi = paginationLinks[pi2].closest('li');
          if (parentLi && (parentLi.classList.contains('disabled') || parentLi.classList.contains('active'))) continue;
          next = paginationLinks[pi2];
          break;
        }
      }
    }

    // Estratégia 3: buscar qualquer link/botão com o número da página dentro do modal
    if (!next) {
      var allLinks = Array.from(modalContainer.querySelectorAll('a, button, span'));
      for (var al = 0; al < allLinks.length; al++) {
        var txt = allLinks[al].textContent.trim();
        if (txt === nextPageNumber) {
          var rect = allLinks[al].getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            next = allLinks[al];
            break;
          }
        }
      }
    }

    // Estratégia 4: botão Next/aria-label dentro do modal
    if (!next) {
      next = modalContainer.querySelector('.pagination .next a, [aria-label="Next"], .page-link[aria-label="Next"]');
    }

    if (!next) {
      log('Nenhuma página posterior detectada no modal para continuar buscando (página ' + (page + 1) + ')', 'info');
      break;
    }

    fastClick(next);
    log('Navegando para a página ' + nextPageNumber + ' para buscar o destinatário...', 'info');
    await sleep(1200); // Aguardar o carregamento da nova página da lista
  }
  return false;
}

// Fecha o modal "Selecionar usuário da Unidade Responsável" clicando no botão "X"
async function fecharModalSelecionarUsuario(modalContainer) {
  try {
    // Estratégia 1: buscar botão close (X) dentro do header do modal
    var closeBtn = null;

    if (modalContainer && modalContainer !== document) {
      // Buscar botão X dentro do modal
      closeBtn = modalContainer.querySelector('button.close, .btn-close, [aria-label="Close"], [data-dismiss="modal"]');

      // Estratégia 2: buscar botão com "×" ou "X" no header do modal
      if (!closeBtn) {
        var headerBtns = Array.from(modalContainer.querySelectorAll('.modal-header button, .panel-heading button, button'));
        for (var i = 0; i < headerBtns.length; i++) {
          var txt = headerBtns[i].textContent.trim();
          if (txt === '×' || txt === 'X' || txt === 'x' || txt === '✕' || txt === '✖') {
            closeBtn = headerBtns[i];
            break;
          }
        }
      }

      // Estratégia 3: buscar qualquer elemento clicável com aria-label="Fechar" ou "Close"
      if (!closeBtn) {
        closeBtn = modalContainer.querySelector('[aria-label="Fechar"], [title="Fechar"], [title="Close"]');
      }
    }

    // Estratégia 4 (fallback global): buscar em modais visíveis no documento inteiro
    if (!closeBtn) {
      var visibleModals = Array.from(document.querySelectorAll('.modal.in, .modal.show, .modal[style*="display: block"], [role="dialog"]'))
        .filter(function (m) { var r = m.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
      for (var j = 0; j < visibleModals.length; j++) {
        closeBtn = visibleModals[j].querySelector('button.close, .btn-close, [aria-label="Close"], [data-dismiss="modal"]');
        if (closeBtn) break;
        var btns = Array.from(visibleModals[j].querySelectorAll('button'));
        for (var k = 0; k < btns.length; k++) {
          var t = btns[k].textContent.trim();
          if (t === '×' || t === 'X' || t === 'x' || t === '✕' || t === '✖') {
            closeBtn = btns[k];
            break;
          }
        }
        if (closeBtn) break;
      }
    }

    if (closeBtn) {
      await sleep(300);
      fastClick(closeBtn);
      log('Modal "Selecionar usuário" fechado com botão X ✓', 'success');
      await sleep(400);
    } else {
      log('Botão X para fechar o modal não encontrado — feche manualmente', 'warning');
    }
  } catch (e) {
    log('Erro ao fechar modal: ' + e.message, 'error');
  }
}

// ============================
// STEP 6 - Salvar (frame do formulario)
// ============================
async function step6_salvar() {
  if (!isFormFrame()) return;

  if (window.isSavingDespacho) {
    log('Já existe um salvamento em andamento. Ignorando múltiplos cliques.', 'warning');
    return;
  }
  window.isSavingDespacho = true;

  try {
    log('Salvando despacho...', 'info');

    // Estrategia 1: Prioridade Máxima para Encaminhar Externamente (pedido do usuário)
    var btn = findByText('button, a, input[type="button"], input[type="submit"]', 'encaminhar externamente');

    // Estrategia 2: Outros botões de salvamento/encaminhamento
    if (!btn) {
      var salvadores = ['Salvar', 'Gravar', 'Salvar Alterações', 'encaminhar'];
      for (var i = 0; i < salvadores.length; i++) {
        var found = findByText('button, a, input[type="button"], input[type="submit"]', salvadores[i]);
        if (found) {
          // Verifica se não é um seletor de unidade
          var t = (found.textContent || found.value || '').toLowerCase();
          if (!t.includes('escolher') && !t.includes('unidade') && !t.includes('destinat')) {
            btn = found;
            break;
          }
        }
      }
    }

    // Estrategia 3: Botao de sucesso (verde/azul) visivel - filtrando seletores de unidade
    if (!btn) {
      btn = Array.from(document.querySelectorAll('button.btn-success, button.btn-primary:not([title*="Incluir"]), input.btn-success, input.btn-primary'))
        .find(function(b) {
          var t = (b.textContent || b.value || '').toLowerCase();
          var isVisible = b.getBoundingClientRect().width > 0 || b.offsetParent !== null;
          // Filtro agressivo para ignorar seletores de unidade/destinatário
          var isUnitPicker = t.includes('escolher') || t.includes('unidade') || t.includes('destinat') || t.includes('selecionar');
          return isVisible && !isUnitPicker;
        });
    }

    if (btn) {
      log('Botao Salvar identificado: ' + (btn.textContent || btn.value || 'sem texto'), 'info');
      fastClick(btn);
      log('Botao Salvar clicado ✓', 'success');
      notify('STEP_DONE', { step: 6 });

      // Aguardar um curto período para evitar repetição acidental de clique
      await sleep(1500);
    } else {
      log('Botao Salvar nao encontrado em ' + frameType(), 'warning');
      notify('STEP_ERROR', { step: 6, msg: 'Botao Salvar nao encontrado' });
    }
  } finally {
    window.isSavingDespacho = false;
  }
}

// ============================
// STEP 7 - Marcar como resolvido
// ============================
async function step7_resolver() {
  if (!isFormFrame() && !isListFrame() && !isMainFrame()) return;
  log('Marcando como resolvido...', 'info');
  await sleep(500);

  // Variaveis de texto para o botao de resolver
  var texts = ['Marcar como resolvido', 'Marcar Resolvido', 'Resolvido', 'Encerrar', 'Concluir', 'Sim'];
  var btn = null;

  for (var i = 0; i < texts.length; i++) {
    btn = findByText('button,a', texts[i]);
    if (btn) break;
  }

  if (btn) {
    fastClick(btn);
    log('Marcado como resolvido ✓', 'success');
    notify('STEP_DONE', { step: 7 });
  } else {
    notify('STEP_ERROR', { step: 7, msg: 'Botao de resolucao nao encontrado' });
  }
}

// ============================
// MESSAGE LISTENER
// ============================
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // Direct acknowledgment log to the popup
  if (msg.type && (msg.type.startsWith('STEP') || msg.type.startsWith('DEBUG'))) {
    log('Frame ' + frameType() + ' recebeu: ' + msg.type);
  }

  if (msg.type === 'PING') {
    sendResponse({ ok: true, frameType: frameType() });
    return true;
  }

  if (msg.type === 'GET_BO_MARKDOWN') {
    try {
      var bodyEl = document.body;
      var rawText = bodyEl ? (bodyEl.innerText || bodyEl.textContent || '') : '';
      var mdResult = '';
      if (typeof MarkItDownEngine !== 'undefined') {
        var engine = new MarkItDownEngine();
        var rawMd = engine.convert(bodyEl);
        if (typeof MarkItDownCleaner !== 'undefined') {
          mdResult = MarkItDownCleaner.sanitize(rawMd, { boNumber: msg.boNumber || '', fato: msg.fato || '' });
        } else {
          mdResult = rawMd;
        }
      } else {
        mdResult = rawText;
      }
      sendResponse({
        ok: true,
        frameType: frameType(),
        markdown: mdResult,
        rawText: rawText
      });
    } catch(errMd) {
      sendResponse({ ok: false, error: errMd.message || String(errMd), frameType: frameType() });
    }
    return true;
  }

  if (msg.type === 'DEBUG_DOM') {
    debugDOM();
    sendResponse({
      ok: true, frameType: frameType(),
      info: 'frame=' + frameType() + ' buttons=' + document.querySelectorAll('button').length +
        ' tr=' + document.querySelectorAll('tr').length +
        ' contenteditable=' + document.querySelectorAll('[contenteditable]').length
    });
    return true;
  }

  if (msg.type === 'DEBUG_FORM') {
    // Inspeciona o frame FORM em detalhe para diagnostico
    var ftype = frameType();
    log('[DEBUG_FORM] frameType=' + ftype, 'info');
    // Textos visiveis
    var labels = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,label,span,p,strong,td,th,mat-card-title,mat-panel-title'))
      .filter(function (e) { return e.children.length === 0 && e.textContent.trim().length > 2 && e.textContent.trim().length < 100; })
      .slice(0, 20)
      .map(function (e) { return e.textContent.trim(); });
    log('[DEBUG_FORM] Textos: ' + labels.join(' | '), 'info');
    // Todos os botoes com detalhes
    var allBtns2 = Array.from(document.querySelectorAll('button'));
    log('[DEBUG_FORM] Total botoes: ' + allBtns2.length, 'info');
    allBtns2.slice(0, 8).forEach(function (b, i) {
      var rect = b.getBoundingClientRect();
      log('[DEBUG_FORM] btn[' + i + '] class="' + (b.className || '') + '" title="' + (b.title || '') +
        '" text="' + b.textContent.trim().substring(0, 30) + '" visible=' + (rect.width > 0) +
        ' html=' + b.outerHTML.substring(0, 150), 'info');
    });
    // Inputs e editores
    var editors2 = document.querySelectorAll('[contenteditable="true"], textarea, input[type="text"]');
    log('[DEBUG_FORM] Editores/inputs: ' + editors2.length, 'info');
    Array.from(editors2).slice(0, 4).forEach(function (e, i) {
      var rect = e.getBoundingClientRect();
      log('[DEBUG_FORM] editor[' + i + '] tag=' + e.tagName + ' class="' + (e.className || '') +
        '" visible=' + (rect.width > 0), 'info');
    });
    sendResponse({ ok: true, frameType: ftype });
    return true;
  }

  if (msg.type === 'STEP1_CLICK_BO') {
    step1_clickFirstBO();
    sendResponse({ ok: true, frameType: frameType() });
    return true;
  }

  if (msg.type === 'STEP2_OPEN_BO') {
    step2_openBO();
    sendResponse({ ok: true, frameType: frameType() });
    return true;
  }

  if (msg.type === 'STEP3_ANALYZE') {
    var result = step3_analyze();
    if (result) {
      sendResponse(result);
    } else {
      sendResponse({ skip: true, frameType: frameType() });
    }
    return true;
  }

  if (msg.type === 'STEP4_INSERT_DESPACHO') {
    step4_insertDespacho(msg.despacho);
    sendResponse({ ok: true, frameType: frameType() });
    return true;
  }

  if (msg.type === 'STEP5_INCLUIR_DESTINATARIO') {
    step5_incluirDestinatario(msg.policial);
    sendResponse({ ok: true, frameType: frameType() });
    return true;
  }

  if (msg.type === 'STEP6_SALVAR') {
    step6_salvar();
    sendResponse({ ok: true, frameType: frameType() });
    return true;
  }

  if (msg.type === 'STEP7_RESOLVER') {
    step7_resolver();
    sendResponse({ ok: true, frameType: frameType() });
    return true;
  }
});

console.log('[BO Extension] Frame carregado: ' + frameType() + ' | url: ' + window.location.href.substring(0, 80));

} // Fim do bloco de protecao contra multiplas injecoes
