import { ungzip } from 'pako';
import convert from 'xml-js';
import fs, { createReadStream } from 'fs';
import { postgresConnection } from './src/database/index.js';
import moment from 'moment'

// // decode the base64 encoded data
// const gzipedData = Buffer.from("H4sIAAAAAAAAC8VXzW6jSBC+rzTv0PJ5xvz4PyKeZTAZOXKMB0i01w60nV4BzfKTjOa6D7OnfYndF9tqjKHB4ESjSJtL6Kqvqrqrv6oua5+/hwF6JklKWXQ9UIbyAJHIYz6NDteDPNt/mg8+Lz/8otlxigAapVffU/968JRl8ZUkvby8DF9GQ5YcJFWWFem3u43jPZEQDyowfR38iUZphiOPDCASQto62kO44htWBgtjksGmKF4qMwkMVVmdIGV8JU+uZFmTREBps8IZNkOapph124iA0sYmBxoSM40JOArchD7mGfZAD/BeXWlrxbD/jDg0jAOSbrEH2cTBUtWkHk1pt/ZJlNE99biz+syg2eYhSdhyPNGk8rNSOSShZLngxzh+VhqXxnBeTSr+lyGknhjczTP1BL8POGAJSZFUi1bYZynPb0BC8IJB3TYD1IbC9a3hBkTbk3xF/NxjTbfSq36Lo4nrcpmebVcMWIgq5AhY9nEBCWyK2/jTBpfyR57SpqwN3tEGji/bEIPtgc8iqpS0getEBMHqzFMaBA0/fC2AvuCUGDjw8oCVMFEiAPWA/pGzDJeoatkOuAE59dl2n5JW9kTN2Tkc59u2cZRC0Ia5ELEsHZbeEJ8kuJnMbsBFNyYQzM8v+akRFx3d5RH1aHzJkwCpidwmYZXqFrsvR++NKUR6zbEGBRgWFXeqHHUqKzJ0gzNFXd409RIa0qjoZYX63z//+YuhGDxD3hjyCTwHWUIOGMUsyTA6/QddTBJA/82OMGUqKSpvs2PAjJTTAmq9EaSKXaaTsjU0bv/YvUcjWR5PpprUpfz/m1LxGPn0wLaPtWXVqarGeoOzPMECYldms65wzYji35fj2WK0mM2gk8vKbAEPGRdWEDOCCiAeO7cWlMudbd6Ya9dCt5b91US395u1hQzLcXW0shzk6FvXcjSpwgs+yndFgfBnj0zRXWgCEsPcurbFW0uxFAD3+6V9q0nwTxAaJAbiKXCRCn+aYSUqi+xVl1vfd1tRX0p/Frp40JkrG//AzGH85YaUDyHnQ0g60rc62un3Gx05680DpMsE0crWVya894LJRYK0A2rSmcRlYXPfovOdbhvm2raQs7Nc5Fibe8MyHbRxV3rPLhrPeds3z3G8bxK+YJW6WMwnijLhVJuOW1QrRi5epODx1OWCRmlcDFqRsWM3Fe/sHKM7nEFPu0jG0XjexcU66dCmdLiykQw4UXpOXJsy9MgimrEu8nZQcQxs7KfiidvzOeRQbnG7PtNZcgwGTGlu0CUB2bOINO/JDDENlnAmkvAb/zXGiUdowtKYZUOPhcPHBMIUoDps0ztMfkJ4uLZ6kOZDtfB6l/neJSxjHgsYgkH9KqLB9SBLcjKoe1d5F+qidS0/NWIfc/sAQ2tJpd6wRyQ/XcIC0gtz4PB5ykfe8kvYnMF/UQS4oMcrx/uaU9wL4b6+5bSY9y8Cy1mge65+61T6xqHu1ZHuZwa6N41z7zLMvdMo906DXDXGtX5znNH1TZQynvAz0T2SptUDp6rNp77oIMc/daFOZEWRx7MpNOcF7yuC/YdTGVf3dHz1dJ96p3i37HHtL6cjuNnj59GoiSvHHi6rWlv3CbR1yKc/qNqy+rCPix//neAvUJ2Q0tOyCnrMVI+RldADjIPB9sbpLG14+aBr/QdYTzFqmxAAAA==", "base64");

// console.log('gzipeddata', gzipedData);
// const ungzipedData = ungzip(gzipedData);



