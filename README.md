<img src="https://i.loli.net/2020/08/18/HSa25hE1bdZ9gCM.jpg" />
<div align="center">
  <p>A feature-rich serverless comment library powered by Supabase</p>
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

- Nexment for Vue.js / Web Component (outdated, still based on Leancloud) [https://github.com/ttttonyhe/nexment-vue](https://github.com/ttttonyhe/nexment-vue)
- Nexment for React.js [https://github.com/ttttonyhe/nexment](https://github.com/ttttonyhe/nexment)

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
}

;<Nexment config={config} />
```

<br/>

## Use Nexment in Next.js

Create a wrapper component:

```tsx
import Nexment from "nexment"

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
	}

	return <Nexment config={config} />
}

export default NexmentComponent
```

Import it using `next/dynamic` to disable SSR:

```tsx
import dynamic from "next/dynamic"

const NexmentDiv = dynamic(() => import("./NexmentComponent"), {
	ssr: false,
})

const Page = () => {
	return (
		<div>
			<NexmentDiv />
		</div>
	)
}

export default Page
```

<br/>

## Email Notifications

Nexment supports email notifications when someone replies to a comment. To enable this, you need to:

1. Set `features.replyEmailNotifications` to `true` in your Nexment config
2. Deploy one of the email endpoint handlers below
3. Point `email.endpoint` in your config to the deployed URL

```jsx
const config = {
	features: {
		replyEmailNotifications: true,
	},
	email: {
		endpoint: "https://your-domain.com/api/nexment-email",
	},
	// ... other config
}
```

### Prerequisites

All handlers use [Resend](https://resend.com) to send emails. You'll need:

- A Resend account and API key
- A verified sending domain (or use Resend's sandbox for testing)

| Environment Variable  | Description                                            | Required             |
| --------------------- | ------------------------------------------------------ | -------------------- |
| `RESEND_API_KEY`      | Your Resend API key                                    | Yes                  |
| `RESEND_FROM_ADDRESS` | Sender address (e.g. `Nexment <no-reply@example.com>`) | No (has default)     |
| `ALLOWED_ORIGIN`      | CORS allowed origin                                    | No (defaults to `*`) |

### Option A — Next.js App Router

Copy [`server/nextjs/app-router.ts`](./server/nextjs/app-router.ts) into your Next.js project as a route handler, for example at `app/api/nexment-email/route.ts`.

### Option B — Next.js Pages Router

Copy [`server/nextjs/pages-router.ts`](./server/nextjs/pages-router.ts) into your Next.js project as an API route, for example at `pages/api/nexment-email.ts`.

### Option C — Cloudflare Worker

Deploy [`server/worker.js`](./server/worker.js) as a Cloudflare Worker. Set `RESEND_API_KEY` and `RESEND_FROM_ADDRESS` as secrets via `wrangler secret put`.

<br/>

## TypeScript Support

Nexment has full TypeScript type-checking support.

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
- leancloud: {
- appId: "xxx",
- appKey: "xxx",
- serverURL: "https://xxx",
- },
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

## Contribution

File an issue whenever you encounter a problem, pull requests are always welcomed.
