import webapp2
import os
import re
import logging
import jinja2
from google.appengine.api import memcache

from google.appengine.ext import db

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir), autoescape=True)

class BaseHandler(webapp2.RequestHandler):
	'''Parent class for all handlers, shortens functions'''
	def write(self, content):
		return self.response.out.write(content)

	def rget(self, name):
		'''Gets a HTTP parameter'''
		return self.request.get(name)

	def render(self, template, params={}):
		template = jinja_env.get_template(template)
		self.response.out.write(template.render(params))

	def set_cookie(self, cookie):
		self.response.headers.add_header('Set-Cookie', cookie)

	def delete_cookie(self, cookie):
		self.response.headers.add_header('Set-Cookie', '%s=; Path=/' % cookie)

class IndexHandler(BaseHandler):
	def get(self):		
		self.render('index.html')

class AboutHandler(BaseHandler):
	def get(self):
		self.render('about.html')

class SoundCloudHandler(BaseHandler):
	def get(self):
		self.render('soundcloud-testing.html')

app = webapp2.WSGIApplication([('/', IndexHandler),
							   ('/about', AboutHandler),
							   ('/soundcloud', SoundCloudHandler)
							  ],
                              debug=True)
