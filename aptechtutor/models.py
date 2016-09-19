from django.db import models

class Category(models.Model):
	name = models.CharField(max_length=255)
	url = models.CharField(max_length=255)
	hide = models.CharField(max_length=5, default='F')
	

class SubCategory(models.Model):
	name = models.CharField(max_length=255)
	url = models.CharField(max_length=255)
	hide = models.CharField(max_length=5,default='F')
	category=models.ForeignKey(Category)

class Content(models.Model):
	title = models.CharField(max_length=255)
	content = models.TextField()
	url = models.CharField(max_length=255)
	category=models.ForeignKey(SubCategory)

	