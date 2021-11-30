#文件数据
data={
    'cloudnotice':'bc6b7031aeff188738be112a9a42e1bb',#真实云研发通知群key
    'testkey':'a5f5d785a2a2ead968654d6a0ff140f3',#真实云测试群key
    # 'testkey':'897cbbb36dba0909261a98ba2d94220a',#模拟云测试群key
    # 'cloudnotice':'314c1cd8d2573606f75074c3c622f001',#模拟云研发通知群key
    'twotest':'d50f60143ddf0ae6de64f0d2a104b786',#2C云测试群
    'msgtype':1,#消息通知类型，1是文本，2是卡片
    'sheets':0,#excel表格第几张表单，从0开始数
    'demand':2,#需求名称所在表格第几列，从0开始从左往右边数。以下也是这样子数，以下也是这样子数，以下也是这样子数，重要的事情说三遍
    'relevant':4,#相关人员所在列
    'state':5,#需求状态所在表格第几列，状态，待开发，开发中，测试中，已发布，已完成，已发布。注意：待开发、开发中跟测试中的才会通知
    'releaseversion':6,#计划首次发布版本所在表格第几列
    'releasetime':8,#计划发布时间所在表格第几列
    'subcasetime':12,#测试计划提交自测用例时间
    'cruxtime':14,#提测时间所在表格第几列
    'checktime':16,#产品UI验收时间所在表格第几列
    'starttest':18,#计划启动测试时间所在列
    'projectKey':25,#项目woa群key所在表格第几列
    'tester':26,#需求跟进人用户id所在表格第几列
    'groupid':'275041673',#群组
    'fileid':'49443798236'#文件id
}



#移动端文件数据
phonedata={
    'online':'https://www.kdocs.cn/p/97236237482?pcEnter=joinonline',#项目表线上地址
    'androidOwner':'b70945665117bdce31253c9458834506',#安卓版本负责人群
    'mobileTest':'f22f2b4c88ddb0833175e11664abd6f6',#移动云测试群key
    'groupid':'973410116',#群组
    'fileid':'108067393386'#文件id
}



#用户反馈data
feedbackdata={
    'groupkey':'e64610ed68b210707a9147643fba3fc4',#反馈群key
    'groupid':'275041673',#群组
    'fileid':'108212985454'#文件id
}

