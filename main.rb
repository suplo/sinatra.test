require 'rubygems'
require 'sinatra'
# require 'sinatra/reloader' if development?

class MainApp < Sinatra::Base
  # configure :development do
    # register Sinatra::Reloader
  # end

  set :public_folder, './pages'

  get '/hello' do
    'Hello Dat. Have a nice day'
  end

  get '/' do
    send_file './pages/index.html'
  end

  get '/unified' do
    send_file './pages/unified.html'
  end

  get '/has_html' do
    send_file './pages/has_html.html'
  end

  get '/has_body' do
    send_file './pages/has_body.html'
  end

  get '/has_head' do
    send_file './pages/has_head.html'
  end

  get '/ignore' do
    send_file './pages/ignore.html'
  end

  get '/very_simple_ignore' do
    send_file './pages/very_simple_ignore.html'
  end

  get '/simple_ignore' do
    send_file './pages/simple_ignore.html'
  end

  get '/form' do
    send_file './pages/form.html'
  end

  get '/lemon' do
    send_file './pages/lemon.html'
  end

  get '/unicorn' do
    send_file './pages/unicorn.html'
  end
end
