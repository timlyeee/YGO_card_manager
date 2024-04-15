
// 导入 fetch 方法
async function httpRequest(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`fetch data with url ${url}:  ${data.response.packList.toString()}`);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export default httpRequest;
