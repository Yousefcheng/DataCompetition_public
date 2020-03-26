
# coding: utf-8

# In[107]:

import pandas as pd
import numpy as np
from numpy import *


# In[108]:

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

#存差值
query_time_start=[]  
query_time_end=[]
refer_time_start=[]
refer_time_end=[]


# In[109]:

#读取数据

#提取test.csv文件的数据
test=pd.DataFrame(pd.read_csv("E:/方禹杨/ccf bdci/test_improve_test_1026_final1_2.csv"))
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


# In[110]:

#存test文件的数据
test_query_id_list = test_query_id.tolist()
test_refer_id_list = test_refer_id.tolist()

#存train文件的数据
train_query_id_list=train_query_id.tolist()
train_refer_id_list=train_refer_id.tolist()


# In[111]:

#找时间差
lenth_test=len(test_query_id)
lenth_train=len(train_query_id)
# print(train_query_time_start[4])

#存差值
query_time_start=[]  
query_time_end=[]
refer_time_start=[]
refer_time_end=[]

for i in range(lenth_test):
    id = test_query_id[i]
    index = train_query_id_list.index(id) if (id in train_query_id_list) else -1
#     print(index)
    #做差
#     a = int(train_query_time_start[index]) - int(test_query_time_start[i])
#     print(a)
    query_time_start.append(int(train_query_time_start[index]) - int(test_query_time_start[i]))
    query_time_end.append(int(train_query_time_end[index]) - int(test_query_time_end[i]))
    refer_time_start.append(int(train_refer_time_start[index]) - int(test_refer_time_start[i]))
    refer_time_end.append(int(train_refer_time_end[index]) - int(test_refer_time_end[i]))

# print(query_time_start)
# print(query_time_end)
# print(refer_time_start)
# print(refer_time_end)


# In[113]:

#输出为csv文件
fyy_result=[]
fyy_result.append(test_query_id)
fyy_result.append(query_time_start)
fyy_result.append(query_time_end)
fyy_result.append(test_refer_id)
fyy_result.append(refer_time_start)
fyy_result.append(refer_time_end)
fyy_result2 = array(fyy_result)
fyy_result2 = transpose(fyy_result2)


# In[115]:

#以csv格式存入文件
column = ['test_query_id','query_time_start的差','query_time_end的差','test_refer_id','refer_time_start的差','refer_time_end的差'] #列表对应每列的列名
test = pd.DataFrame(columns=column, data=fyy_result2)

test.to_csv('E:/方禹杨/ccf bdci/fyy_result.csv',index=None)


# In[ ]:



