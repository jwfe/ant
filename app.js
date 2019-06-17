const path = require('path');
const glob = require('glob');
const env = process.env.NODE_ENV || 'dev';
const config = require(`./config/${env}`)

const fastify = require('fastify')({
    logger: true
})

fastify.register(require('fastify-mysql'), {
    promise: true,
    ...config.db
})

const routers = glob.sync('./router/**/*.js')
routers.forEach((router) => {
    const prefix = path.basename(router, '.js');
    fastify.register(require(path.resolve(router)), { prefix })
});

// Run the server!
fastify.listen(3000, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
        return;
    }
    fastify.log.info(`server listening on ${address}`)
})