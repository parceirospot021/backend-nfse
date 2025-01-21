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
  
  let max_request = 99999
  let datas = [
    // {
    //     DataEmissaoInicial: '2024-09-01T00:00:00.000Z',
    //     DataEmissaoFinal: '2024-11-01T23:59:59.999Z'
    // },
    // {
    //     DataEmissaoInicial: '2024-12-01T23:59:59.999Z',
    //     DataEmissaoFinal: '2025-01-18T23:59:59.999Z'
    // },
    {
        DataEmissaoInicial: '2025-01-18T23:59:59.999Z',
        DataEmissaoFinal: '2025-01-19T23:59:59.999Z'
    },
    // {
    //     DataEmissaoInicial: '2024-12-01T23:59:59.000Z',
    //     DataEmissaoFinal: '2025-01-18T00:41:59.999Z'
    // },
  ]
  
  let token;
  const writeStream = createWriteStream('./src/database/arr.txt', {
    highWaterMark: 32000
  });
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
              setTimeout(() => {
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