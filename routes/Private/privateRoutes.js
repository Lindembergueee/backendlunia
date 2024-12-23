async function privateRoute(fastify, opts, done) {
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.send(err);
    }
  });

  done();
}

function registerPrivateRoutes(fastify, routes) {
  routes.forEach(route => {
    fastify.register(async function (privateFastify, opts, done) {
      privateFastify.addHook('preHandler', async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          return reply.send(err);
        }
      });

      privateFastify.route({
        method: route.method,
        url: route.url,
        handler: route.handler
      });

      done();
    });
  });
}

module.exports = registerPrivateRoutes;
