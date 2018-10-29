require './main.rb'
require 'wovnrb'

use Wovnrb::Interceptor, {
  :project_token => 'SHAFdN',
  :wovn_dev_mode => true,
  :test_mode => true
}

run MainApp
