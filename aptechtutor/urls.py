"""aptechtutor URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from . import views 

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^tadmin/', views.tadmin, name='tadmin'),
    url(r'^login/$', views.login, name='login'),
    url(r'^category/(?P<urlSuffix>\w+)/(?P<id>\w+)/$', views.category, name='category'),
    url(r'^category/(?P<category>\w+)/(?P<urlSuffix>\w+)/(?P<id>\w+)/$', views.subCategory, name='subCategory'),
    url(r'^hideshownode/(?P<type>\w+)/(?P<id>\w+)/(?P<option>\w+)/$', views.hideShowNode, name='hideShowNode'),
	url(r'addcategory/', views.addcategory, name='addcategory'),
    url(r'addcontent/', views.addcontent, name='addcontent'),
	url(r'^getcategory/(?P<id>\w+)/$', views.getcategory, name='getcategory'),
	url(r'getsubcategory/', views.getsubcategory, name='getsubcategory'),
    url(r'getcontentbycategoryid/', views.getContentByCategoryId, name='getContentByCategoryId'),
    url(r'404pagenotfound/', views.pageNotFound, name='404PageNotFound'),
    url(r'^admin/', admin.site.urls),
]
