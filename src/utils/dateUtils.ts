const formateDate = (date: Date): string => {
  const todayDate: Date = new Date()
  const usedTime: number = todayDate.valueOf() - date.valueOf()
  const betweenDays: number = Math.floor(usedTime / (24 * 3600 * 1000))
  const leavel: number = usedTime % (24 * 3600 * 1000)

  if (betweenDays < 1) {
    const betweenHours: number = Math.floor(leavel / (3600 * 1000))
    if (betweenHours < 1) {
      const leavel2 = leavel % (3600 * 1000)
      const minutes = Math.floor(leavel2 / (60 * 1000))
      if (minutes === 0) {
        return Math.floor(leavel2 / 1000) + '秒前'
      }
      return minutes + '分钟前'
    } else {
      return betweenHours + '小时前'
    }
  } else if (betweenDays <= 3) {
    return betweenDays.toString() + '天前'
  } else if (betweenDays <= 7) {
    switch (date.getDay()) {
      case 0:
        return '星期日'
      case 1:
        return '星期一'
      case 2:
        return '星期二'
      case 3:
        return '星期三'
      case 4:
        return '星期四'
      case 5:
        return '星期五'
      case 6:
        return '星期六'
      default:
        return '错误时间'
    }
  } else {
    if (todayDate.getFullYear() - date.getFullYear() < 1) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
    return `${date.getFullYear()}/ ${date.getMonth() + 1}/${date.getDate()}`
  }
}

export default formateDate
