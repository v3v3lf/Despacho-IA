/**
 * Popup JS - Despacho Automático BO v2
 * Controla o fluxo passo a passo com confirmações manuais
 */

// ---- DESPACHOS (espelhados do content.js para preview) ----
const DESPACHOS = {
  fato_atipico: `O Boletim de Ocorrência narra FATO ATÍPICO. Segundo entendimento do próprio STF, a instauração regular de procedimento investigativo depende necessariamente de "base empírica para tanto idônea e indicação plausível do fato delituoso a ser apurado", o que inexiste no caso em questão.(STF – Primeira Turma – Inq 3847 AgR/GO - Rel. Min. Dias Toffoli – j. em 07.04.2015 – Dje 108 de 05.06.2015 / STF – Primeira Turma – Pet 7354 AgR/DF - Rel. Min. Dias Toffoli – j. em 06.03.2018 – Dje 102 de 24.05.2018) Com efeito, a vedação legal ao poder investigativo em situações dessa natureza decorre, ainda, de eventuais ilações no campo penal por abuso de autoridade (arts. 27 e 30 da Lei n. 13.869/2019).`,
  vitima_nao_representar: `Conforme consta no Boletim de Ocorrência, a vítima não deseja não exercer o direito de representação ou queixa contra o autor.   Segundo entendimento do próprio STF, a instauração regular de procedimento investigativo depende necessariamente de "base empírica para tanto idônea e indicação plausível do fato delituoso a ser apurado", o que inexiste no caso em questão.(STF – Primeira Turma – Inq 3847 AgR/GO - Rel. Min. Dias Toffoli – j. em 07.04.2015 – Dje 108 de 05.06.2015 / STF – Primeira Turma – Pet 7354 AgR/DF - Rel. Min. Dias Toffoli – j. em 06.03.2018 – Dje 102 de 24.05.2018) Com efeito, a vedação legal ao poder investigativo em situações dessa natureza decorre, ainda, de eventuais ilações no campo penal por abuso de autoridade (arts. 27 e 30 da Lei n. 13.869/2019).`,
  pericia: `Requisite-se para Polícia Científica exame pericial no objeto ou local dos fatos mencionado no BO, e solicite-se o envio do laudo pericial a esta Delegacia, depois retorne para este signatário para nova apreciação.`,
  dp_om_atribuicao: `Exmo. (a) Senhor (a) Delegado (a),\nCumprimentando-o (a) cordialmente, encaminho o Boletim de Ocorrência a Vossa Excelência para ciência e providências que achar cabíveis.\nNa oportunidade, renovo protestos de elevada estima e distinta consideração.\nRespeitosamente,`,
  decidir_posteriormente: `VISTOS (Decidir posteriormente). \nAGUARDE-SE A MANIFESTAÇÃO DA VÍTIMA no prazo decadencial, conforme a cientificação constante no Boletim de Ocorrência, em que a vítima Deseja Decidir posteriormente sobre o direito de representação ou queixa, estando ciente de que o prazo para oferecer a representação ou a queixa é de 06 (seis) meses, contados da data do fato ou da data em que vier a saber quem é o autor do fato. Pois, nos termos do artigo 5o do CPP: "§ 4o O inquérito, nos crimes em que a ação pública depender de representação, não poderá sem ela ser iniciado.; e, \n§ 5o Nos crimes de ação privada, a autoridade policial somente poderá proceder a inquérito a requerimento de quem tenha qualidade para intentá-la."`,
  investigacao: `Efetuar a VERIFICAÇÃO PRELIMINAR DAS INFORMAÇÕES do presente Boletim de Ocorrência para a identificação do autor(es), de acordo com as informações trazidas, dos termos do artigo 5º, parágrafo 3º do CPP. Caso as diligências investigatórias realizadas não seja possível identificar o(s) autor(es), aguarde-se outro elemento de informação caracterizador da autoria do delito, não necessitando realizar nova tramitação, pois em face da carência de substrato fático criminal razoável à indicação de da autoria delitiva. Por oportuno, não custa lembrar que, segundo entendimento do próprio STF, a instauração regular de procedimento investigativo depende necessariamente de "base empírica para tanto idônea e indicação plausível do fato delituoso a ser apurado" (STF – Primeira Turma – Inq 3847 AgR/GO - Rel. Min. Dias Toffoli – j. em 07.04.2015 – Dje 108 de 05.06.2015 / STF – Primeira Turma – Pet 7354 AgR/DF - Rel. Min. Dias Toffoli – j. em 06.03.2018 – Dje 102 de 24.05.2018), o que inexiste no caso em questão.`,
  estelionato: `Intimar a vítima para comparecer na delegacia para prestar termo de declaração preliminar e juntar os documentos comprobatórios, caso não compareça anexar no SISP esta informação e marcar como resolvido sem necessidade de tramitação. Deixar consignado na intimação que a vítima deverá:
Trazer documentos que contenham o nome do banco, número da agência (cidade e bairro) e conta corrente do GOLPISTA na qual foi realizado o DEPÓSITO, ou esclarecer que não houve transferência (art. 70, §4, CPP -domicílio da vítima) e juntar o documento comprobatório;
O documento que contenha o nome do banco, número da agência(cidade e bairro) da VÍTIMA no caso de FURTO de valores da CONTA (ag. da vítima);
Ou documentos para demonstrar o local onde foi efetuada a compra fraudulenta do produto, bairro, cidade e estado em que o autor foi beneficiado com a COMPRA utilizando-se de CARTÃO CLONADO (local da compra no estabelecimento comercial) e juntar o documento comprobatório;
Ou documentos que contenham o nome do banco, número da agência(cidade e bairro) e conta corrente de onde ocorreu o SAQUE de valor com uso de CARTÃO CLONADO (local onde ocorreu o saque fraudulento);
Para a vítima informar onde foi o local em que ocorreu a ENTREGA A MERCADORIA (retirada do produto) e juntar o documento comprobatório;`,
  queixa: `Conforme o princípio da Celeridade e informalidade do JEC: Fazer contato com a vítima via aplicativo para alertar a vítima que terá que contratar um advogado para propor no juizado especial a queixa-crime em seis meses. Posteriormente, anexar no SISP, sem tramitação, a captura de tela para a vítima, ou certidão.`,
  jec_incondicionada: `Conforme o princípio da Celeridade e informalidade do JEC: Fazer contato com o AUTOR e informar que: Tem o direito de permanecer calado e se quer exercer esse direito; Pode fazer a gravação em vídeo ou audio de seu depoimento e enviar via Whatsapp, ou Pode disponibilizar link para o AUTOR prestar declaração, ou Pode fazer o comparecimento pessoal na Delegacia, Posteriormente anexar no SISP o depoimento, o vídeo ou o áudio (com sua transcrição) e/ou demais informações e tramitar ao cartório de TC.`,
  jec_condicionada: `Conforme o princípio da Celeridade e informalidade do JEC:
1) Intimar a vítima para comparecer na delegacia para prestar termo de declaração preliminar e alertar a vítima que ela deverá comparecer no juizado especial todas as vezes que for intimada, caso não queira representar, anexar no SISP esta informação e marcar como resolvido sem necessidade de tramitação.
2) Caso a vítima não renuncie o direito de representação:
2.1) Fazer contato com o AUTOR e informar que:
a) Tem o direito de permanecer calado e se quer exercer esse direito;
b) Pode fazer a gravação em vídeo ou audio de seu depoimento e enviar via Whatsapp, ou
c) Pode disponibilizar link para o AUTOR prestar declaração, ou
d) Pode fazer o comparecimento pessoal na Delegacia,
3) Posteriormente anexar no SISP o depoimento, o vídeo ou o audio (com sua transcrição) e/ou demais informações e tramitar ao cartório de TC.`,
  oitivas_preliminares: `Intime-se a vítima para prestar termo de declaração preliminar e juntar documentos (laudos) comprobatórios e maiores informações sobre os fatos, depois retorne para ulterior deliberação.`,
  desacordo_comercial: `O STJ tem diversas decisões que tratam do tema. Entre os principais entendimentos, destaca-se: Ausência de dolo caracterizando desacordo comercial: "A mera inadimplência contratual não configura o delito de estelionato, pois exige-se a demonstração do dolo antecedente, ou seja, a intenção de enganar a vítima no momento da celebração do contrato." (HC 455.252/SP, Rel. Min. Nefi Cordeiro, 6ª Turma, julgado em 10/04/2018) Simulação ou fraude no contrato pode configurar estelionato: "Quando demonstrou que o agente celebrou contrato com o objetivo de, desde o início, não cumprir as obrigações pactuadas, valendo-se de planos para induzir a vítima em erro, caracterizando-se o delito de estelionato." (AgRg no AREsp 168.091/RS, Rel. Min. Maria Thereza de Assis Moura, 6ª Turma, julgada em 19/03/2019) Requisitos para caracterização do estelionato: "É indispensável a demonstração de que o agente empregou fraude ou ardil, com dolo antecedente, para obter vantagem ilícita em prejuízo da vítima. A ausência desses elementos remete ao conflito à seara cível." (AgRg no REsp 1.829.943/SP, Rel. Min. Reynaldo Soares da Fonseca, 5ª Turma, julgado em 09/03/2019).\n\nNo caso em tela, não ficou caracterizado o dolo antecedente do suposto autor, afastando o delito de estelionato. Trata-se, portanto, de conflito a ser dirimido no âmbito cível e fatos desta natureza devem ser registrados como "atípicos".\n\nAssim, a pretensão da vítima reputa-se não plausível, conforme exposto acima, e caso a não concorde com o indeferimento de instauração de inquérito policial é possível recurso para o chefe de Polícia, conforme o disposto no art. 5º, § 2º, do CPP (Do despacho que indeferir o requerimento de abertura de inquérito caberá recurso para o chefe de Polícia).`,
  fraude: `Intimar a vítima para comparecer na delegacia para prestar termo de declaração preliminar e juntar os documentos comprobatórios, caso não compareça anexar no SISP esta informação e marcar como resolvido sem necessidade de tramitação. Deixar consignado na intimação que a vítima deverá:
Trazer documentos que contenham o nome do banco, número da agência (cidade e bairro) e conta corrente do GOLPISTA na qual foi realizado o DEPÓSITO, ou esclarecer que não houve transferência (art. 70, §4, CPP -domicílio da vítima) e juntar o documento comprobatório;
O documento que contenha o nome do banco, número da agência(cidade e bairro) da VÍTIMA no caso de FURTO de valores da CONTA (ag. da vítima);
Ou documentos para demonstrar o local onde foi efetuada a compra fraudulenta do produto, bairro, cidade e estado em que o autor foi beneficiado com a COMPRA utilizando-se de CARTÃO CLONADO (local da compra no estabelecimento comercial) e juntar o documento comprobatório;
Ou documentos que contenham o nome do banco, número da agência(cidade e bairro) e conta corrente de onde ocorreu o SAQUE de valor com uso de CARTÃO CLONADO (local onde ocorreu o saque fraudulento);
Para a vítima informar onde foi o local em que ocorreu a ENTREGA A MERCADORIA (retirada do produto) e juntar o documento comprobatório;`,
  estelionato_atribuicao: `Exmo. (a) Senhor (a) Delegado (a),\nCumprimentando-o (a) cordialmente, encaminho o Boletim de Ocorrência de estelionato a Vossa Excelência para ciência e providências que achar cabíveis, nos termos do CPP, art. 70, § 4º Nos crimes previstos no art. 171 do Decreto-Lei nº 2.848, de 7 de dezembro de 1940 (Código Penal), quando praticados mediante depósito, mediante emissão de cheques sem suficiente provisão de fundos em poder do sacado ou com o pagamento frustrado ou mediante transferência de valores, a competência será definida pelo local do domicílio da vítima, e, em caso de pluralidade de vítimas, a competência firmar-se-á pela prevenção.`,
  conflito_visitacao: `Trata-se de CONFLITO RELATIVO AO DIREITO DE VISITAÇÃO DOS FILHOS MENORES DE IDADE, QUE DEVERÁ SER DIRIMIDO EM ÂMBITO CÍVEL, desta forma, não configura delito de desobediência o descumprimento de acordo judicial de visitação dos filhos, vez que é pacífico na doutrina e jurisprudência que tal infração penal não se caracteriza quando a lei comina sanções civis e/ou administrativas para o descumprimento de uma determinação legal. Nesse sentido, inclusive, é a jurisprudência do STJ: PENAL. CRIME DE DESOBEDIÊNCIA. DETERMINAÇÃO JUDICIAL ASSEGURADA POR MULTA DIÁRIA DE NATUREZA CIVIL (ASTREINTES). ATIPICIDADE DA CONDUTA. Para a configuração do delito de desobediência, salvo se a lei ressalvar expressamente a possibilidade de cumulação da sanção de natureza civil ou administrativa com a de natureza penal, não basta apenas o não cumprimento de ordem legal, sendo indispensável que, além de legal a ordem, não haja sanção determinada em lei específica no caso de descumprimento. (Precedentes). Habeas corpus concedido, ratificando os termos da liminar anteriormente concedida. (STJ, HC nº 22721/SP, Rel. Min. Félix Fischer, 5ª Turma, 27.05.03) Trata-se, portanto, de conflito a ser dirimido no âmbito cível e fatos desta natureza devem ser registrados como "atípicos".\n\nAssim, a pretensão da vítima reputa-se não plausível, conforme exposto acima, e caso a não concorde com o indeferimento de instauração de inquérito policial é possível recurso para o chefe de Polícia, conforme o disposto no art. 5º, § 2º, do CPP (Do despacho que indeferir o requerimento de abertura de inquérito caberá recurso para o chefe de Polícia).`,
  devolucao_veiculo: `1 - Verificar onde o veículo se encontra;\n2 - Fazer contato com o proprietário, caso este veículo não tenha sido entregue:\n3 - Analisar os documentos pessoais de propriedade do automóvel;\n4 - Caso esteja regular a documentação, proceder a realização do termo de entrega do veículo, inserindo no SISP;\n5 - Inserir os documentos (termo de entrega e documentos pessoais do proprietário e do veículo) no sistema para baixa no Detrannet/BIN;\n6 - Após as providências acima, encaminhar o BO de recuperação para Delegacia em que foi registrado o furto do veículo.`,
  cnh_sem_perigo: `Trata-se de fato atípico, já que não se enquadra ao art 309 (Dirigir sem Habilitação ou com Direito Cassado, gerando perigo de dano), pois não gerou perigo de dano conforme descrito no relato.`,
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

const TIPO_LABELS = {
  fato_atipico: 'Fato Atípico',
  vitima_nao_representar: 'Vítima não quer respresentar',
  pericia: 'Perícia',
  dp_om_atribuicao: 'DP com atribuição',
  decidir_posteriormente: 'Decidir Posterior.',
  investigacao: 'Investigação',
  estelionato: 'Estelionato',
  queixa: 'Queixa',
  jec_incondicionada: 'JEC-incond.',
  jec_condicionada: 'JEC-cond.',
  oitivas_preliminares: 'Oitivas Prelim.',
  desacordo_comercial: 'Desacordo Comercial',
  fraude: 'Fraude',
  estelionato_atribuicao: 'Estelionato (Atribuição)',
  conflito_visitacao: 'Conflito Visitação',
  devolucao_veiculo: 'Devolução Veículo',
  cnh_sem_perigo: 'CNH sem perigo',
  oitivas_preliminares_testemunha: 'Oitivas Prelim.-Testemunha',
  instaurar_ip: 'Instaurar IP',
  imagens: 'Imagens',
  aguardar_outro_elemento: 'Aguardar outro elemento',
  rel_invest_sem_autoria: 'Rel. Invest. s/ Autoria',
};

const FATO_OPTIONS = [
  { value: 'fato_atipico', label: 'FATO ATÍPICO' },
  { value: 'vitima_nao_representar', label: 'VÍTIMA NÃO QUER REPRESENTAR' },
  { value: 'pericia', label: 'PERÍCIA' },
  { value: 'dp_om_atribuicao', label: 'DP COM ATRIBUIÇÃO' },
  { value: 'decidir_posteriormente', label: 'DECIDIR POSTERIORMENTE' },
  { value: 'investigacao', label: 'INVESTIGAÇÃO' },
  { value: 'estelionato', label: 'ESTELIONATO' },
  { value: 'queixa', label: 'QUEIXA' },
  { value: 'jec_incondicionada', label: 'JEC-INCONDICIONADA' },
  { value: 'jec_condicionada', label: 'JEC-CONDICIONADA' },
  { value: 'oitivas_preliminares', label: 'OITIVAS PRELIMINARES-VÍTIMA' },
  { value: 'oitivas_preliminares_testemunha', label: 'OITIVAS PRELIMINARES-TESTEMUNHA' },
  { value: 'desacordo_comercial', label: 'DESACORDO COMERCIAL' },
  { value: 'fraude', label: 'FRAUDE' },
  { value: 'estelionato_atribuicao', label: 'ESTELIONATO (ATRIBUIÇÃO)' },
  { value: 'conflito_visitacao', label: 'CONFLITO VISITAÇÃO' },
  { value: 'devolucao_veiculo', label: 'DEVOLUÇÃO VEÍCULO' },
  { value: 'cnh_sem_perigo', label: 'CNH SEM PERIGO' },
  { value: 'instaurar_ip', label: 'INSTAURAR IP' },
  { value: 'imagens', label: 'IMAGENS' },
  { value: 'aguardar_outro_elemento', label: 'AGUARDAR OUTRO ELEMENTO' },
  { value: 'rel_invest_sem_autoria', label: 'REL. INVEST. S/ AUTORIA' },
];

const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash-002';

const STEP_FRAME_TYPE = {
  'STEP1_CLICK_BO': 'LIST',
  'STEP2_OPEN_BO': 'LIST',
  'STEP3_ANALYZE': 'FORM',
  'STEP4_INSERT_DESPACHO': 'FORM',
  'STEP5_INCLUIR_DESTINATARIO': 'FORM',
  'STEP6_SALVAR': 'FORM',
  'STEP7_RESOLVER': 'FORM',
  'DEBUG_FORM': 'FORM',
  'DEBUG_DOM': 'ANY'
};

let rules = [];
let logs = [];
let currentTipo = null;
let currentDespacho = null;
let currentPolicial = null;
let currentResumoIA = null;
let currentRelatoText = '';
let currentFatos = '';
let isAutoMode = false;
let googleApiKey = '';
let geminiModel = DEFAULT_GEMINI_MODEL;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function loadAiConfigUI() {
  const keyInput = document.getElementById('googleApiKeyInput');
  const modelInput = document.getElementById('geminiModelInput');
  const status = document.getElementById('aiConfigStatus');
  if (keyInput) keyInput.value = googleApiKey;
  if (modelInput) {
    const val = geminiModel || DEFAULT_GEMINI_MODEL;
    // Se o valor salvo não estiver nas opções do select, cria uma option temporária para ele
    if (modelInput.options && !Array.from(modelInput.options).some(opt => opt.value === val)) {
      const newOpt = document.createElement('option');
      newOpt.value = val;
      newOpt.textContent = val + ' (Personalizado)';
      modelInput.appendChild(newOpt);
    }
    modelInput.value = val;
  }
  if (status && googleApiKey) {
    status.textContent = 'Configuração da IA salva. O resumo será gerado no passo ③ Analisar.';
    status.className = 'success';
  }
}

function getAiConfigFromUI() {
  const keyInput = document.getElementById('googleApiKeyInput');
  const modelInput = document.getElementById('geminiModelInput');
  return {
    googleApiKey: keyInput ? keyInput.value.trim() : (googleApiKey || ''),
    geminiModel: (modelInput ? modelInput.value : (geminiModel || DEFAULT_GEMINI_MODEL))
  };
}

let _renderCount = 0;
function renderAnalysisBox(fatos, resumo, state, message) {
  _renderCount++;
  const callId = _renderCount;
  const hasResumo = !!resumo;
  const preview = resumo ? resumo.substring(0, 80) + '...' : (message || 'Aguardando...');

  const stateClass = state ? ' ' + state : '';
  const resumoHtml = resumo
    ? `<div class="analysis-resumo"><strong>Resumo do Relato Individual</strong>${escapeHtml(resumo)}</div>`
    : `<div class="analysis-resumo${stateClass}"><strong>Resumo do Relato Individual</strong>${escapeHtml(message || 'Aguardando geração da análise...')}</div>`;

  document.getElementById('analysisBox').innerHTML = resumoHtml;
}

function isRetryableGeminiError(status, message) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504 ||
    /internal|temporarily|unavailable|overloaded|timeout|rate/i.test(message || '');
}

