
# coding: utf-8

# In[5]:


import pandas as pd
from numpy import *


# In[1]:


aim_match_count=8 #目标匹配帧的个数
window_length=17
query_id=[]
query_time=[]
refer_id=[]
refer_time=[]
accur=[]
def read_query_and_refer(filename):    #将侵权视频段节点和版权视频段节点提取出来
    f = open(filename,"r")  
    lines = f.readlines()#读取全部内容  
    i=0
    for line in lines:
        #分隔成query_id,query_time,refer_id.refer_time的形式
        query_temp=line.split(" ",2)[0]
        refer_temp=line.split(" ",2)[1]
        query_id.append(query_temp.split("_")[0])
        query_time.append(float(query_temp.split("_")[1][:-4]))
        refer_id.append(refer_temp.split("_")[0])
        refer_time.append(float(refer_temp.split("_")[1][:-4]))
        accur.append(float(line.split(" ",2)[2]))
        i+=1
    return query_id,query_time,refer_id,refer_time,accur
    f.close()
result_of_read=read_query_and_refer("./resnet50_pre.txt")
# print(result_of_read)


# In[2]:


# #分治
# def shrink_refer_range(a,b,original_time,lenth_query):
#     if b-a<=2*lenth_query:
#         return a,b
#     mid=(a+b)/2
#     left_count,mid_count,right_count=0,0,0
#     #三段中间有两个边界点
#     border1=mid-lenth_query
#     border2=mid+lenth_query
#     for i in range(len(original_time)):
#         if a<=original_time[i]<border1:
#             left_count+=1
#         elif border1<=original_time[i]<border2:
#             mid_count+=1
#         elif border2<=original_time[i]<=b:
#             right_count+=1
#     maxcount=max(left_count,mid_count,right_count)
#     if mid_count==maxcount and a==border1 and b==border2:
#         return a,b
#     if maxcount<=aim_match_count:
#         if left_count==maxcount:
#             return a,border1
#         elif mid_count==maxcount:
#             return border1,border2
#         elif right_count==maxcount:
#             return border2,b
#     if left_count==maxcount:
#         return shrink_refer_range(a,border1,original_time,lenth_query)
#     elif mid_count==maxcount:
#         return shrink_refer_range(border1,border2,original_time,lenth_query)
#     elif right_count==maxcount:
#         return shrink_refer_range(border2,b,original_time,lenth_query)


# In[3]:


query_id_result=[]
query_time_result=[]
refer_id_result=[]
refer_time_result=[]

lenth=len(query_id)
for i in range(lenth):
    if i==0 or query_id[i]!=query_id[i-1]:   #有相同query_id的一块的第一个元素下标 
        start_index=i
        start_query_time=query_time[i]
        temp_query_id=query_id[i]
    if i==lenth-1 or query_id[i]!=query_id[i+1]:    #有相同query_id的一块的最后一个元素下标
        end_index=i
        end_query_time=query_time[i]
        lenth_query_time=end_query_time-start_query_time   #该query_id视频的长度
        #lenth_query_time=0，说明原result文件中就只有一行,
        if lenth_query_time==0:
            pass
        else:
            #分治
            #找到该query_id对应的出现次数最多的refer_id,即下段程序中的most_id
            most_id=None
            d={}
            new_refer_id=refer_id[start_index:end_index+1]
            for id in new_refer_id:
                if id not in d:
                    count=new_refer_id.count(id)
                    d[id]=count
                    if count>d.get(most_id,0):
                        most_id=id
            isnew=True
            rtime=[]   #将该qery_id的refer的most_id对应的关键帧时间点放在time中
            qtime=[]   #存储该refer_time对应的query_time
            temp_jj=start_index
            same_qtime_accur=[]
            record_j=start_index  #用来记录同一个record_id 同一个qid，同一时间，但是中间隔着其他id的情况
            shouldend=False
            j=start_index
            while j<end_index+1:    #在同一qid的区间内
                if refer_id[j]==most_id:
                    if len(qtime)==0:   #说明是该qid的第一个，而且refer_id=最大id
                        rtime.append(refer_time[j])
                        qtime.append(query_time[j])
                        same_qtime_accur.append(accur[j])
                        j+=1
                        for kk in range(j,end_index+1):   #可能有多个同一q图片
                            if query_time[kk]!=qtime[len(qtime)-1]:    #idtime已经不一样了
                                j=kk
                                break
                            #这种可能存不存在未知
                            if kk==end_index :
                                same_qtime_accur.append(accur[kk])
                                j=kk+1
                                break
                            if refer_id[kk]==most_id and query_time[kk]==qtime[len(qtime)-1]: 
                                same_qtime_accur.append(accur[kk])
                            else:
                                j=kk
                                pass
                        max_accur_index=accur[temp_jj:].index(max(same_qtime_accur))+temp_jj     #找到same_qtime_accur中最大的，加入到结果中
                        rtime.pop()
                        qtime.pop()
                        rtime.append(refer_time[max_accur_index])
                        qtime.append(query_time[max_accur_index])
                    elif query_time[j]==qtime[len(qtime)-1]:    #和已经存储的最后一个q图片相同
                        temp_accur=[]
                        for xxx in range(j-1,0,-1):
                            if query_time[xxx]!=query_time[j]:
                                break
                            elif refer_id[xxx]==most_id:
                                temp_accur.append(same_qtime_accur.pop())
                            else:
                                pass
                        same_qtime_accur=temp_accur[:]
                        temp_jj=record_j
                        for kk in range(j,end_index+1):   #可能有多个同一q图片
                            if query_time[kk]!=qtime[len(qtime)-1]:    #idtime已经不一样了
                                j=kk
                                break
                            if kk==end_index and query_time[kk]==qtime[len(qtime)-1]:
                                same_qtime_accur.append(accur[kk])
                                j=kk+1
                                break
                            if refer_id[kk]==most_id and query_time[kk]==qtime[len(qtime)-1]:
                                same_qtime_accur.append(accur[kk])
                            else:
                                j=kk
                                break
                        max_accur_index=accur[temp_jj:].index(max(same_qtime_accur))+temp_jj     #找到same_qtime_accur中最大的，加入到结果中
                        rtime.pop()
                        qtime.pop()
                        rtime.append(refer_time[max_accur_index])
                        qtime.append(query_time[max_accur_index])
