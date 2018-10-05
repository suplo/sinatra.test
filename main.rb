require 'rubygems'
require 'sinatra'

class MainApp < Sinatra::Base
  set :public_folder, './pages'

  get '/' do
    'Put this in your pipe & smoke it!'
  end

  get '/unified' do
    send_file './pages/unified.html'
  end
end
