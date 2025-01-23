import NfseService from "../services/nfseService.js";
import {createReadStream, readdir, existsSync, unlinkSync, mkdirSync} from 'fs'
const NfseController = {
    async create(req, res, next){
        const data = req.body;
        try{
            const note = await NfseService.create(data);
            return res.json(note);
        }catch(err){
            next(err);
        }
    },
    async getAll(req, res, next){
        const {limit, page, skip} = req.pagination;
        const {
            search,
            finalDate, 
            initialDate, 
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
            prestador
        } = req.query;

        try {
			const nfses = await NfseService.getAllNfses(
				Number(page),
				Number(limit),
                Number(skip),
                String(search),
                initialDate ? String(initialDate) : undefined,
                finalDate ? String(finalDate) : undefined,
                status ? String(status) : undefined,
                municipio ? String(municipio) : undefined,
                serie ? String(serie) : undefined,
                initialRps ? initialRps : undefined,
                finalRps ? finalRps : undefined,
                initialNfse ? initialNfse : undefined,
                finalNfse ? finalNfse : undefined,
                cnpj_prestador ? cnpj_prestador : undefined,
                cnpj_tomador ? cnpj_tomador : undefined,
                tomador ? tomador : undefined,
                prestador ? prestador : undefined
			);
			return res.json(nfses);
		} catch (err) {
			next(err);
		}
    },

    async getExport(req, res, next){
        // const {limit, page, skip} = req.pagination;
        const {
            search,
            finalDate, 
            initialDate, 
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
        } = req.query;
        
        const folderName = './src/downloads';
        try {
            let nameExcel, dirPath;
            if (!existsSync(folderName)) {
                mkdirSync(folderName);
            }
            if(chave_acesso){
                const {nameExcel: nameExcelReturn, dirPath: dirPathReturn} = await NfseService.exportExcelPerAccessKey(chave_acesso);
                nameExcel = nameExcelReturn
                dirPath = dirPathReturn
            }else{
                const {nfses} = await NfseService.getAllNfses(
                    1,
                    999999999,
                    null,
                    String(search),
                    initialDate ? String(initialDate) : undefined,
                    finalDate ? String(finalDate) : undefined,
                    status ? String(status) : undefined,
                    municipio ? String(municipio) : undefined,
                    serie ? String(serie) : undefined,
                    initialRps ? initialRps : undefined,
                    finalRps ? finalRps : undefined,
                    initialNfse ? initialNfse : undefined,
                    finalNfse ? finalNfse : undefined,
                    cnpj_prestador ? cnpj_prestador : undefined,
                    cnpj_tomador ? cnpj_tomador : undefined,
                    tomador ? tomador : undefined,
                    prestador ? prestador : undefined
                );
                console.log('LENGTH', nfses.length);
                const {nameExcel: nameExcelReturn, dirPath: dirPathReturn} = await NfseService.exportExcel(nfses, initialDate, finalDate);
                nameExcel = nameExcelReturn
                dirPath = dirPathReturn
            }

            console.log()
            const stream = createReadStream(`${dirPath}/${nameExcel}.xlsx`)

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              )
      
              res.setHeader(
                "Content-Disposition",
                "attachment;filename=" + nameExcel + '.xlsx'
            )

            stream.pipe(res);

            stream.on('end', () => {
                readdir(dirPath, (err, files) => {
                    if (err) {
                        return console.log('Diretório não encontrado: ' + err);
                    } 
            
                    files?.forEach(file => {
                        if(file == `${nameExcel}.xlsx`){
                            const path = `${dirPath}${file}`;
                            if(existsSync(path)){
                                unlinkSync(path);
                            }    
                        }
                    }) 
                })
            })

		} catch (err) {
			next(err);
		}
    }

}

export default NfseController;