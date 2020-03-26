#!/usr/bin/env python
# coding: utf-8

# In[1]:


import torch.nn as nn
import os
import sys
import glob
import shutil
import codecs
import subprocess

import pandas as pd
import numpy as np
import time

# %pylab inline
from PIL import Image
#train_df = pd.read_csv('../input/train.csv')

# from multiprocessing.pool import ThreadPool
import pretrainedmodels


# In[2]:


class SEModule(nn.Module):

    def __init__(self, channels, reduction):
        super(SEModule, self).__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.fc1 = nn.Conv2d(channels, channels // reduction, kernel_size=1,
                             padding=0)
        self.relu = nn.ReLU(inplace=True)
        self.fc2 = nn.Conv2d(channels // reduction, channels, kernel_size=1,
                             padding=0)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        module_input = x
        x = self.avg_pool(x)
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.sigmoid(x)
        return module_input * x


# In[2]:


# 读取query 每秒帧 并进行排序
query_imgs_path =glob.glob('./query_frame/*/*.jpg')
# for id in pd.read_csv('../input/submit_example.csv')['query_id']:
#     query_imgs_path += glob.glob('../input/query_frame/' + id + '/*.jpg')
query_imgs_path.sort(key=lambda x: x.lower())

# print(query_imgs_path)


# In[3]:


# 读取refer 每帧帧 并进行排序

refer_imgs_path = glob.glob('./refer_frame/*/*.jpg')
refer_imgs_path.sort(key=lambda x: x.lower())
# print(refer_imgs_path)


# In[4]:


# import cv2
#import imagehash
from PIL import Image
from tqdm import tqdm_notebook
from scipy.spatial.distance import cosine

def compute_cosin_distance(Q, feats, names):
    """
    feats and Q: L2-normalize, n*d
    """
    dists = np.dot(Q, feats.T)
#     print(dists)
    idxs = np.argsort(dists)[::-1]
#     print(idxs)
    rank_dists = dists[idxs]
#     print(rank_dists)
    rank_names = [names[k] for k in idxs]
#     print(rank_names)
    return idxs, rank_dists, rank_names

def hamming_distance(chaine1, chaine2):
    return sum(c1 != c2 for c1, c2 in zip(chaine1, chaine2))


# # 将图片经过去除最后一层的预训练的模型的特征进行比对

# In[5]:


import torch
torch.manual_seed(0)
torch.backends.cudnn.deterministic = True
torch.backends.cudnn.benchmark = False

import torchvision.models as models
import torchvision.transforms as transforms
import torchvision.datasets as datasets
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.autograd import Variable
from torch.utils.data.dataset import Dataset
class QRDataset(Dataset):
    def __init__(self, img_path, transform=None):
        self.img_path = img_path
#         print(self.img_path)
        self.img_label = np.zeros(len(img_path))
    
        if transform is not None:
            self.transform = transform
        else:
            self.transform = None
    
    def __getitem__(self, index):
        img = Image.open(self.img_path[index])
        
        if self.transform is not None:
            img = self.transform(img)
        
        return img, self.img_path[index]

    def __len__(self):
        return len(self.img_path)
    
# model = models.resnet18(True).cuda()
# # print(model)
# del model.fc
# model.fc=lambda x:x

# model = se_resnet50(num_classes=1000,pretrained=True)
# #print(model)
# #model.load_state_dict(torch.load('seresnet50.pkl'))
# del model.fc
# model=lambda x:x
# model.eval()
# model = torch.load('/home/zhuyuan/桌面/4_10000model.pth')
# del model.Linear_layer
# model.Linear_layer=lambda x:x
# device = torch.device('cuda')  # 若能使用cuda，则使用cuda
# model = model.to(device)


model_name = 'se_resnet50' # could be fbresnet152 or inceptionresnetv2           # 导入senet50模型
model = pretrainedmodels.__dict__[model_name](num_classes=1000, pretrained='imagenet')
model.eval()
# print(model)
del model.last_linear    #删去最后一层
model.last_linear=lambda x:x
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model=model.to(device)

