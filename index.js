import { ungzip } from 'pako';
import convert from 'xml-js';
import fs, { createWriteStream } from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { jwtDecode } from 'jwt-decode';

let data = new FormData();
data.append('grant_type', 'client_credentials');
data.append('client_id', '9cc0ea318a3a4cc397236b3b8f2716bd');
data.append('scope', 'integracao-api');
data.append('client_secret', 'nd6lV6YRAN4ltzhcOf6NpzNJyUnp1OaGLun9F0MTkdY=');



let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://spacenddidentityhml.e-datacenter.nddigital.com.br/connect/token?grant_type=client_credentials&client_id=9cc0ea318a3a4cc397236b3b8f2716bd&scope=integracao-api&client_secret=nd6lV6YRAN4ltzhcOf6NpzNJyUnp1OaGLun9F0MTkdY=',
  headers: { 
    ...data.getHeaders()
  },
  data : data,
  retries: 300
};



// decode the base64 encoded data
const gzipedData = Buffer.from("H4sIAAAAAAAAC8VY3W6rRhC+P9J5h5WlSq3UE/5sx46Ij4hNIo4c44AdndsNrJOtgKX8JFFv+yi96Hu0L9ZZjGHB4ERHkWopgZ355mdnZ2bH1r++hgF6JklKWXQ5UM7kASKRx3waPV4O8mz3ZTL4Ovv8SXfiFAE0Si9eU/9y8JRl8YUkvby8nL1oZyx5lFRZVqTvt0vXeyIhHlRg+jb4C43SDEceGYAlhHQr2oG54h1WcxbGJAOnKJ4p5xIIqrI6QsrwYqReDGVdEgGlzAJn2AxpmmLWLSMCShmHPNKQmGlMQFGwSehDnmEP+ADv5ZWydgz+Z8SlYRyQdIU9iCYOZqou9XBKOcsnUUZ31OPK6j0DZ5WHJAHnp7pUvlYslySUzKYy+LV/rTgbGoOILhXP0oTUY4OreaaeoPceBywhKZJq0gL7LOXxDUgIWjCw22KAWlI4PgtOQJQ90BfEzz3WVCu9qbfYmrgul+mRu6LBglQhFXUk/8qj1CS38QcHZwK4orXBa9rA8WUbMmc7yGcRVVLaQCsRQbA60pQGQUMPXwugK5ySOQ68PGAlTKQIQCOgv+cswyWqWrYNLoFOfbbapaQVPZFztA/XvVs1tlIQ2rANWCxLh6XXxCcJbgazG3BSjQkJ5uen9NSIk4pu84h6ND6lSYDUidxOwirUrew+bb3XpmDpLcU6FGBYVNyhcmRFVmXoBkeMurxp6iU0pFHRyyzoU48J/vfPf/6Gv78Y8hlKuQinwIqg1bVrIo+FiLzGLMlEKAGaR4Iz9PNI/olLPvPNcPADqPfZL58/ra3v6AtSNE1TppPpuTaBPtBwoPKrDDVlFjR1f9/ZNU0eTuWhLnUx//+GVVxUPn1kq4dasupiVdO9xlmeYAGxBk2Qoayufn0exb/NhqORpk3ksQw35USDS44TK4gZQXUQjx1LC8yZs70yVy662Vq3hmOYri5VLAFeXi/y0UVTdBiaAOXKvkWOubEcm7eYgiSAtruZ802X4CEQ5ySeqcNzdSyP4Zz5SmQWkaoOsj7bNqM+gP4dd515Z1wc/AdmLuM3OIT3DOJ7BgFGV852ZaOF7SLXWG3g4dgLx7rZmi5amMi17ram5RgwAwjiJxOjbVyXjigbFjb3ICpfG84cTNrIXdsb5NrL7dwGZ5abRZ8XjSu+rZvHO941E73IJnU6nYwUZcRTbDxspVgxhvHiBI2HzhfMFGXCDxXmmg5mHZST/lT52eFolZ9rx742Xdd2kLtxbHNpnszd4Xln9tbHwmausTQQUuXJgVt91sb97cZWj+iHz71xYyAV+qio7rhG7raGs+GZYkNGGa61NHvKpSP5tak87k/+QzWNxhNZOR83q6mOy1Gc5wzysenrhgRkxyLSzAYzxDRotLumKAyUgm5+9tV8zmd1YSgoD2SdsIx5LGAI5v+LiAaXgyzJyaBue33j7Q9N7vvA3cMsXKZcr9k9ku8uYQHphbmw+RwGSOjf+zfBuTn/ohLgIg3e2N5NTnEvhOu6y2nxNeIksBwxusf19w6775wV35wUf2ROfNeU+CEz4gdNiB80H1bTYeurzFG6viul5k/4mRgeSdPqvlTV5pQA/w8fZQrHoozHQ22insMgCCUtyH8+lHF1TvtL1PCpd7D3jT1Y/mysjXRp/7oXauLKiYnTqr7VvQPdCmMIBVRtWX3Yx8VvCp3gK6hOCOlhWRndR6pHyE7oI0ySAUypnaUNlyd0rf8AoSvw9fIQAAA=", "base64");

console.log('gzipeddata', gzipedData);
const ungzipedData = ungzip(gzipedData);



