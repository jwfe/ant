const static = require('../task/static')

async function routes(fastify, options) {
    fastify.get('/', async (request, reply) => {
        const { query } = request;
        if (!query.pid) {
            return reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send({ code: 500, msg: '必须存在一个可执行的项目id' });
        }
        const connection = await fastify.mysql.getConnection()

        const [rows] = await connection.query(
            'SELECT pid, script_src, script_type, othertask FROM config WHERE pid=?', [query.pid],
        )
        connection.release();
        const { pid, script_src, script_type, othertask } = rows[0];

        if (script_type === 1) {
            const connection = await fastify.mysql.getConnection()

            const taskData = await connection.query(
                'SELECT pid, tid, task_status FROM task WHERE pid=? and task_status = 2', [query.pid],
            )
            connection.release();
            // 如果当前有一个项目在执行不允许执行其他任务
            if(taskData[0].length){
                return reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send({ code: 501, msg: '当前有一个任务在执行, 任务编号' +  taskData[0][0].tid });
            } else{
               (async () => {
                   const timeStamp = parseInt((+new Date()));
                    const tid = `t${timeStamp}`;
                    const connection = await fastify.mysql.getConnection();
                    await connection.query(
                        'insert into task(pid, tid, task_status) values (?)', [[query.pid, tid, 2]]
                    )
                    try{
                        await static(pid, script_src);
                        await connection.query('update task set task_status = 3 WHERE tid = ?', [tid])
                    } catch(err){
                        await connection.query(
                            'update task set task_status = 3, task_info = ? WHERE tid = ?', [err.message, tid]
                        )
                    }
                    connection.release();
               })()
            }
        }

        if (script_type === 2) {

        }

        reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send({ code: 200, msg: '任务开始执行' });
    })
}

module.exports = routes