#                         if j==kk+1 :
#                             temp_kk=kk
                    else: 
                        rtime.append(refer_time[j])
                        qtime.append(query_time[j])
                        same_qtime_accur.append(accur[j])
                        record_j=j
                        j+=1
                else:
                    j+=1 
#             original_left,original_right=shrink_refer_range(min(rtime),max(rtime),rtime,lenth_query_time)
            print(qtime)
            print("$$$$")
            print(rtime)
            print("%%%%")
            original_left=min(qtime)
            original_right=max(qtime)
            #滑窗
            step_length=1
            query_start=0
            #找query_start
            window_start_left=original_left
            window_start_right=window_start_left+window_length
            #不到最右边，往右滑
            while  window_start_right<=end_query_time:
                #看该滑窗里是否有aim帧能匹配得上
                match_count=0
                flag=False  #用来判断当前匹配的帧是不是该滑窗内的第一个
                for k in range(len(qtime)):
                    if window_start_left<=qtime[k]<=window_start_right:
                        if flag==False:
                            query_start=qtime[k]     #找到该滑窗内的第一个匹配帧
                            refer_start=rtime[k]
                            flag=True
                        match_count+=1
                    elif qtime[k]>window_start_right:
                        flag=False
                        break
                if match_count>=aim_match_count:   #该滑窗内匹配帧满足条件
                    break
                window_start_left+=step_length
                window_start_right=window_start_left+window_length
            #找query_end
            query_end=original_right
            window_end_right=original_right
            window_end_left=window_end_right-window_length
            #不到最左边，往左滑
            while  window_end_left>=0:
                #看该滑窗里是否有3帧能匹配得上
                match_count=0
                flag=False  #用来判断当前匹配的帧是不是该滑窗内的第一个
                reverse_range=reversed(range(len(qtime)))
                for k in reverse_range:
                    if window_end_left<=qtime[k]<=window_end_right:
                        if flag==False:
                            query_end=qtime[k]     #找到该滑窗内的第一个匹配帧    
                            refer_end=rtime[k]
                            flag=True 
                        match_count+=1
                    elif qtime[k]<window_end_left:
                        flag==False
                        break
                if match_count>=aim_match_count:   #该滑窗内匹配帧满足条件
                    break
                window_end_right-=step_length
                window_end_left=window_end_right-window_length
            if query_start>query_end:
                query_start,query_end=query_end,query_start
            if refer_start>refer_end:
                refer_start,refer_end=refer_end,refer_start
#             if query_start==query_end:
#                 query_start-=1
#                 query_end+=1
#             if refer_start==refer_end:
#                 refer_start-=1
#                 refer_end+=1
            query_id_result.append(temp_query_id)
            query_time_result.append(str(int((query_start-1)*1000))+"|"+str(int((query_end-1)*1000)))
            refer_id_result.append(most_id)
            refer_time_result.append(str(int((refer_start-1)*1000))+"|"+str(int((refer_end-1)*1000)))


# In[6]:


result=[]
result.append(query_id_result)
result.append(query_time_result)
result.append(refer_id_result)
result.append(refer_time_result)
result2=array(result)
result2=transpose(result2)


# In[7]:


#以csv格式存入文件
column = ['query_id','query_time_range','refer_id','refer_time_range'] #列表对应每列的列名
test = pd.DataFrame(columns=column, data=result2)
test.to_csv('result.csv',index=None)


# In[97]:





# In[102]:




