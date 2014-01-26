# huddoc

huddoc is a chrome extension that allows you to superimpose information over your website. It's intended to show additional contextual information to an organization's internal staff to aid in routing site issues and generally understanding how a website is composed. "huddoc" is a portmanteau of "heads-up display" and "documentation".

## Goals / Features

- Implement a contextual overlay that can highlight elements on the page (via outline or similar) and provide an information popup.
- Implement a DSL for describing conditions to show messaging, and what messaging to show.
- Allow rulesets for the extension to be loaded from external sources.

## Ruleset DSL

The ruleset DSL is used to specify the messages you want to display, and where. It's controlled via a JSON file.

```json
{
    "mask":"https://.*example\\.com.*",
    "selector":"#login",
    "title":"Account",
    "description":"Email us if you need an account",
    "email":"admins@example.com",
    "url":"https://.*example\\.com.*/account-help"
}
```

- `mask` is a regular expression which must match the current URL in order for the rule to activate.
- `selector` is a jQuery-style CSS selector that identifies an object on the page that will be covered with an overlay.
- `title` (optional) is a heading for the message box
- `description` (optional) is the body of the message box
- `email` (optional) will create a mailto: link when clicked
- `url` (optional) will create an info link to another page
