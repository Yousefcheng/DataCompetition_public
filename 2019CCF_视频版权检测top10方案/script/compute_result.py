
# coding: utf-8

# In[34]:

import pandas as pd
import numpy as np
from numpy import *


# In[35]:

#存test文件的数据
test_query_id = []
test_query_time = []
test_query_time_start = []
test_query_time_end = []
test_refer_id = []
test_refer_time = []
test_refer_time_start = []
test_refer_time_end = []

#存train文件的数据
train_query_id=[]
train_query_time=[]
train_query_time_start=[]
train_query_time_end=[]
train_refer_id=[]
train_refer_time=[]
train_refer_time_start=[]
train_refer_time_end=[]


# In[36]:

#读取数据

#提取test.csv文件的数据
test=pd.DataFrame(pd.read_csv("/home/zhuyuan/final_1029_2.csv"))
test_list = np.array(test)

#提取出每一行
test_query_id = test_list[:,0]
test_query_time=test_list[:,1]
test_refer_id=test_list[:,2]
test_refer_time=test_list[:,3]
#分割time
test_query_time_start = [i.split('|')[0] for i in test_query_time]
test_query_time_end= [i.split('|')[1] for i in test_query_time]
test_refer_time_start=[i.split('|')[0] for i in test_refer_time]
test_refer_time_end=[i.split('|')[1] for i in test_refer_time]

#提取train.csv文件的数据
train=pd.DataFrame(pd.read_csv("E:/方禹杨/ccf bdci/train.csv"))
train_list=np.array(train)
# train_array = np.array(train)
# train_list = train_array.tolist()
#提取出每一行
train_query_id = train_list[:,0]
train_query_time=train_list[:,1]
train_refer_id=train_list[:,2]
train_refer_time=train_list[:,3]
#分割time
train_query_time_start = [i.split('|')[0] for i in train_query_time]
train_query_time_end= [i.split('|')[1] for i in train_query_time]
train_refer_time_start=[i.split('|')[0] for i in train_refer_time]
train_refer_time_end=[i.split('|')[1] for i in train_refer_time]

#array转换为list
test_query_id_list = test_query_id.tolist()
test_refer_id_list = test_refer_id.tolist()
train_query_id_list=train_query_id.tolist()
train_refer_id_list=train_refer_id.tolist()


# In[37]:

TP = 0    #正确匹配数量（id正确且起止时间差不超过2秒）
FP = 0    #错误匹配数量（id不正确或起止时间差超过2秒）
FN = len(train_query_id)      #未匹配或错误匹配数量

lenth_test=len(test_query_id)
for i in range(lenth_test):
    id_query = test_query_id[i] 
    index = train_query_id_list.index(id_query) if (id_query in train_query_id_list) else -1
#     print(index)

    #计算时间差
    query_time_start = int(train_query_time_start[index]) - int(test_query_time_start[i])
    query_time_end = int(train_query_time_end[index]) - int(test_query_time_end[i])
    refer_time_start = int(train_refer_time_start[index]) - int(test_refer_time_start[i])
    refer_time_end = int(train_refer_time_end[index]) - int(test_refer_time_end[i])
    
#     print("test_refer_id=",test_refer_id_list[i])
#     print("train_refer_id",train_refer_id_list[index])
#     if(test_refer_id_list[i]==train_refer_id_list[index]):
#         print("yes")
#     else:
#         print("no")
#     if(query_time_start<=5000 and query_time_end<=5000 and refer_time_start<=5000 and refer_time_end<=5000):
#         print("yes")
#     else:
#         print("no")
    
    #判断是否正确匹配
    if(test_refer_id_list[i]==train_refer_id_list[index] and query_time_start<=5000 and query_time_end<=5000 and refer_time_start<=5000 and refer_time_end<=5000):
        TP=TP+1
    else:
        FP=FP+1

FN = FN-TP 
print("TP =",TP)
print("FP =",FP)
print("FN =",FN)


# In[38]:

precision=TP/(TP+FP)
recall=TP/(TP+FN)
print("precision =",precision)
print("recall =",recall)

F1=2*precision*recall/(precision+recall)
print("F1-score =",F1)


# In[ ]:



