# Quick Database Setup with Neon

## Step 1: Create Free Neon Database (2 minutes)

1. Open your browser and go to: **https://neon.tech**

2. Click "Sign Up" and create an account (you can use GitHub to sign in)

3. After signing in, click "Create a Project"

4. Give it a name like "bloghub" and select a region close to you

5. Neon will show you a connection string that looks like:

   ```
   postgresql://username:password@ep-something-123.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

6. **COPY THIS ENTIRE CONNECTION STRING**

## Step 2: Update Your .env.local File

1. Open the file: `/Users/laxmanp/Downloads/internshipproject/.env.local`

2. Replace the DATABASE_URL line with your copied connection string:

   ```
   DATABASE_URL="postgresql://your-actual-connection-string-here"
   ```

3. Save the file

## Step 3: Set Up the Database

Open your terminal in the project folder and run:

```bash
# Push the schema to create tables
npm run db:push

# Add sample blog posts and categories
npm run db:seed
```

## Step 4: Restart the Dev Server

```bash
# Stop the current server (Ctrl+C if running)
# Then start it again
npm run dev
```

Now visit http://localhost:3000 - it should work! 🎉

---

## Alternative: Use Local PostgreSQL

If you have PostgreSQL installed locally:

1. Create a database:

   ```bash
   createdb blogging_platform
   ```

2. Update `.env.local`:

   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/blogging_platform"
   ```

3. Run setup:
   ```bash
   npm run db:push
   npm run db:seed
   npm run dev
   ```

---

## Troubleshooting

### "Connection refused" error

- Make sure your database is running
- Check the connection string is correct
- Verify there are no extra spaces

### "Cannot push schema" error

- Make sure you copied the ENTIRE connection string including `?sslmode=require`
- Check your internet connection (for Neon)

### Still having issues?

The connection string should look exactly like this format:

```
DATABASE_URL="postgresql://user:pass@host.region.neon.tech/dbname?sslmode=require"
```

No spaces, wrapped in quotes, starting with `postgresql://`
