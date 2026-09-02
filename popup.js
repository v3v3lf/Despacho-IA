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
  estelionato_insignificancia: 'Estelionato - Insignificância',
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
  { value: 'estelionato_insignificancia', label: 'ESTELIONATO - INSIGNIFICÂNCIA' },
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

// Estado Multiprovedor de IA
let activeProvider = 'gemini';
let providerKeys = {};
let providerModels = {};
let enableWebSearch = false;

// Estado MarkItDown
let currentMarkdownDoc = '';
let currentRawDoc = '';
let currentTokenStats = null;
let currentActiveMdTab = 'rendered';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Atualiza o badge do provedor e modelo ativos no cabeçalho.
 */
function updateActiveAiBadge() {
  const badge = document.getElementById('activeAiBadge');
  if (!badge) return;
  const cfg = (typeof getProviderConfig === 'function') ? getProviderConfig(activeProvider) : null;
  const icon = cfg?.icon || '🤖';
  const name = cfg?.badgeText || cfg?.name || 'IA';
  const currentModel = providerModels[activeProvider] || cfg?.defaultModel || '';
  
  let shortModel = currentModel
    .replace(/^models\//, '')
    .replace(/^openrouter\//, '')
    .replace(/^meta-llama\//, '')
    .replace(/^google\//, '')
    .replace(/^anthropic\//, '');
  if (shortModel.length > 20) shortModel = shortModel.substring(0, 18) + '...';

  const searchIcon = enableWebSearch && cfg?.supportsGrounding ? ' 🌐' : '';
  badge.textContent = `${icon} ${shortModel || name}${searchIcon}`;
  badge.title = `Provedor: ${cfg?.name || activeProvider}\nModelo: ${currentModel}\nBusca na Web: ${enableWebSearch ? 'Ativa' : 'Desativada'}`;
}

/**
 * Sincroniza toda a interface do modal/painel de IA com o provedor e chaves ativos.
 */
function loadAiConfigUI() {
  const providerSelect = document.getElementById('providerSelect');
  const providerLabel = document.getElementById('currentProviderLabel');
  const keyHelpLink = document.getElementById('providerKeyHelpLink');
  const keyInput = document.getElementById('providerApiKeyInput');
  const keyStatusBadge = document.getElementById('keyStatusBadge');
  const modelSelect = document.getElementById('providerModelSelect');
  const toggleSearch = document.getElementById('toggleWebSearch');
  const searchSupportBadge = document.getElementById('webSearchSupportBadge');
  const searchDesc = document.getElementById('webSearchDesc');
  const statusEl = document.getElementById('aiConfigStatus');

  const providerConfig = (typeof getProviderConfig === 'function')
    ? getProviderConfig(activeProvider)
    : { name: 'Google Gemini', icon: '🌐', apiKeyUrl: 'https://aistudio.google.com/apikey', defaultModel: 'gemini-2.5-flash', modelGroups: [] };

  if (providerSelect) {
    providerSelect.value = activeProvider;
  }

  if (providerLabel) {
    providerLabel.textContent = providerConfig.name;
  }

  if (keyHelpLink) {
    keyHelpLink.href = providerConfig.apiKeyUrl;
    keyHelpLink.textContent = `Obter chave no ${providerConfig.name} ↗`;
  }

  const currentKey = providerKeys[activeProvider] || '';
  if (keyInput) {
    keyInput.value = currentKey;
    keyInput.placeholder = providerConfig.keyPlaceholder || 'Cole sua chave de API...';
  }

  if (keyStatusBadge) {
    if (currentKey && currentKey.trim().length > 0) {
      keyStatusBadge.textContent = 'Salva ✓';
      keyStatusBadge.className = 'key-status-badge saved';
    } else {
      keyStatusBadge.textContent = 'Não salva';
      keyStatusBadge.className = 'key-status-badge missing';
    }
  }

  if (modelSelect) {
    modelSelect.innerHTML = '';
    const selectedModel = providerModels[activeProvider] || providerConfig.defaultModel;

    let modelFound = false;
    if (providerConfig.modelGroups && providerConfig.modelGroups.length > 0) {
      providerConfig.modelGroups.forEach(group => {
        const optGroup = document.createElement('optgroup');
        optGroup.label = group.label;
        group.models.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.id;
          opt.textContent = m.name;
          if (m.id === selectedModel) {
            opt.selected = true;
            modelFound = true;
          }
          optGroup.appendChild(opt);
        });
        modelSelect.appendChild(optGroup);
      });
    }

    if (!modelFound && selectedModel) {
      const customOpt = document.createElement('option');
      customOpt.value = selectedModel;
      customOpt.textContent = `${selectedModel} (Personalizado)`;
      customOpt.selected = true;
      modelSelect.appendChild(customOpt);
    }
  }

  if (toggleSearch) {
    toggleSearch.checked = !!enableWebSearch;
    if (!providerConfig.supportsGrounding) {
      toggleSearch.disabled = true;
      if (searchSupportBadge) {
        searchSupportBadge.textContent = 'Não aplicável';
        searchSupportBadge.className = 'web-search-badge disabled';
      }
      if (searchDesc) {
        searchDesc.textContent = `O provedor ${providerConfig.name} não possui suporte nativo a pesquisa Google em tempo real.`;
      }
    } else {
      toggleSearch.disabled = false;
      if (searchSupportBadge) {
        searchSupportBadge.textContent = 'Suportado';
        searchSupportBadge.className = 'web-search-badge';
      }
      if (searchDesc) {
        searchDesc.textContent = 'Habilita pesquisa no Google em tempo real para enriquecer a fundamentação jurídica.';
      }
    }
  }

  if (statusEl) {
    if (currentKey) {
      statusEl.textContent = `Provedor ativo: ${providerConfig.name} (${providerModels[activeProvider] || providerConfig.defaultModel})`;
      statusEl.className = 'success';
    } else {
      statusEl.textContent = `Informe a chave de API do ${providerConfig.name} para utilizar a análise inteligente.`;
      statusEl.className = 'error';
    }
  }

  updateActiveAiBadge();
}

let _renderCount = 0;
function renderAnalysisBox(fatos, resumo, state, message) {
  _renderCount++;
  const callId = _renderCount;
  const hasResumo = !!resumo;
  const preview = resumo ? resumo.substring(0, 80) + '...' : (message || 'Aguardando...');

  const stateClass = state ? ' ' + state : '';
  const resumoHtml = resumo
    ? `<div class="analysis-resumo" style="margin-top: 2px; padding-top: 2px; border-top: none; font-size: 11px; line-height: 1.6; color: var(--text); font-family: 'IBM Plex Mono', monospace; white-space: pre-wrap;">${escapeHtml(resumo)}</div>`
    : `<div class="analysis-resumo${stateClass}" style="margin-top: 2px; padding-top: 2px; border-top: none; font-size: 11px; line-height: 1.6; font-family: 'IBM Plex Mono', monospace; white-space: pre-wrap;">${escapeHtml(message || 'Aguardando geração da análise...')}</div>`;

  document.getElementById('analysisBox').innerHTML = resumoHtml;

  const copyBtn = document.getElementById('btnCopyResumo');
  if (copyBtn) {
    if (resumo) {
      copyBtn.style.display = 'inline-flex';
      const newCopyBtn = copyBtn.cloneNode(true);
      copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
      
      newCopyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resumo)
          .then(() => {
            const originalText = newCopyBtn.innerHTML;
            newCopyBtn.innerHTML = '✓ Copiado!';
            newCopyBtn.style.borderColor = '#22c55e';
            newCopyBtn.style.color = '#22c55e';
            setTimeout(() => {
              newCopyBtn.innerHTML = originalText;
              newCopyBtn.style.borderColor = '#38bdf8';
              newCopyBtn.style.color = '#38bdf8';
            }, 2000);
          })
          .catch(err => {
            console.error('[Despacho IA] Erro ao copiar texto:', err);
          });
      });
    } else {
      copyBtn.style.display = 'none';
    }
  }
}

