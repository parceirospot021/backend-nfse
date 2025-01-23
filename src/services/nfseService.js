import moment from "moment";
import { postgresConnection } from "../database/index.js";
import xlsx from 'xlsx-js-style';

const NfseService = {
    async create(data){
        try{
            const newNfse = await postgresConnection('allNfse')
            .insert(data)
            .returning('*');

            console.log(newNfse);
            
            return newNfse;
        }catch(err){
            console.log(err?.message);
            throw new Error('Error salvando nfse: ' + err?.message);
        }
    },

    async getAllNfses(
        page,
        limit,
        skip,
        search,
        initialDate,
        finalDate,
        status,
        municipio,
        serie,
        initialRps,
        finalRps,
        initialNfse,
        finalNfse,
        cnpj_prestador,
        cnpj_tomador,
        tomador, 
        prestador,
        chave_acesso
    ){
        try{

            const query = postgresConnection('all_nfse').select('*')
            const countQuery = postgresConnection("all_nfse");

            if(search){
                query.where('num_rps', '=', search)
                countQuery.where('num_rps', '=', search)
            }

            if(chave_acesso){
                query.where('chave_acesso', '=', chave_acesso)
                countQuery.where('chave_acesso', '=', chave_acesso)
            }


            if(status){
                query.where('status', '=', status)
                countQuery.where('status', '=', status)
            }

            if(serie){
                query.where('serie', '=', serie)
                countQuery.where('serie', '=', serie)
            }

            if(initialRps && finalRps){
                query.where("num_rps", '>=', initialRps)
                .andWhere("num_rps", '<=', finalRps)

                countQuery.where("num_rps", '>=', initialRps)
                .andWhere("num_rps", '<=', finalRps)
            }

            if(initialNfse && finalNfse){
                query.where("num_nfse", '>=', initialNfse)
                .andWhere("num_nfse", '<=', finalNfse)

                countQuery.where("num_nfse", '>=', initialNfse)
                .andWhere("num_nfse", '<=', finalNfse)
            }

            

            if(initialDate && finalDate){
                query.where("ref_dataEmissao", '>=', new Date(initialDate))
                .andWhere("ref_dataEmissao", '<=', new Date(finalDate))

                countQuery.where("ref_dataEmissao", '>=', new Date(initialDate))
                .andWhere("ref_dataEmissao", '<=', new Date(finalDate))
            }
            

            if(municipio){
                query.andWhereRaw(`UPPER("municipio") like ?`, `%${String(municipio).toUpperCase()}%`);
                countQuery.andWhereRaw(`UPPER("municipio") like ?`, `%${String(municipio).toUpperCase()}%`);
            }

            if(cnpj_prestador){
                query.andWhereRaw(`UPPER("cnpj_prestador") like ?`, `%${String(cnpj_prestador).toUpperCase()}%`);
                countQuery.andWhereRaw(`UPPER("cnpj_prestador") like ?`, `%${String(cnpj_prestador).toUpperCase()}%`);
            }

            if(cnpj_tomador){
                query.andWhereRaw(`UPPER("cnpj_tomador") like ?`, `%${String(cnpj_tomador).toUpperCase()}%`);
                countQuery.andWhereRaw(`UPPER("cnpj_tomador") like ?`, `%${String(cnpj_tomador).toUpperCase()}%`);
            }

            if(prestador){
                query.andWhereRaw(`UPPER("prestador") like ?`, `%${String(prestador).toUpperCase()}%`);
                countQuery.andWhereRaw(`UPPER("prestador") like ?`, `%${String(prestador).toUpperCase()}%`);
            }

            if(tomador){
                query.andWhereRaw(`UPPER("tomador") like ?`, `%${String(tomador).toUpperCase()}%`);
                countQuery.andWhereRaw(`UPPER("tomador") like ?`, `%${String(tomador).toUpperCase()}%`);
            }


            // if (limit && page) {
            //     query.limit(limit).offset((page - 1) * limit);
            // }
    
            const nfse = await query;
            const [count] = await countQuery.count();
            const totalCount = Number(count["count"]);
            return { nfses: nfse, count: totalCount };

        }catch(err){
            throw new Error('Erro ao buscar nfse: ' + err?.message);
        }
    },

    async exportExcel(nfses, initialDate, finalDate){
        try{
            const dirPath = './src/downloads/'
            const workbook = xlsx.utils.book_new()
            const nfsesFormmated = nfses.map(item => {
                return {
                    'Município': item.municipio,
                    'RPS': item.num_rps,
                    'Série': item.serie,
                    'NFSE': item.num_nfse,
                    'Cnpj Prestador': item.cnpj_prestador,
                    'Cnpj Tomador': item.cnpj_tomador,
                    'Prestador': item.prestador,
                    'Tomador': item.tomador,
                    'Valor ISS': item.valor_iss,
                    'Valor Serviços': item.valor_servicos,
                    'Base Cálculo': item.base_calculo,
                    'Aliquota': item.aliquota,
                    'Valor líquido NFSE': item.valor_liquido_nfse,
                    'Tributos federais': item.valor_total_tributos_federais,
                    'Tributos estaduais': item.valor_total_tributos_estaduais,
                    'Tributos municipais': item.valor_total_tributos_municipais,
                    'Chave acesso': item.chave_acesso,
                    'Descrição': item.descricao,
                    'Endereco Prestador': item.end_prestador,
                    'Status': item.status,
                    'Data emissão': moment(item.ref_dataEmissao).utc(-6).format('DD/MM/YYYY[ ]HH:mm:ss') 
                }
            })

            let worksheet = xlsx.utils.json_to_sheet(nfsesFormmated);
            xlsx.utils.book_append_sheet(workbook, worksheet, "NFSES");

            const nameExcel = `${initialDate}-${finalDate}-random=${Date.now()}`

            xlsx.writeFile(workbook, `${dirPath}${nameExcel}.xlsx`);

            return {nameExcel, dirPath};
            
        }catch(err){
            console.log(err);
        }
    },

    async exportExcelPerAccessKey(chave_acesso){
        try{
            const dirPath = './src/downloads/'
            const workbook = xlsx.utils.book_new()

            const query = postgresConnection('all_nfse').select('*')

            //SOMENTE PARA DOWNLOAD INDIVIDUAL...
            if(chave_acesso){
                query.where('chave_acesso', '=', chave_acesso)
            }

            const nfse = await query;
            const nfseFormmated = nfse.map(item => {
                return {
                    'Município': item.municipio,
                    'RPS': item.num_rps,
                    'Série': item.serie,
                    'NFSE': item.num_nfse,
                    'Cnpj Prestador': item.cnpj_prestador,
                    'Cnpj Tomador': item.cnpj_tomador,
                    'Prestador': item.prestador,
                    'Tomador': item.tomador,
                    'Valor ISS': item.valor_iss,
                    'Valor Serviços': item.valor_servicos,
                    'Base Cálculo': item.base_calculo,
                    'Aliquota': item.aliquota,
                    'Valor líquido NFSE': item.valor_liquido_nfse,
                    'Tributos federais': item.valor_total_tributos_federais,
                    'Tributos estaduais': item.valor_total_tributos_estaduais,
                    'Tributos municipais': item.valor_total_tributos_municipais,
                    'Chave acesso': item.chave_acesso,
                    'Descrição': item.descricao,
                    'Endereco Prestador': item.end_prestador,
                    'Status': item.status,
                    'Data emissão': moment(item.ref_dataEmissao).utc(-6).format('DD/MM/YYYY[ ]HH:mm:ss') 
                }
            })
                        
            let worksheet = xlsx.utils.json_to_sheet(nfseFormmated);
            xlsx.utils.book_append_sheet(workbook, worksheet, "NFSE");

            const nameExcel = `${chave_acesso}-random=${Date.now()}`

            xlsx.writeFile(workbook, `${dirPath}${nameExcel}.xlsx`);

            return {nameExcel, dirPath};
            
        }catch(err){
            console.log(err);
        }
    },

    

}

export default NfseService;