async function callGeminiGenerate(model, apiKey, prompt) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data && data.error && data.error.message ? data.error.message : `HTTP ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.retryable = isRetryableGeminiError(response.status, message);
    throw err;
  }

  let text = (((data.candidates || [])[0] || {}).content || {}).parts
    ? data.candidates[0].content.parts.map(p => p.text || '').join('\n').trim()
    : '';

  // 1. Remove blocos de raciocínio da IA (ex: <think>...</think>)
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. Tenta extrair o conteúdo após a tag "RESUMO:" (independente de maiúsculas/minúsculas)
  const resumoMatch = text.match(/RESUMO:?\s*([\s\S]+)/i);
  if (resumoMatch) {
    text = resumoMatch[1].trim();
  }

  // 3. Remove prefixos redundantes que a IA costuma adicionar mesmo quando não pedimos
  text = text.replace(/^(Resumo do Relato Individual|Resumo do BO|Resumo):?\s*/i, '').trim();

  if (!text) throw new Error('A API não retornou texto para a análise.');
  return text;
}

async function gerarResumoRelatoIA(textoBo, fatos) {
  const cfg = getAiConfigFromUI();
  googleApiKey = cfg.googleApiKey;
  geminiModel = cfg.geminiModel;

  if (!googleApiKey) {
    return { ok: false, skipped: true, message: 'Configure a chave API Google acima para gerar a análise automaticamente.' };
  }

  let textoRelato = (textoBo || '').trim();
  if (!textoRelato || textoRelato.length < 20) {
    return { ok: false, skipped: true, message: 'Nenhum texto encontrado na página do BO para análise IA.' };
  }

  // ---- EXTRAÇÃO DO RELATO INDIVIDUAL NO JAVASCRIPT ----
  // Procura a expressão "Relato Individual:" no texto recebido e recorta SOMENTE o trecho após ela.
  const lowerTexto = textoRelato.toLowerCase();
  const idxRelato = lowerTexto.indexOf('relato individual');
  if (idxRelato !== -1) {
    let recorte = textoRelato.substring(idxRelato);
    // Remove o rótulo "Relato Individual:" do início
    const colonPos = recorte.indexOf(':');
    if (colonPos !== -1 && colonPos < 30) {
      recorte = recorte.substring(colonPos + 1).trim();
    } else {
      recorte = recorte.substring(17).trim();
    }
    // Corta na próxima seção (Outras Informações, Condições físicas, ATENDENTES, PROVIDÊNCIAS, etc.)
    const fimMatch = recorte.match(/\n\s*(?:Outras\s+Informa[cç][oõ]es|Condi[cç][oõ]es\s+f[ií]sicas|ATENDENTES|PROVID[EÊ]NCIAS|PROCEDIMENTOS|REGISTROS\s+RELACIONADOS|ENCAMINHAMENTOS|ASSINATURAS)/i);
    if (fimMatch) {
      recorte = recorte.substring(0, fimMatch.index).trim();
    }
    if (recorte.length > 10) {
      textoRelato = recorte;
      console.log('[Despacho IA] Relato Individual extraído com sucesso (' + textoRelato.length + ' chars)');
    }
  }

  const configuredModel = geminiModel.replace(/^models\//, '') || DEFAULT_GEMINI_MODEL;
  const modelsToTry = [configuredModel];
  if (configuredModel !== DEFAULT_GEMINI_MODEL) modelsToTry.push(DEFAULT_GEMINI_MODEL);

  function buildPrompt(limit) {
    return `Resuma o texto abaixo de forma fiel e detalhada em um único parágrafo contínuo. Sua resposta deve começar com RESUMO: seguido do parágrafo.

