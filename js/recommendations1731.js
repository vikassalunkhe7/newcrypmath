// all tags must be in lowercase
let articles = [
   {
      "url": "https://criptomo.com/buy-bitcoin-2021/",
      "lastmod": "2017-12-11T00:00:00+00:00",
      "title": "How to buy Bitcoin (BTC) in 2021",
      "description": "Guía para principiantes de cómo comprar Bitcoin en 2021. Actualizado.",
      "img": "https://criptomo.com/images/posts/201909/bitcoin-2019.webp",
      "tags": "btc",
      "lang": "en"
   },
   {
      "url": "https://criptomo.com/comprar-bitcoin-2021/",
      "lastmod": "2017-12-11T00:00:00+00:00",
      "title": "Cómo comprar Bitcoin BTC (2021)",
      "description": "Guía para principiantes de cómo comprar Bitcoin en 2021. Actualizado.",
      "img": "https://criptomo.com/comprar-bitcoin-2021/",
      "tags": "btc",
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/que-es-cardano/",
      "lastmod": "2017-12-11T00:00:00+00:00",
      "title": "Qué es Cardano (ADA)",
      "description": "Qué es Cardano",
      "img": "https://criptomo.com/images/posts/201712/cardano.jpg",
      "tags": ["ada", "xtz"],
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/que-es-bitcoin/",
      "lastmod": "2018-01-12T00:00:00+00:00",
      "title": "Qué es Bitcoin",
      "description": "Qué es Bitcoin",
      "img": "https://criptomo.com/images/posts/201711/bitcoin.png",
      "tags": "btc",
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/estrategia-inversion-largo-plazo/",
      "lastmod": "2018-01-14T00:00:00+00:00",
      "title": "Estrategía de Inversión a Largo Plazo",
      "description": "Estrategía de Inversión a Largo Plazo",
      "img": "https://criptomo.com/images/posts/201801/investments.png",
      "tags": "invest",
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/como-valorar-criptomonedas/",
      "lastmod": "2018-01-18T00:00:00+00:00",
      "title": "Cómo valorar Criptomonedas",
      "description": "Cómo saber si una criptomoneda merece la pena",
      "img": "https://criptomo.com/images/posts/201801/investing.png",
      "tags": "invest",
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/que-es-tezos/",
      "lastmod": "2020-02-21T00:00:00+00:00",
      "title": "Qué es Tezos (XTZ)",
      "description": "Guía para principiantes sobre qué es Tezos y como se diferencia de Cardano (ADA).",
      "img": "https://criptomo.com/images/posts/202002/tezos.jpg",
      "tags": "xtz",
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/what-is-tezos/",
      "lastmod": "2020-02-21T00:00:00+00:00",
      "title": "What is Tezos (XTZ)",
      "description": "Beginner’s guide to what Tezos (XTZ) is and how it differs from Cardano (ADA).",
      "img": "https://criptomo.com/images/posts/202002/tezos.jpg",
      "tags": "xtz",
      "lang": "en"
   },
   {
      "url": "https://criptomo.com/que-es-crypto/",
      "lastmod": "2018-06-27T00:00:00+00:00",
      "title": "Qué es CRYPTO (CRO/MCO)",
      "description": "La tarjeta de crédito y débito de criptomonedas llamada CRYPTO, anteriormente conocida como Monaco (MCO) con cambios de divisas competitivos y fondos de inversión. Análisis y opiniones de CRO y MCO.",
      "img": "https://criptomo.com/images/posts/201806/crypto.jpg",
      "tags": "cro mco",
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/what-is-crypto/",
      "lastmod": "2020-01-11T00:00:00+00:00",
      "title": "What is CRYPTO (MCO/CRO)",
      "description": "The cryptocurrency credit and debit card called CRYPTO, formerly known as Monaco (MCO) with competitive currency exchanges and investment funds. Analysis and opinions of CRO and MCO.",
      "img": "https://criptomo.com/images/posts/201806/crypto.jpg",
      "tags": "cro mco",
      "lang": "en"
   },
   {
      "url": "https://criptomo.com/que-es-ethereum/",
      "lastmod": "2017-12-26T00:00:00+00:00",
      "title": "Qué es Ethereum",
      "description": "La criptomoneda Ethereum explicada, qué es, qué diferencias tiene con Bitcoin y dónde comprarla",
      "img": "https://criptomo.com/images/posts/201712/ethereum.jpg",
      "tags": "eth",
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/que-es-iota/",
      "lastmod": "2017-12-18T00:00:00+00:00",
      "title": "Qué es IOTA",
      "description": "La criptomoneda IOTA explicada, en qué consiste, dónde comprarla y cómo almancerla de manera segura.",
      "img": "https://criptomo.com/images/posts/201712/iota.jpg",
      "tags": "miota",
      "lang": "es"
   },
   {
      "url": "https://criptomo.com/que-es-stellar-lumens/",
      "lastmod": "2018-04-05T00:00:00+00:00",
      "title": "Qué es Stellar Lumnes (XLM)",
      "description": "La criptomoneda Stellar Lumens (XLM) explicada de manera sencilla. Dónde comprar y guardar.",
      "img": "https://criptomo.com/images/posts/201804/stellar.png",
      "tags": "xlm",
      "lang": "es"
   }
]
function recommendArticles(coin) {
   let articleSpace = document.querySelector(".recommended-articles");
   let article = '';
   
	const results = articles.filter(obj => {
		  // return (obj.tags.toLowerCase() === coin.toLowerCase() && obj.lang === document.documentElement.lang);
        return (obj.tags.includes(coin.toLowerCase()) && obj.lang === document.documentElement.lang);
	});
   results.forEach(function(result) {
      article += '<div class="recommended-article"><a href="' + result.url + '">' + result.title + '</a></div>';
    });
    articleSpace.innerHTML = article;
    if (article) {
      document.getElementsByClassName("recommended-articles-wrapper")[0].style.display = "block";  
    } else {
      document.getElementsByClassName("recommended-articles-wrapper")[0].style.display = "none";
    }
}