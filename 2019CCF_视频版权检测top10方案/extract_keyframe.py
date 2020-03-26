#!/usr/bin/env python
# coding: utf-8

# In[1]:


import torch as t


# In[2]:


import torchvision


# In[3]:


import os
import sys
import glob
import shutil
import codecs
import subprocess

import pandas as pd
import numpy as np
import time

from PIL import Image

from multiprocessing.pool import ThreadPool


# In[4]:


refer_id = glob.glob('./input/refer/*.mp4')
query_id = glob.glob('./input/query/*.mp4')


# In[ ]:


def extract_keyframe(id):
    if id.split('/')[-2] == 'query':
        query_id = id.split('/')[-1][:-4]
        query_mp4 = '../input/query/' + query_id + '.mp4'
        if not os.path.exists('./input/query_frame/'+query_id):
            os.mkdir('./input/query_frame/'+query_id)    
        
        
        command = ['ffmpeg', '-i', query_mp4,
                   '-r','1',
                   ' -vsync', 'vfr', '-qscale:v', '2',
                   '-f', 'image2', 
                   './input/query_frame/{0}/{0}_%05d.jpg'.format(query_id)]
         #抽取关键帧
        os.system(' '.join(command))
    else:
        refer_id = id.split('/')[-1][:-4]
        refer_mp4 = '../input/refer/' + refer_id + '.mp4'
        
        if not os.path.exists('./input/refer_frame/'+refer_id):
            os.mkdir('./input/refer_frame/'+refer_id)    
        
        
        command = ['ffmpeg', '-i', refer_mp4,
                   '-r','1',
                   ' -vsync', 'vfr', '-qscale:v', '2',
                   '-f', 'image2', 
                   './input/refer_frame/{0}/{0}_%05d.jpg'.format(refer_id)]
         #抽取关键帧
        os.system(' '.join(command))


# In[7]:


ThreadPool(4).imap_unordered(extract_keyframe, query_id[:])


# In[9]:


ThreadPool(4).imap_unordered(extract_keyframe, refer_id[:])

