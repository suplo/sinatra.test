require 'rubygems'
require 'sinatra'
# require 'sinatra/reloader' if development?

class MainApp < Sinatra::Base
  # configure :development do
    # register Sinatra::Reloader
  # end

  set :public_folder, './pages'

  get '/' do
    'Hello @wovn'
  end

  get '/unified' do
    send_file './pages/unified.html'
  end
end
