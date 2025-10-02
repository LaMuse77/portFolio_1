from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Project, Stack
from .serializers import ProjectSerializer, StackSerializer

class StackViewSet(viewsets.ModelViewSet):
    queryset = Stack.objects.all()
    serializer_class = StackSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
