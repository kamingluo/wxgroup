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

# dayOfWeek = datetime.datetime.now().isoweekday() ###返回数字1-7代表周一到周日
# nowhour=datetime.datetime.now().hour#获取当前小时数

# 打开数据库连接
db = MySQLdb.connect("81.71.87.121", "crowd", "crowd", "crowd", charset='utf8' )
# 使用cursor()方法获取操作游标 
cursor = db.cursor()
print("连接数据库成功")

#执行脚本
try:
    print("进入try")
    # 第一步：打开工作簿
    wb=openpyxl.load_workbook("zhuanshu.xlsx")
    sheets = wb.sheetnames #获取所有的表单
    # 第二步：选取表单
    sh = wb[sheets[0]]
    # 第三步：读取数据
    num=0
    for cases in list(sh.rows)[1:]:#不去除,第一行开始读，避免其他的项目不是这配置
        print("进入循环---------------------------")
        product="'" + cases[0].value + "'" #品名
        name="'" + str(cases[1].value) + "'" #微信名称
        phone="'" + str(cases[2].value) + "'" #电话号码
        link="'" + cases[3].value + "'" #一次性链接
        usetime="'" + cases[4].value + "'" #使用时间
        if phone != None:
            # SQL 插入语句
            sql = '''INSERT INTO `ex_links` ( product, name,phone,link,usetime,create_time) VALUES ({},{},{},{},{},{})'''.format
            newsql = sql(product,name,phone,link,usetime,nowtime)
            print(newsql)
            try:
                # 执行sql语句
                cursor.execute(newsql)
                # 提交到数据库执行
                db.commit()
            except:
                # Rollback in case there is any error
                db.rollback()
                print("执行失败")
            num=num + 1
            print("执行完成---------------------------")
    
    print("共插入数据")
    print(num)

    # 关闭数据库连接
    db.close()
    #关闭工作薄
    wb.close()

except Exception:
    reporterror("专属链接导入脚本报错了")#发送脚本错误信息给开发人员

#脚本全部执行完毕
print("脚本执行完毕,退出。")
exit()