This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AI Integration

The app already includes an API route at `src/app/api/analyze-match/route.ts` that can use OpenAI to power matchup analysis.

To enable AI integration with Grok via the Groq-compatible endpoint:
1. Create a `.env.local` file in the project root.
2. Add your Groq key, or reuse an existing OpenAI key. Do not need quotes around the value:

```env
GROQ_API_KEY=sk-...
# or
OPENAI_API_KEY=sk-...
```

3. Set the model to Grok:

```env
GROQ_MODEL=grok-1
```

4. Run the development server with:

```bash
npm run dev
```

The API will now ask the model to return exact JSON keys: `ta pedindo`, `dificuldade`, `win rate`, `setup`, `toda a build`, `games` e `dicas`.

If neither `GROQ_API_KEY` nor `OPENAI_API_KEY` is configured, or if the request fails, the app falls back to the static matchup generator in `src/app/data/championsData.ts`.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
