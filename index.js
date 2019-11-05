const script = require('./task/script');
const db = require('./lib/db');

const {
    PROJECT_ID,
} = process.env;

(async () => {
    // 查询可用的任务
    const rows = await db(
        'SELECT tid, task_content, task_type, bs_id, bs_owner FROM task WHERE task_status = 1', []
    )

    if(!rows || !rows.length){
        return
    }

    // 分别执行任务
    rows.forEach(async (row) => {
        const { tid, task_content, task_type, bs_id } = row;
        if (task_type == 1 && PROJECT_ID == bs_id) {
            try{
                console.log(1, tid, task_content, task_type, bs_id, PROJECT_ID)
                await script(task_content);
                await db('update task set task_status = 2 WHERE tid = ?', [tid])
                console.log(2, tid, task_content, task_type, bs_id, PROJECT_ID)
            } catch(err){
                await db(
                    'insert into task_log(tid, err_info) values (?)', [err.message, tid]
                );
                await db('update task set task_status = 3 WHERE tid = ?', [tid])
            }
        }
    })
})()