${textoRelato.slice(0, limit)}`;
  }

  let lastError = null;
  let triedModels = new Set();
  for (let m = 0; m < modelsToTry.length; m++) {
    const model = modelsToTry[m];
    triedModels.add(model);

    // Primeira rodada com contexto maior; se a API retornar erro interno, tenta com contexto menor.
    for (const limit of [12000, 6000]) {
      const prompt = buildPrompt(limit);

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const resumo = await callGeminiGenerate(model, googleApiKey, prompt);
          if (attempt > 1 || limit < 12000 || model !== configuredModel) {
            addLog(`Análise IA gerada após nova tentativa (modelo ${model})`, 'success');
          }
          return { ok: true, resumo };
        } catch (e) {
          lastError = e;
          const retryable = e.retryable || isRetryableGeminiError(e.status, e.message);
          if (!retryable) break;
          addLog(`API Gemini instável (${e.message}). Tentativa ${attempt}/3...`, 'warning');
          await sleep(700 * attempt);
        }
      }
      if (lastError && !lastError.retryable && lastError.status !== 404) break;
    }

    // Auto-discover if 404 and we've exhausted our options
    if (lastError && lastError.status === 404 && m === modelsToTry.length - 1) {
      try {
        addLog('Modelo não encontrado. Buscando modelos disponíveis...', 'info');
        const mResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(googleApiKey)}`);
        const mData = await mResp.json();
        if (mData && mData.models) {
          const valid = mData.models
            .filter(x => x.supportedGenerationMethods && x.supportedGenerationMethods.includes('generateContent'))
            .map(x => x.name.replace('models/', ''));
          
          if (valid.length > 0) {
            const bestModel = valid.find(x => x.includes('flash') && !x.includes('lite')) || 
                              valid.find(x => x.includes('gemini')) || 
                              valid[0];
            
            if (bestModel && !triedModels.has(bestModel)) {
              addLog(`Encontrado: ${bestModel}. Tentando novamente...`, 'info');
              modelsToTry.push(bestModel);
              chrome.storage.local.set({ geminiModel: bestModel });
              geminiModel = bestModel;
            } else {
              lastError = new Error(`Modelos disponíveis: ${valid.join(', ')}`);
            }
          }
        }
      } catch (err) {
        if (err.message.includes('Modelos disponíveis')) lastError = err;
      }
    }
  }

  const msg = lastError && lastError.message ? lastError.message : 'erro desconhecido';
  throw new Error(`API Google instável ou indisponível (${msg}). Tente novamente ou altere o modelo em ⚙ REGRAS.`);
}

