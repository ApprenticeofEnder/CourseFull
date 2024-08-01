![CourseFull: Live your education to the fullest.](assets/CourseFull%20Banner.png)

# CourseFull
>
> How students know where they're at from the *first* minute, not the *last*.

There's a long-running meme of calculating what you need to get on a final exam to pass a course.

But if you're doing that to know what you need at the last minute, why not do it from minute one? For *all* of your deliverables, across *all* of your courses, and update it throughout the semester?

Making a spreadsheet for that is a lot of work. **That's what CourseFull is for.**

## Contents

- [About This Project](#about-this-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Local Development](#local-development)

## About This Project

CourseFull actually has its roots in cuHacking 2021. My team and I took an idea I had for a learning management system and managed to win first in the Educational category with a very scuffed PHP demo app!

The idea? Take those calculations you do to figure out what you need to get on a final exam to pass a course and use them as continuous goal tracking metrics.

Years passed and we planned on taking this further. However, as I progressed in my web dev and security journey, I realized one thing: PHP . . . wasn't great.

Not only was our workflow during the hackathon majorly inefficient, using PHP lended itself to a lot of issues with scale, human error, security, you name it.

Eventually the project fizzled out. My teammates moved onto other things. But CourseFull stuck around for years, until April of 2024.

I had tried starting the project back up in November 2023, but school priorities took over, and I wasn't about to commit to a Java and Angular app for who knew how long.

In April, something clicked. I buckled down, trying to learn React and Ruby on Rails alongside my summer internship where I was doing zero full stack web dev. 3 months later at the time of writing, here we are.

## Tech Stack

- React/NextJS for front end
- Ruby on Rails for API
- Supabase for Postgres database and authentication
- Rspec for API testing
- Vitest and Playwright for front end testing
- TailwindCSS for front end styling
- HeadlessUI/NextUI for front end components
- Docker and Docker Compose for consistent, low-hassle deployments

### "Why XYZ?"

**React/NextJS**: I started this project when I realized I had only dug into React once for anything resembling a serious project, that being my Honours Thesis. I wanted to fix that!

**Ruby on Rails**: Similar to the above, but I had also interviewed at Wealthsimple (did not get in despite making it to final round) and realized I was missing out on potential opportunities in companies that needed Ruby experience.

**Supabase**: I wanted a managed database and didn't want to deal with implementing authentication myself -- that stuff is a pain at the best of times.

**RSpec**: This one was on a whim, but I saw that a lot of documentation assumed a project was using RSpec. Wound up really enjoying Behaviour Driven Development (BDD).

**Vitest**: Jest was giving me errors I didn't like. Realized NextJS was using Vite. Natural switch!

**Playwright**: Heard some good things about it, decided to give it a shot, loved it.

**TailwindCSS**: Have used it for ages, didn't want to go without.

**HeadlessUI/NextUI**: Knowing React tends to have you reinvent the wheel on a lot of things, I decided to use common front end components someone else had built already, and then modify them for my own needs.

## Features

### Goal Setting Across The Semester

Set a goal and see it reflect in your semester's average throughout the term!

### No-Frills Progress Tracking

See what deliverables you've completed, and how you did, at a glance!

### Simple Ticketing System

TODO

### Secure Stripe Payments

TODO

### Secure Authentication with Supabase

TODO

## Local Development

This section will become available when the project officially launches and an open source license is available. Sit tight!
