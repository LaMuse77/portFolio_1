from rest_framework import serializers
from .models import Project, Stack

class StackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    # Lecture seule : afficher les détails complets des stacks
    stacks = StackSerializer(many=True, read_only=True)
    
    # Écriture : accepter uniquement les IDs des stacks
    stacks_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Stack.objects.all(), 
        write_only=True, 
        source='stacks',
        required=False  # Optionnel pour permettre des projets sans stack
    )
    
    # Champ owner en lecture seule (automatiquement assigné)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Project
        fields = [
            'id',
            'title', 
            'description', 
            'image',
            'link',
            'github',
            'status', 
            'created_at',
            'stacks',      # Lecture (détails complets)
            'stacks_ids',  # Écriture (IDs uniquement)
            'owner'
        ]
        read_only_fields = ['created_at', 'owner']

    def create(self, validated_data):
        # Extraire les stacks avant de créer le projet
        stacks = validated_data.pop('stacks', [])
        
        # Créer le projet avec l'owner depuis le contexte
        project = Project.objects.create(**validated_data)
        
        # Ajouter les stacks
        if stacks:
            project.stacks.set(stacks)
        
        return project

    def update(self, instance, validated_data):
        # Extraire les stacks si présents
        stacks = validated_data.pop('stacks', None)
        
        # Mettre à jour les champs du projet
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Mettre à jour les stacks si fournis
        if stacks is not None:
            instance.stacks.set(stacks)
        
        return instance