
import * as FileSystem from 'expo-file-system';
const listFilesRecursively = async (directory) => {
    try {
        const content = await FileSystem.readDirectoryAsync(directory);

        const files = await Promise.all(
            content.map(async (item) => {
                const fullPath = `${directory}/${item}`;
                const fileInfo = await FileSystem.getInfoAsync(fullPath);

                if (fileInfo.isDirectory) {
                    // 递归处理子目录
                    const subFiles = await listFilesRecursively(fullPath);
                    return {
                        type: 'directory',
                        name: item,
                        files: subFiles,
                    };
                } else {
                    return {
                        type: 'file',
                        name: item,
                        size: fileInfo.size,
                    };
                }
            })
        );

        return files;
    } catch (error) {
        console.error('Error listing files:', error);
        return [];
    }
};
export { listFilesRecursively };