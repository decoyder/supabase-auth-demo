1. Create a .env file and enter your Supabase Keys
    
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    DATABASE_URL=your-database-url
    DIRECT_URL=your-database-direct-url
    ```
    
    Instructions:
    
    1. [Setup Supabase project](https://dev.to/ojaswiat/secure-your-nextjs-app-email-google-authentication-with-supabase-postgresql-rls-and-triggers-4g5j)
    2. [Setup Supabase Database](https://dev.to/ojaswiat/secure-your-nextjs-app-email-google-authentication-with-supabase-postgresql-rls-and-triggers-21op)
2. Setup Google Cloud Project and get your OAuth Client ID and Secret.
    
    [Check out the instructions here](https://dev.to/ojaswiat/secure-your-nextjs-app-email-google-authentication-with-supabase-postgresql-rls-and-triggers-38nl)
    
3. Install node modules
    
    ```bash
    pnpm install
    ```
    
4. Run the prisma migrations
    
    ```bash
    pnpm migrate
    ```
    
5. Run the development server
    
    ```bash
    pnpm run dev
    ```
