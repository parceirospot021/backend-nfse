import { ValidationError } from 'express-validation'
import winston from 'winston'


const errorMiddleware = (
    error,
    req,
    res,
    next
  ) => {
  
    const logger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'backend' },
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
      ]
    })
  
    logger.error(`Method: ${req.method}, Url: ${req.url}, Error: ${error.message}`)
  
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json(error)
    }
    res.status(500).json({
      message: error?.message ?? ''
    })
  }
  
  export default errorMiddleware
  