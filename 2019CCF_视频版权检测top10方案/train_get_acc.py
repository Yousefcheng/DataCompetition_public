import pandas as pd
import numpy as np




def get_acc(input_):
    
    #存txt文件的数据
    query_id = []
    query_time = []
    refer_id = []
    refer_time = []


    query=[]
    refer=[]

    accur = []

    query_and_refer=[]

  
    for line in input_:
        query_temp=line.split(" ",2)[0]
        refer_temp=line.split(" ",2)[1]
        accur_temp=line.split(" ",2)[2]

        query_id.append(query_temp.split("_")[0])
        query_time.append(float(query_temp.split("_")[1][:-4]))
        refer_id.append(refer_temp.split("_")[0])
        refer_time.append(float(refer_temp.split("_")[1][:-4]))

        query.append(query_temp)
        refer.append(refer_temp)

        accur.append(float(line.split(" ",2)[2]))

        query_and_refer_temp=line.split(" ",2)[0]+" "+line.split(" ",2)[1]
        query_and_refer.append(query_and_refer_temp)


    query_and_refer=np.array(query_and_refer)

    # 得到query_id的种类
    query_id_class=[]
    for id in query_id:
        if id not in query_id_class:
            query_id_class.append(id)


    refer_id_class=[]
    for id in refer_id:
        if id not in refer_id_class:
            refer_id_class.append(id)

#    print(query_id_class)
#    print(refer_id_class)



    # 得到query_id中对应种类的索引
    query_id_class_idx=[]
    for class_ in query_id_class:
        idxs=[]
        for idx,id_ in enumerate(query_id):

            if class_==id_:
                idxs.append(idx)
        query_id_class_idx.append(idxs)


    refer_id=np.array(refer_id)
    best_refer_id=[]                     # 得到出现次数最多的
    for idx in query_id_class_idx:       # 得到不同类别的refer_id的索引
        refer_id_son=list(refer_id[idx])
        num=[]
        for i in refer_id_class:          # 计算一个类别中不同refer_id的数量
            num.append(refer_id_son.count(i))         #计算数量
        max_num=max(num)
        max_idx=num.index(max_num)
        best_refer_id.append(refer_id_class[max_idx])
#    print(best_refer_id)

    # 求

    extract_idx=[]                      #出现次数最多的 提取完之后的索引
    refer_id=np.array(refer_id)
    idx_=0
    for idx in query_id_class_idx:
#        print(idx)
        refer_id_son=list(refer_id[idx])
#        print(refer_id_son)

        for i,id_ in enumerate(refer_id_son):
            if id_== best_refer_id[idx_]:
                extract_idx.append(idx[i])
        idx_+=1
#    print(extract_idx)
#    print(refer_id[extract_idx])


    data=np.array(query)

    extract_data=data[extract_idx]
#    print(extract_data)

    accur=np.array(accur)
    extract_accur=accur[extract_idx]
#    print(extract_accur)


    extract_data_class=[]
    for id in extract_data:
        if id not in extract_data_class:
            extract_data_class.append(id)


    extract_data_class=np.array(extract_data_class)
#    print(extract_data_class)


    extract_data_class_idx=[]
    for class_ in extract_data_class:
        idxs=[]
        for idx,id_ in enumerate(extract_data):

            if class_==id_:
                idxs.append(idx)
        extract_data_class_idx.append(idxs)
#    print(extract_data_class_idx)



    best_accur_idx=[]  
    extract_accur=np.array(extract_accur)
    for idx in extract_data_class_idx:
        extract_accur=np.array(extract_accur)
#        print(extract_accur[idx])
        max_accur=max(extract_accur[idx])
        extract_accur=list(extract_accur)
#        print(extract_accur.index(max_accur))
        best_accur_idx.append(extract_accur.index(max_accur))



    # query_id=np.array()
    # query_time
    # refer_id
    # refer_time
    query_id = np.array(query_id)[extract_idx][best_accur_idx]
    query_time = np.array(query_time)[extract_idx][best_accur_idx]
    refer_id = np.array(refer_id)[extract_idx][best_accur_idx]
    refer_time = np.array(refer_time)[extract_idx][best_accur_idx]


    query=np.array(query)[extract_idx][best_accur_idx]
    refer=np.array(refer)[extract_idx][best_accur_idx]

    accur = np.array(accur)[extract_idx][best_accur_idx]

    query_and_refer=np.array(query_and_refer)[extract_idx][best_accur_idx]

    query_id=list(query_id)
    query_time=list(query_time)

    refer_id=list(refer_id)
    refer_time=list(refer_time)
    query=list(query)
    refer=list(refer)
    accur=list(accur)
#    print(query_and_refer)
    query_and_refer=list(query_and_refer)



    #提取train.csv文件的数据

    train=pd.DataFrame(pd.read_csv("./train.csv"))
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
    train_query_id_list=list(train_query_id)
    train_refer_id_list=list(train_refer_id)

#    print(train_query_id_list)


    lenth_txt=len(query_id)
    lenth_train=len(query_id)
    print_txt_query_id=[]
    print_txt_query_time=[]
    print_txt_refer_id=[]
    print_txt_refer_time=[]
    time_diff=[]

    for i in range(lenth_txt):
        id = query_id[i]
        index = train_query_id_list.index(id) if (id in train_query_id_list) else -1

        if(train_refer_id_list[index] == int(refer_id[i])):
            print_txt_query_id.append(query_id[i])
            print_txt_query_time.append(query_time[i])
            print_txt_refer_id.append(refer_id[i])
            print_txt_refer_time.append(refer_time[i])

            tempt1=(int(train_query_time_start[index]))/1000
    #         print(tempt1)
            tempt2=(int(query_time[i]))
    #        print(tempt2)

            tempt3=(int(train_refer_time_start[index]))/1000
            tempt4=(int(refer_time[i]))
    #         print(tempt4)

            time_diff_temp=(tempt3-tempt1)-(tempt4-tempt2)
            time_diff.append(int(abs(time_diff_temp)))
        else:
            print_txt_query_id.append(query_id[i])
            print_txt_query_time.append(query_time[i])
            print_txt_refer_id.append(refer_id[i])
            print_txt_refer_time.append(refer_time[i])
            time_diff.append(int(1000))

    # print(int(time_diff))



    fyy_result=[]
    fyy_result.append(print_txt_query_id)
    fyy_result.append(print_txt_query_time)
    fyy_result.append(print_txt_refer_id)
    fyy_result.append(print_txt_refer_time)
    fyy_result.append(time_diff)

    fyy_result = np.array(fyy_result)
#     fyy_result2 = np.transpose(fyy_result2)
#     print(fyy_result)
    result_means=np.mean(time_diff)
#     print(result_means)
    result_len=len(time_diff)
    my_acc=result_means/result_len
    return my_acc

#     column = ['txt_query_id','txt_query_time','txt_refer_id','txt_refer_time','总差'] #列表对应每列的列名
#     test = pd.DataFrame(columns=column, data=fyy_result2)
#     test.to_csv(output_file,index=None)
    
    
# input_file='./inceptionv2.txt'
# output_file='./abs/inceptionv2.csv'
# get_acc(input_file,output_file)
    
    