async function initApp() {
  console.log('[Despacho IA] Inicializando App...');
  
  // 1. Carrega dados de IA que não dependem de sessão
  loadAiConfigUI();

  // 2. Resetar estado do fluxo
  currentTipo = null;
  currentDespacho = null;
  currentPolicial = null;
  currentResumoIA = null;
  currentRelatoText = '';
  currentFatos = '';
  isAutoMode = false;

  // 3. Verifica Autenticação primeiro
  let sessao = { autenticado: false };
  try {
    sessao = await Auth.verificarSessao();
  } catch (err) {
    console.error('[Despacho IA] Erro ao verificar sessão:', err);
  }

  if (!sessao.autenticado) {
    console.log('[Despacho IA] Usuário não autenticado.');
    const emailInput = document.getElementById('loginEmail');
    chrome.storage.local.get(['sessao_email'], data => {
      if (emailInput && data.sessao_email) {
        emailInput.value = data.sessao_email;
      }
    });

    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('panelFlow').classList.add('hidden');
    document.getElementById('panelConfig').classList.add('hidden');
    document.querySelector('.bottom-nav').style.display = 'none';
    document.getElementById('btnLogout').style.display = 'none';
    return; // Para a execução aqui
  }

  // 3. Está logado: exibe interface normal e botão de sair
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('panelFlow').classList.remove('hidden');
  document.getElementById('panelConfig').classList.remove('hidden'); // ADICIONADO
  document.querySelector('.bottom-nav').style.display = 'flex';
  document.getElementById('btnLogout').style.display = 'block';

  // 4. Carrega configurações e regras locais
  chrome.storage.local.get(['rules', 'logs', 'googleApiKey', 'geminiModel'], data => {
    // Garante que rules e logs sejam sempre arrays
    rules = Array.isArray(data.rules) ? data.rules : [];
    logs = Array.isArray(data.logs) ? data.logs : [];
    
    if (data.googleApiKey) googleApiKey = data.googleApiKey;
    if (data.geminiModel) {
      if (data.geminiModel === 'gemini-3-flash' || data.geminiModel === 'gemini-3.1-flash-lite' || data.geminiModel === 'gemini-2.0-flash' || data.geminiModel === 'gemini-1.5-flash') {
        geminiModel = 'gemini-1.5-flash-002';
        chrome.storage.local.set({ geminiModel: 'gemini-1.5-flash-002' });
      } else {
        geminiModel = data.geminiModel;
      }
    }

    try {
      loadAiConfigUI();
      renderRules();
      renderLogs();
      checkTab();
    } catch (err) {
      console.error('[Despacho IA] Erro na inicialização da UI:', err);
      addLog('Erro ao carregar interface: ' + err.message, 'error');
    }
  });
}