/**
 * Atualiza a interface e métricas do visualizador MarkItDown.
 */
function updateMarkItDownUI(markdownText, rawText, metadata = {}) {
  currentMarkdownDoc = (markdownText || '').trim();
  currentRawDoc = (rawText || '').trim();

  const tokenBadge = document.getElementById('mdTokenBadge');
  const renderedView = document.getElementById('mdRenderedView');
  const rawTextarea = document.getElementById('mdRawTextarea');
  const statsContainer = document.getElementById('mdStatsContainer');

  if (typeof MarkItDownCleaner !== 'undefined' && currentRawDoc) {
    currentTokenStats = MarkItDownCleaner.computeTokenStats(currentRawDoc, currentMarkdownDoc);
  } else {
    const mdChars = currentMarkdownDoc.length;
    const rawChars = currentRawDoc.length || mdChars;
    const mdTok = Math.ceil(mdChars / 3.8);
    const rawTok = Math.ceil(rawChars / 3.8);
    currentTokenStats = {
      originalChars: rawChars,
      markdownChars: mdChars,
      originalTokens: rawTok,
      markdownTokens: mdTok,
      savedTokens: Math.max(0, rawTok - mdTok),
      savedPercent: rawChars > 0 ? Math.max(0, Math.round(((rawChars - mdChars) / rawChars) * 100)) : 0
    };
  }

  // Atualiza Badge de Economia
  if (tokenBadge) {
    if (currentTokenStats && currentTokenStats.savedPercent > 0) {
      tokenBadge.textContent = `⚡ MarkItDown: -${currentTokenStats.savedPercent}% tokens`;
      tokenBadge.classList.remove('hidden');
    } else if (currentMarkdownDoc) {
      tokenBadge.textContent = `⚡ MarkItDown Ativo`;
      tokenBadge.classList.remove('hidden');
    } else {
      tokenBadge.classList.add('hidden');
    }
  }

  // Renderiza HTML
  if (renderedView) {
    if (typeof MarkItDownViewer !== 'undefined') {
      renderedView.innerHTML = MarkItDownViewer.renderToHtml(currentMarkdownDoc);
    } else {
      renderedView.textContent = currentMarkdownDoc;
    }
  }

  // Textarea Raw
  if (rawTextarea) {
    rawTextarea.value = currentMarkdownDoc;
  }

  // Grid de Estatísticas
  if (statsContainer && currentTokenStats) {
    statsContainer.innerHTML = `
      <div class="md-stat-card">
        <div class="md-stat-val highlight">${currentTokenStats.markdownTokens.toLocaleString('pt-BR')}</div>
        <div class="md-stat-lbl">Tokens (.md)</div>
      </div>
      <div class="md-stat-card">
        <div class="md-stat-val">${currentTokenStats.originalTokens.toLocaleString('pt-BR')}</div>
        <div class="md-stat-lbl">Tokens (Bruto)</div>
      </div>
      <div class="md-stat-card">
        <div class="md-stat-val highlight">${currentTokenStats.markdownChars.toLocaleString('pt-BR')}</div>
        <div class="md-stat-lbl">Caracteres (.md)</div>
      </div>
      <div class="md-stat-card">
        <div class="md-stat-val highlight">-${currentTokenStats.savedPercent}%</div>
        <div class="md-stat-lbl">Economia Total</div>
      </div>
    `;
  }
}

