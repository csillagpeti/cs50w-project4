
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_post", views.create_post, name="create_post"),
    path("update_post", views.update_post, name="update_post"),
    path("user/<str:username>", views.user_view, name="user_details"),
    path("user/<str:username>/toggle_follow", views.toggle_follow, name="toggle_follow"),
    path("following", views.following, name="following"),
    path("toggle_like", views.toggle_like, name="toggle_like")
]
