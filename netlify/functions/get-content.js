const { getStore } = require('@netlify/blobs');

const DEFAULT_HORSES = [
  {
    id: 'flicker', name: 'Flicker', nameJa: 'フリッカー',
    breed: 'クォーターホース · 2009年生',
    desc: '少しだけ男顔だけど、とてもおとなしい女の子。人懐っこくて首などを掻いてあげると寄り添ってきます。外乗コースで一番人気の馬で、木漏れ日の中をゆったりと歩む姿がとても美しい。',
    tag: '外乗コース担当',
    img1: 'http://aso-uma.com/wp-content/uploads/2019/09/5D_33026.jpg',
    img2: 'http://aso-uma.com/wp-content/uploads/2019/09/5D_33028.jpg',
    bg: 'linear-gradient(160deg,#2A1A0A,#5C3018)',
  },
  {
    id: 'momo', name: 'Momo', nameJa: 'モモ',
    breed: '2014年生',
    desc: 'とても顔の可愛らしい女の子。気難しいところもありますが、ゆったり歩いてくれるので乗り心地が良く、多くのお客様の心をつかんでいます。',
    tag: '外乗 / ホースセラピー',
    img1: 'http://aso-uma.com/wp-content/uploads/2019/09/5D_33040.jpg',
    img2: 'http://aso-uma.com/wp-content/uploads/2019/09/5D_33047.jpg',
    bg: 'linear-gradient(160deg,#1E0E18,#3A1830)',
  },
  {
    id: 'choco', name: 'Choco', nameJa: 'チョコ',
    breed: '',
    desc: 'チョコレート色の美しい毛並みが印象的。おっとりとした性格で子どもたちに大人気。えさやり体験や引き馬でも活躍しています。',
    tag: '子ども・初心者向け',
    img1: 'http://aso-uma.com/wp-content/uploads/2019/09/5D_33047.jpg',
    img2: '',
    bg: 'linear-gradient(160deg,#2A1505,#5C2E10)',
  },
  {
    id: 'merry', name: 'Merry', nameJa: 'メリー',
    breed: '',
    desc: '牧場のムードメーカー。しっかり調教されており安定感抜群。ホースセラピーでの貢献が大きく、訪れた方の心を癒しています。',
    tag: 'ホースセラピー担当',
    img1: 'http://aso-uma.com/wp-content/uploads/2019/09/5D_33040.jpg',
    img2: '',
    bg: 'linear-gradient(160deg,#0A1E14,#144A2C)',
  },
];

const DEFAULT_PLANS = [
  { id:'esayari',  name:'えさやり体験',          dur:'随時受付',  note:'予約不要・直接来場OK', price:'¥100',   priceNum:100,  desc:'馬に直接えさを与えてふれあう体験。お子様から年配の方まで楽しめます。',                       img:'http://aso-uma.com/wp-content/uploads/2013/04/top-slide02.jpg',                        hot:false },
  { id:'hikiuma',  name:'引き馬',                dur:'予約不要',  note:'予約不要・直接来場OK', price:'¥1,100', priceNum:1100, desc:'インストラクターが引く馬に乗る安心プラン。小さなお子様からご年配の方まで。',             img:'http://aso-uma.com/wp-content/uploads/2013/04/hikiuma-01.jpg',                         hot:false },
  { id:'futari',   name:'幼児と保護者の二人乗り', dur:'要予約',    note:'お子様連れにおすすめ', price:'¥1,500', priceNum:1500, desc:'小さなお子様と保護者が一緒に馬に乗れる特別プラン。',                                    img:'http://aso-uma.com/wp-content/uploads/2013/04/dan-family.jpg',                         hot:false },
  { id:'taiken20', name:'体験乗馬 20分コース',    dur:'約20分',   note:'要予約 · 乗馬デビューに', price:'¥3,500〜', priceNum:3500, desc:'乗り方の説明後、場内を自分で馬を操る楽しさを体験。乗馬デビューに最適。',              img:'https://aso-uma.com/wp-content/uploads/2024/08/img_5593-1.jpg',                        hot:false },
  { id:'taiken40', name:'体験乗馬 40分コース',    dur:'約40分',   note:'要予約 · 人気プラン',  price:'¥5,940', priceNum:5940, desc:'インストラクターの先導後、馬場内で自由に乗馬。ゆったりと馬との時間を満喫できる人気プラン。', img:'http://aso-uma.com/wp-content/uploads/2019/09/5D_33026.jpg',                          hot:true  },
  { id:'mini',     name:'ミニ外乗コース',          dur:'約25分',   note:'要予約 · 小学生以上',  price:'¥5,500', priceNum:5500, desc:'牧場の外へ。木立の中を馬に乗ってトレッキング。3名様まで同時に。',                       img:'http://aso-uma.com/wp-content/uploads/2019/09/5D_33051.jpg',                          hot:true  },
  { id:'middle',   name:'外乗 ミドルコース',       dur:'約40分',   note:'要予約 · 小学生以上',  price:'¥7,700', priceNum:7700, desc:'森や木立の中を40分かけてトレッキング。阿蘇の自然を五感で感じる人気コースです。',           img:'http://aso-uma.com/wp-content/uploads/2019/09/5D_33074.jpg',                          hot:true  },
  { id:'long',     name:'外乗 ロングコース',       dur:'約60分',   note:'要予約 · 小学生以上',  price:'¥9,200', priceNum:9200, desc:'森と野山を60分かけてゆっくり探索。馬との深い一体感を堪能できる最長コース。',             img:'http://aso-uma.com/wp-content/uploads/2019/09/5D_33075.jpg',                          hot:false },
  { id:'advanced', name:'中・上級者 / アリーナレッスン', dur:'要相談', note:'要相談・要予約',   price:'お問い合わせ', priceNum:0, desc:'馬で走れるようになるためのレッスン。本格的に乗馬技術を磨きたい方へ。',              img:'http://aso-uma.com/wp-content/uploads/2013/04/top-slide01.png',                        hot:false },
];

exports.handler = async () => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const store = getStore({ name: 'aso-uma-content', consistency: 'strong' });
    const [hRaw, pRaw] = await Promise.all([
      store.get('horses').catch(() => null),
      store.get('plans').catch(() => null),
    ]);
    const horses = hRaw ? JSON.parse(hRaw) : DEFAULT_HORSES;
    const plans  = pRaw ? JSON.parse(pRaw) : DEFAULT_PLANS;
    return { statusCode: 200, headers, body: JSON.stringify({ horses, plans }) };
  } catch {
    return { statusCode: 200, headers, body: JSON.stringify({ horses: DEFAULT_HORSES, plans: DEFAULT_PLANS }) };
  }
};
