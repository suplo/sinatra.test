require './main.rb'
require 'wovnrb'

use Wovnrb::Interceptor, {
  :project_token => 'rIkqL4', # unified_value dat@wovn.io
  #:project_token => 'W-jrmj', # fragmented_value dat+uvm@wovn.io
  :wovn_dev_mode => true,
  :test_mode => true,
  :api_url => 'http://dev-wovn.io:4000/v0',
  :api_timeout_seconds => 5,
  :supported_langs => ['en', 'vi', 'ja', 'nl', 'gl'],
  :default_lang => 'en',
  :translate_fragment => true,
  :url_pattern => 'path'
}

run MainApp
