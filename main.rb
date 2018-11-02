require 'rubygems'
require 'sinatra'
# require 'sinatra/reloader' if development?

class MainApp < Sinatra::Base
  # configure :development do
    # register Sinatra::Reloader
  # end

  set :public_folder, './pages'

  get '/' do
    send_file './pages/index.html'
  end

  get '/unified' do
    send_file './pages/unified.html'
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
end