def predit_file(path):
    if not isinstance(path, list):
        path = [path]
    
    # print(path)
    
    data_loader = torch.utils.data.DataLoader(
        QRDataset(path, 
                transforms.Compose([
#                             transforms.Resize((256, 256)),  # 先调整图片大小至256x256
#                             transforms.RandomCrop((224, 224)),
                            transforms.Resize((224, 224)),
                            transforms.ToTensor(),
                            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])
        ), batch_size=40, shuffle=False, num_workers=0,
    )
    
    img_feat = []
    with torch.no_grad():
        for batch_data in tqdm_notebook(data_loader):
            batch_x, batch_y = batch_data
#             print(batch_x)
#             print(batch_y)
            
            # print(batch_y[:10])
            batch_x = Variable(batch_x).cuda()
            
            batch_x = batch_x.to(batch_x)
#             device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            feat_pred = model(batch_x)
#             print(feat_pred.shape)

            # max-pooling
            # feat_pred = F.max_pool2d(feat_pred, kernel_size=(24, 32))
            
            # ave-pooling
            # feat_pred = F.avg_pool2d(feat_pred, kernel_size=(24, 32))[:, :, 0, 0]
            
            #print(feat_pred.shape, batch_x.shape)
            feat_pred = feat_pred.data.cpu().numpy()
            # feat_pred = feat_pred.max(-1).max(-1)
            
            # feat_pred = feat_pred.reshape((-1, 512))
            img_feat.append(feat_pred)
            
            del feat_pred
            # img_feat.append(feat_pred)
            
    img_feat = np.vstack(img_feat)
    return img_feat


# In[6]:


query_cnn = predit_file(list(query_imgs_path[:]))


# In[8]:


refer_cnn = predit_file(list(refer_imgs_path[:]))


# In[9]:


# -*- coding: utf-8 -*-
import os, sys, codecs
import glob

import numpy as np
# import cv2

from sklearn.preprocessing import normalize as sknormalize
from sklearn.decomposition import PCA

def normalize(x, copy=False):
    """
    A helper function that wraps the function of the same name in sklearn.
    This helper handles the case of a single column vector.
    """
    if type(x) == np.ndarray and len(x.shape) == 1:
        return np.squeeze(sknormalize(x.reshape(1,-1), copy=copy))
        #return np.squeeze(x / np.sqrt((x ** 2).sum(-1))[..., np.newaxis])
    else:
        return sknormalize(x, copy=copy)
        #return x / np.sqrt((x ** 2).sum(-1))[..., np.newaxis]

# 特征归一化
query_cnn = normalize(query_cnn)
refer_cnn = normalize(refer_cnn)


# In[10]:


print(query_cnn.shape)


# ##  调用faiss库进行加速     此次比赛中,此操作将最后匹配时间缩减了大概10倍左右

# In[14]:


import faiss


import numpy as np

d=int(query_cnn.shape[1])
nlist = 5                      #聚类中心的个数
k = 5
quantizer = faiss.IndexFlatL2(d)  # the other index
index = faiss.IndexIVFFlat(quantizer, d, nlist, faiss.METRIC_INNER_PRODUCT)

# assert not index.is_trained
index.train(refer_cnn)
# assert index.is_trained

index.add(refer_cnn)                  # add may be a bit slower as well
D1, I1 = index.search(query_cnn, k)     # actual search

index.nprobe = 10              # default nprobe is 1, try a few more
D2, I2 = index.search(query_cnn, k)


# # 输出相匹配的图像名称,以及其相似度

# In[15]:


num=query_cnn.shape[0]
h=0
with open('senet50.txt','w') as f:
    for i in range(num):
        for id,j in enumerate(I1[i]):
            if(D1[i][id]>0.8):
                print(query_imgs_path[i].split('/')[-1], refer_imgs_path[j].split('/')[-1],D1[i][id],file=f)
                print(query_imgs_path[i].split('/')[-1], refer_imgs_path[j].split('/')[-1],D1[i][id])


# # 下一步对数据进行去噪,进行时间对齐

# In[ ]:




