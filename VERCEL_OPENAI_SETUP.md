# Vercel Environment Variables Setup Guide

## Overview
The GPT API feature requires the `OPENAI_API_KEY` environment variable to be set on Vercel deployment.

## Steps to Set Up OpenAI API on Vercel

### 1. Get Your OpenAI API Key
- Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Sign in or create an account
- Click "Create new secret key"
- Copy the key (keep it safe!)

### 2. Add to Vercel Dashboard
- Go to your Vercel project: [vercel.com/dashboard](https://vercel.com/dashboard)
- Find your project "medical-appointment-booking-app-frontend"
- Click on it → Settings → Environment Variables
- Click "Add New"
- Fill in:
  - **Name**: `OPENAI_API_KEY`
  - **Value**: Paste your OpenAI API key
  - **Environments**: Select "Production" and "Preview"
- Click "Save"

### 3. Redeploy on Vercel
- Go to Deployments tab
- Click the latest deployment or use "Redeploy"
- Wait for build to complete (5-10 minutes)
- Test the GPT feature on your deployed site

## Verification

### Local Development
The .env.local file already has it set, so it works locally.

### Production (Vercel)
Add the key via dashboard → Environment Variables as shown above

### Preview Deployments
Make sure to select "Preview" environment when setting the variable.

## Troubleshooting

**If still getting errors:**
1. Clear Vercel cache: Settings → Deployment Shield → Clear Cache & Redeploy
2. Verify key is correctly pasted (no extra spaces)
3. Check OpenAI API key has balance/credits

**To verify it's working:**
- Check Vercel logs: Deployments → Runtime logs
- Look for successful API responses or error messages from OpenAI

## Cost
- OpenAI GPT-4o-mini is very cheap (~$0.00015 per 1K input tokens)
- Set usage limits in OpenAI dashboard to prevent overspending
