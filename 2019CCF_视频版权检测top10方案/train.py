import torch                    
import os
import torchvision.models as models
from PIL import Image
from torch.utils.data.dataset import Dataset
import numpy as np
import torchvision.transforms as transforms
import torch.nn as nn
import torch.optim as optim
from torch.autograd import Variable
from torch.optim.lr_scheduler import *
import torchvision.transforms as transforms
import numpy as np
os.environ['CUDA_LAUNCH_BLOCKING'] = "1"
import pretrainedmodels
import glob
import faiss

import train_get_acc as tacc




path= glob.glob('../train/*/*')
num=glob.glob('../train/*')

img_label=[float(img_path.split('/')[-2]) for img_path in path]

label_len=len(num)

query_imgs_path =glob.glob('../query_frame_train_20/*/*.jpg')
query_imgs_path.sort(key=lambda x: x.lower())

refer_imgs_path = glob.glob('../refer_frame_train_20/*/*.jpg')
refer_imgs_path.sort(key=lambda x: x.lower())



class train_dataset(Dataset):
    def __init__(self, path,label,transform=None):
        
        self.img_paths=path
        
        self.img_label=label
        if transform is not None:
            self.transform=transform
        else:
            self.transform=None
    def __getitem__(self, index):
        img = Image.open(self.img_paths[index])
        if self.transform is not None:
            img = self.transform(img)
        return img,self.img_label[index]
    
    
    def __len__(self):
        return len(self.img_paths)
class val_dataset(Dataset):
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



def predit_file(path):
    val_model=model
#     print(val_model)
    del val_model.Linear_layer
    val_model.Linear_layer=lambda x:x
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    val_model=val_model.to(device)
    if not isinstance(path, list):
        path = [path]
    
    # print(path)
    
    data_loader = torch.utils.data.DataLoader(
        val_dataset(path, 
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
        for batch_data in data_loader:
            batch_x, batch_y = batch_data
#             print(batch_x)
#             print(batch_y)
            
            # print(batch_y[:10])
            batch_x = Variable(batch_x).cuda()
            feat_pred = val_model(batch_x)
#             print(feat_pred)

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



# 修改之后的网络
class Net(nn.Module):
    def __init__(self, model):
        super(Net, self).__init__()
        # 取掉model的后1层
        self.resnet_layer = nn.Sequential(*list(model.children())[:-1])
        self.Linear_layer = nn.Linear(2048, int(label_len)) #加上一层参数修改好的全连接层
    def forward(self, x):
        x = self.resnet_layer(x)
        x = x.view(x.size(0), -1)
        x = self.Linear_layer(x)
        return x



transform_train = transforms.Compose([
    transforms.Resize((224, 224)),  # 先调整图片大小至256x256
#     transforms.RandomCrop((224, 224)),  # 再随机裁剪到224x224
#     transforms.RandomHorizontalFlip(),  # 随机的图像水平翻转，通俗讲就是图像的左右对调
    transforms.ToTensor(),
    transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.2225))  # 归一化，数值是用ImageNet给出的数值
])
trainset = train_dataset(path, img_label,transform=transform_train)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=10, shuffle=False, num_workers=0)

def train(epoch):
    print('第'+str(epoch)+'轮训练')
    scheduler.step()
    model.train()
    for id ,(img,label) in enumerate(trainloader):
#         img,label=data
#         img.type(torch.FloatTensor)
        torch.as_tensor(img, dtype=float)
#         print(len(img))
        label=np.array(label,dtype=float)
        label=torch.from_numpy(label)
        image = Variable(img).cuda()
        label = Variable(label).cuda()
        optimizer.zero_grad()
        out = model(image)
#         print('out:{}'.format(out))
#         print(out.shape)
#         print('label:{}'.format(label))
        loss = criterion(out, label.long())
        print('loss:{0}'.format(loss))

        loss.backward()
        optimizer.step()





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
        #return np.squeeze(x / np.sqrt((0.28864568x ** 2).sum(-1))[..., np.newaxis])
    else:
        return sknormalize(x, copy=copy)
        #return x / np.sqrt((x ** 2).sum(-1))[..., np.newaxis]



def val_predict():
    result=[]
    query_cnn = predit_file(list(query_imgs_path[:]))
    refer_cnn = predit_file(list(refer_imgs_path[:]))
    query_cnn = normalize(query_cnn)
    refer_cnn = normalize(refer_cnn)
    
    d=int(query_cnn.shape[1])
    nlist = 1                      #聚类中心的个数
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
    
    num=query_cnn.shape[0]
    for i in range(num):
        for id,j in enumerate(I1[i]):
            if(D1[i][id]>0.8):
                data=str(query_imgs_path[i].split('/')[-1])+' '+str(refer_imgs_path[j].split('/')[-1])+' '+str(D1[i][id])
                result.append(data)
    return result
    



model_name = 'se_resnet50' # could be fbresnet152 or inceptionresnetv2
model = pretrainedmodels.__dict__[model_name](num_classes=1000, pretrained='imagenet')
model.eval()
# del model.last_linear
# model.last_linear=lambda x:x
model=Net(model)
device = torch.device("cuda")
model=model.to(device)

# for param in transfer_model.parameters():
#     param.require_grad = true

# optimizer = torch.optim.SGD(model.parameters(), lr=0.001, momentum=0.9, weight_decay=5e-4)  # 设置训练细节
optimizer = torch.optim.Adam(model.parameters(), lr=0.001, betas=(0.9, 0.99))  # 设置训练细节
scheduler = StepLR(optimizer, step_size=3)
criterion = nn.CrossEntropyLoss()
# for epoch in range(int(label_len)):

acc_log=[]
for epoch in range(20):
    train(epoch)
    torch.save(model, './'+str(epoch)+'_.pth')  # 保存模型
    result=val_predict()
#    print(result)
    acc=tacc.get_acc(result)
    print(acc)
    acc_log.append(acc)
    with open('acc_index.txt','a+') as f:
        print(acc,acc_log.index(min(acc_log)),file=f)
with open('acc_log.txt','w') as f:
    print(acc_log,file=f)
#   
    

# print(model)
