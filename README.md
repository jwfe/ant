# ergate-cli
像蚂蚁一样勤奋的搬运，并保持自身的短小精湛。

## 配置
部署到业务所在系统，并且在用户组下

### 环境变量

```
# 产品线编号 1:bw 2:rms+ 3:ai
export PROJECT_ID=3
# mysql相关配置
export ANT_MYSQL_HOST=127.0.0.1
export ANT_MYSQL_PORT=3306
export ANT_MYSQL_USER=root
export ANT_MYSQL_PASSWORD=123456
```

### 定时任务启动
```
# crontab增加定时脚本
3 * * * * /usr/local/bin/node /usr/ant
```

### 数据库中配置
目前未建索引

```
CREATE TABLE `task` (
  `tid` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT '任务id',
  `task_type` tinyint(4) DEFAULT '1' COMMENT '1: 正常linux命令',
  `task_status` tinyint(11) NOT NULL DEFAULT '1' COMMENT '1: waiting 2：success 3:error',
  `task_content` text NOT NULL,
  `bs_id` tinyint(4) NOT NULL COMMENT '1: bw 2:rms+ 3:ai',
  `bs_owner` text,
  `createtime` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4
```
