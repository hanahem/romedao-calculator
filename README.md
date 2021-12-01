
# (🏛️,🏛️) RomeDAO Rewards Calculator

A rewards calculator for [RomeDAO](https://romedao.finance).

*It goes without saying: thanks to [Lobis](https://github.com/LobisHQWorkspace) for the inspiration.*  
*The calculator and app are not directly affiliated to RomeDAO. The calculator link is pinned in the Discord on #trading*

### How to deploy locally

Clone the repo and run:

```
yarn
yarn run dev
```

To start developing locally.
There are no env variables needed.

### How does it work

The `CalculatorContext` is where the data fetching happens. We use ethers to instantiate contracts, and call the various functions.  
Once we read and compute all the needed data, we send them through a `useCalculator` hook in the `Calculator.tsx` component.  
There the data is computed, formatted and displayed.

## Contribute

### How to contribute
There are some things that need to be fixed. And some refactoring is needed. You can either:
- Report a bug or an issue in [issues](https://github.com/hanahem/romedao-calculator/issues)
- Create an [issue](https://github.com/hanahem/romedao-calculator/issues) and announce that you are building the fix
- Directly create your pull request

To contribute, fork the repo on your profile, do your edits, and create a pull request here based on develop.

### Format
There's some format to follow when you create an issue, it so for better communication and experience.

**Issues template**
```
Title: Title of your issue
Type: Bug/Enhancement/Feature/Request/Other
Details: Details
I'm on it: Yes or No
```

**PRs template**
```
Title: Title of your issue
Type: Bug/Enhancement/Feature/Request/Other
Details: Details
Fixes: Link an issue if needed
```

## To Rome!
Contributions are open for everyone, don't hesitate to bring your knowledge, or to come here to enhance your skills.  
It is also a good repo to start learning web3 and front-end development.

Don't forget a look at [ROMEDAO](https://romedao.finance).
And (🏛️,🏛️)!!

## Socials
You can contact me through [Twitter](https://twitter.com/0xethercake) if needed.