// Inicia o app
initApp();

// Listen for events from content script (via background)
chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'LOG') addLog(msg.msg, msg.level);
  if (msg.type === 'STEP_DONE') {
    onStepDone(msg.step);
  }
  if (msg.type === 'STEP_ERROR') { addLog(`Erro passo ${msg.step}: ${msg.msg}`, 'error'); setStatus(msg.msg, 'error'); }
});

// Also poll storage for events from content script
setInterval(() => {
  chrome.storage.local.get(['lastEvent'], data => {
    if (!data.lastEvent) return;
    const ev = data.lastEvent;
    // Only process once (within last 2s)
    if (Date.now() - ev.ts > 2000) return;
    chrome.storage.local.remove('lastEvent');
    if (ev.type === 'LOG') addLog(ev.payload.msg, ev.payload.level);
    if (ev.type === 'STEP_DONE') {
      onStepDone(ev.payload.step);
    }
    if (ev.type === 'STEP_ERROR') { addLog(`Erro passo ${ev.payload.step}: ${ev.payload.msg}`, 'error'); }
  });
}, 400);

// ---- TAB CHECK ----
async function checkTab() {
  const tab = await findTargetTab();
  if (!tab) { setStatus('SISP não encontrado', 'warn'); return; }
  setStatus('SISP detectado ✓', 'success');
}

// Find the SISP tab regardless of window
async function findTargetTab() {
  // Try active tab in ANY window first
  const tabs = await chrome.tabs.query({ url: ['https://sisp.ciasc.sc.gov.br/*', 'https://backend.ssp.sc.gov.br/*'] });
  if (tabs && tabs.length > 0) {
    // Return the one that is active if possible, or just the first one
    const active = tabs.find(t => t.active);
    return active || tabs[0];
  }
  return null;
}


async function sendToTab(type, extra) {
  const tab = await findTargetTab();
  if (!tab) {
    addLog('Nenhuma aba do SISP detectada!', 'error');
    return null;
  }

  // SEMPRE injeta o content script para garantir que ele esteja presente (mesmo após recarregar a página)
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['content.js']
    });
  } catch (e) {
    // Silencioso se falhar (pode ser problema de permissão em frames cross-origin, o que é esperado no SISP)
    console.warn('[Popup] Falha ao injetar script (pode já estar presente):', e.message);
  }
  await sleep(100);

  const cmd = Object.assign({ type }, extra);

  // Caso especial: STEP3_ANALYZE precisa pollar frames por resposta
  if (type === 'STEP3_ANALYZE') {
    return await sendToAllFramesForResponse(tab.id, cmd);
  }

  // Roteamento geral via background
  const frameType = STEP_FRAME_TYPE[type] || 'ANY';
  addLog(`Enviando ${type} (${frameType})...`, 'info');

  return new Promise(resolve => {
    chrome.runtime.sendMessage({
      type: 'SEND_TO_FRAME_TYPE',
      tabId: tab.id,
      frameType: frameType,
      cmd: cmd
    }, response => {
      if (chrome.runtime.lastError) {
        console.warn('[Popup] Erro ao enviar para background:', chrome.runtime.lastError.message);
      }
      resolve(response);
    });
  });
}

// Poll all frames for STEP3_ANALYZE (needs actual response with 'tipo')
async function sendToAllFramesForResponse(tabId, cmd) {
  return new Promise(function (resolve) {
    chrome.webNavigation.getAllFrames({ tabId: tabId }, function (frames) {
      if (!frames || frames.length === 0) { resolve(null); return; }
      var results = [];
      var pending = frames.length;
      frames.forEach(function (frame) {
        chrome.tabs.sendMessage(tabId, cmd, { frameId: frame.frameId }, function (resp) {
          chrome.runtime.lastError;
          if (resp && !resp.skip && (resp.ok || resp.tipo || resp.fatos || resp.relato)) results.push(resp);
          pending--;
          if (pending === 0) {
            if (results.length === 0) { resolve(null); return; }

            const scoreResult = r => {
              const text = (r.relato || '').toLowerCase();
              let score = Math.min(text.length, 12000) / 100;
              if (r.frameType === 'FORM') score += 500;
              // PRIORIDADE ABSOLUTA para o frame que contém o Relato Individual
              if (/relato\s+individual/i.test(text)) score += 5000;
              if (/fatos?\s+comunicados?/i.test(text)) score += 250;
              if (/data\s+do\s+fato|local\s+do\s+fato/i.test(text)) score += 150;
              return score;
            };
            const withRelato = results
              .filter(r => r.relato && r.relato.trim().length >= 20)
              .sort((a, b) => scoreResult(b) - scoreResult(a))[0];
            const withTipo = results.find(r => r.tipo);
            const base = withRelato || withTipo || results[0];

            resolve(Object.assign({}, base, {
              tipo: base.tipo || (withTipo && withTipo.tipo) || null,
              despacho: base.despacho || (withTipo && withTipo.despacho) || null,
              fatos: base.fatos || (withTipo && withTipo.fatos) || 'Verificar BO'
            }));
          }
        });
      });
    });
  });
}

