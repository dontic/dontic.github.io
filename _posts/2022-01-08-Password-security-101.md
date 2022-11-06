---
title: "Password security 101"
categories:
  - Info
tags:
  - network security
  - password security
toc: true
toc_sticky: true
---

Password security is becoming more concerning these days. Using the same password for everything is not enough.

Here are some tips that can help you protect yourself against attackers and hackers.

[TLDR](#tldr)

___

# How in the world are my passwords hacked?

There are many ways a person can obtain your credentials.

## Leaks

![A strong password isn't useful if it's used everywhere](/assets/images/2022-01-08-Password-security-101/dataleaks.jpeg)

More often than not, an attacker can gain access into one of your accounts by means of a data breach or leak from a service you use.

Leaks happen when an online service is breached and lists of accounts and passwords are extracted. Usually these are distributed as super long dictionaries of "username:password" pairs in plain text or csv files.

Attackers can then use what is called "Credential Stuffing" to check for services that accept that authentication pairs. These attacks consist on automated software that injects username:password pairs into multiple sites, often using proxies, and it returns the username:password pairs that were successful and it's services.

**Tip:** Next time you create a strong password, throw some ":" or "," or other common csv separators in there to mess with these kind of attackers.
{: .notice--info}

### An example of these attacks:  

Imagine you use the same email (or username) and password for multiple services such as Facebook, Instagram, Spotify, Netflix... or more serious stuff such as your email, Paypal, online bank account or, God forbid, your cryptocurrency account.

Now imagine that [Facebook has a serious breach into their systems that compromises more than 500 Million accounts](https://www.bleepingcomputer.com/news/security/533-million-facebook-users-phone-numbers-leaked-on-hacker-forum/) (yeah... this really happened). 

Well... now the email and password that you use for everything is out in the open and people can access all the services you use.

### Oh no! How do I know if my stuff has been leaked?  

Ok, calm down. There are many tools that can let you know if your email and password have been leaked online.

My go-to is [haveibeenpwned.com](https://haveibeenpwned.com/).

If you use a password manager (smart move), they usually come with tools that let you know if your passwords have been found in any leaks so you can change them easily.

## Man in the middle attacks

Usually go to your local Starbucks, connect yo their wifi, and login to your services, work accounts, etc.?  

 **Don't.**  

Public networks are a haven for attackers to gather confidential data such as passwords. An easy way for attackers to do this is creating a man in the middle attack, which... just works as it sounds.  

They will set their systems as an intermediary between your system and the network and collect all the traffic that goes through, often containing private and sensitive information.

**Important:** PLEASE, **use a VPN** if you're using a public wifi network.
{: .notice--warning}

You've heard it countless times on Youtube, VPNs will protect your system's traffic in public networks.

NetworkChuck has an [awesome video](https://www.youtube.com/watch?v=q7HkIwbj3CM) on how these attacks work:

<iframe width="560" height="315" src="https://www.youtube.com/embed/q7HkIwbj3CM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

There are many other ways that an attacker can target you and gather sensitive information such as passwords.

You wouldn't believe how easy it is to hack into an admin account on a windows pc.

___

# How can I protect myself?

There are several ways you can protect yourself against these attacks.

## Use different passwords + password manager

![A strong password isn't useful if it's used everywhere](/assets/images/2022-01-08-Password-security-101/strongpassword.png)

Password managers are awesome and you should definitely be using one.  

These will store your passwords safely and they come with phone applications and web extensions that will auto-fill the credentials when you want to log into a service.

If you use Safari or Google Chrome you're probably using their built in password managers without even realizing it.

With these you can create a different password for each service to use and not have to remember anything. If one of your passwords gets hacked not only will the rest of the services you use not be compromised, but also you will only have to change the password of one service.

Some password managers can even generate strong, unique passwords on the go when creating a new account or changing a password.

![Password Generator](/assets/images/2022-01-08-Password-security-101/passwordgenerator.png)

Furthermore, they will let you know if a password has been leaked so you can go ahead and change it.

![Compromised passwords](/assets/images/2022-01-08-Password-security-101/passwordcompromise.png)

### Here's a list of password managers you can use:

- [Bitwarden](https://bitwarden.com/) (my favourite)
- [Apple keychain](https://support.apple.com/en-us/HT204085) on iCloud (iOS and macOS)
- [Google Chrome's password manager](https://passwords.google.com/)
- Paid services like [Lastpass](https://www.lastpass.com/)

## Use 2FA (2 Factor Authentication)

2FA makes it so that when you enter a password, you will have to introduce one-time code.

You've probably experienced this anytime Twitter, Amazon or Microsoft have sent you a code either by email or by phone to ensure it's you.

Though not all, many online services provide 2FA options.

### Some 2FA you can use:
- Email and phone messages
- [Google Authenticator](https://g.co/kgs/hwWhWd)
- [Microsoft Authenticator](https://www.microsoft.com/en-us/security/mobile-authenticator-app)
- [Bitwarden 2FA](https://bitwarden.com/help/article/setup-two-step-login/)

## Use VPNs in public networks

As mentioned, public networks are quite easy to attack. If you use a VPN, your traffic will be encrypted and no man in the middle attack will be able to intercept it.

You don't even have to pay for a VPN. If you have a home server, a Raspberry Pi or similar, you can set-up [OpenVPN](https://openvpn.net/) to connect to your home network from anywhere.

I use this all the time when travelling in airports or hotels.

## Use strong passwords

![Use strong passwords](/assets/images/2022-01-08-Password-security-101/strongpassword1.jpeg)

If you use symbols, numbers, upper and lower case in your passwords, they will be much harder to crack or bruteforce.

However, if you use the same password everywhere and it gets leaked, it won't matter how strong it is as the attackers will be able to use it anywhere.

___

# TLDR

There are many attacks that can be done to obtain usernames and passwords.

A strong password is useless if used in multiple sites.

Prevent being hacked by using:
- Different passwords
- Password managers
- 2FA (2 Factor Authentication)
- VPN when using public networks