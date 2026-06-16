# Routes

This project uses file-based routing. Every `.tsx` file in this directory is a
route. Do not create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx`; those are conventions from other frameworks. The root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` |
| `posts/{-$category}.tsx` | `/posts/:category?` |
| `files/$.tsx` | `/files/*` |
| `_layout.tsx` | layout route |
| `__root.tsx` | app shell |

`routeTree.gen.ts` is auto-generated. Do not edit it by hand.
