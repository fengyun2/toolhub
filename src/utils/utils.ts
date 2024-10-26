interface Params {
  key: string;
  value: string;
}

/**
 * 将 URLSearchParams 转换为 Params 数组
 * @param searchParams URLSearchParams 对象
 * @returns Params 数组
 */
function convertSearchParamsToArray(searchParams: URLSearchParams): Params[] {
  const result: Params[] = [];
  searchParams.forEach((value, key) => {
    result.push({ key, value });
  });
  return result;
}

/**
 * 提取url地址和查询参数
 * @param urlString url地址
 * @returns
 */
function extractParamsFromUrl(urlString: string): { path: string, params: Params[] } | null {
  // 匹配查询字符串部分
  const match = urlString.match(/(.*?)(\?.*)/);
  if (match) {
    const [_, path, search] = match;
    const params = convertSearchParamsToArray(new URLSearchParams(search.slice(1))); // 去掉问号
    return { path, params };
  } else if (urlString.startsWith('?')) {
    // 如果输入以问号开头，直接处理查询字符串部分
    const params = convertSearchParamsToArray(new URLSearchParams(urlString.slice(1))); // 去掉问号
    return { path: '', params };
  } else if (urlString.includes('=')) {
    const params = convertSearchParamsToArray(new URLSearchParams(urlString));
    return { path: '', params };
  }
  else {
    // 如果没有查询字符串部分，返回路径和空数组params
    return { path: urlString, params: [] };
  }
}

export { extractParamsFromUrl };