from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Project, Stack
from .serializers import ProjectSerializer, StackSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Lecture publique, écriture authentifiée
    parser_classes = [JSONParser, MultiPartParser, FormParser]  # Pour gérer les images

    def get_queryset(self):
        """Filtrer les projets selon l'utilisateur si connecté"""
        queryset = Project.objects.all().order_by('-created_at')
        
        # Filtre par recherche
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                title__icontains=search
            ) | queryset.filter(
                description__icontains=search
            ) | queryset.filter(
                stacks__name__icontains=search
            )
        
        return queryset.distinct()

    def perform_create(self, serializer):
        """Assigner automatiquement l'owner lors de la création"""
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Récupérer les 5 projets les plus récents"""
        recent_projects = self.get_queryset()[:5]
        serializer = self.get_serializer(recent_projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_tech(self, request):
        """Filtrer les projets par technologie"""
        tech = request.query_params.get('tech', '')
        if not tech:
            return Response(
                {'error': 'Le paramètre "tech" est requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        projects = self.get_queryset().filter(stacks__name__icontains=tech)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_projects(self, request):
        """Récupérer uniquement les projets de l'utilisateur connecté"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentification requise'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        projects = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

class StackViewSet(viewsets.ModelViewSet):
    queryset = Stack.objects.all()
    serializer_class = StackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Récupérer les stacks les plus utilisées"""
        from django.db.models import Count
        
        popular_stacks = Stack.objects.annotate(
            project_count=Count('projects')
        ).filter(project_count__gt=0).order_by('-project_count')[:10]
        
        serializer = self.get_serializer(popular_stacks, many=True)
        return Response(serializer.data)