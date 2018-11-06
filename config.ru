require './main.rb'
require 'wovnrb'

use Wovnrb::Interceptor, {
  # :project_token => 'SHAFdN', # unified_value
  :project_token => 'RYmOcl', # fragmented_value
  :wovn_dev_mode => true,
  :test_mode => true,
  :api_url => 'http://dev-wovn.io:4000/v0',
  :api_timeout_seconds => 5,
  :supported_langs => ['en', 'vi', 'ja'],
  :default_lang => 'en',
  :translate_fragment => true
}

run MainApp
