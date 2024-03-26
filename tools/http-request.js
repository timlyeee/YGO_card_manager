async function fetchCardData(cardId) {
    const url = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${cardId}&lang=cn`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching card data:', error);
        return null;
    }
}

// 调用示例
const cardId = 9511; // 你要获取的卡片ID
fetchCardData(cardId)
    .then(data => {
        if (data) {
            console.log('Card data:', data);
            // 在这里处理返回的数据
        } else {
            console.log('Failed to fetch card data.');
        }
    });
