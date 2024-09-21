import Fastify, { FastifyInstance } from 'fastify'
import AutoLoad from '@fastify/autoload'
import { join } from 'path'
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'
import {
    ConflictError,
    InvalidRequestError,
    NotFoundError,
    UnmodifiableError,
    DatabaseError,
    UnauthorizedError,
    UnauthenticatedError,
    sendBasicMessageResponse,
} from './util/errors'
import { logger, fastifyLogOpts } from './util/logger'
import cors from '@fastify/cors'

export default async function server (): Promise<FastifyInstance> {
    const fastify = Fastify({
        logger: fastifyLogOpts
    })

    fastify.setValidatorCompiler(TypeBoxValidatorCompiler)

    fastify.register(cors)

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, { // eslint-disable-line @typescript-eslint/no-floating-promises
        dir: join(__dirname, 'routes'),
        options: {
            // here's where you can pass in controllers, services or other shared classes to your routes
        }
    })

    // Handle errors and return formatted responses
    fastify.setNotFoundHandler(async function (request, reply) {
        await sendBasicMessageResponse(404, reply)
    })
    // If any errors happen, pass them through this middleware to send a response
    fastify.setErrorHandler(async function (error, request, reply) {
        if (error.statusCode != null && error.statusCode >= 400 && error.statusCode < 500) {
            await sendBasicMessageResponse(error.statusCode, reply, error.message)
            // If it's unsafe to send back detailed errors then send back limited error information
        } else {
            if (error instanceof InvalidRequestError) {
                await sendBasicMessageResponse(400, reply, error.message)
            } else if (error instanceof UnauthenticatedError) {
                await sendBasicMessageResponse(401, reply, error.message)
            } else if (error instanceof UnauthorizedError) {
                await sendBasicMessageResponse(403, reply, error.message)
            } else if (error instanceof NotFoundError) {
                await sendBasicMessageResponse(404, reply, error.message)
            } else if (error instanceof ConflictError || error instanceof UnmodifiableError) {
                await sendBasicMessageResponse(409, reply, error.message)
            } else if (error instanceof DatabaseError) {
                logger.error({err: error}, 'Critical database error')
                await sendBasicMessageResponse(500, reply, error.message)
            } else {
                logger.error({err: error}, 'Unknown internal server error')
                await sendBasicMessageResponse(error.statusCode ?? 500, reply, error.message)
            }
        }
    })

    return fastify
}
