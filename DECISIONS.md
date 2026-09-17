# Decisions

Had a lot of fun with the assignment!

I built a proof-of-concept agentic storefront. There are three parts to the demo:

- **Admin configurator:** an onboarding flow where (non-technical) users choose what kind of AI experiences they want to support and configure them through chat.
- **Noord:** a webshop mockup for a menswear fashion brand.
- **Volta:** a webshop mockup for a fitness nutrition brand.

Changes made in the configurator are persisted locally to the storefronts. It should be functional: the agents are aware of the product catalogue and what's in your cart, to help users make shopping decisions and ask questions.

## How I thought about the merchant, and what they control

I've chosen to go with three surface areas for the agentic storefront: AI-enabled search, product help, and the classic omnipresent chat bubble. Letting merchants choose where they want AI in their product puts them in control and lets them decide on the types of experiences they offer users.

## How the agent stays looking right across brands

I think it's important that merchants have a great deal of customisability over the widgets. But to make sure the experience feels holistic across brands, choices are deterministic. You can't inject CSS or anything. In the past, having many options would have meant terrible UX due to mega forms; by putting a sleek chat interface in front of that massive schema it is actually fun to design it via chat, and it looks good across different styles.

## What the AI tooling suggested that I overrode, and why

Design still requires a lot of iteration, even with the best model. What it comes up with the first time around is usually poor and instantly recognisable as "designed by AI", so a lot of those things you have to challenge and steer. In terms of overall product, AI was very biased towards jargon like "launcher" for these chat components, which I don't think end users would be familiar with. So I tried to make it approachable to someone without much domain expertise.

## What I cut for time

Previews that show the actual sites in the admin would have been very nice. But during onboarding we wouldn't have those controls available, so I decided to focus on the onboarding without on-site previews.

## The weakest part of what I shipped

Some of the technical aspects around how you'd actually connect features like AI search are a bit ill-defined currently. For some features you'd have to go further than a body tag. There's room for improvement there.

## What I would do with another hour

- A lot of clean up and polish!
- Better product previews and bespoke UI in the chats.
- Previews that show the actual sites in the admin.
