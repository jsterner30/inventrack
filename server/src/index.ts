import {FastifyReply, FastifyRequest} from "fastify";
import { Static, Type } from '@sinclair/typebox'
import Fastify from 'fastify'
import AutoLoad from '@fastify/autoload'
import {join} from "path";

const fastify = Fastify({
    logger: true
})

// This loads all plugins defined in routes
// define your routes in one of these
fastify.register(AutoLoad, { // eslint-disable-line @typescript-eslint/no-floating-promises
    dir: join(__dirname, 'routes'),
    // Don't attempt to autoload the report handlers
    // options: {
    //     // here's where you can pass in controllers, services or other shared classes to your routes
    //     db
    // }
})

// todo add error handler

await fastify.listen({
    host: '0.0.0.0',
    port: 8080
})
