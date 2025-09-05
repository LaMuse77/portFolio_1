from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser

class Accounts(AbstractUser):

    # Username, email, password sont déjà inclus
    # Tu ajoutes tes propres champs ici

    is_client = models.BooleanField(default=False)   # pour distinguer client
    is_owner = models.BooleanField(default=False)    # toi, l’admin du portfolio

    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    # Exemple : lien vers LinkedIn/GitHub
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    gmail = models.URLField(blank=True)

    def __str__(self):
        return self.username 