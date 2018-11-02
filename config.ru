require './main.rb'
require 'wovnrb'

use Wovnrb::Interceptor, {
  :project_token => 'SHAFdN',
  :wovn_dev_mode => true,
  :test_mode => true,
  :api_url => 'http://dev-wovn.io:4000/v0',
  :api_timeout_seconds => 5,
  :supported_langs => ['en', 'vi', 'ja']
}

run MainApp
