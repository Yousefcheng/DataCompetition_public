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

from PIL import Image
import glob
path= glob.glob('./train/*/*')
img_label=[float(img_path.split('/')[-2]) for img_path in path]
label_len=len(img_label)/2

class DA(Dataset):
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

    
    
    
    
class Net(nn.Module):
    def __init__(self, model):
        super(Net, self).__init__()
        # 取掉model的后1层
        self.resnet_layer = nn.Sequential(*list(model.children())[:-1])
        self.Linear_layer = nn.Linear(512, int(label_len)) #加上一层参数修改好的全连接层
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
trainset = DA(path, img_label,transform=transform_train)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=80, shuffle=False, num_workers=0)

def train(epoch):
    print('第'+str(epoch)+'轮训练')
    scheduler.step()
    model.train()
    for id ,(img,label) in enumerate(trainloader):
#         img,label=data
#         img.type(torch.FloatTensor)
        torch.as_tensor(img, dtype=float)
        label=np.array(label,dtype=float)
        label=torch.from_numpy(label)
        image = Variable(img)
        label = Variable(label)
        optimizer.zero_grad()
        out = model(image)
#         print('out:{}'.format(out))
#         print(out.shape)
#         print('label:{}'.format(label))
        loss = criterion(out, label.long())
        print(id)
#         print(label)
        loss.backward()
        optimizer.step()
     
    
model = models.resnet18(True)
# model = torch.load('999model.pth')
model = Net(model)
device = torch.device('cpu')  # 若能使用cuda，则使用cuda
model = model.to(device)
optimizer = torch.optim.SGD(model.parameters(), lr=0.001, momentum=0.9, weight_decay=5e-4)  # 设置训练细节
scheduler = StepLR(optimizer, step_size=3)
criterion = nn.CrossEntropyLoss()
for epoch in range(20):
    train(epoch)
    torch.save(model, './'+str(epoch)+'_10000model.pth')  # 保存模型
