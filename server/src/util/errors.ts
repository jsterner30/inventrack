import { FastifyReply } from 'fastify'

export interface ValidationInformation {
    code: number
    message: string
}

/**
 * Send a basic non 200 response
 * @throws {Error} if no message is provided and none can be inferred from the status code
 */
export async function sendBasicMessageResponse (code: number, reply: FastifyReply, message?: string): Promise<ValidationInformation> {
    if (message === undefined) {
        switch (code) {
            case 404:
                message = 'Resource not found.'
                break
            case 401:
                message = 'Unauthorized'
                break
            case 403:
                message = 'Forbidden'
                break
            default:
                throw Error('Missing validation response message.')
        }
    }

    const validationResponse: ValidationInformation = {
        code,
        message
    }

    await reply.status(code).send({
        metadata: {
            restricted: false,
            validation_response: validationResponse
        }
    })

    return validationResponse
}

export class InvalidRequestError extends Error {
    constructor (message?: string) {
        super(message ?? 'Bad Request')
        Object.setPrototypeOf(this, InvalidRequestError.prototype)
    }
}

export class NotFoundError extends Error {
    constructor (message?: string) {
        super(message ?? 'Not Found')
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}

export class UnauthorizedError extends Error {
    constructor (message?: string) {
        super(message ?? 'Unauthorized')
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
}

export class UnauthenticatedError extends Error {
    constructor (message?: string) {
        super(message ?? 'Unauthenticated')
        Object.setPrototypeOf(this, UnauthenticatedError.prototype)
    }
}

export class UnmodifiableError extends Error {
    constructor (message?: string) {
        super(message ?? 'Cannot Add/Update Item')
        Object.setPrototypeOf(this, UnmodifiableError.prototype)
    }
}

export class ConflictError extends Error {
    constructor (message?: string) {
        super(message ?? 'Duplicate Key Error')
        Object.setPrototypeOf(this, ConflictError.prototype)
    }
}

export class DatabaseError extends Error {
    constructor (message?: string) {
        super(message ?? 'Error communicating with the database')
        Object.setPrototypeOf(this, DatabaseError.prototype)
    }
}

/**
 * Throws an error.
 * Useful for placing within try {} blocks to avoid 'exception caught locally' warnings.
 * @param errorMessage
 * @throws {Error}
 */
export function throwExpression (errorMessage: string): never {
    throw new Error(errorMessage)
}