// console.log('ungziped data', new TextDecoder().decode(ungzipedData));
// const textUngziped = new TextDecoder().decode(ungzipedData);
// const result = convert.xml2json(textUngziped, {compact: true, spaces: 4});
// const resultParse = JSON.parse(result);
// // console.log(result);


// const codesMunicipios = fs.readFileSync('./src/utils/códigos-municipios.txt');
// const codesMunicipiosParse = JSON.parse(codesMunicipios);
// const currentMunicipio = codesMunicipiosParse.find(item => item.Codigo == resultParse?.Rps?.InfRps?.Servicos?.MunicipioIncidencia?._text);
// const municipio = `${currentMunicipio.Nome}/${currentMunicipio.Uf}`
// const serie = resultParse?.Rps?.InfRps?.IdentificacaoRps?.Serie?._text
// const num_rps = resultParse?.Rps?.InfRps?.IdentificacaoRps?.Numero?._text
// const num_nfse = resultParse?.Rps?.InfNfse?.Numero?._text
// const data_emissao = resultParse?.Rps?.InfRps?.DataEmissao?._text
// const cnpj_prestador = resultParse?.Rps?.InfRps?.Prestador?.Cnpj?._text
// const cnpj_tomador = resultParse?.Rps?.InfRps?.Tomador?.IdentificacaoTomador?.Cnpj?._text
// const prestador = resultParse?.Rps?.InfRps?.Prestador?.DadosComplementaresPrestador?.RazaoSocial?._text
// const tomador = resultParse?.Rps?.InfRps?.Tomador?.RazaoSocial?._text
// const valor_iss = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorISSQN?._text
// const valor_servicos = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorServicos?._text
// const base_calculo = resultParse?.Rps?.InfNfse?.ValoresServico?.BaseCalculo?._text
// const aliquota = resultParse?.Rps?.InfNfse?.ValoresServico?.Aliquota?._text
// const valor_liquido_nfse = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorLiquidoNfse?._text
// const valor_total_tributos_federais = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorTotalTributosFederais?._text
// const valor_total_tributos_estaduais = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorTotalTributosEstaduais?._text
// const valor_total_tributos_municipais = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorTotalTributosMunicipais?._text
// const chave_acesso = resultParse?.Rps?.InfNfse?.ChaveAcesso?._text
// const descricao = resultParse?.Rps?.InfRps?.Servicos?.Discriminacao?._text
// const prestadorInfo = resultParse?.Rps?.InfRps?.Prestador?.EnderecoPrestador
// const end_prestador = `${prestadorInfo?.Endereco?._text}, ${prestadorInfo?.Numero?._text}, ${prestadorInfo?.Bairro?._text} - ${prestadorInfo?.Cep?._text} - ${prestadorInfo?.Uf?._text}`
// console.log({
//     municipio, 
//     serie, 
//     num_rps, 
//     num_nfse, 
//     data_emissao, 
//     cnpj_prestador,
//     cnpj_tomador, 
//     prestador, 
//     tomador, 
//     valor_iss, 
//     valor_servicos,
//     base_calculo,
//     aliquota,
//     valor_liquido_nfse,
//     valor_total_tributos_federais,
//     valor_total_tributos_estaduais,
//     valor_total_tributos_municipais,
//     chave_acesso,
//     descricao,
//     end_prestador,
//     // ref_dataEMissao,
//     // status,
//     // ref_numeroRPS
// });
const codesMunicipios = fs.readFileSync('./src/utils/códigos-municipios.txt');
const codesMunicipiosParse = JSON.parse(codesMunicipios);
const readStream = fs.createReadStream('./src/database/nfses-all.txt');

let output = '';

readStream.on('data', function(chunk) {
  output += chunk.toString('utf8');
});

