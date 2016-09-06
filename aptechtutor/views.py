from django.http import HttpResponse
from django.shortcuts import render, RequestContext,render_to_response
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.http import Http404,HttpRequest,HttpResponse,HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_http_methods

from django.core import serializers

import json

from aptechtutor.models import Category,SubCategory

def index(request):
	#conn = getConnection()
	return render(request, 'index.html')

def tadmin(request):
	return render(request,'tadmin.html')

@require_http_methods(["POST"])
@csrf_exempt
def addcategory(request):
	categoryname = request.POST['category']
	categoryType = request.POST['type']
	parentId = request.POST['parentId']
	
	if parentId == -1:
		category = Category.objects.create(name=categoryname)
	elif categoryType=='subcategory':
		category = Category.objects.get(pk=parentId)
		sub_category = SubCategory.objects.create(name=categoryname,category=category)

	
	
	data = serializers.serialize('json', [category])
	
	return HttpResponse(data) 

@require_http_methods(["GET"])
def getcategory(request):
	categories = Category.objects.all()
	names = set()
	
	serialized_data = serializers.serialize("json", categories, fields=('name'))

	return HttpResponse(serialized_data, content_type="application/json")


@require_http_methods(["GET"])
def getsubcategory(request):
	
	names = set()
	
	names.add({'id':12,'title': u'Zara', 'isLazy':'true'});
	return HttpResponse(json.dumps(list(names)), content_type="application/json")

