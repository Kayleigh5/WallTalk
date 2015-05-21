class StaticPagesController < ApplicationController
  def home
  end

  def step1
  end

  def step2
  end

  def step3
  end

def login
end

private

def nested_hash_values(obj,key)
  r = []  
  if obj.is_a?(Hash)        
    r.push(obj[key]) if obj.key?(key) 
    obj.each_value { |e| r += nested_hash_values(e,key) }
  end
  if obj.is_a?(Array)
    obj.each { |e| r += nested_hash_values(e,key) }
  end
  r
end

helper_method :nested_hash_values
end
