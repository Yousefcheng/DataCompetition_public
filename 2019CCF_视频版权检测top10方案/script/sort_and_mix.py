
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np


# In[2]:


def mix_accur(a1,a2,delta):
#     print(a1,a2,delta)
    return (a1+delta+a2)/2


# In[3]:


def text_save(filename, data):#filename为写入txt文件的路径，data为要写入数据列表.
    file = open(filename,'w')
    for i in range(len(data)):
        s = str(data[i]).replace('[','').replace(']','')#去除[],这两行按数据不同，可以选择
        s = s.replace("'",'').replace(',','')+'\n'   #去除单引号，逗号，每行末尾追加换行符
        file.write(s)
    file.close()
    print("保存文件成功") 


# In[6]:


txt1="./senet50.txt"
txt2="./senet154.txt"
#读取txt文件
query_id=[]
query_time=[]
refer_id=[]
refer_time=[]
accur=[]
accur1=[]
accur2=[]
inial_name=""
sorted_name=""
delta=0
def read_lines_and_sorted(filename1,filename2):    #将侵权视频段节点和版权视频段节点提取出来
    f1= open(filename1,"r")  
    f2= open(filename2,"r")  
    lines1 = f1.readlines()#读取全部内容  
    #提取accur的平均值
    for line in lines1:
        accur1.append(float(line.split(" ",2)[2]))
    mid_1=np.mean(accur1)
    lines2 = f2.readlines()#读取全部内容 
    #提取accur的p平均值
    for line in lines2:
        accur2.append(float(line.split(" ",2)[2]))
    mid_2=np.mean(accur2)
    
    delta=mid_2-mid_1
#     print(mid_1,mid_2,delta)
    lines=lines1+lines2
    lines=sorted(lines)
#     print(lines)
#     text_save("./2",lines)
    i=0
    for line in lines:
        #分隔成query_id,query_time,refer_id.refer_time的形式
        query_temp=line.split(" ",2)[0]
        refer_temp=line.split(" ",2)[1]
        query_id.append(query_temp.split("_")[0])
        query_time.append(query_temp.split("_")[1][:-4])
        refer_id.append(refer_temp.split("_")[0])
        refer_time.append(refer_temp.split("_")[1][:-4])
        accur.append(float(line.split(" ",2)[2]))
        i+=1
    return query_temp,refer_temp,query_id,query_time,refer_id,refer_time,accur,delta
    f1.close()
    f2.close()
query_temp,refer_temp,query_id,query_time,refer_id,refer_time,accur,delta=read_lines_and_sorted(txt1,txt2)


# In[7]:


i=0
final_result=[]
lent=len(query_id)
stri=""
print(delta)
while i<lent-1:
    if query_id[i]==query_id[i+1] and query_time[i]==query_time[i+1] and refer_id[i]==refer_id[i+1] and refer_time[i]==refer_time[i+1]:
        accur_temp=mix_accur(accur[i],accur[i+1],delta)
#         result=[]
#         result.append(query_id[i])
#         result.append(query_time[i])
#         result.append(refer_id[i])
#         result.append(refer_time[i])
#         result.append(accur_temp)
        stri=query_id[i]+"_"+query_time[i]+".jpg "+refer_id[i]+"_"+refer_time[i]+".jpg "+str(accur_temp)
        final_result.append(stri)
        i+=2
    else:
#         result=[]
#         result.append(query_id[i])
#         result.append(query_time[i])
#         result.append(refer_id[i])
#         result.append(refer_time[i])
#         result.append(accur[i])
#         final_result.append(result)
        stri=query_id[i]+"_"+query_time[i]+".jpg "+refer_id[i]+"_"+refer_time[i]+".jpg "+str(accur[i])
        final_result.append(stri)
        i+=1
text_save("./mixed.txt",final_result)

