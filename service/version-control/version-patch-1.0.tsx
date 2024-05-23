//Version patch 1.0, actually init
/**
 * Update script from 0 to 1, actually init the app.
 */
export const updateScripts: (() => Promise<void>)[] = [
    async () => {
      // 版本更新脚本1：添加新表格或字段
      console.log('Running update script 1');
      // 执行相应的数据库更新操作
    },
    async () => {
      // 版本更新脚本2：修改表格结构
      console.log('Running update script 2');
      // 执行相应的数据库更新操作
    },
    // 添加更多的版本更新脚本...
  ];
  
async function runUpdateScripts(currentVersion: number, latestVersion: number) {
    for (let version = currentVersion + 1; version <= latestVersion; version++) {
      console.log(`Running update script for version ${version}`);
      try {
        await updateScripts[version - 1]();
        // 更新数据库版本号
        // updateDatabaseVersion(version);
      } catch (error) {
        console.error(`Error running update script for version ${version}:`, error);
        // 处理错误情况，例如回滚更新
        break;
      }
    }
  }
  
  // 示例：模拟当前数据库版本和最新数据库版本
  const currentVersion = 1;
  const latestVersion = 2;
  
  // 运行版本更新脚本
  runUpdateScripts(currentVersion, latestVersion)
    .then(() => {
      console.log('Database update completed successfully');
    })
    .catch((error) => {
      console.error('Database update failed:', error);
    });
  