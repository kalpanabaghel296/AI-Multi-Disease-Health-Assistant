import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from tqdm import tqdm
import os

# --------------------------------------------------
# Device configuration
# --------------------------------------------------

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using device:", device)

# --------------------------------------------------
# Dataset paths
# --------------------------------------------------

train_dir = "../datasets/dermatosis_images/train"
test_dir = "../datasets/dermatosis_images/test"

# --------------------------------------------------
# Image preprocessing
# --------------------------------------------------

train_transforms = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor()
])

test_transforms = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

# --------------------------------------------------
# Load dataset
# --------------------------------------------------

train_dataset = datasets.ImageFolder(train_dir, transform=train_transforms)
test_dataset = datasets.ImageFolder(test_dir, transform=test_transforms)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=32)

print("Classes:", train_dataset.classes)

# --------------------------------------------------
# Load pretrained ResNet50
# --------------------------------------------------

model = models.resnet50(pretrained=True)

num_features = model.fc.in_features
num_classes = len(train_dataset.classes)

model.fc = nn.Linear(num_features, num_classes)

model = model.to(device)

# --------------------------------------------------
# Loss and optimizer
# --------------------------------------------------

criterion = nn.CrossEntropyLoss()

optimizer = optim.Adam(model.parameters(), lr=0.0001)

# --------------------------------------------------
# Training loop
# --------------------------------------------------

epochs = 8

for epoch in range(epochs):

    model.train()

    running_loss = 0

    for images, labels in tqdm(train_loader):

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    print(f"Epoch {epoch+1}/{epochs} Loss: {running_loss:.4f}")

# --------------------------------------------------
# Evaluation
# --------------------------------------------------

model.eval()

correct = 0
total = 0

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)
        correct += (predicted == labels).sum().item()

accuracy = correct / total

print("Test Accuracy:", accuracy)

# --------------------------------------------------
# Save model
# --------------------------------------------------

os.makedirs("../backend/ml_models", exist_ok=True)

torch.save(
    model.state_dict(),
    "../backend/ml_models/dermatosis_model.pth"
)

print("Dermatosis model saved successfully!")