#时间处理
from datetime import datetime
from datetime import timedelta
def timeprocessing():
    #获取当前时间并转换成datetime日期格式，请保证执行脚本的机器的时间是正常的
    now=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    currenttime=datetime.strptime(now, "%Y-%m-%d %H:%M:%S")
    newcurrenttime =datetime.date(currenttime)
    nowtime=datetime.combine(currenttime, datetime.min.time())
    return nowtime