// Nicolle Nogueira Style: o moodboard da marca (imagens salvas no Pinterest, organizadas em 13 capítulos).
// Gerado a partir de conteudo/marca/style/apresentacao.html. Cada imagem é o código do pin no CDN do Pinterest;
// o último caractere diz o formato: P = retrato, L = paisagem, S = quadrada.

export type Capitulo = { id: string; nome: string; titulo: string; texto: string[]; imagens: string[] }

export const urlPin = (h: string) => `https://i.pinimg.com/736x/${h.slice(0, 2)}/${h.slice(2, 4)}/${h.slice(4, 6)}/${h.slice(0, 32)}.jpg`

export const PERGUNTA = 'Como você quer se sentir aqui?'
export const INTRO = 'O repertório visual da marca, construído ao longo do tempo como uma coleção de sensações. Antes da materialidade, da luz e da proporção, existe uma temperatura emocional. Este universo é a tentativa de torná-la visível.'

export const PILARES = [
  { nome: 'Quiet luxury', texto: 'Sofisticação que dispensa ostentação. O valor está na matéria, no acabamento e no tempo de feitura.' },
  { nome: 'Minimalismo sofisticado', texto: 'Poucos elementos, cada um com presença. Vazio como respiro e como parte da composição.' },
  { nome: 'Curadoria', texto: 'Nada entra por acaso. Cada objeto, imagem e referência passa por um olhar editorial rigoroso.' },
  { nome: 'Matéria honesta', texto: 'Madeira, pedra, linho, couro, cerâmica e cera. Superfícies que envelhecem com beleza.' },
  { nome: 'Luz quente e penumbra', texto: 'Tons âmbar, sombras suaves e atmosfera íntima. Espaços que acolhem antes de impressionar.' },
]

export const PALETA = [
  { nome: 'Cru', hex: '#EFE8DC' }, { nome: 'Bege', hex: '#CDBB9F' }, { nome: 'Ocre', hex: '#B38641' }, { nome: 'Âmbar', hex: '#A8733A' },
  { nome: 'Burl', hex: '#74492B' }, { nome: 'Couro', hex: '#4F3324' }, { nome: 'Marsala', hex: '#6B2A2D' }, { nome: 'Grafite', hex: '#1B1917' },
]

export const REFERENCIAS = ['Kelly Wearstler', 'Athena Calderone', 'The Row', 'Aman', 'Tadao Ando', 'Arthur Casas', 'Flamingo Estate', 'Goop', 'Juliana Lima Vasconcellos', 'Ana Khouri']

export const RECUSA = {
  texto: 'Arquitetura genérica e projetos com cara de catálogo. A estética do excesso e da ostentação. Conteúdo raso e tendências passageiras. Ambientes que fotografam bem e acolhem pouco.',
  regra: 'Tudo o que entra precisa ter matéria, tempo e intenção.',
}