// ---- FLOW CONTROL ----
function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden'); }
function showSection(id) {
  // Show the section and mark it as active
  const sec = document.getElementById(id);
  if (!sec) return;
  sec.classList.remove('hidden');
  sec.classList.add('active-step');
}

function resetStep5Button() {
  // btnAddDestinatario não existe no HTML v2, mas mantemos o reset de estado visual se necessário em outros botões
}

function onStepDone(step) {
  // ATUALIZAR COR DO BOTAO MANUAL
  const btnM = document.getElementById('btnM' + step);
  if (btnM) btnM.classList.add('success');

  if (step === 1) {
    addLog('Aguardando carregamento do BO...', 'info');
    setStatus('Aguardando BO...', 'active');
    if (isAutoMode) {
      setTimeout(() => { triggerStep2(); }, 150);
    }
  }
  if (step === 2) {
    addLog('BO aberto, analisando...', 'info');
    if (isAutoMode) {
      setTimeout(() => {
        triggerStep3();
      }, 150);
    }
  }
  if (step === 4) {
    showSection('secDestinatario');
    addLog('Despacho inserido com sucesso no campo de Encaminhamento Interno ✓', 'success');
    setStatus('Despacho inserido ✓ — adicione destinatário ou salve', 'success');
  }
  if (step === 5) {
    setStatus('Destinatário adicionado ✓', 'success');
  }
  if (step === 6) {
    setStatus('Salvo ✓ — clique em Resolver para finalizar', 'success');
    addLog('Despacho salvo! Clique em "Resolver" para marcar como resolvido.', 'success');
  }
  if (step === 7) {
    show('secDone');
    setStatus('Concluído! ✓', 'success');
  }
}

// CONFIG IA
if (document.getElementById('btnSaveAiConfig')) {
  document.getElementById('btnSaveAiConfig').addEventListener('click', () => {
    const cfg = getAiConfigFromUI();
    googleApiKey = cfg.googleApiKey;
    geminiModel = cfg.geminiModel;
    chrome.storage.local.set({ googleApiKey, geminiModel }, () => {
      const status = document.getElementById('aiConfigStatus');
      if (status) {
        status.textContent = googleApiKey
          ? `Configuração salva. Modelo: ${geminiModel}`
          : 'Modelo salvo, mas informe a chave API Google para usar o resumo por IA.';
        status.className = googleApiKey ? 'success' : 'error';
      }
      addLog('Configuração da IA salva', googleApiKey ? 'success' : 'warning');
    });
  });
}

// DEBUG DOM
document.getElementById('btnDebugDOM').addEventListener('click', async () => {
  addLog('Inspecionando DOM da página (todos frames)...', 'info');
  const res = await sendToTab('DEBUG_DOM');
  if (!res) addLog('Erro ao inspecionar — verifique se está no SISP', 'error');
});

// DEBUG FORM - inspeciona especificamente o frame FORM
if (document.getElementById('btnDebugForm')) {
  document.getElementById('btnDebugForm').addEventListener('click', async () => {
    addLog('Inspecionando frame FORM...', 'info');
    const res = await sendToTab('DEBUG_FORM');
    if (!res) addLog('Frame FORM não encontrado', 'error');
    else addLog('DEBUG_FORM enviado — veja os logs acima', 'success');
  });
}

// STEP 1 - Start
document.getElementById('btnStart').addEventListener('click', async () => {
  console.log('[Popup] Botão Iniciar clicado');
  isAutoMode = true;
  window.scriptsInjected = false; // Reset to force re-verification
  const tab = await findTargetTab();
  if (!tab) {
    addLog('Acesse o SISP primeiro!', 'error');
    setStatus('Acesse o SISP', 'error');
    return;
  }
  // Reset flow
  hide('secAnalysis'); hide('secResumoIA'); hide('secDestinatario'); hide('secDone');
  document.getElementById('analysisBox').innerHTML = '<div style="color: #64748b; font-size: 13px;">Clique no botão acima para gerar o resumo com IA.</div>';
  hide('despachoSuggestion');
  document.getElementById('selectManualTipo').value = '';
  resetStep5Button();

  // Reset manual buttons
  for (let i = 1; i <= 7; i++) {
    const btnM = document.getElementById('btnM' + i);
    if (btnM) btnM.classList.remove('success');
  }

  setStatus('Clicando no BO...', 'active');
  addLog('Iniciando — clicando no primeiro BO', 'info');
  await sendToTab('STEP1_CLICK_BO');
});

// STEP 2 - Open BO
async function triggerStep2() {
  setStatus('Abrindo BO...', 'active');
  addLog('Clicando no menu do BO', 'info');
  await sendToTab('STEP2_OPEN_BO');
}

// STEP 3 - Analyze BO
let _step3Count = 0;
async function triggerStep3() {
  _step3Count++;
  setStatus('Analisando BO...', 'active');
  addLog('Lendo conteúdo do BO', 'info');
  showSection('secAnalysis');

  let res = null;
  // Tenta analisar o BO por até 5 segundos (50 * 100ms)
  for (let i = 0; i < 50; i++) {
    res = await sendToTab('STEP3_ANALYZE');
    if (res && res.tipo) break;
    await sleep(100);
  }

  if (!res) { addLog('Erro ao analisar BO', 'error'); return; }

  // Show suggestion as soon as deterministic analysis finishes
  currentTipo = res.tipo;
  currentDespacho = res.despacho;
  currentPolicial = getPolicial(res.tipo);
  currentFatos = res.fatos || '';
  currentResumoIA = null;

  show('despachoSuggestion');
  updateDespachoUI(res.tipo, res.despacho);
  addLog(`Tipo identificado: ${TIPO_LABELS[res.tipo] || 'Não identificado'}`, res.tipo ? 'success' : 'warning');

  // ---- PRÉ-EXTRAÇÃO DO RELATO INDIVIDUAL (para agilizar o step 3.1) ----
  currentRelatoText = res.relato || '';

  // Tenta pegar o texto do Relato Individual que o content script cacheou no storage
  try {
    const stored = await new Promise(r => chrome.storage.local.get(['_sispRelatoText', '_sispRelatoTimestamp'], r));
    if (stored._sispRelatoText && /relato\s+individual/i.test(stored._sispRelatoText)) {
      const age = Date.now() - (stored._sispRelatoTimestamp || 0);
      if (age < 60000) {
        currentRelatoText = stored._sispRelatoText;
        addLog('Relato Individual encontrado via cache do storage!', 'success');
      }
    }
  } catch(e) {}

  // Se ainda não tem "Relato Individual", tenta via scripting API
  if (!/relato\s+individual/i.test(currentRelatoText)) {
    addLog('Relato não encontrado no frame principal. Buscando em todos os frames...', 'warning');
    try {
      const tabs = await new Promise(r => chrome.tabs.query({ active: true, currentWindow: true }, r));
      // Filtra para garantir que não estamos tentando injetar no próprio popup ou em páginas protegidas
      const tab = tabs.find(t => t.url && t.url.includes('sisp.ciasc.sc.gov.br'));
      
      if (tab) {
        const injectionResults = await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: () => document.body ? (document.body.innerText || document.body.textContent || '') : ''
        });
        if (injectionResults && injectionResults.length > 0) {
          for (const frame of injectionResults) {
            const frameText = (frame.result || '');
            if (/relato\s+individual/i.test(frameText)) {
              currentRelatoText = frameText;
              addLog('Relato Individual encontrado via scripting API!', 'success');
              break;
            }
          }
        }
      }
    } catch(e) {
      console.error('[Despacho IA] scripting API error:', e);
    }
  }

  if (/relato\s+individual/i.test(currentRelatoText)) {
    addLog('Relato Individual pré-carregado ✓ — pronto para resumir com IA', 'success');
  }

  setStatus('BO analisado — aguardando sua ação', 'success');
  onStepDone(3);
}

