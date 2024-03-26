// updateDatabase.js

const sqlite3 = require('sqlite3');
const jsonData = require('./cards.json');

const databasePath = './mycard.cdb'; // 修改为你的数据库路径
// 创建一个 SQLite 数据库连接
const db = new sqlite3.Database(databasePath);

// 开启事务
db.serialize(() => {
    // 检查 texts 表中是否存在 cid 列
    db.all(`
    PRAGMA table_info(texts);
  `, (err, result) => {
        if (err) {
            console.error('Error checking cid column:', err);
        } else {
            // 如果不存在 cid 列，则添加
            const hasCidColumn = result.some(column => column.name === 'cid');
            if (!hasCidColumn) {
                db.run(`
          ALTER TABLE texts
          ADD COLUMN cid INTEGER;
        `, (alterErr) => {
                    if (alterErr) {
                        console.error('Error adding cid column:', alterErr);
                    } else {
                        console.log('Cid column added successfully');
                    }
                });
            } else {
                console.log('Cid column already exists');
            }


        }

        updateDatabase();
    });

});


function updateDatabase() {
    // 开始事务
    db.run('BEGIN TRANSACTION');

    // 开始插入数据
    const stmt = db.prepare(`
      UPDATE texts SET cid = ? WHERE id = ?
    `);

    // 执行所有更新操作
    Object.values(jsonData).forEach(({ id, cid }) => {
        stmt.run(cid, id, (updateErr) => {
            if (updateErr) {
                console.error(`Error updating cid for id ${id}:`, updateErr);
            } else {
                console.log(`Cid updated for id ${id}`);
            }
        });
    });

    // 提交事务
    db.run('COMMIT');

    // 重置语句
    stmt.finalize();
}