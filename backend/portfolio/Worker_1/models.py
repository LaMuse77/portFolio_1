from django.db import models

# Create your models here.


class Stack(models.Model):
    name = models.CharField(max_length=100, unique=True)  # ex: Django, React, etc.
    icon = models.ImageField(upload_to="stacks/", blank=True, null=True)  # optionnel (logo tech)

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=500)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    link = models.URLField(blank=True, null=True)  # lien vers le projet en ligne
    github = models.URLField(blank=True, null=True)  # lien vers le repo GitHub
    created_at = models.DateField(auto_now_add=True)

    # relation avec Stack
    stacks = models.ManyToManyField(Stack, related_name="projects")

    def __str__(self):
        return self.title
