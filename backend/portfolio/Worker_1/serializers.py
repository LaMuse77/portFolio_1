import os
from rest_framework import serializers
from .models import Project, Stack

class StackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        fields = "__all__"  

class ProjectSerializer(serializers.ModelSerializer):
    tech_stack = StackSerializer(many=True, read_only=True)
    tech_stack_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Stack.objects.all(), write_only=True, source="tech_stack"
    )

    class Meta:
        model = Project
        fields = ["id", "title", "description", "client", "status", "created_at", "tech_stack", "tech_stack_ids"]
