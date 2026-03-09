import torch
import torch.nn as nn
import torch.optim as optim
import os

from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from tqdm import tqdm


# ----------------------------------------
# Device configuration
# ----------------------------------------

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using device:", device)


# ----------------------------------------
# Dataset paths (UPDATED)
# ----------------------------------------

train_dir = "../datasets/chest_xray/train"
val_dir = "../datasets/chest_xray/val"
test_dir = "../datasets/chest_xray/test"


# ----------------------------------------
# Image preprocessing
# ----------------------------------------

train_transforms = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
])

test_transforms = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
])


# ----------------------------------------
# Load datasets
# ----------------------------------------

train_dataset = datasets.ImageFolder(train_dir, transform=train_transforms)
val_dataset = datasets.ImageFolder(val_dir, transform=test_transforms)
test_dataset = datasets.ImageFolder(test_dir, transform=test_transforms)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32)
test_loader = DataLoader(test_dataset, batch_size=32)

print("Classes:", train_dataset.classes)


# ----------------------------------------
# Load DenseNet121 (best for X-ray)
# ----------------------------------------

model = models.densenet121(pretrained=True)

num_features = model.classifier.in_features

model.classifier = nn.Linear(num_features, 2)

model = model.to(device)


# ----------------------------------------
# Loss + optimizer
# ----------------------------------------

criterion = nn.CrossEntropyLoss()

optimizer = optim.Adam(model.parameters(), lr=0.0001)


# ----------------------------------------
# Training
# ----------------------------------------

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


# ----------------------------------------
# Validation
# ----------------------------------------

model.eval()

correct = 0
total = 0

with torch.no_grad():

    for images, labels in val_loader:

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)

        correct += (predicted == labels).sum().item()

val_accuracy = correct / total

print("Validation Accuracy:", val_accuracy)


# ----------------------------------------
# Test Accuracy
# ----------------------------------------

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

test_accuracy = correct / total

print("Test Accuracy:", test_accuracy)


# ----------------------------------------
# Save model
# ----------------------------------------

os.makedirs("../backend/ml_models", exist_ok=True)

torch.save(
    model.state_dict(),
    "../backend/ml_models/pneumonia_model.pth"
)

print("Pneumonia model saved successfully!")