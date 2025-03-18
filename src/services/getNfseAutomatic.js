import {
    ToadScheduler,
    SimpleIntervalJob,
    Task,
    AsyncTask
} from 'toad-scheduler'
import { ungzip } from 'pako';
import convert from 'xml-js';
import moment from 'moment';
import FormData from 'form-data';
import { jwtDecode } from 'jwt-decode';
import { postgresConnection } from '../database/index.js';
import fs from 'fs';
import axios from 'axios';

export const schedulerEvents = new ToadScheduler();

const codesMunicipios = fs.readFileSync('./src/utils/códigos-municipios.txt');
const codesMunicipiosParse = JSON.parse(codesMunicipios);

let token = '';



const getToken = async() => {
      try{
        let data = new FormData();

        data.append('grant_type', process.env.grant_type);
        data.append('client_id', process.env.client_id);
        data.append('scope', process.env.scope);
        data.append('client_secret', process.env.client_secret);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://spacenddidentityprod.e-datacenter.nddigital.com.br/connect/token?grant_type=client_credentials&client_id=78c6d02e94f2492fb5b58d32de21f5e4&scope=integracao-api&client_secret=Ual1rhyWAC56REJE7vvuUjLdlzsgR0CUYBYU/RwneNM=',
            headers: { 
            ...data.getHeaders()
            },
            data : data,
        }
          const {data: response} = await axios(config)
          token = response?.access_token;
          console.log('BUSQUEI TOKEN');
      }catch(err){
        console.log('Erro ao buscar token', err?.message);
      }
}

const decodeNfses = (arr) => {
    return arr.map(nfse => {
    
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
                ref_dataEmissao: moment(nfse?.dataEmissao).utc().toISOString(),
                status: nfse?.status,
                ref_numeroRPS: nfse?.numeroRPS,
                ref_numeroNfse: nfse?.numeroDocumento
            }
      })
} 
  

