#!/usr/bin/env node
const script = require('../task/script');
const db = require('../lib/db');

const {
    PROJECT_ID,
} = process.env;

console.log('任务开始:', PROJECT_ID);

(async () => {
    // 查询可用的任务
    const rows = await db(
        'SELECT tid, task_content, task_type, bs_id, bs_owner FROM task WHERE task_status = 1', []
    )

    if(!rows || !rows.length){
        console.log('没有要处理的任务', PROJECT_ID);
        return
    }
    console.log('任务列表:', PROJECT_ID, JSON.stringify(rows));
    // 分别执行任务
    rows.forEach(async (row) => {
        const { tid, task_content, task_type, bs_id } = row;
        console.log('正在执行:', JSON.stringify(row), PROJECT_ID);
        if (task_type == 1 && PROJECT_ID == bs_id) {
            try{
                console.log('开始调用脚本:', JSON.stringify(row), PROJECT_ID)
                await script(task_content);
                await db('update task set task_status = 2 WHERE tid = ?', [tid])
                console.log('任务执行成功:', JSON.stringify(row), PROJECT_ID)
            } catch(err){
                console.log('任务执行失败:', err.message, JSON.stringify(row), PROJECT_ID)
                await db(
                    'insert into task_log(tid, err_info) values (?)', [err.message, tid]
                );
                console.log('修改任务执行状态', JSON.stringify(row), PROJECT_ID)
                await db('update task set task_status = 3 WHERE tid = ?', [tid])
            }
        }
    })
})()