require 'rake'
require 'fileutils'
include FileUtils

# file lists

HTMLS = Rake::FileList['pages/*.html']
HAMLS = Rake::FileList['pages/*.html.haml']
STYLESHEETS = Rake::FileList['stylesheets/*.sass']
JAVASCRIPTS = Rake::FileList['javascripts/*.js']
IMAGES = Rake::FileList['images/*']

HTML_OUTPUT = HTMLS.map{ |f| f.gsub /^pages/, 'output' }
HAML_OUTPUT = HAMLS.map{ |f| f.gsub(/^pages/, 'output').gsub(/\.haml$/, '') }
PAGE_OUTPUT = HTML_OUTPUT + HAML_OUTPUT

STYLESHEET_OUTPUT = STYLESHEETS.map{ |f| "output/#{f.gsub(/\.sass/, '.css')}" }

JS_OUTPUT = JAVASCRIPTS.map{ |f| "output/#{f}" }
JAVASCRIPT_OUTPUT = JS_OUTPUT + ['output/javascripts/prototype.js']

# directories

directory 'output'
directory 'output/javascripts'
directory 'output/stylesheets'
directory 'output/images'

# hard-coded tasks

task :default => :build

desc "Build the site."
task :build => [:directories, :pages, :stylesheets, :javascripts, :images]

desc "Make output directories."
task :directories => ['output', 'output/javascripts', 'output/stylesheets', 'output/images']

desc "Build pages."
task :pages => PAGE_OUTPUT

desc "Build stylesheets."
task :stylesheets => STYLESHEET_OUTPUT

desc "Build javascripts."
task :javascripts => JAVASCRIPT_OUTPUT

desc "Set SASS to the compressed output style."
task :compress do
  $sass_mode = '-t compressed'
end

desc "Remove the output files."
task :clean do
  sh "rm -rf output"
end

# generated tasks

HTMLS.zip(HTML_OUTPUT) do |p|
  input, output = p
  file output => [input, 'output'] do
    cp input, output
  end
end

HAMLS.zip(HAML_OUTPUT) do |p|
  input, output = p
  file output => [input, 'output'] do
    sh 'haml', input, output
  end
end

STYLESHEETS.zip(STYLESHEET_OUTPUT) do |s|
  input, output = s
  file output => [input, 'output/stylesheets'] do
    sh 'sass', input, output
  end
end

JAVASCRIPTS.zip(JS_OUTPUT) do |j|
  input, output = j
  file output => [input, 'output/javascripts'] do
    cp input, output
  end
end

# specific files
file 'output/javascripts/prototype.js' => FileList['vendor/prototype/src/*', 'vendor/prototype/src/**/*', 'vendor/prototype/Rakefile'] do
  cd 'vendor/prototype' do
    sh 'rake', 'dist'
  end
  cp 'vendor/prototype/dist/prototype.js', 'output/javascripts/prototype.js'
end
