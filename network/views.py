from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse

from .models import User, Post, Follow
from .forms import PostForm


def index(request):
    posts = Post.objects.all().order_by('-created_at')
    form = PostForm()

    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return redirect("index")

    return render(request, "network/index.html", {"posts": posts, "form": form})

def create_post(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return redirect("index")
    else:
        form = PostForm()

    return render(request, "network/create_post.html", {"form": form})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def user_view(request, username):
    targetUser  = User.objects.get(username=username)
    posts = Post.objects.filter(user=targetUser)
    followers = Follow.objects.filter(following=targetUser)
    following = Follow.objects.filter(follower=targetUser)
    is_following = False
    if request.user.is_authenticated:
        is_following = Follow.objects.filter(follower=request.user, following=targetUser).exists()

    return render(request, "network/user_details.html", {"targetUser": targetUser, "posts": posts, "followers": followers, "following": following, "is_following": is_following})

@login_required
def toggle_follow(request, username):
    user_to_follow = User.objects.get(username=username)
    action = request.POST.get('action', '')

    if action == 'follow':
        Follow.objects.create(follower=request.user, following=user_to_follow)
    elif action == 'unfollow':
        Follow.objects.filter(follower=request.user, following=user_to_follow).delete()

    return redirect('user_details', username=username)

@login_required
def following(request):
    following_users = Follow.objects.filter(follower=request.user).values('following')
    posts = Post.objects.filter(user__in=following_users).order_by('-created_at')
    return render(request, 'network/following.html', {"posts": posts})