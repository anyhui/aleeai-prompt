/**
 * 提示词版本控制服务
 * 用于管理提示词的版本历史
 */

// 本地存储键名
const VERSION_STORAGE_KEY = 'prompt_versions';

/**
 * 获取指定提示词的所有版本历史
 * @param {string} promptId - 提示词ID
 * @returns {Array} - 版本历史数组
 */
export const getVersionHistory = (promptId) => {
  try {
    const allVersions = JSON.parse(localStorage.getItem(VERSION_STORAGE_KEY) || '{}');
    return allVersions[promptId] || [];
  } catch (error) {
    console.error('获取版本历史失败:', error);
    return [];
  }
};

/**
 * 保存提示词的新版本
 * @param {string} promptId - 提示词ID
 * @param {string} content - 提示词内容
 * @param {string} changeDescription - 变更描述
 * @returns {Object} - 新创建的版本对象
 */
export const saveVersion = (promptId, content, changeDescription = '') => {
  try {
    const allVersions = JSON.parse(localStorage.getItem(VERSION_STORAGE_KEY) || '{}');
    const promptVersions = allVersions[promptId] || [];
    
    // 创建新版本
    const newVersion = {
      id: generateVersionId(),
      versionNumber: promptVersions.length + 1,
      content,
      changeDescription,
      timestamp: Date.now()
    };
    
    // 添加到版本历史
    promptVersions.push(newVersion);
    allVersions[promptId] = promptVersions;
    
    // 保存到本地存储
    localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(allVersions));
    
    return newVersion;
  } catch (error) {
    console.error('保存版本失败:', error);
    return null;
  }
};

/**
 * 比较两个版本的差异
 * @param {Object} version1 - 第一个版本
 * @param {Object} version2 - 第二个版本
 * @returns {Array} - 差异数组
 */
export const compareVersions = (version1, version2) => {
  if (!version1 || !version2) return [];
  
  const lines1 = version1.content.split('\n');
  const lines2 = version2.content.split('\n');
  const differences = [];
  
  // 简单的行比较算法
  const maxLines = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLines; i++) {
    const oldLine = i < lines1.length ? lines1[i] : null;
    const newLine = i < lines2.length ? lines2[i] : null;
    
    if (oldLine === null) {
      differences.push({
        type: 'added',
        oldText: '',
        newText: newLine,
        lineNumber: i
      });
    } else if (newLine === null) {
      differences.push({
        type: 'removed',
        oldText: oldLine,
        newText: '',
        lineNumber: i
      });
    } else if (oldLine !== newLine) {
      differences.push({
        type: 'changed',
        oldText: oldLine,
        newText: newLine,
        lineNumber: i
      });
    }
  }
  
  return differences;
};

/**
 * 删除指定版本
 * @param {string} promptId - 提示词ID
 * @param {string} versionId - 版本ID
 * @returns {boolean} - 是否删除成功
 */
export const deleteVersion = (promptId, versionId) => {
  try {
    const allVersions = JSON.parse(localStorage.getItem(VERSION_STORAGE_KEY) || '{}');
    const promptVersions = allVersions[promptId] || [];
    
    const updatedVersions = promptVersions.filter(version => version.id !== versionId);
    
    // 更新版本号
    updatedVersions.forEach((version, index) => {
      version.versionNumber = index + 1;
    });
    
    allVersions[promptId] = updatedVersions;
    localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(allVersions));
    
    return true;
  } catch (error) {
    console.error('删除版本失败:', error);
    return false;
  }
};

/**
 * 生成唯一的版本ID
 * @returns {string} - 唯一ID
 */
const generateVersionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};