// STEP 3.1 - Resumir com IA (manual) — texto já extraído no step 3

async function triggerStep3_1() {
  if (!currentTipo) {
    addLog('Execute o passo ③ Analisar antes de resumir com IA.', 'warning');
    return;
  }

  showSection('secResumoIA');
  renderAnalysisBox(currentFatos, null, '', '⟳ Gerando resumo com IA...');
  setStatus('Gerando resumo com IA...', 'active');
  addLog('Chamando API Gemini...', 'info');

  try {
    const resumoRes = await gerarResumoRelatoIA(currentRelatoText, currentFatos);
    if (resumoRes.ok) {
      currentResumoIA = resumoRes.resumo;
      renderAnalysisBox(currentFatos, currentResumoIA);
      addLog('Resumo IA gerado com sucesso', 'success');
      const btn31 = document.getElementById('btnM3_1');
      if (btn31) btn31.classList.add('success');
    } else {
      renderAnalysisBox(currentFatos, null, resumoRes.skipped ? 'warning' : 'error', resumoRes.message);
      addLog(resumoRes.message, resumoRes.skipped ? 'warning' : 'error');
    }
  } catch (e) {
    const msg = 'Falha ao gerar resumo IA: ' + (e.message || e);
    renderAnalysisBox(currentFatos, null, 'error', msg);
    addLog(msg, 'error');
  }

  setStatus('BO analisado — aguardando sua ação', 'success');
}

function updateDespachoUI(tipo, despacho) {
  const tag = document.getElementById('tipoTag');
  const preview = document.getElementById('despachoPreview');
  tag.textContent = tipo ? (TIPO_LABELS[tipo] || tipo) : '?';
  preview.textContent = despacho || 'Tipo não identificado automaticamente.';
}

function getPolicial(tipo) {
  const rule = rules.find(r => r.fato === tipo && r.policial);
  return rule ? rule.policial.toUpperCase() : null;
}




// Next BO
document.getElementById('btnNext').addEventListener('click', async () => {
  isAutoMode = true;
  window.scriptsInjected = false; // Reset to force re-verification
  const tab = await findTargetTab();
  if (!tab) {
    addLog('Acesse o SISP primeiro!', 'error');
    setStatus('Acesse o SISP', 'error');
    return;
  }
  // Reset flow
  hide('secAnalysis'); hide('secResumoIA'); hide('secDestinatario'); hide('secDone');
  document.getElementById('analysisBox').innerHTML = '<div style="color: #64748b; font-size: 13px;">Clique no botão acima para gerar o resumo com IA.</div>';
  hide('despachoSuggestion');
  document.getElementById('selectManualTipo').value = '';
  resetStep5Button();

  // Reset manual buttons
  for (let i = 1; i <= 7; i++) {
    const btnM = document.getElementById('btnM' + i);
    if (btnM) btnM.classList.remove('success');
  }

  setStatus('Clicando no BO...', 'active');
  addLog('Iniciando — clicando no próximo BO', 'info');
  await sendToTab('STEP1_CLICK_BO');
});

// ---- TABS ----
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
    // Reset REGRAS button state when switching tabs
    document.getElementById('btnRegrasToggle').classList.remove('active');
  });
});

// ---- REGRAS TOGGLE (header button) ----
document.getElementById('btnRegrasToggle').addEventListener('click', () => {
  const btn = document.getElementById('btnRegrasToggle');
  const panelFlow = document.getElementById('panelFlow');
  const panelConfig = document.getElementById('panelConfig');
  const isShowingConfig = panelConfig.classList.contains('active');

  if (isShowingConfig) {
    // Voltar ao fluxo
    panelConfig.classList.remove('active');
    panelFlow.classList.add('active');
    btn.classList.remove('active');
  } else {
    // Mostrar regras
    panelFlow.classList.remove('active');
    panelConfig.classList.add('active');
    btn.classList.add('active');
  }
});

// ---- RULES ----
function saveRules() { 
  chrome.storage.local.set({ rules }, () => {
    console.log('[Despacho IA] Regras salvas com sucesso');
  }); 
}

