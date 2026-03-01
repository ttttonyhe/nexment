<img src="https://i.loli.net/2020/08/18/HSa25hE1bdZ9gCM.jpg" />
<div align="center">
  <p>A feature-rich serverless comment library powered by Supabase</p>
  <a href="https://github.com/ttttonyhe/nexment/actions?query=workflow%3ACI">
    <img src="https://github.com/ttttonyhe/nexment/workflows/CI/badge.svg" alt="github ci">
  </a>
  <a href="https://www.npmjs.com/package/nexment">
    <img src="https://img.shields.io/npm/dw/nexment" alt="npm downloads">
  </a>
  <a href="https://www.npmjs.com/package/nexment">
    <img src="https://img.shields.io/npm/l/nexment" alt="license">
  </a>
</div>

<br/>

<br/>

## See also
+ Nexment for Vue.js / Web Component (outdated, still based on Leancloud) [https://github.com/ttttonyhe/nexment-vue](https://github.com/ttttonyhe/nexment-vue)
+ Nexment for React.js [https://github.com/ttttonyhe/nexment](https://github.com/ttttonyhe/nexment)

<br/>

## Installation

### Part I - Supabase

1. Create a project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`migration/schema.sql`](./migration/schema.sql) to create the `nexment_comments` table
3. Go to **Authentication** → **Providers** → **Email** and disable "Confirm email" (required for admin registration)
4. Go to **Project Settings** → **API** and copy your **Project URL** and **Publishable** key

<br/>

### Part II - Nexment

Add Nexment to your project:
```shell
npm install nexment
```

Import and use:
```jsx
import Nexment from "nexment"

const config = {
  pageKey: "xxx", // optional, defaults to window.location.pathname
  features: {
    linkInput: true,
    replyListModal: true,
    replyEmailNotifications: true,
    descriptionTag: true,
  },
  supabase: {
    url: "https://your-project.supabase.co",
    anonKey: "your-anon-key",
  },
  admin: {
    name: "xxx",
    email: "xxx@xxx.xxx",
  },
  blackList: [
    { name: "xxx", email: "xxx", keyword: "xxx", link: "xxx" },
    { keyword: "xxx" },
  ],
};

<Nexment config={config} />
```

<br/>

## Use Nexment in Next.js

Create a wrapper component:
```tsx
import Nexment from "nexment";

const NexmentComponent = () => {
  const config = {
    pageKey: "xxx",
    features: {
      linkInput: true,
      replyListModal: true,
      replyEmailNotifications: true,
      descriptionTag: true,
    },
    supabase: {
      url: "https://your-project.supabase.co",
      anonKey: "your-anon-key",
    },
    admin: {
      name: "xxx",
      email: "xxx@xxx.xxx",
    },
  };

  return <Nexment config={config} />;
};

export default NexmentComponent;
```

Import it using `next/dynamic` to disable SSR:
```tsx
import dynamic from "next/dynamic";

const NexmentDiv = dynamic(() => import("./NexmentComponent"), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <NexmentDiv />
    </div>
  );
};

export default Page;
```

<br/>

## Migrating from LeanCloud

If you were previously using the LeanCloud-based version of Nexment, follow these steps to migrate your data to Supabase:

### 1. Export your LeanCloud data

Go to your LeanCloud app → **Data Storage** → **Import/Export** → **Export** to download a backup. The backup will contain a `nexment_comments.0.jsonl` file with all your comments.

### 2. Set up the Supabase table

Follow the [Supabase setup instructions](#part-i---supabase) above to create the `nexment_comments` table.

### 3. Run the migration script

```shell
node migration/leancloud-to-supabase.mjs <path-to-backup-dir> <output.sql>
```

For example:
```shell
node migration/leancloud-to-supabase.mjs ./my-backup ./seed.sql
```

This reads the `nexment_comments.0.jsonl` file from the backup directory and generates a `seed.sql` file containing INSERT statements for all your comments.

### 4. Import the data

Paste the contents of the generated `seed.sql` file into the Supabase **SQL Editor** and run it. All your comments (including reply threading) will be preserved.

### 5. Update your config

Replace the `leancloud` config with `supabase`:

```diff
  const config = {
-   leancloud: {
-     appId: "xxx",
-     appKey: "xxx",
-     serverURL: "https://xxx",
-   },
+   supabase: {
+     url: "https://your-project.supabase.co",
+     anonKey: "your-anon-key",
+   },
    admin: {
      name: "xxx",
      email: "xxx@xxx.xxx",
    },
  };
```

An example LeanCloud backup is included in the [`backup/`](./backup) directory for reference.

<br/>

## TypeScript Support
Nexment has full TypeScript type-checking support.

<br/>

## Contribution
File an issue whenever you encounter a problem, pull requests are always welcomed.
