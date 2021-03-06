from django.http import HttpResponse
from django.shortcuts import render,redirect, RequestContext,render_to_response
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.http import Http404,HttpRequest,HttpResponse,HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_http_methods

from django.core import serializers

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login

import json

from aptechtutor.models import Category,SubCategory,Content

def index(request):
	#conn = getConnection()
	categories = Category.objects.all()
	return render(request, 'index.html',{'category_list':categories})

@login_required(login_url='/admin/login/')
def tadmin(request):
	return render(request,'tadmin.html')

def initlogin(request):
	nextpage = request.GET['next']
	return render(request,'login.html',{'nextpage':nextpage})

@require_http_methods(["POST"])
def dologin(request):
	username = request.POST['username']
	password = request.POST['password']
	user = authenticate(username=username, password=password)
	if user is not None:
		login(request, user)
		# Redirect to a success page.
		return redirect('/tadmin/')
	else:
		# Return an 'invalid login' error message.
		return redirect('/404pagenotfound')	

def category(request, urlSuffix, id):
	print(urlSuffix)
	category = Category.objects.get(url=urlSuffix, pk=id)

	if category.hide == 'T':
		return redirect('/404pagenotfound')

	sub_category = SubCategory.objects.all().filter(category=category)
	print(sub_category)
	categories = Category.objects.all()
	return render(request, 'category.html',{'category':category,'category_list':categories,'categoryUrl':urlSuffix,'sub_category_list':sub_category})

def subCategory(request, urlSuffix, category, id):
	print(urlSuffix)
	sub_category = SubCategory.objects.get(url=urlSuffix ,pk=id)

	if sub_category.hide == 'T':
		return redirect('/404pagenotfound')

	sub_category_list = SubCategory.objects.all().filter(category=sub_category.category)
	print(sub_category)
	content = Content.objects.all().filter(category=sub_category)
	if len(content) > 0:
		content = content[0]
	print(content)
	categories = Category.objects.all()
	return render(request, 'content.html',{'category_list':categories,'categoryUrl':urlSuffix,'sub_category_list':sub_category_list,'content':content})

def pageNotFound(request):
	return render(request, '404.html')

@require_http_methods(["POST"])
@csrf_exempt
def addcategory(request):
	categoryname = request.POST['category']
	categoryType = request.POST['type']
	parentId = request.POST['parentId']
	url = request.POST['url']
	
	if parentId == '-1':
		category = Category.objects.create(name=categoryname, url=url, hide='F')
	elif categoryType=='subcategory':
		category = Category.objects.get(pk=parentId)
		sub_category = SubCategory.objects.create(name=categoryname,url=url,category=category, hide='F')

	
	
	data = serializers.serialize('json', [category])
	
	return HttpResponse(data) 

@require_http_methods(["POST"])
@csrf_exempt
def addcontent(request):
	contenttitle = request.POST['title']
	content = request.POST['content']
	categoryId = request.POST['categoryId']
	url = request.POST['url']
	id = request.POST['id']
	
	contentOb = ''
	if id == '-1':
		category = SubCategory.objects.get(pk=categoryId)
		contentOb = Content.objects.create(title=contenttitle, content=content, url=url, category=category)
		print('Content created')
	else:
		contentOb = Content.objects.filter(pk=id).update(title=contenttitle, content=content)
		print('Content updated')
	
	
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

@require_http_methods(["GET"])
def getContentByCategoryId(request):
	categoryId = request.GET['categoryId']
	print(category)
	subCategory = SubCategory.objects.get(pk=categoryId)
	content = Content.objects.get(category=subCategory)
	data = serializers.serialize('json', [content],fields=('title','content','url','category'))
	print(data)
	
	return HttpResponse(data)

@require_http_methods(["GET"])
def hideShowNode(request, type, id, option):
	print(id)
	print(option)
	if type == 'category':
		Category.objects.filter(pk=id).update(hide=option)
		category = Category.objects.get(pk=id)
		subCategory_list = SubCategory.objects.filter(category=category)
		for subCategory in subCategory_list:
			print(subCategory.name)
			SubCategory.objects.filter(pk=subCategory.pk).update(hide=option)
	if type == 'subcategory':
		SubCategory.objects.filter(pk=id).update(hide=option)
	return HttpResponse(option)