function renderRules() {
  const c = document.getElementById('rulesContainer');
  if (!c) return;

  if (!Array.isArray(rules) || rules.length === 0) {
    c.innerHTML = '<p style="color:var(--muted);font-size:10px;text-align:center;padding:8px 0;">Nenhuma regra configurada.</p>';
    return;
  }
  
  c.innerHTML = '';
  rules.forEach((rule, i) => {
    if (!rule) return;
    const div = document.createElement('div');
    div.className = 'rule-item';
    div.innerHTML = `
      <button class="rule-remove" data-i="${i}">×</button>
      <label>Tipo de Fato</label>
      <select class="rf" data-i="${i}">
        <option value="">Selecione...</option>
        ${FATO_OPTIONS.map(o => `<option value="${o.value}" ${rule.fato === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
      </select>
      <label>Nome do Policial</label>
      <input type="text" class="rp" data-i="${i}" placeholder="Nome completo do policial conforme SISP" value="${escapeHtml(rule.policial || '')}">
    `;
    c.appendChild(div);
  });
  
  // Reatribui listeners
  c.querySelectorAll('.rf').forEach(s => s.addEventListener('change', e => { 
    const idx = +e.target.dataset.i;
    if (rules[idx]) {
      rules[idx].fato = e.target.value; 
      saveRules(); 
    }
  }));
  
  c.querySelectorAll('.rp').forEach(s => s.addEventListener('input', e => { 
    const idx = +e.target.dataset.i;
    if (rules[idx]) {
      const val = e.target.value.toUpperCase();
      rules[idx].policial = val; 
      e.target.value = val; 
      saveRules(); 
    }
  }));
  
  c.querySelectorAll('.rule-remove').forEach(b => b.addEventListener('click', e => { 
    const idx = +e.currentTarget.dataset.i;
    rules.splice(idx, 1); 
    saveRules(); 
    renderRules(); 
  }));
}

document.getElementById('btnAddRule').addEventListener('click', () => {
  rules.push({ fato: '', policial: '' });
  saveRules(); renderRules();
  // Ensure config panel is visible
  const panelConfig = document.getElementById('panelConfig');
  if (!panelConfig.classList.contains('active')) {
    document.getElementById('btnRegrasToggle').click();
  }
});

// ---- LOG ----
function addLog(msg, level = 'info') {
  const now = new Date();
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  logs.unshift({ time, msg, level });
  if (logs.length > 60) logs.pop();
  chrome.storage.local.set({ logs });
  renderLogs();
}

function renderLogs() {
  const c = document.getElementById('logScroll');
  if (logs.length === 0) { c.innerHTML = '<span class="log-empty">Aguardando ações...</span>'; return; }
  c.innerHTML = logs.slice(0, 8).map(l =>
    `<div class="log-entry"><span class="log-time">${l.time}</span><span class="log-msg ${l.level}">${l.msg}</span></div>`
  ).join('');
}

// ---- STATUS ----
function setStatus(text, state = '') {
  document.getElementById('statusText').textContent = text;
  document.getElementById('statusDot').className = 'status-dot ' + (state || '');
}

// ---- CONTROLE MANUAL ----
document.getElementById('toggleManualHeader').addEventListener('click', () => {
  document.getElementById('manualControls').classList.toggle('hidden');
});

document.getElementById('btnResetManual').addEventListener('click', (e) => {
  e.stopPropagation(); // Previne fechar/abrir a sanfona
  isAutoMode = false;
  
  // Limpa a interface de análise e resultados
  hide('secAnalysis'); hide('secResumoIA'); hide('secDestinatario'); hide('secDone');
  document.getElementById('analysisBox').innerHTML = '<div style="color: #64748b; font-size: 13px;">Clique no botão acima para gerar o resumo com IA.</div>';
  hide('despachoSuggestion');
  document.getElementById('selectManualTipo').value = '';
  resetStep5Button();
  
  // Limpa o estado visual dos botões manuais
  for (let i = 1; i <= 7; i++) {
    const btnM = document.getElementById('btnM' + i);
    if (btnM) btnM.classList.remove('success');
  }
  const btn31 = document.getElementById('btnM3_1');
  if (btn31) btn31.classList.remove('success');
  
  setStatus('Pronto', '');
  addLog('Ciclo manual resetado', 'info');
});

document.getElementById('btnM1').addEventListener('click', async () => { console.log('[Popup] Botão M1 clicado'); isAutoMode = false; await sendToTab('STEP1_CLICK_BO'); });
document.getElementById('btnM2').addEventListener('click', async () => { console.log('[Popup] Botão M2 clicado'); isAutoMode = false; await triggerStep2(); });
document.getElementById('btnM3').addEventListener('click', async () => { console.log('[Popup] Botão M3 clicado'); isAutoMode = false; await triggerStep3(); });
document.getElementById('btnM3_1').addEventListener('click', async () => { console.log('[Popup] Botão M3.1 clicado'); isAutoMode = false; await triggerStep3_1(); });

document.getElementById('btnM4').addEventListener('click', async () => {
  console.log('[Popup] Botão M4 clicado');
  isAutoMode = false;
  const tipo = document.getElementById('selectManualTipo').value;
  if (!tipo && !currentDespacho) { addLog('Selecione o tipo de despacho', 'warning'); return; }
  const desp = tipo ? DESPACHOS[tipo] : currentDespacho;
  const pol = tipo ? getPolicial(tipo) : currentPolicial;
  document.getElementById('destinatarioName').textContent = pol || 'Nenhum policial';
  await sendToTab('STEP4_INSERT_DESPACHO', { despacho: desp, rules });
});

document.getElementById('btnM5').addEventListener('click', async () => {
  console.log('[Popup] Botão M5 clicado');
  isAutoMode = false;
  const tipo = document.getElementById('selectManualTipo').value;
  const pol = tipo ? getPolicial(tipo) : (currentPolicial || getPolicial(currentTipo));
  await sendToTab('STEP5_INCLUIR_DESTINATARIO', { policial: pol });
});

document.getElementById('btnM6').addEventListener('click', async () => { 
  console.log('[Popup] Botão M6 clicado');
  isAutoMode = false; 
  setStatus('Salvando...', 'active');
  await sendToTab('STEP6_SALVAR'); 
});
document.getElementById('btnM7').addEventListener('click', async () => { 
  console.log('[Popup] Botão M7 clicado');
  isAutoMode = false; 
  setStatus('Encerrando BO...', 'active');
  await sendToTab('STEP7_RESOLVER'); 
});

// ---- INSERIR OUTRO DESPACHO ----
document.getElementById('selectManualTipo').addEventListener('change', async (e) => {
  const tipo = e.target.value;
  if (!tipo) return;
  isAutoMode = false;
  currentTipo = tipo;
  currentDespacho = DESPACHOS[tipo];
  currentPolicial = getPolicial(tipo);
  
  // Oculta a análise do BO e resumo IA para ficar mais minimalista
  hide('secAnalysis');
  hide('secResumoIA');
  
  document.getElementById('destinatarioName').textContent = currentPolicial || 'Nenhum policial';
  addLog(`Inserindo despacho: ${TIPO_LABELS[tipo]}`, 'info');
  setStatus('Inserindo despacho...', 'active');
  await sendToTab('STEP4_INSERT_DESPACHO', { despacho: currentDespacho, rules });
  // Reset select para o label padrão
  e.target.value = '';
});

// ---- AUTENTICAÇÃO ----
document.getElementById('btnLogin').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;
  const errorDiv = document.getElementById('loginError');
  const btnText = document.getElementById('btnLoginText');

  if (!email || !senha) {
    errorDiv.textContent = 'Preencha email e senha.';
    errorDiv.classList.remove('hidden');
    return;
  }

  errorDiv.classList.add('hidden');
  btnText.textContent = 'Verificando...';
  document.getElementById('btnLogin').disabled = true;

  const res = await Auth.login(email, senha);

  if (res.ok) {
    // Reload UI state via initApp
    initApp();
  } else {
    errorDiv.textContent = res.erro;
    errorDiv.classList.remove('hidden');
  }

  btnText.textContent = 'Entrar';
  document.getElementById('btnLogin').disabled = false;
});

document.getElementById('btnLogout').addEventListener('click', async () => {
  await Auth.logout();
  // Limpa campos
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginSenha').value = '';
  document.getElementById('loginError').classList.add('hidden');
  
  // Reseta estado
  isAutoMode = false;
  
  // Chama initApp para esconder tudo e mostrar tela de login
  initApp();
});
