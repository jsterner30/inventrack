import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

// todo add a generic param if we use options with fastify
const add: FastifyPluginAsync = async function(fastifyApp, _opts) {
    const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

    fastify.get('/', {
        schema: {
            querystring: Type.Object({
                name: Type.String({ default: 'world' })
            }),
            response: {
                200: Type.Object({
                    hello: Type.String()
                })
            }
        }
    }, (req) => {
        const { name } = req.query;
        return { hello: name };
    });

    fastify.post('/', {
        schema: {
            body: Type.Object({
                name: Type.String()
            }),
            response: {
                200: Type.Object({
                    hello: Type.String()
                })
            }
        }
    }, async (request) => {
        const { name } = request.body;
        return { hello: name || 'world' };
    });
}

export default plugin;