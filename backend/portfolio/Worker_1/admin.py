from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Stack, Project

# Inline pour gérer les stacks dans le formulaire Project
class StackInline(admin.TabularInline):
    model = Project.stacks.through  # Accède à la table intermédiaire de la relation ManyToMany
    extra = 1  # Nombre de champs vides à afficher par défaut
    verbose_name = "Technologie"
    verbose_name_plural = "Technologies"

@admin.register(Stack)
class StackAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon_preview', 'project_count')
    search_fields = ('name',)
    list_filter = ('name',)
    ordering = ('name',)

    def icon_preview(self, obj):
        if obj.icon:
            return mark_safe(f'<img src="{obj.icon.url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />')
        return "-"
    icon_preview.short_description = "Icône"

    def project_count(self, obj):
        return obj.projects.count()
    project_count.short_description = "Nombre de projets"

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Si on édite un objet existant
            return ('name',)  # Rendre le champ 'name' en lecture seule pour éviter les modifications accidentelles
        return ()

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_at', 'stack_list', 'image_preview')
    search_fields = ('title', 'description')
    list_filter = ('status', 'created_at', 'stacks')
    inlines = [StackInline]
    list_per_page = 20  # Limite le nombre d'éléments par page
    date_hierarchy = 'created_at'  # Navigation par date
    ordering = ('-created_at',)  # Trie par date de création (plus récent en premier)

    def stack_list(self, obj):
        return ", ".join([stack.name for stack in obj.stacks.all()])
    stack_list.short_description = "Technologies"

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />')
        return "-"
    image_preview.short_description = "Image"

    def get_fieldsets(self, request, obj=None):
        return (
            (None, {
                'fields': ('title', 'description', 'status')
            }),
            ('Liens', {
                'fields': ('link', 'github'),
                'classes': ('collapse',)  # Section pliable pour les champs optionnels
            }),
            ('Médias', {
                'fields': ('image',),
                'classes': ('collapse',)
            }),
        )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Optionnel : Ajouter une notification ou un log pour l'admin
        self.message_user(request, f"Projet '{obj.title}' {'modifié' if change else 'créé'} avec succès.")