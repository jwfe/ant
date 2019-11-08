#!/usr/bin/env node
const script = require('../task/script');
const db = require('../lib/db');

const {
    PROJECT_ID,
} = process.env;

if(!PROJECT_ID){
    console.log(`
    请配置\r\n
    # 产品线编号 1:bw 2:rms+ 3:ai
    export PROJECT_ID=3
    # mysql相关配置
    export ANT_MYSQL_HOST=127.0.0.1
    export ANT_MYSQL_PORT=3306
    export ANT_MYSQL_USER=root
    export ANT_MYSQL_PASSWORD=123456
    `)
    return;
}
console.log('任务开始:', PROJECT_ID);

(async () => {
    // 查询可用的任务
    const rows = await db(
        'SELECT tid, task_content, task_type, bs_id, bs_owner FROM task WHERE task_status = 1 and bs_id = ?', [PROJECT_ID || 0]
    )

    if(!rows || !rows.length){
        console.log('没有要处理的任务', PROJECT_ID);
        return
    }
    console.log('任务列表:', PROJECT_ID, JSON.stringify(rows));
    // 分别执行任务
    rows.forEach(async (row, index) => {
        const { tid, task_content, task_type, bs_id } = row;
        console.log('预计要执行的: row:%j | pid:%s | index:%s', row, PROJECT_ID, index);
        if (task_type == 1 && PROJECT_ID == bs_id) {
            console.log('即将进入调用环节，请注意执行情况。pid:%s | 当前pid:%s | index:%s', PROJECT_ID, bs_id, index);
            try{
                console.log('开始调用脚本: row:%j | pid:%s | index:%s', row, PROJECT_ID, index)
                a();
                // await script(task_content);
                // await db('update task set task_status = 2 WHERE tid = ?', [tid])
                // console.log('任务执行成功:', JSON.stringify(row), PROJECT_ID)
            } catch(err){
                console.log('任务执行失败: msg:%s | row:%j | pid:%s | index:%s', err.message, row, PROJECT_ID, index)
                await db(
                    'insert into task_log(tid, err_info) values (?)', [[tid, err.message]]
                );
                console.log('修改任务执行状态: row:%j | pid:%s | index:%s', row, PROJECT_ID, index)
                await db('update task set task_status = 3 WHERE tid = ?', [tid])
            }
        }
    })
})()