console.log('ungziped data', new TextDecoder().decode(ungzipedData));
const textUngziped = new TextDecoder().decode(ungzipedData);
const result = convert.xml2json(textUngziped, {compact: true, spaces: 4});
const resultParse = JSON.parse(result);
// console.log(result);


const codesMunicipios = fs.readFileSync('./src/utils/códigos-municipios.txt');
const codesMunicipiosParse = JSON.parse(codesMunicipios);
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

console.log({
    municipio, 
    serie, 
    num_rps, 
    num_nfse, 
    data_emissao, 
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
    chave_acesso
});

let max_request = 99999
let datas = [
    {
        DataEmissaoInicial: '2024-09-01T23:59:59.000Z',
        DataEmissaoFinal: '2024-11-01T23:59:59.999Z'
    },
    {
        DataEmissaoInicial: '2024-11-01T23:59:59.000Z',
        DataEmissaoFinal: '2025-01-01T23:59:59.999Z'
    },
    {
        DataEmissaoInicial:  '2025-01-01T23:59:59.999Z',
        DataEmissaoFinal: '2025-01-18T00:41:59.999Z'
    },
    // {
    //     DataEmissaoInicial:  '2025-01-16T23:59:59.999Z',
    //     DataEmissaoFinal: '2025-01-17T23:59:59.999Z'
    // },
    // {
    //     DataEmissaoInicial:  '2025-01-17T23:59:59.999Z',
    //     DataEmissaoFinal: '2025-01-18T05:59:59.999Z'
    // },
]

let token;
const writeStream = createWriteStream('./src/database/arr.txt');
writeStream.write('[');

const makeRequest = async (page, idx) => {
    const data = datas[idx];
    if(page >= max_request) return;
    // let resultOfYesterday = read('./src/database/arr.txt');
    console.log({token});
    axios
    .get(`https://spaceapiv2hml.e-datacenter.nddigital.com.br/integracaov2-nfse/api/NFSeRecepcao/ConsultarRecepcaoNFSe?CNPJ=29985115000164&DataEmissaoInicial=${data?.DataEmissaoInicial}&DataEmissaoFinal=${data?.DataEmissaoFinal}&Pagina=${page}`,
    ).then(({data}) => {
        // console.log(data?.length);
        console.log({page});
        if(!data.length){
            console.log('ACABOU REQUISIÇÃO', 'INDEX: ', idx);
            if(idx+1 <= datas.length-1){
                makeRequest(1, idx+1);
            }else{
                writeStream.write(']');
                setTimeout(() => {
                    let resultOfYesterday = read('./src/database/arr.txt');
                    console.log('total', resultOfYesterday?.length);

                }, 2000)
            }
        }else{
            setTimeout(() => {
                data.forEach((obj, i) => {
                    writeStream.write(JSON.stringify(obj, null, 2));
    
                    if(i < data.length-1){
                        writeStream.write(',');
                    }else{
                        if(idx+1 <= datas.length-1){
                            writeStream.write(',');
                        }
                    }
                })
                // resultOfYesterday = [...resultOfYesterday.filter(prevItem => !data.some(newItem => prevItem.dataEmissao == newItem.dataEmissao)), ...data].filter(item => item.dataEmissao && item.numeroDocumento);
                // write(resultOfYesterday, './src/database/arr.txt');
                makeRequest(page+1, idx);
            }, 25000);
        }
        
    }).catch(async(err) => {
        console.log('catch fn', err.message);
        // if(err?.response?.status != 401){
        //     setTimeout(() => {
        //         makeRequest(page, idx);
        //     }, 30000);
        // }
    })
}

const getToken = async() => {
    try{
        const {data} = await axios(config)
        token = data?.access_token;
    }catch(err){
        console.log('ERRO AO BUSCAR TOKEN');
        setTimeout(async () => {
            await getToken();
        }, 20000);
    }
}

await getToken();


axios.interceptors.request.use(
    async (config) => {

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // decode the token and check if (token.exp < Date.now() / 1000)
        // console.log(jwtDecode(token));

        if (jwtDecode(token).exp < Date.now() / 1000) {
            // Call your refresh token endpoint
            // you have to implement an endpoint to get the refresh token
            // if you use 3rd party auth servers, you make requests to their /refreh enpoints
            const newToken = await getToken();
            if (newToken) {
              // Token refreshed, update the Authorization header with the new token
              config.headers.Authorization = `Bearer ${newToken}`;
              // Retry the original request
            }    
        } 
    
      }

      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);



makeRequest(1,0)

function write(array, path) {
    fs.writeFileSync(path, JSON.stringify(array, null, 2));
}

function read(path) {
    const fileContent = fs.readFileSync(path);
    let array = [];
    if(fileContent.length){
        array = JSON.parse(fileContent);
    }

    return array;
}

// write(['a', 'b'], './arr.txt');
// const arr = read('./arr.txt');




// parseBruto = parseBruto.replace(/\\n/g, "\\n")
//                .replace(/\\'/g, "\\'")
//                .replace(/\\"/g, '\\"')
//                .replace(/\\&/g, "\\&")
//                .replace(/\\r/g, "\\r")
//                .replace(/\\t/g, "\\t")
//                .replace(/\\b/g, "\\b")
//                .replace(/\\f/g, "\\f");
// // Remove non-printable and other non-valid JSON characters
// parseBruto = parseBruto.replace(/[\u0000-\u001F]+/g,"");
// var o = JSON.parse(parseBruto);