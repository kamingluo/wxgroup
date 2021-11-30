import os
import openpyxl
import time
import datetime
import sys
sys.path.append("..")
from common.timepro import timeprocessing
from common.config import data
from common.reporterr import reporterror
import MySQLdb

nowtime= "'" + str(timeprocessing()) + "'"#获取当前日期,年月日，时分秒

dayOfWeek = datetime.datetime.now().isoweekday() ###返回数字1-7代表周一到周日
nowhour=datetime.datetime.now().hour#获取当前小时数

# 打开数据库连接
db = MySQLdb.connect("81.71.87.121", "crowd", "crowd", "crowd", charset='utf8' )
# 使用cursor()方法获取操作游标 
cursor = db.cursor()
print("连接数据库成功")

#执行脚本
try:
    print("1111111111")
    # 第一步：打开工作簿
    wb=openpyxl.load_workbook("iteration.xlsx")
    print("222222")
    sheets = wb.sheetnames #获取所有的表单
    # 第二步：选取表单
    sh = wb[sheets[0]]
    # 第三步：读取数据
    state="0"
    crowd_id="3514"
    num=0
    for cases in list(sh.rows)[1:]:#不去除,第一行开始读，避免其他的项目不是这配置
        code=cases[1].value
        codeone=code.strip()#去除字符串中的空格
        newcode = "'" + codeone + "'" #处理优惠券码
        if code != None:
            # SQL 插入语句
            sql = '''INSERT INTO `crowd_coupon_code` ( code, crowd_id,state,create_time,update_time) VALUES ({},{},{},{},{})'''.format
            newsql = sql(newcode,crowd_id,state,nowtime,nowtime)
            print(newsql)
            try:
                # 执行sql语句
                cursor.execute(newsql)
                
                # 提交到数据库执行
                db.commit()
                print("执行成功")
            except:
                # Rollback in case there is any error
                db.rollback()
                print("执行失败")
            num=num + 1
    
    print("共插入数据")
    print(num)

    # 关闭数据库连接
    db.close()
    #关闭工作薄
    wb.close()
    
    #删除文件
    # os.remove(filename)


except Exception:
    reporterror("优惠券脚本执行错误")#发送脚本错误信息给开发人员

#脚本全部执行完毕
print("脚本执行完毕,退出。")
exit()