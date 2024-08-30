
export const toast = (message: string, mask?: boolean,) => {
  uni.showToast({
    title: message,
    icon: 'none',
    mask: mask || false,
    duration: 2000,
  })
}
type LoadingQueueItem = {
  id: number;
  options: {title: string, mask: boolean};
  close: () => void;
}
const loadingQueue: Array<LoadingQueueItem> = []
let loadingId = 0
let currentLoading: null | LoadingQueueItem = null
/**
 * 显示loading 调用 LoadingQueueItem.close() 关闭当前loading
 * @param message loading message
 * @param mask loading mask
 * @returns LoadingQueueItem
 */
export const loading = (message: string = '加载中...', mask?: boolean) => {
  let temp: LoadingQueueItem = {
    id: loadingId++,
    options: {
      title: message,
      mask: mask !== false
    },
    close: () => {
      const index = loadingQueue.indexOf(temp)
      if (index > -1) {
        loadingQueue.splice(index, 1)
        updateLoadingShow()
      }
    }
  }
  loadingQueue.push(temp)
  updateLoadingShow()
  return temp
}
function updateLoadingShow() {
  if(currentLoading && loadingQueue.indexOf(currentLoading) === -1) {
    uni.hideLoading()
    currentLoading = null
  }
  const last = loadingQueue[loadingQueue.length - 1]
  if(last){
    showLoading(last)
  }
}
function showLoading(loading: LoadingQueueItem) {
  if (currentLoading) return
  currentLoading = loading
  uni.showLoading(loading.options)
}