/**
 * Inicializa os ouvintes de eventos da UI do MarkItDown (abas, drawer e botões).
 */
function initMarkItDownUI() {
  const btnToggle = document.getElementById('btnToggleMdView');
  const drawer = document.getElementById('mdDrawer');
  const btnClose = document.getElementById('btnCloseMdDrawer');
  const tabRendered = document.getElementById('tabMdRendered');
  const tabRaw = document.getElementById('tabMdRaw');
  const tabStats = document.getElementById('tabMdStats');
  const renderedView = document.getElementById('mdRenderedView');
  const rawView = document.getElementById('mdRawView');
  const statsView = document.getElementById('mdStatsView');
  const btnCopy = document.getElementById('btnCopyMd');
  const btnDownload = document.getElementById('btnDownloadMd');
  const btnSaveEdited = document.getElementById('btnSaveEditedMd');
  const rawTextarea = document.getElementById('mdRawTextarea');

  if (btnToggle && drawer) {
    btnToggle.addEventListener('click', () => {
      drawer.classList.toggle('hidden');
      if (!drawer.classList.contains('hidden') && !currentMarkdownDoc && currentRelatoText) {
        // Converte texto em markdown se ainda não foi convertido
        let md = currentRelatoText;
        if (typeof MarkItDownEngine !== 'undefined') {
          const engine = new MarkItDownEngine();
          md = engine.convert(currentRelatoText);
        }
        if (typeof MarkItDownCleaner !== 'undefined') {
          md = MarkItDownCleaner.sanitize(md, { fato: currentFatos });
        }
        updateMarkItDownUI(md, currentRelatoText);
      }
    });
  }

  if (btnClose && drawer) {
    btnClose.addEventListener('click', () => {
      drawer.classList.add('hidden');
    });
  }

  function setMdTab(tabName) {
    currentActiveMdTab = tabName;
    if (tabRendered) tabRendered.classList.toggle('active', tabName === 'rendered');
    if (tabRaw) tabRaw.classList.toggle('active', tabName === 'raw');
    if (tabStats) tabStats.classList.toggle('active', tabName === 'stats');

    if (renderedView) renderedView.classList.toggle('hidden', tabName !== 'rendered');
    if (rawView) rawView.classList.toggle('hidden', tabName !== 'raw');
    if (statsView) statsView.classList.toggle('hidden', tabName !== 'stats');
  }

  if (tabRendered) tabRendered.addEventListener('click', () => setMdTab('rendered'));
  if (tabRaw) tabRaw.addEventListener('click', () => setMdTab('raw'));
  if (tabStats) tabStats.addEventListener('click', () => setMdTab('stats'));

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const textToCopy = currentMarkdownDoc || (rawTextarea ? rawTextarea.value : '');
      if (!textToCopy) return;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const orig = btnCopy.innerHTML;
        btnCopy.innerHTML = '✓ Copiado!';
        setTimeout(() => { btnCopy.innerHTML = orig; }, 1800);
      }).catch(err => {
        console.error('[Despacho IA] Erro ao copiar MD:', err);
      });
    });
  }

  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const content = currentMarkdownDoc || (rawTextarea ? rawTextarea.value : '');
      if (!content) return;
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BO_${currentTipo || 'documento'}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (btnSaveEdited && rawTextarea) {
    btnSaveEdited.addEventListener('click', async () => {
      const editedMd = rawTextarea.value.trim();
      if (!editedMd) return;
      currentMarkdownDoc = editedMd;
      updateMarkItDownUI(currentMarkdownDoc, currentRawDoc);
      setMdTab('rendered');
      addLog('Markdown atualizado manualmente. Reexecutando análise com IA...', 'info');
      try {
        renderAnalysisBox(currentFatos, null, '', '⟳ Reanalisando com Markdown personalizado...');
        const resumoRes = await gerarResumoRelatoIA(currentMarkdownDoc, currentFatos);
        if (resumoRes.ok) {
          currentResumoIA = resumoRes.resumo;
          renderAnalysisBox(currentFatos, currentResumoIA);
          addLog('Resumo IA gerado com sucesso via Markdown personalizado', 'success');
        } else {
          renderAnalysisBox(currentFatos, null, 'error', resumoRes.message);
        }
      } catch (err) {
        renderAnalysisBox(currentFatos, null, 'error', err.message);
      }
    });
  }
}