const getNfseAutomatic = async() => {
    const task = new AsyncTask('Get nfse of 15 in 15 minutes.', async () => {
        await getToken();
        const initDate = moment().subtract(24, 'hours').utc().toISOString();
        const endDate = moment().utc().toISOString();
        const initDateRef = moment().subtract(48, 'hours').utc().toISOString();
        
        let max_request = 99999
        console.log('INICIANDO CRON', {initDate, endDate, initDateRef});
        const makeRequest = async (page) => {
            if(page >= max_request) return;
            axios
            .get(`https://spaceportalprod.e-datacenter.nddigital.com.br/integracao-nfse/api/NFSeRecepcao/buscarPorCNPJInscricaoMunicipal?CNPJ=29985115000164&DataEmissaoInicial=${initDate}&DataEmissaoFinal=${endDate}&Pagina=${page}`,
            ).then(async({data}) => {
                console.log('cron ->', {page, items: data?.length});
                if(!data.length){
                    console.log('ACABOU CRON', moment().utc().toISOString());
                }else{
                    const objFake={
                        municipio: 'Rio de Janeiro/RJ',
                        serie: '900',
                        num_rps: '39',
                        num_nfse: '39',
                        cnpj_prestador: '51777213000165',
                        cnpj_tomador: '29985115000164',
                        prestador: '51.777.213 MOISES NOBERTO MARTINS',
                        tomador: 'PARCEIRO SPOT SOLUCOES LTDA',
                        valor_iss: '0,00',
                        valor_servicos: '4950,00',
                        base_calculo: '0,00',
                        aliquota: '0,00',
                        valor_liquido_nfse: '4950,00',
                        valor_total_tributos_federais: '0,00',
                        valor_total_tributos_estaduais: '0,00',
                        valor_total_tributos_municipais: '0,00',
                        chave_acesso: '33045572251777213000165000000000003925019668997361',
                        descricao: 'prestaÃ§ao de serviÃ§o de entrega ',
                        end_prestador: 'ALMIRANTE SANTIAGO DANTAS, 01, BARROS FILHO - 21665210 - RJ',
                        ref_dataEmissao: '2025-01-19T16:59:42.000Z',
                        status: 'Cancelado',
                        ref_numeroRPS: '39',
                        ref_numeroNfse: '39'
                      }
                    const arrFormatted = decodeNfses(data);
                    // const arrFormatted = [objFake];

                    const itemsDB = await postgresConnection('all_nfse').select('*').where("ref_dataEmissao", '>=', initDateRef)
                        .andWhere("ref_dataEmissao", '<=', endDate)
                    
                    // const {ref_dataEmissao, ref_numeroNfse, ref_numeroRPS, created_at} = itemsDB.find(nfse => nfse.chave_acesso == '33015042254720997000183000000000001725015803165886');
                    // console.log(ref_dataEmissao == objFake.ref_dataEmissao)
                    // console.log(moment(objFake.ref_dataEmissao).unix() , ' ', moment(created_at).unix())
                    // console.log(ref_numeroNfse == objFake.ref_numeroNfse);

                    // console.log(ref_numeroRPS == objFake.ref_numeroRPS);


                    const itemsNotSaved = arrFormatted.filter((item) => {

                        return !itemsDB.some((itemArr) => item.chave_acesso == itemArr.chave_acesso
                            // moment(item.ref_dataEmissao).unix() == moment(itemArr.ref_dataEmissao).unix()
                            // && item.ref_numeroNfse == itemArr.ref_numeroNfse 
                            // && item.ref_numeroRPS == itemArr.ref_numeroRPS
                        )
                    });

     
                    // console.log(itemsNotSaved[0])
                    
                    const itemsSaved = arrFormatted.filter((item) => {
                        
                        return itemsDB.some((itemArr) => item.chave_acesso == itemArr.chave_acesso
                            // moment(item.ref_dataEmissao).unix() == moment(itemArr.ref_dataEmissao).unix() 
                            // && item.ref_numeroNfse == itemArr.ref_numeroNfse 
                            // && item.ref_numeroRPS == itemArr.ref_numeroRPS
                        )
                    });
                    
                    console.log({
                        itemsNotSaved: itemsNotSaved.length,
                        itemsSaved: itemsSaved.length
                    });

                    if(itemsNotSaved?.length){
                        await postgresConnection('all_nfse').insert(itemsNotSaved);
                    }

                    if(itemsSaved?.length){
                        //CASO ALGUM DOS REGISTROS JÁ TENHAM SIDO SALVO, ELE ATUALIZA.
                        await postgresConnection.transaction(trx => {
                            const queries = [];
                            itemsSaved.forEach(item => {
    
                                const query = postgresConnection('all_nfse')
                                    .where('chave_acesso', '=', item.chave_acesso)
                                    .update(item)
                                    .transacting(trx); // This makes every update be in the same transaction
                                queries.push(query);
                            });
                        
                            Promise.all(queries) // Once every query is written
                                .then(trx.commit) // We try to execute all of them
                                .catch(trx.rollback); // And rollback in case any of them goes wrong
                        });
                    }

                    setTimeout(() => {
                        makeRequest(page+1);
                    }, 40000);
                }
                
            }).catch(async(err) => {
                console.log('catch fn', err.message);
                if(err?.response?.status == 401){
                    console.log('if')
                    getToken().then(() => {
                        makeRequest(page);
                    })
                }
            })
        }

        makeRequest(1);
    })
  

    const job = new SimpleIntervalJob(
        { seconds: 60*10, runImmediately: true },
        task,
        { id: 'get-nfse', preventOverrun: true }
    )
    //create and start jobs
    schedulerEvents.addSimpleIntervalJob(job);

    axios.interceptors.request.use(
        async (config) => {
    
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // decode the token and check if (token.exp < Date.now() / 1000)
            // console.log(jwtDecode(token));
    
            if (jwtDecode(token).exp < Date.now() / 1000) {
                console.log('TOKEN EXPIROU', token);
                // Call your refresh token endpoint
                // you have to implement an endpoint to get the refresh token
                // if you use 3rd party auth servers, you make requests to their /refreh enpoints
                const newToken = await getToken();
                if (newToken) {
                    console.log('Geramos um novo token', newToken);
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
};

export default getNfseAutomatic;