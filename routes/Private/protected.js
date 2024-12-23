async function protectedRoute(fastify, opts, done) {
  fastify.get('/protected', async (request, reply) => {
    try {
      // Você pode acessar os dados do token JWT no request.user
      const user = request.user;
      return reply.send({ message: 'Acesso concedido à rota protegida!', user });
    } catch (err) {
      return reply.status(401).send({ error: 'Token JWT inválido!' });
    }
  });

  done();
}

module.exports = protectedRoute;