readStream.on('end', async function() {
  console.log('finished reading');
  console.log('total :)', output.split('},').length)
  const text = output.replaceAll('[', '').replaceAll(']', '').split('},');
  let arr = text.map((obj, i) => {
    if(i == text.length-1){
        return JSON.parse(obj);
    }
    const full_object = obj.concat('}');
    return JSON.parse(full_object);
  })

  console.log('COM DUPLICADOS', arr.length);

  arr = arr.map(nfse => {

    // decode the base64 encoded data
        const gzipedData = Buffer.from(nfse?.conteudoDocumento, "base64");

        const ungzipedData = ungzip(gzipedData);

        const textUngziped = new TextDecoder().decode(ungzipedData);
        const result = convert.xml2json(textUngziped, {compact: true, spaces: 4});
        const resultParse = JSON.parse(result);


        

        const currentMunicipio = codesMunicipiosParse.find(item => item.Codigo == resultParse?.Rps?.InfRps?.Servicos?.MunicipioIncidencia?._text);
        const municipio = `${currentMunicipio.Nome}/${currentMunicipio.Uf}`
        const serie = resultParse?.Rps?.InfRps?.IdentificacaoRps?.Serie?._text
        const num_rps = resultParse?.Rps?.InfRps?.IdentificacaoRps?.Numero?._text
        const num_nfse = resultParse?.Rps?.InfNfse?.Numero?._text
        const data_emissao = resultParse?.Rps?.InfRps?.DataEmissao?._text
        const cnpj_prestador = resultParse?.Rps?.InfRps?.Prestador?.Cnpj?._text
        const cnpj_tomador = resultParse?.Rps?.InfRps?.Tomador?.IdentificacaoTomador?.Cnpj?._text
        const prestador = resultParse?.Rps?.InfRps?.Prestador?.DadosComplementaresPrestador?.RazaoSocial?._text
        const tomador = resultParse?.Rps?.InfRps?.Tomador?.RazaoSocial?._text
        const valor_iss = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorISSQN?._text
        const valor_servicos = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorServicos?._text
        const base_calculo = resultParse?.Rps?.InfNfse?.ValoresServico?.BaseCalculo?._text
        const aliquota = resultParse?.Rps?.InfNfse?.ValoresServico?.Aliquota?._text
        const valor_liquido_nfse = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorLiquidoNfse?._text
        const valor_total_tributos_federais = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorTotalTributosFederais?._text
        const valor_total_tributos_estaduais = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorTotalTributosEstaduais?._text
        const valor_total_tributos_municipais = resultParse?.Rps?.InfNfse?.ValoresServico?.ValorTotalTributosMunicipais?._text
        const chave_acesso = resultParse?.Rps?.InfNfse?.ChaveAcesso?._text
        const descricao = resultParse?.Rps?.InfRps?.Servicos?.Discriminacao?._text
        const prestadorInfo = resultParse?.Rps?.InfRps?.Prestador?.EnderecoPrestador
        const end_prestador = `${prestadorInfo?.Endereco?._text}, ${prestadorInfo?.Numero?._text}, ${prestadorInfo?.Bairro?._text} - ${prestadorInfo?.Cep?._text} - ${prestadorInfo?.Uf?._text}`
        return {
            municipio,
            serie,
            num_rps,
            num_nfse,
            cnpj_prestador,
            cnpj_tomador,
            prestador,
            tomador,
            valor_iss,
            valor_servicos,
            base_calculo,
            aliquota,
            valor_liquido_nfse,
            valor_total_tributos_federais,
            valor_total_tributos_estaduais,
            valor_total_tributos_municipais,
            chave_acesso,
            descricao,
            end_prestador,
            ref_dataEmissao: nfse?.dataEmissao,
            status: nfse?.status,
            ref_numeroRPS: nfse?.numeroRPS,
            ref_numeroNfse: nfse?.numeroDocumento
        }
  }).filter((item, i, arr) => {
    return !arr.some((itemArr, j) => 
        j > i 
        && item.chave_acesso == itemArr.chave_acesso 
    )
  }).map(nfse => ({...nfse, ref_dataEmissao: moment(nfse?.ref_dataEmissao).utc().toISOString()}))


  console.log('sem duplicados', arr.length);

  let maxItemsPerInsert = 100;
  let qtdLoop = Math.ceil(arr.length / maxItemsPerInsert);
  
  for(let i = 1; i <= qtdLoop; i++){
    console.log(new Date());
    await insertBd(arr.slice((i-1) * maxItemsPerInsert, i*maxItemsPerInsert));
  }
  
});

const insertBd = async (arr) => {
    console.log('CHAMEI');
    return await new Promise((resolve) => {
        postgresConnection('all_nfse').insert(arr).then(() => {
            setTimeout(() => {
                resolve();
            }, 3000);
        }).catch(err => {
            console.log(err);
        })
    });
}


