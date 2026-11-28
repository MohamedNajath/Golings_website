# GOALINGS website
React + TypeScript + Vite + Tailwind CSS + Framer Motion + React Router + React Hook Form + Zod.

    npm install
    npm run dev      # http://localhost:5173
    npm run build    # production build in dist/

Internship & Training system (pages, API, admin): see INTERNSHIP_SETUP.md. The /server folder is a separate Node API (npm install inside it).

Routes: /internship-training , /internship-training/:slug , /admin/internships , /privacy-policy , /terms-and-conditions , / , /about , /services , /services/:slug (7 pages) , /portfolio , /portfolio/:slug , /contact
Edit content in `src/data/services.ts` and `src/data/projects.ts`.
Projects are SAMPLES: replace them with real work. Contact form: connect `onSubmit` in `src/pages/Contact.tsx` to your Spring Boot API.
For SPA hosting, route all paths to index.html.