/**
 * Função principal para gerar o resumo do BO usando o Provedor de IA ativo e MarkItDown.
 */
async function gerarResumoRelatoIA(documentoMarkdownOuTexto, fatos) {
  const currentKey = providerKeys[activeProvider] || '';
  const providerConfig = (typeof getProviderConfig === 'function')
    ? getProviderConfig(activeProvider)
    : { name: 'Google Gemini', defaultModel: 'gemini-2.5-flash', apiKeyUrl: 'https://aistudio.google.com/apikey' };

  if (!currentKey || !currentKey.trim()) {
    return {
      ok: false,
      skipped: true,
      message: `Configure a chave de API do ${providerConfig.name} em ⚙ REGRAS para gerar a análise automaticamente.`
    };
  }

  let textoDoc = (documentoMarkdownOuTexto || '').trim();
  if (!textoDoc || textoDoc.length < 20) {
    return { ok: false, skipped: true, message: 'Nenhum texto estruturado encontrado na página do BO para análise IA.' };
  }

  const currentModel = providerModels[activeProvider] || providerConfig.defaultModel;

  addLog(`Enviando documento MarkItDown (${textoDoc.length} chars) para ${providerConfig.name} (${currentModel})...`, 'info');
  console.log(`[Despacho IA] Enviando para ${providerConfig.name} [${currentModel}] (${textoDoc.length} chars MarkItDown)`);

  const systemInstruction = `Você é um analista de dados policiais especialista em extrair dados estruturados de Boletins de Ocorrência do SISP.
Sua tarefa é ler todo o documento do Boletim de Ocorrência estruturado em Markdown fornecido e criar um resumo fluido, contínuo e em parágrafo único.

Instruções específicas:
1. Inicie obrigatoriamente com o padrão: "o BO-[NÚMERO DO BO]" (ex: "o BO-00614.2026.0030318"). Utilize o número do BO no formato de registro (ex: "00127.2026.0001088").
2. No mesmo parágrafo, de forma corrida (sem quebras de linha ou divisões), informe: os fatos comunicados, a data/horário, o endereço do ocorrido, o comunicante, a(s) vítima(s) e o autor do crime (caso identificado nas tabelas ou relato).
3. Inclua a dinâmica do fato de forma detalhada, especificando todas as ações relatadas e todos os objetos/bens/valores subtraídos ou transacionados descritos no Markdown.
4. Nunca invente ou assuma informações não descritas explicitamente no documento estruturado fornecido.
5. Se autor ou testemunhas não forem citados ou forem declarados como desconhecidos, simplesmente não os mencione no texto.
6. ATENÇÃO: O resumo deve ser concluído com um ponto final e conter todo o relato estruturado, sem ser cortado ou truncado no meio de uma frase.`;

  const prompt = `### BOLETIM DE OCORRÊNCIA ESTRUTURADO (MARKDOWN):
---
${textoDoc.slice(0, 16000)}
---`;

  try {
    const result = await callAIProvider({
      provider: activeProvider,
      model: currentModel,
      apiKey: currentKey,
      prompt: prompt,
      systemInstruction: systemInstruction,
      enableWebSearch: enableWebSearch,
      temperature: 0.1,
      maxTokens: 1400,
      onRetry: (attempt, maxAttempts, delay, err) => {
        addLog(`API ${providerConfig.name} instável (${err.message}). Tentativa ${attempt}/${maxAttempts}...`, 'warning');
      }
    });

    return { ok: true, resumo: result.text };
  } catch (err) {
    const msg = err.formattedMessage || err.message || 'Erro de comunicação com a IA.';
    throw new Error(msg);
  }
}

