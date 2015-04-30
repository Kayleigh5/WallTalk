require 'test_helper'

class StaticPagesControllerTest < ActionController::TestCase
  test "should get home" do
    get :home
    assert_response :success
  end

  test "should get step1" do
    get :step1
    assert_response :success
  end

  test "should get step2" do
    get :step2
    assert_response :success
  end

  test "should get step3" do
    get :step3
    assert_response :success
  end

end
