# PostHog post-wizard report

The wizard has completed a deep integration of your portfolio with PostHog analytics. A new `posthog.js` module was created to initialize the browser SDK (`posthog-js`) using environment variables. Six events were instrumented across four components to track the key visitor interactions: project exploration, contact engagement, social outreach, and language switching. Exception autocapture is enabled globally via the SDK init options.

| Event | Description | File |
|---|---|---|
| `project opened` | User clicks a project row to open the detail modal | `components/work.jsx` |
| `project live url clicked` | User clicks the live URL link inside the project detail modal | `components/project-modal.jsx` |
| `contact email clicked` | User clicks the email address link in the contact section | `components/contact.jsx` |
| `social link clicked` | User clicks a social media link in the contact section | `components/contact.jsx` |
| `language changed` | User switches the portfolio language using the language toggle | `components/nav.jsx` |
| `nav item clicked` | User clicks a navigation link to jump to a section | `components/nav.jsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/504560/dashboard/1821968)
- [Project views over time](https://us.posthog.com/project/504560/insights/Mscqmzdg)
- [Top projects by views](https://us.posthog.com/project/504560/insights/39cfUq8E)
- [Contact engagement funnel](https://us.posthog.com/project/504560/insights/xrdLfaNc)
- [Social links by platform](https://us.posthog.com/project/504560/insights/QH8N58Bv)
- [Language preference](https://us.posthog.com/project/504560/insights/mBwEYvKM)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