async function initApp() {
  console.log('[Despacho IA] Inicializando App...');
  
  // 1. Carrega dados de IA que não dependem de sessão e UI do MarkItDown
  loadAiConfigUI();
  initMarkItDownUI();

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

  // 4. Carrega configurações, migra chaves legadas e renderiza regras/logs
  chrome.storage.local.get([
    'rules',
    'logs',
    'googleApiKey',
    'geminiModel',
    'activeProvider',
    'providerKeys',
    'providerModels',
    'enableWebSearch'
  ], data => {
    // Garante que rules e logs sejam sempre arrays
    rules = Array.isArray(data.rules) ? data.rules : [];
    logs = Array.isArray(data.logs) ? data.logs : [];

    // Migração e carregamento transparente de Multiprovedores
    activeProvider = data.activeProvider || 'gemini';
    providerKeys = (data.providerKeys && typeof data.providerKeys === 'object') ? data.providerKeys : {};
    providerModels = (data.providerModels && typeof data.providerModels === 'object') ? data.providerModels : {};
    if (typeof data.enableWebSearch === 'boolean') {
      enableWebSearch = data.enableWebSearch;
    }

    // Migração de chaves legadas do Gemini se ainda não existirem no novo formato
    if (data.googleApiKey && !providerKeys.gemini) {
      providerKeys.gemini = data.googleApiKey;
    }
    if (data.geminiModel && !providerModels.gemini) {
      providerModels.gemini = data.geminiModel;
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
  // Try matching any SISP/CIASC/SSP subdomains first
  try {
    const tabs = await chrome.tabs.query({ url: ['*://*.ciasc.sc.gov.br/*', '*://*.ssp.sc.gov.br/*'] });
    if (tabs && tabs.length > 0) {
      const active = tabs.find(t => t.active);
      return active || tabs[0];
    }
  } catch (e) {
    console.warn('[Popup] Erro na busca de abas do SISP:', e);
  }

  // Fallback: check all active tabs across normal browser windows
  try {
    const activeTabs = await chrome.tabs.query({ active: true });
    if (activeTabs && activeTabs.length > 0) {
      const currentWin = await chrome.windows.getCurrent();
      const nonPopup = activeTabs.find(t => t.windowId !== currentWin.id && t.url && (t.url.includes('ciasc.sc.gov.br') || t.url.includes('ssp.sc.gov.br')));
      if (nonPopup) return nonPopup;
    }
  } catch (e) {}

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

// CONFIG MULTIPROVEDOR IA
const providerSelectEl = document.getElementById('providerSelect');
if (providerSelectEl) {
  providerSelectEl.addEventListener('change', (e) => {
    activeProvider = e.target.value;
    chrome.storage.local.set({ activeProvider });
    loadAiConfigUI();
    const cfg = (typeof getProviderConfig === 'function') ? getProviderConfig(activeProvider) : { name: activeProvider };
    addLog(`Provedor de IA alterado para: ${cfg.name}`, 'info');
  });
}

const btnToggleKeyEye = document.getElementById('btnToggleKeyEye');
if (btnToggleKeyEye) {
  btnToggleKeyEye.addEventListener('click', () => {
    const keyInput = document.getElementById('providerApiKeyInput');
    if (!keyInput) return;
    if (keyInput.type === 'password') {
      keyInput.type = 'text';
      btnToggleKeyEye.textContent = '🔒';
      btnToggleKeyEye.title = 'Ocultar chave';
    } else {
      keyInput.type = 'password';
      btnToggleKeyEye.textContent = '👁️';
      btnToggleKeyEye.title = 'Mostrar chave';
    }
  });
}

const providerModelSelectEl = document.getElementById('providerModelSelect');
if (providerModelSelectEl) {
  providerModelSelectEl.addEventListener('change', (e) => {
    providerModels[activeProvider] = e.target.value;
    chrome.storage.local.set({ providerModels });
    if (activeProvider === 'gemini') {
      chrome.storage.local.set({ geminiModel: e.target.value });
    }
    updateActiveAiBadge();
  });
}

const toggleWebSearchEl = document.getElementById('toggleWebSearch');
if (toggleWebSearchEl) {
  toggleWebSearchEl.addEventListener('change', (e) => {
    enableWebSearch = e.target.checked;
    chrome.storage.local.set({ enableWebSearch });
    updateActiveAiBadge();
    addLog(`Busca na Internet (Grounding): ${enableWebSearch ? 'Ativada' : 'Desativada'}`, 'info');
  });
}

const btnSaveAiConfigEl = document.getElementById('btnSaveAiConfig');
if (btnSaveAiConfigEl) {
  btnSaveAiConfigEl.addEventListener('click', () => {
    const keyInput = document.getElementById('providerApiKeyInput');
    const modelSelect = document.getElementById('providerModelSelect');
    const toggleSearch = document.getElementById('toggleWebSearch');

    const keyVal = keyInput ? keyInput.value.trim() : '';
    const modelVal = modelSelect ? modelSelect.value : '';
    const searchVal = toggleSearch ? toggleSearch.checked : false;

    providerKeys[activeProvider] = keyVal;
    if (modelVal) providerModels[activeProvider] = modelVal;
    enableWebSearch = searchVal;

    const dataToSave = {
      activeProvider,
      providerKeys,
      providerModels,
      enableWebSearch
    };

    // Retrocompatibilidade se Gemini ativo
    if (activeProvider === 'gemini') {
      dataToSave.googleApiKey = keyVal;
      dataToSave.geminiModel = modelVal;
    }

    chrome.storage.local.set(dataToSave, () => {
      loadAiConfigUI();
      const cfg = (typeof getProviderConfig === 'function') ? getProviderConfig(activeProvider) : { name: activeProvider };
      if (keyVal) {
        addLog(`Configurações de IA salvas com sucesso para ${cfg.name}!`, 'success');
      } else {
        addLog(`Chave não configurada para ${cfg.name}. Insira sua chave para habilitar a análise.`, 'warning');
      }
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

  // Só busca no storage ou via scripting API se o texto principal estiver vazio ou não contiver "relato individual"
  if (!currentRelatoText || !/relato\s+individual/i.test(currentRelatoText)) {
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
        const tab = tabs && tabs[0];
        
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
  renderAnalysisBox(currentFatos, null, '', '⟳ Estruturando com MarkItDown e gerando resumo...');
  setStatus('Processando com MarkItDown & IA...', 'active');
  addLog('Extraindo e estruturando frames do SISP com MarkItDown...', 'info');

  let rawFullText = '';
  let markdownConverted = '';

  try {
    const tabs = await new Promise(r => chrome.tabs.query({ active: true, currentWindow: true }, r));
    const tab = tabs && tabs[0];
    if (tab) {
      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: () => {
          if (!document.body) return null;
          return {
            html: document.body.innerHTML || '',
            text: document.body.innerText || document.body.textContent || ''
          };
        }
      });

      if (injectionResults && injectionResults.length > 0) {
        const validFrames = injectionResults
          .map(frame => frame.result)
          .filter(res => res && res.text && res.text.trim().length > 20);

        rawFullText = validFrames.map(f => f.text.trim()).join('\n\n---\n\n');

        // Conversão com MarkItDown Engine
        if (typeof MarkItDownEngine !== 'undefined') {
          const engine = new MarkItDownEngine();
          const frameMds = validFrames.map(f => engine.convert(f.html));
          markdownConverted = frameMds.filter(m => m.trim().length > 0).join('\n\n---\n\n');
        } else {
          markdownConverted = rawFullText;
        }
      }
    }
  } catch (e) {
    console.error('[Despacho IA] Erro ao extrair frames com MarkItDown:', e);
  }

  if (!rawFullText) {
    rawFullText = currentRelatoText;
  }

  if (!markdownConverted) {
    if (typeof MarkItDownEngine !== 'undefined') {
      const engine = new MarkItDownEngine();
      markdownConverted = engine.convert(rawFullText);
    } else {
      markdownConverted = rawFullText;
    }
  }

  // Sanitização e Frontmatter
  let markdownFinal = markdownConverted;
  if (typeof MarkItDownCleaner !== 'undefined') {
    markdownFinal = MarkItDownCleaner.sanitize(markdownConverted, {
      fato: currentFatos || currentTipo || ''
    });
  }

  // Atualiza painel e métricas de tokens do MarkItDown
  updateMarkItDownUI(markdownFinal, rawFullText);

  const providerCfg = (typeof getProviderConfig === 'function') ? getProviderConfig(activeProvider) : { name: 'IA' };
  addLog(`Chamando API ${providerCfg.name} com documento MarkItDown...`, 'info');

  try {
    const resumoRes = await gerarResumoRelatoIA(markdownFinal, currentFatos);
    if (resumoRes.ok) {
      currentResumoIA = resumoRes.resumo;
      renderAnalysisBox(currentFatos, currentResumoIA);
      addLog('Resumo IA gerado com sucesso via MarkItDown', 'success');
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
