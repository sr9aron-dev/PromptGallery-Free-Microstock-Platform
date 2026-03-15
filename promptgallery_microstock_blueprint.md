# PromptGallery -- Free Microstock Platform

Domain: https://promptgallery.fun/

Technical Architecture Plan (Developer Blueprint) Version: 1.0

------------------------------------------------------------------------

# 1. Project Goal

Build a **free microstock website** similar to Pixabay but focused on
**free assets and prompts**.

Key goals:

-   100% free assets (Public Domain / CC0 / permissive licenses)
-   SEO optimized pages for each asset
-   Fully static frontend for speed
-   Free infrastructure stack
-   Scalable to **100k+ assets**
-   Safe for **Google AdSense**
-   Automatic sitemap generation
-   Admin dashboard for uploading assets

------------------------------------------------------------------------

# 2. Tech Stack

Frontend Hosting Netlify

Image Storage GitHub repository

Image CDN jsDelivr

Database Firebase Firestore

Authentication Firebase Auth

Search Firestore query + client filtering

Admin Panel Custom dashboard (protected route)

------------------------------------------------------------------------

# 3. System Architecture

User Browser ↓ Netlify (Frontend + CDN) ↓ Firebase (Database + Auth +
API) ↓ GitHub Repo (Image storage) ↓ jsDelivr CDN (Image delivery)

------------------------------------------------------------------------

# 4. Repository Structure

/project-root

frontend components pages styles utils services

admin dashboard upload edit

functions sitemap generator metadata tools

public assets icons logo

------------------------------------------------------------------------

# 5. URL Structure

Home /

Search /search?q=keyword

Photo Page /photo/{slug}

Category Page /category/{category}

Tag Page /tag/{tag}

Admin /admin/login /admin/dashboard

------------------------------------------------------------------------

# 6. Page List

Main pages

Home Search Photo Page Category Page Tag Page Collections Blog

Legal pages

About About Us FAQ License Summary Terms of Service Privacy Policy
Cookies Policy

------------------------------------------------------------------------

# 7. Homepage Layout

Hero search bar

Trending assets

Latest assets

Popular categories

Featured collections

Footer navigation

------------------------------------------------------------------------

# 8. Photo Page Layout

Image preview

Download button

Metadata section

Description (200--400 words)

Keyword list

Category link

Related images

Usage tips

License information

------------------------------------------------------------------------

# 9. Metadata Model (Inspired by Adobe Stock)

Photo Object

id title slug description keywords\[\] category orientation color
people_count author license width height upload_date image_url
thumbnail_url views downloads

------------------------------------------------------------------------

# 10. Categories

Animals Architecture Business Food Nature People Technology Backgrounds
Objects Travel Lifestyle Abstract Education Health Sports Industry
Environment

------------------------------------------------------------------------

# 11. Firebase Database Schema

Collection: photos

id title slug description keywords category imageUrl thumbUrl width
height orientation uploadDate views downloads

Collection: categories

name slug description

Collection: tags

tag count

------------------------------------------------------------------------

# 12. Image Storage Strategy

Images uploaded to GitHub repository

Example path

/images/{category}/{filename}.jpg

CDN delivery via jsDelivr

Example URL

https://cdn.jsdelivr.net/gh/username/repo@main/images/file.jpg

------------------------------------------------------------------------

# 13. Upload Workflow

Admin uploads image

Image pushed to GitHub repo

CDN URL generated

Metadata saved in Firebase

Slug generated

Sitemap updated

Page becomes searchable

------------------------------------------------------------------------

# 14. Admin Dashboard

Admin Login

Dashboard statistics

Upload new asset

Edit metadata

Delete asset

View analytics

------------------------------------------------------------------------

# 15. SEO Strategy

Each asset has a dedicated page.

SEO fields

title meta description slug alt text structured data

Example page title

Free Business Team Meeting Photo -- PromptGallery

------------------------------------------------------------------------

# 16. Avoid Low Content (AdSense)

Every asset page must include:

Description 200--400 words

Keyword explanation

Usage suggestions

Related assets

Internal links

------------------------------------------------------------------------

# 17. Blog Strategy

Example posts

Best Free Business Images

How to Use Free Stock Photos in Marketing

Free Background Images Guide

Blog improves SEO authority.

------------------------------------------------------------------------

# 18. Dynamic Sitemap

Endpoint

/sitemap.xml

Includes

Home Categories Tags Photo pages Blog posts

Automatically regenerated when:

New asset uploaded Asset removed Metadata edited

------------------------------------------------------------------------

# 19. Performance Optimization

Use WebP or AVIF images

Lazy loading images

Responsive image sizes

CDN caching

Preload hero images

------------------------------------------------------------------------

# 20. Responsive Grid

Desktop 6 columns

Tablet 4 columns

Mobile 2 columns

------------------------------------------------------------------------

# 21. Security

Admin route protected with Firebase Auth

Upload validation

Image size validation

Rate limiting

------------------------------------------------------------------------

# 22. Monetization Plan

Stage 1 Google AdSense

Stage 2 Affiliate links to stock sites

Stage 3 Sponsored assets

------------------------------------------------------------------------

# 23. Branding

Site name PromptGallery

Tagline

Free Creative Assets & Prompts for Everyone

Design style

Minimalist White background Large search bar Grid image layout

------------------------------------------------------------------------

# 24. Scaling Strategy

10k assets

≈ 10k pages

100k assets

≈ 100k pages

With CDN + static pages this is scalable.

------------------------------------------------------------------------

# 25. Development Roadmap

Phase 1 Frontend design

Phase 2 Firebase integration

Phase 3 Admin dashboard

Phase 4 Image upload system

Phase 5 Search system

Phase 6 SEO optimization

Phase 7 Sitemap automation

Phase 8 AdSense integration

------------------------------------------------------------------------

# 26. Launch Checklist

Domain connected to Netlify

Firebase configured

GitHub image repo ready

Admin dashboard tested

SEO meta tags implemented

Sitemap submitted to Google Search Console

------------------------------------------------------------------------

# End of Document