export const CAPITULOS: Capitulo[] = [
 {
  "id": "moods",
  "nome": "Moods",
  "titulo": "Atmosfera",
  "texto": [
   "Antes da forma, a sensação. Objetos esculturais, flores escuras, texturas táteis e luz baixa compõem a temperatura emocional da marca.",
   "É daqui que tudo parte. Cada projeto começa pela pergunta sobre como se quer sentir um lugar, e estas imagens são a resposta em estado bruto."
  ],
  "imagens": [
   "ffde6a0f96f78098155b1c732c68011cP",
   "38e50cf038ae3200faa8c6dee5181970P",
   "4c50dd0191b1606755ad952d3d7c0f8cP",
   "5fc0747d3adb313e6de4328c47803d81P",
   "79375726be391b46a30c2d3f23cb6d57P",
   "8f4cfb7f9b2492963b810508b2896b60P",
   "e0e92fa8a02eff177282a4614a75d238P",
   "45dd4b3ff3a6f544f52110a8f5ffd1a0P",
   "431fe04118161526021468e5ae8fa7e1P",
   "8b2e52e75f790283fe59e8f6c5e72f44P",
   "2e63f439d6bfbda45c978b7afe11034cP",
   "0cc158e47a6ec1aed08ba94a46a5b1c3P",
   "c795090c3da8c47e23b6fb381c301957S",
   "1e0b268dddcbb0ed9842673ac14cd432P",
   "3e6ac13072bc7240dd351b381c7754a1L",
   "a17826223ccb7b6a7c330cd57336f15eL",
   "3846d336b91cbaca89d77d8dd7b7f25cP",
   "1621c3dfcf4c346600bbf8708159492fS",
   "d9afa2cfad7d6e04b595f83db52a86baP",
   "33a82ec7cba91d99b112c395199b7723P",
   "73b77285786d373d0eecfa2f08486678S",
   "63a43a3ed1692772f15d4b12e3d73e62P",
   "eeea3299338734b3844ec966c55715ffS",
   "f551d0b8e34fff12ed4242b2df8e63d9S",
   "c53906a6eb4bc92a020df1d4edcbf99fP",
   "0527e7bace2516d1969a72319d6b37c8P",
   "009e5bf7df3fbc36d93147e2e28edd80P",
   "f56df9a0b89a41085daa0132143918fbS",
   "3ca0317f2b656c546de6f8172dbb6215S",
   "057d13642c36a993a193ec8a673d523dP",
   "41794aeb09607b57814f9f71b5cba227P",
   "6ade1c0c200d22459956159152371769P",
   "d2a5f96aba9aa54146e3387bb19ecc74P",
   "840449a4ce933e84381a7375257671c7P",
   "dcf20581e784d4701c3da013d441d6f4P",
   "9bc48574fe7c07051fbba2799600fb7fP",
   "30800a9922a7998a67919077c77d00fcP",
   "a1674d699f569130dcebbe69d34f7df6P",
   "000fdb672fe678625838ea101cbe43ceP",
   "c86dffdf70085d4a679c2fb00aec3347P",
   "b05547f6d4e7eea1bb26de3cdc3fa521P",
   "c62801930db01ef86b9f542b332af03cP",
   "df9ee9c2134974f5182685ea529857c9P",
   "fa724f454639144e67187f17b680e100P",
   "fff03f88eba235fa81eef73aa91894b4P",
   "cea539a97215f21dfd0d961c880c3a37P",
   "d7e4a6cd2d99c44915ffeebb9fa54d7aP",
   "a5f443e8e576d44f2c4b35db14d86cacP",
   "f1969dedb6a3031bacc02c5fce3e5d76P",
   "c79663ac2abcfa4faf436287d5368530P",
   "259f69a12852bf2f3cbfa8d795b9bea4P",
   "5f0d9371b1afeb6de0c2f27963b41c7dP",
   "b142be3394740c2698eaad060db338b6S",
   "142e67992c5e874359f45cf431109359S",
   "68b020fa1bca65d148a3386f2045baa9P",
   "e0108275ed6aba03d2c853e0bbcf3f1bP",
   "08534c5d20d9f0b411e16e7dd27fc4dcP",
   "d57cf64488ccf2e1ed72a5e9312e7c26P",
   "045109a057b40a8cf0e2045c43b50c12P",
   "4c8851ca35970740248af4bfa5d9edb0P",
   "f9c3a68fd94af9f8a48ffb43ee46502aP",
   "78a60614c96c34a10c906192dc9a73a4P",
   "737ced28d396d7b5fd4bee56e9747573P",
   "09397ad452e69084b68da2cbe2d75d9dP",
   "53a51475bcf84b104924d931ab5b7144P",
   "e57c3ad58c47a7c4bbbb5da3db947daaP",
   "ed1dff2c534897d6a19baad157bd59ecP",
   "684ba53ded7f6c5f7a0b303aa3b8c1b9P",
   "69e94c3b1ad6380276fbad7206e4038cP",
   "52768cfcd89142bb2aed1a03479c2be7P",
   "fe26d59235a483c362bdbdfeeed37fa1P",
   "9b938b615b117ae4fabc2f442c415048P",
   "8bb0ecce2c40786d236014553adc5b41P",
   "8c0eb563310ea2e2b9d736016f724c08P",
   "75ae52b7b311edd438acdb9d6de0ded0P",
   "b27299cb6ca05344972347681f3aed21P",
   "2459d2dfebca30a48e41c19f19570e2bP",
   "6196c7ad410d53133ee3470765713952P",
   "3681a13e768a3b62d97a7bc6d6ce37d7P",
   "2c2ca316dba8c791bf04958b3aac3b15P"
  ]
 },
 {
  "id": "interiores",
  "nome": "Interiores",
  "titulo": "Espaços de silêncio",
  "texto": [
   "Madeiras quentes, pedra, linho e penumbra. Ambientes de proporção precisa, com poucos elementos e muita presença.",
   "Casas pensadas para serem vividas com calma, onde o luxo aparece na qualidade da matéria e na luz que atravessa o espaço."
  ],
  "imagens": [
   "bb7a34aa3a73b8441ed5e544e6b355f6P",
   "6c2cc25a776583cd3d028c0d1ddce696L",
   "53e912c307b84f240fab33db18125269P",
   "eea5eb8e21e5a761d630501b30f43bcaP",
   "9f23b04265484d7b4458c4f72acebaeeP",
   "c62b1442064122d261daf07320eb5fb7P",
   "271b9ecee548cbcb8c9111f83d5fa6f8L",
   "9f9b26d394065d4570652bf20fc6e07cL",
   "56e340d20922fd1c885580294cf82634P",
   "1e4596510aa05d3e08214916ea02fec2P",
   "ce738ff92525dcd9d849ac7242335297P",
   "966de9cfdabaa7347f3facfa24c59cf4P",
   "38160ce64073039c0ae9597d70cde5c3P",
   "d1814254f3d750d7d503b2eea58ba13eP",
   "43b7187936d7726730d7d65afec36be8P",
   "84fd0007098510bb1f3790499374c1f5P",
   "f72e63d46ba2f5989d30b16b74d77f07P",
   "2098bd3484d431d58f3ad4f98919f6beP",
   "9baf915fc8f49a33e33f67536bb8e948P",
   "15fd3b39f72f57f11053eac515a0126cP",
   "c4d5e05aa9db602e7b564c9ddd045683P",
   "f604b836105f774f8328d8d5757c1468P",
   "ce0267fca10056718e301e1acbf712daP",
   "a6ed1661274df241bb1c614aeeb04ee1S",
   "f3c8d1d9f5f8456a2faa99f42b22fde9S",
   "ea85e5c1174c6867e3c6e21a0e882bdbP",
   "e02c45b7ca4ecaa7909aaddfe9b52b41P",
   "873245f80407aacbf5cd656648ed1e39P",
   "ec0a5cabdbd67a1ac779bd1b5051777bP",
   "433e5e2d5de75aa82ea3d5f3b645583eP",
   "2ec7c6ddc900ee68a48e43cd3eb8fa05S",
   "f942169fd628948897cea329f52ce9b3P",
   "131233fe9dcbffffd723e29a547a95b6L",
   "ce146ca77f793fd41855fa5b54ca35a9P",
   "493b98a822f46e3c5a04dec66cce73feP",
   "85fe6b35260b5308844999622e2dd15cP",
   "8f1598aa7dd0b098465d807527e6b51bP",
   "498925ff4e4d9268745e3991b29bf77dP",
   "097e4e7cd079a535f6af23cdae6e0d59P",
   "fa8b9c3364b99b5743b01e899553ca92P",
   "f07f62b19ccb49c73b0f8916fa0e2156P",
   "3597df6f0fc5baf0848ee8dd82f11031P",
   "7660ce30650594477b207c8c66c327a4P",
   "21076557be8c588477a599a760fe4ea8P",
   "20a3631a9d9f17ffb2b9b3c6e6f0e569P",
   "197f8ea098eb6161fc2a67b04f877d74P",
   "93a3ab23f8d3b0da1d6da5170fe1a2a5P",
   "ead86ed077475c789ff786818af9ec98L",
   "bce5cb6666807aff82a40a353edf12dcP",
   "2f1846aa22d43819eeadaa0471a56567P"
  ]
 },
 {
  "id": "arquitetura",
  "nome": "Arquitetura",
  "titulo": "Volume e matéria",
  "texto": [
   "Concreto, terra, madeira e paisagem. Uma arquitetura de massa e sombra, em diálogo com a tradição de Tadao Ando e Arthur Casas.",
   "O tempo aparece na superfície e o edifício se apoia no lugar com discrição."
  ],
  "imagens": [
   "bd34084a2fa150c0db6fcd908fb8434fP",
   "e5aaedadb38b37bf2f2ccf248c9c5c11L",
   "127b8ae01e1b218585dac465c4e32fb7S",
   "5ffa934513ad2850ae17caf4db22462fL",
   "a8742423001651c7033f7d5c58fc4fcbP",
   "e940e85945703a57ac572924b02c8458P",
   "37326945b5ed820039c51dce48caeb88P",
   "5ac43c0dc4088c3e74e5947a0315a5b5P",
   "1c1a2445590c92f500580071d668ef33L",
   "2b3ad91c8d0c83cfc36f83a03ae41317L",
   "f918527ffe493c7c91da22a0cc56032fP",
   "b8a9580caad90a7191019088d88d72feP",
   "42e1a033cf5ace93f978a098415b8dc7L"
  ]
 },
 {
  "id": "design",
  "nome": "Design",
  "titulo": "Objeto como escultura",
  "texto": [
   "Peças de desenho autoral, forma escultórica e matéria honesta.",
   "Repertório direto para a primeira coleção de produto do estúdio, que começa por mesa de centro e vaso."
  ],
  "imagens": [
   "d0221b2cf0975cf77a9400854e8e4fbbP",
   "97d284c05ec6da7b7f0add7379c72473P",
   "ad038d68f146ed73007c6cf0fb0e840eL",
   "648f6d3933f381fcb68029cc7ef127b6P",
   "5ef79bb4709420f3740ad13ea70d37ffP",
   "c8df90cadc36c14704c291318d5023f0P",
   "0c5f51382795cd6f65274ce3489eaa4cP",
   "621e90e819f99083514e061e42f3f783P",
   "aa98e10789945dbf14495cf0c4dc223eS",
   "23324bcdfe8732f7492b314abc40324aP",
   "38160ce64073039c0ae9597d70cde5c3P"
  ]
 },
 {
  "id": "mesa-nn",
  "nome": "Mesa NN",
  "titulo": "O ritual sobre a mesa",
  "texto": [
   "Velas, papelaria, embalagens e pequenos objetos de uso diário.",
   "A marca traduzida no detalhe tátil do cotidiano, naquilo que se toca, se acende e se guarda."
  ],
  "imagens": [
   "2f969812078d642594410826e412761fP",
   "5b32db2b6c62563edb3ccf93ee7ebc60P",
   "e35a5bbe3d3814e37773efd96ce5b851P",
   "cad5467b0247c1e72466aa06b23a9b2eP",
   "9d09fe39eb04f3231785fa88c50b2a2bP",
   "cf710178b0dbfd44e657c7b1982107b4P",
   "32d77f38df314e9bea25bc8fa22a19d6P",
   "0016958bbd6133fa019470c3ecaa6974P",
   "779578240417c5d3ba82cc50588a0fefP",
   "27d63ab1ff786ff4f71f762bd829b0daP",
   "2c798483e5d89e82bf7d46b0bdff42d7P",
   "78f250b60c19a90b86eab0419fbcf49cP",
   "ba30e33ea516e083f7ac9bfaf8fc9735P",
   "682ec8d86e2da595501c95d813d4eef0P",
   "a725677fab287fcd5adf047782d2a7e7P",
   "e34c174f433ec24101849fa24561788eP",
   "ec1b00395f58c2f7d5b2dcf5110b6d63P",
   "df57195b177701b8bee5949fe1d18acfP",
   "2c34a42636636f00980360afa7145871P"
  ]
 },
 {
  "id": "mesa-posta-contemporanea",
  "nome": "Mesa Posta Contemporânea",
  "titulo": "Receber",
  "texto": [
   "A mesa como cenografia. Louças de forma orgânica, frutas, cera e luz de vela.",
   "Hospitalidade com rigor e leveza."
  ],
  "imagens": [
   "34da198b3934653c0eb6d471e2f913cbP",
   "91665af8d8c1d2170da00d6e21a4c048P",
   "5b5e580448cf4ee80c1117a3927a6afdP",
   "a0c0829128494f4629b26ba21828e1e8P",
   "cc58c69b30b7638ef5acc08fa0794408P"
  ]
 },
 {
  "id": "flores",
  "nome": "Flores",
  "titulo": "Botânica",
  "texto": [
   "Flores esculturais em tons profundos, usadas como gesto único, com economia e intenção."
  ],
  "imagens": [
   "041bc7c56e983528bf70b1d869e72319P",
   "9dfd746e0f5034754b62081b518ea1f5P",
   "dd4db4e50e81dfd205221806489019faP",
   "0a65d2f64dc815b852b3b32e4416628cP",
   "ed81dc441f8529318891829121df0592P",
   "07374ab65bb047a83b7f8b24a440696fP",
   "5f871622ad1895051afde566ad57ca0eP"
  ]
 },
 {
  "id": "lifestyle",
  "nome": "Lifestyle",
  "titulo": "Vida bem vivida",
  "texto": [
   "Galerias, jantares longos, casas abertas à luz. O universo da marca se estende para o modo de viver, receber e observar o mundo.",
   "A estética como forma de habitar o tempo."
  ],
  "imagens": [
   "a827ae5943b08f3854b469fc3018e223P",
   "04845ea39342496654600bae78764edfP",
   "fc85c74f97ebbe493a6928c59673ec15S",
   "30c83a1e6235ea53f2aa7519b1adc9f1S",
   "d6869f000af6919457c6628c077beb2cP",
   "02532adc5ae29bfdd43b920c893878fdS",
   "040aa7ef126e504f63335162d5753870P",
   "78d1d82931e613a91c996f76fc85c5c3P",
   "903254cfb33f95791ef4957008f1e1c4P",
   "376f5cce81fd6c7d26b4dc1d629e1f5bP",
   "d346e1409903071f2ad0dbad4932629fP",
   "bf9a33f58f888d7882ed13758a695feeP",
   "6f6de1f55e3ca7b804baae097e580391P",
   "aab3af845b91628350478fd34dca08c9P",
   "a4ccda0da1be02ff3969ef10b72962c7P",
   "ffc4285a510cf9c15ceb9205f852ce63P",
   "b13b8297a2b55ebc56c98a0ace7fb0b8P",
   "566cd7c73f5f524ff26e60add99f2f72P",
   "45d9f1cd134f3d38d04803f80f82b78bP",
   "69faa5a350ed2858ec928d9137357002P",
   "16f646f8d2874d840dfa2eb615cb173dP",
   "cd767c776b3baf0592c87b4cf3011a89P",
   "560a154997bcd615896c0745b085a865P",
   "6b9044dd97f04b9d0007998b98132912P",
   "307a5ed49678f73f0a77862e053b7abaP",
   "c38284c3f7f054b16755c90f1dd95858P",
   "b34e84052119e1e366eea598bb447b8bP",
   "06b66dfca4caeec5c71f096733e1d012P",
   "bf15e0d52ca5b541f968b16cf4645ab8P",
   "95d258f5f05872b0e6c8413ea649c526S",
   "a8ad3e8021705fafe0e361d30d9c6ab7L",
   "e56e2fc6ae09370547d44d1b8079728eP",
   "36b65bb14918fa20835cadffacace703P",
   "51077ce079c6ac04eb4509eae789dc35P",
   "4f953a69ad8d9b3d6e27718e88eeb899P",
   "f9558f47b979e35bd30af82d0850d853P",
   "2d8e67d57dfe209162c1527694244804P"
  ]
 },
 {
  "id": "looks",
  "nome": "Looks",
  "titulo": "Vestir",
  "texto": [
   "Alfaiataria precisa, neutros quentes, cortes limpos e preto absoluto.",
   "Uma elegância discreta, próxima do universo de The Row, que leva para o corpo a mesma linguagem dos espaços."
  ],
  "imagens": [
   "775148a897fec72c7646f5b7b12f9043P",
   "41d4a152fd185e552f2cd78531728b31P",
   "d71fd199c5ecba0e9b6c09778b3ff443P",
   "8bafc0baa4c29518aaa81f0ff5e5606bP",
   "9d6bc5a1910f1fd8b8eeef2327d3be39P",
   "94fe60a244416403ef2d23035a3db776P",
   "306b786aada0d5a403d4ea001064438fP",
   "7886801f159eb97d4e075d46223d7705P",
   "ffd58f1b856b67efc5a65c46fbd78046P",
   "879dd63eba0d50ecf94694a286c6fd82P",
   "87c99f0e54020a81380d8a7cb38bbcfeP",
   "3e664132ec6b6bcbcab37f5e8af6f9d9P",
   "80141e28d1e3222309c19bb14759b470P",
   "74449f790f57d064d55d2f06d03d18b1S",
   "29bc626d134b5c9db4b47c46a2641e64P",
   "62ce9dfba5b1a48374d19fe4405eb9e0P",
   "11b64aabadfb02e7010977a4b4b5e0c7P",
   "d142852ff9cf86b18e6ef9baaa15017dP",
   "37da6dd591543b71597d5458eb553f76P",
   "318ad2202fecf958720ec2e73666bee8P",
   "f0c957b067875b5e961ec4adbdbea515S",
   "6c97a51b2f30606ba4a00dc7b22672c8S",
   "a226472dd383633dc420cddbdc4ebd08S",
   "6dcd5ed1fa089046b7d7f02c8afdf199P",
   "9e52aa6bae5dbd62b2054c2b559284a7P",
   "21def74754311734d8436f52ae4e76ffP",
   "8453f082c22cab7f89ae73ba5cfd7ca2P",
   "857f23ef552baea3b3d32f723a2cceadP",
   "b11914dc46d696aabf87f769e55c75f6P",
   "e903dfa9b0e82f712535db56d7726f2fP",
   "bdf75399c147bb755fe29c37b6d68f45P",
   "691f7a8d5faf86d52fea4ef9f0b095f0P",
   "1fc9318df186f2826ef28685b542a3acP",
   "85faffcef3f5ed29fb0109e3ee67eeaaP",
   "84f59d1bfb9289998aeed57fb4a914cfP",
   "e813a819e1ed6d1c7eb1251f8f1001c3P",
   "0ea216c7757112c499b917bb708bfb47P",
   "73027125815e1f0d22d2f762c5114208P",
   "d73ff2407fc13fb0b25b13a0ee3dc0d6P",
   "847b672cea6a32902816699ad2253b7aP",
   "f1e133b32897fb676446a4a0a04ee504P",
   "cf7924af3946d20854bd7e34a2228426P",
   "3b2a12044b61795a42956f2364092333P",
   "f43c9cb8d1229f956647aee9a82cf4f1P",
   "db42b189f5a8fb4806239467b023cf8eP",
   "0af867524985924bc2a351ae29740b6aP",
   "023d4ac8f3e7d2fed7c3faafc5d7e7e7S",
   "8be77ea5082700df13e930546797bc1eS",
   "f5bb78da59ac7a308e66ea45be704f77P",
   "d3dd4348c886f63bd3a71785c8807f15P",
   "f0f69851026a4343058cc131295347afP",
   "429b90b8838606e752f6014e203c62bfP",
   "9f02686d37c162e22e1f494ec096fe99P",
   "95703f01ca36302dc0a0be2a3b64291bP",
   "5d3d4d140d3daa2e5ce9e78db033a4cdP"
  ]
 },
 {
  "id": "hair",
  "nome": "Hair",
  "titulo": "Gesto",
  "texto": [
   "Cabelos presos com naturalidade, coques baixos, acabamento sem esforço aparente."
  ],
  "imagens": [
   "5ed1867c644347aa9624bfabbed26fe0P",
   "e0d134861d5d944e5b67a9779abb27d2P",
   "a0a9df7b811c109ad967a72951de2977P",
   "30a48ee9876afe024d3867aafbabcfa1P",
   "dc1115e458df879959d224e91f897804P"
  ]
 },
 {
  "id": "retrato-2026",
  "nome": "Retrato 2026",
  "titulo": "Presença",
  "texto": [
   "Direção para o retrato da marca. Luz natural, postura serena, preto e branco e tons terrosos.",
   "A fundadora como parte do universo que constrói."
  ],
  "imagens": [
   "1dd3db1258820b3df9fb460896fc4059P",
   "75ad98b440d4b1b109236cd31756586bP",
   "0a4231fce938ace61262713d5012890eP",
   "613a6d597129073bf86871a3d5125aadP",
   "3548bc54889285940681b85987328f67P",
   "052b565e34aa92501e2d03bddd5c6306P",
   "6af7e52e8edeba10aec93b418c4a74f4P",
   "40c1d1f1199bb17b3f9c08b68e8b376fP",
   "cb7e198a448b7b3aa3cf74f8032cbc5bP",
   "a6adebc6b2f44519900e2a9212046f55P",
   "01f5228f4b776af9ab5d66a01039bb5dP",
   "54efa2a56a0690aa95cb2e7e0ae03ae3S",
   "2dd6993b5edd5cc19fc99fc14b0f3dbfS",
   "722a4a169a30563b34c4fdce5fc6cf0fP",
   "f1bfb87a2a5e3c81ccba7b8d277489d6P",
   "87e039b50fd618b4063d8790b0b8efc5P",
   "4b048c2a74621fe57b487eb57acd5b89P",
   "c020f72006ed7827ada903d5cfb0a659P",
   "b958628d76f148e9cb2095b6ae83a108P"
  ]
 },
 {
  "id": "meu-escritorio",
  "nome": "Meu escritório",
  "titulo": "O estúdio",
  "texto": [
   "Referências para o espaço onde a marca é vivida todos os dias.",
   "Madeira, livros, arte e luz filtrada como ambiente de criação."
  ],
  "imagens": [
   "ba711dc69c6325f3e2b12fd9d0e11dd5L",
   "693da54c4b735636ce869af1bb010fa9L",
   "c86fa5292216345403aad95acfdf6eb8P",
   "26335c79295af0aec800b1535ec58885P",
   "c0edb09cdae237f9ceed0e4bcb8c34c8P",
   "e358daec08fdc5c27e2ebbd979a734a0P",
   "57d23eda814e3221cd626e70fb8e519fP",
   "38b58d5ed8e7517a40266008e8a60459P",
   "5e0bbde89cb036cef4367d673f036863P",
   "8aed99a46a2cc2ee10213299d10c7481P",
   "813341aecae86dfd422ca7883cedd27dP",
   "89ba214e9f987cf0f3910841bc369561S",
   "057b2792d7ab788aafe80d03236de044P",
   "831b1defd94d161dc76657b617b320ceP",
   "6ca2243de60301d3ebdd3c712641fdceP",
   "53b1315f81036359031a824900e05e66P",
   "0b805f23a550ebba6729e2d65a5b0ed0P",
   "e7390438f328809d2b98e6ff7d2e89d8P",
   "5d7744adc0f29bd438305f2dc4c67c22P"
  ]
 },
 {
  "id": "identidade-visual",
  "nome": "Identidade visual",
  "titulo": "Linguagem gráfica",
  "texto": [
   "Papelaria tátil, tipografia contida, grids generosos e fotografia editorial.",
   "A tradução da estética em cada ponto de contato da marca."
  ],
  "imagens": [
   "8275d60ffcf6adba0fd7efa47366ecceP",
   "76f013523330d70d979ae0443576373dS",
   "2bf7886e78dac9344c36dedb70c12c15P",
   "a27ae2ded4cf77b590cedfe0137c551fL",
   "62ffd60799321ebde36e3a21e9a689d6L",
   "04fc5b5497219b05106fbbd0b8810b51L",
   "a5267d2569fa3e9c76955f703783a602L",
   "7c4f81eae8bb4b3993cfb5d5e1b3ec9bP",
   "3a8c435931d57780982e5623478e7c30P",
   "896f55c2920adf032188a5992bff1ceeL",
   "d421da4c9471f1300f2de835512c9cf5S",
   "ca994b07c9c37427613b5512a1157e7aP",
   "4aa3c8e26957ea66b9c52225cedd821cP",
   "821547a72883d0cfb47a9b1ae8187d60P",
   "aee6d0a02c630b3a3bd0fba978908fa7P",
   "0ed296e7fa1998cd336ee633111fb2adS",
   "ddb8b856444b08fae1f016dc2bc0fb21P",
   "42596cd9fb631a13b0c678eac8d5ec3fP",
   "c9ee53dc62ebf6403caa6b881d9f0420S",
   "969a2db82f6d44a185eec5046a8d2862P",
   "650151a997218113fc7cb3bae8f96085S",
   "9f23c6a9004b45006bd6b913d2cbb8c9S",
   "cfe4d50d2729c007b799fefc3beca812S",
   "6b987b4cf7be31cd9d951199b08991c4S",
   "129ed8ee3bb9858bef107bd76c9fce2cL",
   "4b43a51517e78622bbd9502550bab7cdP",
   "204ac11025bd747ac44d0074a19ce53bS",
   "33cfca68a6d428257a72ad28fd5b3d05L",
   "64dc8c8471746a463d6d54a546392b60P",
   "1862d8c3b833304357d297d4b0a1c39dS",
   "a1b4f9808fb3fd917aee85c44ef85994P",
   "31b066e2a8ea69732648ac6236f29140S",
   "46731bc440bcd17834b52537022d8cc4L",
   "12425e051a49ad6d99e17b9fd47fb211P",
   "4b4a0557fcca6bffac0042c094fa4697P",
   "451bc850cd11b550faafbc2c1b5318fbP",
   "cd8b4d0d50ba32e82a593aef6ec99ea1S",
   "5cb0ff055a771d09cbf22e5b74dc626aP",
   "93afde317e25b75ee4d43adfdd1bbf76P",
   "f1a9b01388c0de2b38c18861d90977aaS",
   "8ce0afb29c65fa5cab5ecf8db1f3b75aL",
   "0c3d68f920a148402379731751efad0cL",
   "f67d2500ea0a84ec3663d7fe75b0f560L",
   "9c1e19aee15b4fb81492fc6271ae9acfS",
   "b7353525f8a34405d61a59d485e28489S",
   "6c1fef5a5fdab93ed2517d49ec935846P",
   "6386cfe127afa3f9f027363fb98e175dP"
  ]
 }
]

/** Três imagens do dia, de capítulos diferentes (atmosfera, espaço e um terceiro que gira). */
export function imagensDoDia(diaISO: string): { capitulo: Capitulo; imagem: string }[] {
  const dias = Math.floor(Date.parse(diaISO + 'T12:00:00Z') / 86400000)
  const retrato = (c: Capitulo) => c.imagens.filter((h) => !h.endsWith('L'))
  const escolhidos = [CAPITULOS[0], CAPITULOS[1], CAPITULOS[2 + (dias % (CAPITULOS.length - 2))]]
  return escolhidos.map((c, i) => {
    const lista = retrato(c)
    return { capitulo: c, imagem: lista[(((dias * (7 + i * 4)) % lista.length) + lista.length) % lista.length] }
  })
}
