from django.http import HttpResponse
from django.shortcuts import render, RequestContext,render_to_response
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.http import Http404,HttpRequest,HttpResponse,HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_http_methods

from django.core import serializers

import json

from aptechtutor.models import Category,SubCategory,Content

def index(request):
	#conn = getConnection()
	categories = Category.objects.all()
	return render(request, 'index.html',{'category_list':categories})

def tadmin(request):
	return render(request,'tadmin.html')

def category(request, urlSuffix):
	print(urlSuffix)
	categories = Category.objects.all()
	return render(request, 'category.html',{'category_list':categories})


@require_http_methods(["POST"])
@csrf_exempt
def addcategory(request):
	categoryname = request.POST['category']
	categoryType = request.POST['type']
	parentId = request.POST['parentId']
	url = request.POST['url']
	
	if parentId == '-1':
		category = Category.objects.create(name=categoryname, url=url)
	elif categoryType=='subcategory':
		category = Category.objects.get(pk=parentId)
		sub_category = SubCategory.objects.create(name=categoryname,url=url,category=category)

	
	
	data = serializers.serialize('json', [category])
	
	return HttpResponse(data) 

@require_http_methods(["POST"])
@csrf_exempt
def addcontent(request):
	contenttitle = request.POST['title']
	content = request.POST['content']
	categoryId = request.POST['id']
	url = request.POST['url']
	
	category = SubCategory.objects.get(pk=categoryId)
	
	contentOb = Content.objects.create(title=contenttitle, content=content, url=url, category=category)
	
	
	data = serializers.serialize('json', [contentOb])
	
	return HttpResponse(data) 

@require_http_methods(["GET"])
def getcategory(request, id):
	print(id)
	categories = Category.objects.all()
	names = set()
	
	serialized_data = serializers.serialize("json", categories, fields=('name'))

	return HttpResponse(serialized_data, content_type="application/json")


@require_http_methods(["GET"])
def getsubcategory(request):
	categoryId = request.GET['categoryId']
	print(categoryId)
	category = Category.objects.get(pk=categoryId)
	print(category)
	subCategory = SubCategory.objects.filter(category=category)
	data = serializers.serialize('json', subCategory,fields=('name'))
	print(data)
	
	return HttpResponse(data)

