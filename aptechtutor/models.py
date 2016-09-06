from django.db import models

class Category(models.Model):
	name = models.CharField(max_length=255)
	

class SubCategory(models.Model):
	name = models.CharField(max_length=255)
	category=models.ForeignKey(Category)
	